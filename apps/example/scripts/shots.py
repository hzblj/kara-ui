#!/usr/bin/env python3
"""The capture script's image side: what to shoot, and turning a raw device frame into what the website serves.

  shots.py list [--only a,b] [--platform ios|android]
      One line per shot, separated by `|`: id, frame, kind (still|steps|period|flow), loop length in ms, url, flow, and
      how long to wait for the network before the still, in ms.
  shots.py still <raw.png> <out.webp> --frame center|bottom|screen
      Crops the frame out of a device screenshot, converts it to sRGB and writes the website's WebP.
  shots.py settled <a.png> <b.png>
      Exit 0 when two screenshots are the same screen at rest, 1 when something still moved between them.
  shots.py check <media dir>
      Lists every capture that is missing or broken — a still, or a recording shorter than a second — as
      `platform appearance id what`, and exits 1 when there is any.
  shots.py banner <shot.png>
      Exit 0 when the dev client's blue "Refreshing…" / "Bundling…" bar is across the top of the screen.
"""

import argparse
import io
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageCms

SHOTS = Path(__file__).resolve().parent.parent / "src" / "shots" / "shots.json"

# The band every scene is staged in: the screen's full width and three quarters of it in height, through the middle
# of the screen (`center`) or along its bottom edge (`bottom`). `shot-screen.tsx` lays the stage out to the same ratio.
STAGE_RATIO = 0.75
STILL_SIZE = (1200, 900)
SCREEN_WIDTH = 640


def shot_list(only: set[str], platform: str | None) -> None:
    shots = json.loads(SHOTS.read_text())
    for shot_id, config in sorted(shots.items()):
        if only and shot_id not in only:
            continue
        if platform and platform not in config.get("platforms", ["ios", "android"]):
            continue
        # A flow only drives the platforms it was written for; elsewhere the shot is a plain still — SwipeActions on
        # Android is the row without its actions, which is still worth showing.
        if "flow" in config and (platform is None or platform in config.get("flowPlatforms", ["ios", "android"])):
            kind, loop = "flow", 0
        elif "steps" in config:
            kind, loop = "steps", sum(config["steps"])
        elif "period" in config:
            kind, loop = "period", config["period"]
        else:
            kind, loop = "still", 0
        frame = config.get("frame", "center")
        # A frame can differ per platform — an iOS 26 action sheet is a popover in the middle, Android's a bottom sheet.
        if isinstance(frame, dict):
            frame = frame.get(platform or "ios", "center")
        fields = [shot_id, frame, kind, str(loop), config.get("url", ""), config.get("flow", ""), str(config.get("settle", 0))]
        # Not tabs: the shell's `read` collapses a run of whitespace separators, and with them every empty field.
        print("|".join(fields))


def to_srgb(image: Image.Image) -> Image.Image:
    """Simulator screenshots carry a Display P3 profile; the page around them is plain sRGB."""
    profile = image.info.get("icc_profile")
    image = image.convert("RGB")
    if not profile:
        return image
    source = ImageCms.ImageCmsProfile(io.BytesIO(profile))
    return ImageCms.profileToProfile(image, source, ImageCms.createProfile("sRGB"), outputMode="RGB")


def crop_box(width: int, height: int, frame: str) -> tuple[int, int, int, int]:
    if frame == "screen":
        return 0, 0, width, height
    band = round(width * STAGE_RATIO)
    top = height - band if frame == "bottom" else (height - band) // 2
    return 0, top, width, top + band


def still(raw: Path, out: Path, frame: str) -> None:
    image = to_srgb(Image.open(raw))
    image = image.crop(crop_box(image.width, image.height, frame))
    if frame == "screen":
        size = (SCREEN_WIDTH, round(SCREEN_WIDTH * image.height / image.width))
    else:
        size = STILL_SIZE
    image = image.resize(size, Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "WEBP", quality=90, method=6)


def settled(first: Path, second: Path) -> bool:
    """Small differences are compression noise and the caret; anything above that is a screen still animating."""
    a = Image.open(first).convert("L").resize((120, 260))
    b = Image.open(second).convert("L").resize((120, 260))
    difference = ImageChops.difference(a, b).point(lambda value: 255 if value > 24 else 0)
    changed = sum(difference.histogram()[255:])
    return changed <= a.width * a.height * 0.002


