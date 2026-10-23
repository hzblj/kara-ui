#!/usr/bin/env bash
#
# Photographs every component for the website, on iOS and on Android, in light and in dark — and records the ones that
# move. Each shot is a route of this app (`app/shot/[id].tsx`): the component alone on a stage of the screen's own
# background, laid out in the 4:3 band this script crops to. What there is to shoot, how it is framed and what moves
# is `src/shots/shots.json`.
#
#   stills    <out>/<platform>/<appearance>/<id>.webp   — 1200×900 (a whole-screen shot is 640 wide)
#   videos    <out>/<platform>/<appearance>/<id>.mp4    — 720×540 H.264, muted, cut to loop seamlessly
#
# A shot with `steps` or a `period` plays its own timeline (`?play=1`) and is recorded for exactly one loop of it, so the
# clip repeats without a seam. A shot with a `flow` is driven by Maestro (`scripts/flows/<flow>.yaml`), which takes the
# still and the recording itself.
#
# Usage: scripts/capture-shots.sh [options]
#
#   --platform ios|android         repeatable; both by default
#   --appearance light|dark|both   both by default
#   --only <id>[,<id>…]            just these shots
#   --stills | --videos            one half of the work only
#   --out <dir>                    ../website/public/media by default
#
# Requires: Metro (`yarn start`), a booted simulator and an attached emulator with the example installed on both, the
# dev menu's welcome dismissed once on each, and Pillow, ffmpeg and — for the flows — Maestro.
set -euo pipefail

cd "$(dirname "$0")/.."

APP_ID="com.hzblj.karaui.example"
SCHEME="kara-ui"
DEV_CLIENT="exp+kara-ui-example"
METRO="http://localhost:8081"
OUT_DIR="../website/public/media"

PLATFORMS=""
APPEARANCES="light dark"
ONLY=""
STILLS=1
VIDEOS=1

while [ $# -gt 0 ]; do
	case "$1" in
	--platform)
		PLATFORMS="${PLATFORMS} $2"
		shift 2
		;;
	--appearance)
		APPEARANCES="$([ "$2" = both ] && echo "light dark" || echo "$2")"
		shift 2
		;;
	--only)
		ONLY="$2"
		shift 2
		;;
	--stills)
		VIDEOS=0
		shift
		;;
	--videos)
		STILLS=0
		shift
		;;
	--out)
		OUT_DIR="$2"
		shift 2
		;;
	*)
		echo "unknown option: $1" >&2
		sed -n '15,21p' "$0" >&2
		exit 2
		;;
	esac
done
PLATFORMS="${PLATFORMS:-ios android}"

WORK="$(mktemp -d -t kara-shots)"
STATUS=0

cleanup() {
	rm -rf "$WORK"
	# Leave the devices as they were found: a status bar frozen at 9:41 and an emulator pinned awake would outlast the
	# run otherwise.
	[ -n "${SIM:-}" ] && xcrun simctl status_bar "$SIM" clear > /dev/null 2>&1
	if [ -n "${EMULATOR:-}" ]; then
		adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command exit > /dev/null 2>&1
		adb -s "$EMULATOR" shell settings delete global hide_error_dialogs > /dev/null 2>&1
		adb -s "$EMULATOR" shell svc power stayon false > /dev/null 2>&1
	fi
	return 0
}
trap cleanup EXIT INT TERM

has() { case " $PLATFORMS " in *" $1 "*) return 0 ;; *) return 1 ;; esac }

# ---------------------------------------------------------------------------------------------------------------------
# Preconditions — each of these produces a plausible but wrong image rather than an error, so all are checked first.
# ---------------------------------------------------------------------------------------------------------------------

python3 -c 'import PIL' 2> /dev/null || {
	echo "Pillow is missing — install it with 'python3 -m pip install pillow'" >&2
	exit 1
}
command -v ffmpeg > /dev/null || {
	echo "ffmpeg is missing — install it with 'brew install ffmpeg'" >&2
	exit 1
}
curl -s -m 5 "${METRO}/status" | grep -q running || {
	echo "Metro is not running — start it with 'yarn start'" >&2
	exit 1
}