def banner(shot: Path) -> bool:
    """The dev client's status bar is a full-width band of saturated blue over the top of the screen."""
    image = Image.open(shot).convert("RGB")
    band = image.crop((0, 0, image.width, max(1, image.height // 25))).resize((120, 8))
    pixels = list(band.getdata())
    blue = sum(1 for red, green, b in pixels if b > 170 and red < 110 and 60 < green < 190 and b - red > 90)
    return blue >= len(pixels) * 0.5


def pillarboxed(video: Path) -> bool:
    """
    The last second's frame with black edge columns where the stage is not black: a recording of the wrong aspect,
    fitted rather than cropped. (iOS's dark stage is black right to the edge, so the stage is what it is compared with.)
    """
    frame = subprocess.run(
        ["ffmpeg", "-v", "error", "-sseof", "-1", "-i", str(video), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        capture_output=True,
    ).stdout
    if not frame:
        return False
    image = Image.open(io.BytesIO(frame)).convert("L")
    width, height = image.size
    edges = [image.crop((0, 0, width // 20, height)), image.crop((width - width // 20, 0, width, height))]
    stage = image.getpixel((width // 2, 2))
    return stage >= 12 and all(edge.getextrema()[1] < 12 for edge in edges)


def motion(video: Path, lead: float, tail: float) -> tuple[float, float]:
    """
    Where a recording starts and stops moving, as `start length` with `lead` seconds of stillness before the first
    change and `tail` after the last — for a recorder that ran longer than the flow it filmed.
    """
    fps, width, height = 10, 72, 160
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video), "-vf", f"fps={fps},scale={width}:{height},format=gray",
         "-f", "rawvideo", "-"],
        capture_output=True,
    ).stdout
    size = width * height
    frames = [raw[index:index + size] for index in range(0, len(raw) - size + 1, size)]
    # Moving: enough pixels changed by more than the encoder's noise — a swipe moves one row, a small share of the frame.
    moving = [
        index
        for index in range(1, len(frames))
        if sum(abs(a - b) > 16 for a, b in zip(frames[index], frames[index - 1])) > size * 0.002
    ]
    duration = len(frames) / fps
    if not moving:
        return 0.0, duration
    start = max(0.0, (moving[0] - 1) / fps - lead)
    end = min(duration, moving[-1] / fps + tail)
    return start, end - start


def check(media: Path) -> bool:
    shots = json.loads(SHOTS.read_text())
    problems = []
    for shot_id, config in sorted(shots.items()):
        for platform in config.get("platforms", ["ios", "android"]):
            flows = config.get("flowPlatforms", ["ios", "android"])
            moves = ("flow" in config and platform in flows) or "steps" in config or "period" in config
            for appearance in ("light", "dark"):
                folder = media / platform / appearance
                if not (folder / f"{shot_id}.webp").is_file():
                    problems.append(f"{platform} {appearance} {shot_id} still")
                if moves:
                    video = folder / f"{shot_id}.mp4"
                    length = 0.0
                    if video.is_file():
                        probe = subprocess.run(
                            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)],
                            capture_output=True,
                            text=True,
                        )
                        try:
                            length = float(probe.stdout.strip() or 0)
                        except ValueError:
                            length = 0.0
                    if length < 1:
                        problems.append(f"{platform} {appearance} {shot_id} video")
                    elif pillarboxed(video):
                        problems.append(f"{platform} {appearance} {shot_id} video pillarboxed")
    for problem in problems:
        print(problem)
    return not problems


def main() -> None:
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)

    listing = commands.add_parser("list")
    listing.add_argument("--only", default="")
    listing.add_argument("--platform")

    crop = commands.add_parser("still")
    crop.add_argument("raw", type=Path)
    crop.add_argument("out", type=Path)
    crop.add_argument("--frame", choices=["bottom", "center", "screen"], default="center")

    compare = commands.add_parser("settled")
    compare.add_argument("first", type=Path)
    compare.add_argument("second", type=Path)

    audit = commands.add_parser("check")
    audit.add_argument("media", type=Path)

    moves = commands.add_parser("motion")
    moves.add_argument("video", type=Path)
    moves.add_argument("--lead", type=float, default=0.8)
    moves.add_argument("--tail", type=float, default=1.0)

    bar = commands.add_parser("banner")
    bar.add_argument("shot", type=Path)

    args = parser.parse_args()
    if args.command == "list":
        shot_list({value for value in args.only.split(",") if value}, args.platform)
    elif args.command == "still":
        still(args.raw, args.out, args.frame)
    elif args.command == "check":
        sys.exit(0 if check(args.media) else 1)
    elif args.command == "motion":
        start, length = motion(args.video, args.lead, args.tail)
        print(f"{start:.2f} {length:.2f}")
    elif args.command == "banner":
        sys.exit(0 if banner(args.shot) else 1)
    else:
        sys.exit(0 if settled(args.first, args.second) else 1)


if __name__ == "__main__":
    main()