if has ios; then
	SIM="$(xcrun simctl list devices booted | grep -oE '[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}' | head -1)"
	[ -n "$SIM" ] || {
		echo "no booted simulator — boot one, or run 'yarn ios'" >&2
		exit 1
	}
	xcrun simctl get_app_container "$SIM" "$APP_ID" > /dev/null 2>&1 || {
		echo "${APP_ID} is not installed on the simulator — run 'yarn ios'" >&2
		exit 1
	}
fi

if has android; then
	EMULATOR="$(adb devices | awk '$2 == "device" {print $1; exit}')"
	[ -n "$EMULATOR" ] || {
		echo "no attached emulator — boot one, or run 'yarn android'" >&2
		exit 1
	}
	adb -s "$EMULATOR" shell pm path "$APP_ID" > /dev/null 2>&1 || {
		echo "${APP_ID} is not installed on the emulator — run 'yarn android'" >&2
		exit 1
	}
	# The emulator's encoder refuses a phone's full resolution, and its fallback is 720×1280 whatever the screen's
	# shape — which would squash every clip. 720 wide at the screen's own aspect is accepted, and all the site needs.
	RECORD_SIZE="$(adb -s "$EMULATOR" shell wm size | awk -F'[ x]' '/Physical/ {printf "720x%d", int($4 * 720 / $3 / 2) * 2}')"
fi

# ---------------------------------------------------------------------------------------------------------------------
# The devices.
# ---------------------------------------------------------------------------------------------------------------------

shoot() {
	if [ "$1" = ios ]; then
		xcrun simctl io "$SIM" screenshot --type png "$2" > /dev/null 2>&1
	else
		# screencap regularly hands back the frame before last: take two, keep the second.
		adb -s "$EMULATOR" exec-out screencap -p > /dev/null
		adb -s "$EMULATOR" exec-out screencap -p > "$2"
	fi
}

open_path() {
	if [ "$1" = ios ]; then
		xcrun simctl openurl "$SIM" "${SCHEME}://$2" > /dev/null
	else
		adb -s "$EMULATOR" shell "am start -a android.intent.action.VIEW -d '${SCHEME}://$2'" > /dev/null 2>&1
	fi
}

# Waits out the dev client's blue "Refreshing…" bar — a Fast Refresh, a bundle loading — which would otherwise end up
# across the top of a whole-screen still or a recording. Nothing may be edited while a run is going.
clear_banner() {
	local platform="$1" probe="${WORK}/banner.png"

	for _ in $(seq 30); do
		shoot "$platform" "$probe"
		python3 scripts/shots.py banner "$probe" || return 0
		sleep 1
	done
	echo "  WARNING: the dev client's banner never went away on ${platform}" >&2
	STATUS=1
}

# Shoots until two frames a second apart agree, so a still is never taken mid-animation. Shots that never stop moving
# (a skeleton's pulse, a spinner) are let through after the last try.
settle() {
	local platform="$1" out="$2" previous="${WORK}/settling.png"

	clear_banner "$platform"
	shoot "$platform" "$previous"
	for _ in 1 2 3 4 5; do
		sleep 1
		shoot "$platform" "$out"
		python3 scripts/shots.py settled "$previous" "$out" && return 0
		cp "$out" "$previous"
	done
	return 0
}

prepare() {
	local platform="$1"

	if [ "$platform" = ios ]; then
		xcrun simctl ui "$SIM" appearance "$APPEARANCE" > /dev/null
		xcrun simctl status_bar "$SIM" override --time '9:41' --batteryLevel 100 --batteryState unplugged \
			--cellularBars 4 --wifiBars 3 > /dev/null 2>&1 || true
		xcrun simctl terminate "$SIM" "$APP_ID" > /dev/null 2>&1 || true
		# Cold, so the app follows the appearance just set; through the dev client, which otherwise comes up on its own
		# launcher instead of the bundle.
		xcrun simctl openurl "$SIM" "${DEV_CLIENT}://expo-development-client/?url=$(printf '%s' "$METRO" | sed 's|:|%3A|g; s|/|%2F|g')"
	else
		adb -s "$EMULATOR" reverse tcp:8081 tcp:8081 > /dev/null
		adb -s "$EMULATOR" shell svc power stayon true
		adb -s "$EMULATOR" shell input keyevent KEYCODE_WAKEUP
		adb -s "$EMULATOR" shell wm dismiss-keyguard
		# A dev bundle earns itself an "isn't responding" dialog now and then, which would sit over a still that passes
		# every other check.
		adb -s "$EMULATOR" shell settings put global hide_error_dialogs 1 > /dev/null 2>&1 || true
		adb -s "$EMULATOR" shell settings put global sysui_demo_allowed 1 > /dev/null 2>&1 || true
		adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command enter > /dev/null 2>&1 || true
		adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941 > /dev/null 2>&1 || true
		adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false > /dev/null 2>&1 || true
		adb -s "$EMULATOR" shell "cmd uimode night $([ "$APPEARANCE" = dark ] && echo yes || echo no)" > /dev/null
		adb -s "$EMULATOR" shell am force-stop "$APP_ID"
		adb -s "$EMULATOR" shell "am start -a android.intent.action.VIEW -d '${DEV_CLIENT}://expo-development-client/?url=$(printf '%s' "$METRO" | sed 's|:|%3A|g; s|/|%2F|g')'" > /dev/null 2>&1
	fi

	echo "  waiting for the ${platform} app to come up..."
	wait_for_app "$platform"
	settle "$platform" "${WORK}/launched.png"
}

# The home screen's call to action (src/home): once it is in the window, the bundle has run.
HOME_MARK="Explore components"

# A cold start lasts as long as the bundle takes, and a long run makes that longer; a deep link sent before it has run
# is dropped, and the shot shows the home screen or the dev client's grey instead. Android waits until the home screen's
# text is in the window; iOS, which shows no hierarchy, for a frame that is not flat.
wait_for_app() {
	local platform="$1" probe="${WORK}/probe.png"

	if [ "$platform" = ios ]; then
		sleep 20
	else
		sleep 5
	fi
	for _ in $(seq 60); do
		if [ "$platform" = android ]; then
			adb -s "$EMULATOR" shell uiautomator dump /sdcard/kara-window.xml > /dev/null 2>&1
			adb -s "$EMULATOR" shell cat /sdcard/kara-window.xml 2> /dev/null | grep -q "$HOME_MARK" && return 0
		else
			shoot ios "$probe"
			python3 scripts/shots.py blank "$probe" || return 0
		fi
		sleep 2
	done
	echo "  WARNING: the ${platform} app never came up" >&2
	STATUS=1
}

record_start() {
	if [ "$1" = ios ]; then
		xcrun simctl io "$SIM" recordVideo --codec h264 --force "$2" > /dev/null 2>&1 &
	else
		adb -s "$EMULATOR" shell rm -f /sdcard/kara-shot.mp4
		adb -s "$EMULATOR" shell screenrecord --size "$RECORD_SIZE" --bit-rate 12000000 /sdcard/kara-shot.mp4 &
	fi
	RECORDER=$!
	sleep 1
}

record_stop() {
	if [ "$1" = ios ]; then
		kill -INT "$RECORDER" 2> /dev/null || true
		wait "$RECORDER" 2> /dev/null || true
	else
		adb -s "$EMULATOR" shell 'kill -2 $(pidof screenrecord)' 2> /dev/null || true
		wait "$RECORDER" 2> /dev/null || true
		sleep 1
		adb -s "$EMULATOR" pull /sdcard/kara-shot.mp4 "$2" > /dev/null
	fi
	RECORDER=""
}

# encode <raw.mp4> <out.mp4> <frame> <start s> <length s>
encode() {
	local raw="$1" out="$2" frame="$3" start="$4" length="$5" fade="${6:-0}" crop

	case "$frame" in
	screen) crop="scale=480:-2:flags=lanczos" ;;
	bottom) crop="crop=iw:trunc(iw*3/8)*2:0:ih-trunc(iw*3/8)*2,scale=720:540:flags=lanczos" ;;
	*) crop="crop=iw:trunc(iw*3/8)*2:0:(ih-trunc(iw*3/8)*2)/2,scale=720:540:flags=lanczos" ;;
	esac
	mkdir -p "$(dirname "$out")"
	# Both recorders write a variable frame rate — nothing while the screen holds still — so the cut is made after
	# \`fps\` has filled those stretches in: seeking the input would start at the first frame that moved.
	if [ "$fade" = 0 ]; then
		ffmpeg -y -v error -i "$raw" -ss "$start" -t "$length" -vf "${crop},fps=30,format=yuv420p" \
			-c:v libx264 -preset slow -crf 26 -an -movflags +faststart "$out"
		return
	fi
	# An animation with no period of its own: the cut starts `fade` seconds in, and its last `fade` seconds dissolve into
	# the first `fade` of the recording — so the loop's last frame is the frame before its first.
	local graph
	graph="$(python3 -c "s, l, f = $start, $length, $fade
print(f'[0:v]${crop},fps=30,format=yuv420p,split[a][b];'
      f'[a]trim=start={s + f}:end={s + l + f},setpts=PTS-STARTPTS,fps=30[main];'
      f'[b]trim=start={s}:end={s + f},setpts=PTS-STARTPTS,fps=30[head];'
      f'[main][head]xfade=transition=fade:duration={f}:offset={l - f},format=yuv420p[out]')")"
	ffmpeg -y -v error -i "$raw" -filter_complex "$graph" -map "[out]" \
		-c:v libx264 -preset slow -crf 26 -an -movflags +faststart "$out"
}

# The path a shot opens: its scene, or the route it photographs instead.
path_for() {
	local id="$1" url="$2" play="$3"

	if [ -n "$url" ]; then
		echo "${url#/}"
	elif [ "$play" = 1 ]; then
		echo "shot/${id}?play=1"
	else
		echo "shot/${id}"
	fi
}

# ---------------------------------------------------------------------------------------------------------------------
# One shot.
# ---------------------------------------------------------------------------------------------------------------------

capture_still() {
	local platform="$1" id="$2" frame="$3" url="$4" target="$5" settle_ms="${6:-0}"

	open_path "$platform" "$(path_for "$id" "$url" 0)"
	sleep 2
	# A remote photo arriving late looks exactly like a settled screen without it.
	[ "$settle_ms" -gt 0 ] && sleep "$(python3 -c "print($settle_ms / 1000)")"
	settle "$platform" "${WORK}/still.png"
	python3 scripts/shots.py still "${WORK}/still.png" "$target" --frame "$frame"
}

# Records two loops' worth and keeps exactly one, from after the scene has mounted: a timeline is periodic, so a cut one
# loop long repeats without a seam wherever it starts. A loop under three seconds is kept twice over.
capture_loop() {
	local platform="$1" id="$2" frame="$3" loop_ms="$4" target="$5" fade_ms="${6:-0}"
	local raw="${WORK}/loop.mp4" length warmup=3 recorded fade

	length="$(python3 -c "loop = $loop_ms / 1000; print(round(loop * max(1, -(-3 // loop)), 3))")"
	fade="$(python3 -c "print($fade_ms / 1000)")"
	# A recorder under load now and then hands back a file with next to nothing in it: check what came back covers the
	# cut, and record again if it does not.
	for attempt in 1 2 3; do
		rm -f "$raw"
		open_path "$platform" "shot/${id}"
		sleep 2
		clear_banner "$platform"
		record_start "$platform" "$raw"
		open_path "$platform" "$(path_for "$id" "" 1)"
		sleep "$(python3 -c "print($warmup + $length + $fade + 1.5)")"
		record_stop "$platform" "$raw"
		recorded="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$raw" 2> /dev/null || echo 0)"
		if python3 -c "import sys; sys.exit(0 if float('${recorded:-0}' or 0) >= $warmup + $length + $fade else 1)" 2> /dev/null; then
			encode "$raw" "$target" "$frame" "$warmup" "$length" "$fade"
			break
		fi
		echo "    ${platform}/${id}: the recording came back ${recorded:-empty}s long (attempt ${attempt})" >&2
		[ "$attempt" = 3 ] && STATUS=1
		# A long run wears the dev build down until its frames stop arriving; a cold start is what brings them back.
		[ "$attempt" -lt 3 ] && prepare "$platform"
	done
	# Back to the still state, so the next shot's still is not taken over a timeline still running here.
	open_path "$platform" "shot/${id}"
}

# Maestro drives the shot: the flow records itself (`startRecording`) and takes the still at its moment (`takeScreenshot`).
capture_flow() {
	local platform="$1" id="$2" frame="$3" url="$4" flow="$5" still_target="$6" video_target="$7"
	local device="${SIM:-}"

	[ "$platform" = android ] && device="$EMULATOR"
	command -v maestro > /dev/null || {
		echo "  WARNING: maestro is missing — skipping ${id} ('brew install maestro')" >&2
		STATUS=1
		return 0
	}
	open_path "$platform" "$(path_for "$id" "$url" 0)"
	sleep 2
	settle "$platform" "${WORK}/before.png"
	rm -f "${WORK}/flow.mp4" "${WORK}/flow-own.mp4" "${WORK}/flow-still.png"
	rm -rf "${WORK}/maestro"
	# Maestro records Android at 720×1280 whatever the screen, which pillarboxes a taller one — the video comes from our
	# own recorder there, at the screen's aspect, cut to where the picture starts and stops moving.
	[ "$platform" = android ] && record_start android "${WORK}/flow-own.mp4"
	if ! maestro --device "$device" test "scripts/flows/${flow}.yaml" --test-output-dir "${WORK}/maestro" \
		-e STILL=still -e VIDEO=video > "${WORK}/maestro.log" 2>&1; then
		[ "$platform" = android ] && record_stop android "${WORK}/flow-own.mp4"
		echo "  WARNING: the ${flow} flow failed on ${platform} — see below" >&2
		tail -20 "${WORK}/maestro.log" >&2
		STATUS=1
		return 0
	fi
	[ "$platform" = android ] && record_stop android "${WORK}/flow-own.mp4"
	# Maestro files what a flow saves under its own run directory, named as the flow asked.
	find "${WORK}/maestro" -name still.png -exec cp {} "${WORK}/flow-still.png" \;
	find "${WORK}/maestro" -name video.mp4 -exec cp {} "${WORK}/flow.mp4" \;
	if [ "$STILLS" = 1 ] && [ -s "${WORK}/flow-still.png" ]; then
		python3 scripts/shots.py still "${WORK}/flow-still.png" "$still_target" --frame "$frame"
	fi
	if [ "$VIDEOS" = 1 ] && [ "$platform" = android ] && [ -s "${WORK}/flow-own.mp4" ]; then
		local cut
		cut="$(python3 scripts/shots.py motion "${WORK}/flow-own.mp4")"
		encode "${WORK}/flow-own.mp4" "$video_target" "$frame" "${cut% *}" "${cut#* }"
	elif [ "$VIDEOS" = 1 ] && [ -s "${WORK}/flow.mp4" ]; then
		# Maestro's own recording, cut the same way: from just before the picture first moves to just after it stops,
		# rather than the seconds Maestro spends starting and finishing around the flow.
		local cut
		cut="$(python3 scripts/shots.py motion "${WORK}/flow.mp4")"
		encode "${WORK}/flow.mp4" "$video_target" "$frame" "${cut% *}" "${cut#* }"
	fi
}

# ---------------------------------------------------------------------------------------------------------------------
# Run.
# ---------------------------------------------------------------------------------------------------------------------

for APPEARANCE in $APPEARANCES; do
	for platform in ios android; do
		has "$platform" || continue
		echo "${platform}/${APPEARANCE}:"
		prepare "$platform"
		dir="${OUT_DIR}/${platform}/${APPEARANCE}"

		# On its own descriptor: adb and Maestro read standard input, and would swallow the rest of the list.
		while IFS='|' read -r -u 3 id frame kind loop url flow settle_ms fade_ms; do
			if [ "$kind" = flow ]; then
				capture_flow "$platform" "$id" "$frame" "$url" "$flow" "${dir}/${id}.webp" "${dir}/${id}.mp4"
				echo "  ${id} (flow)"
				continue
			fi
			[ "$STILLS" = 1 ] && capture_still "$platform" "$id" "$frame" "$url" "${dir}/${id}.webp" "$settle_ms"
			if [ "$VIDEOS" = 1 ] && [ "$kind" != still ]; then
				capture_loop "$platform" "$id" "$frame" "$loop" "${dir}/${id}.mp4" "$fade_ms"
				echo "  ${id} (still and loop)"
			else
				echo "  ${id}"
			fi
		done 3< <(python3 scripts/shots.py list --only "$ONLY" --platform "$platform")
	done
done

exit "$STATUS"
