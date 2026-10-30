import Accelerate
import CoreGraphics

/**
 A gaussian blur of an image on the CPU (vImage, two separable passes), for the pre-blurred copies a title transition
 plays as keyframes. Core Animation has no public blur filter to animate on a layer.
 */
enum GaussianBlur {
  /** `image` blurred by `sigma` pixels, or `nil` for a sigma too small to matter or a failed conversion. */
  static func image(_ image: CGImage, sigma: CGFloat) -> CGImage? {
    guard sigma > 0.01,
      let format = vImage_CGImageFormat(cgImage: image),
      var source = try? vImage_Buffer(cgImage: image, format: format),
      var destination = try? vImage_Buffer(width: Int(source.width), height: Int(source.height), bitsPerPixel: 32)
    else {
      return nil
    }
    defer {
      source.free()
      destination.free()
    }
    let radius = Int((sigma * 3).rounded(.up))
    let weights = (-radius...radius).map { offset -> Double in
      let x = Double(offset)
      return exp(-(x * x) / Double(2 * sigma * sigma))
    }
    let total = weights.reduce(0, +)
    let kernel = weights.map { Int16(($0 / total * 4096).rounded()) }
    let divisor = Int32(kernel.reduce(0) { $0 + Int32($1) })
    guard var intermediate = try? vImage_Buffer(width: Int(source.width), height: Int(source.height), bitsPerPixel: 32) else {
      return nil
    }
    defer {
      intermediate.free()
    }
    var background: [UInt8] = [0, 0, 0, 0]
    let flags = vImage_Flags(kvImageBackgroundColorFill)
    let horizontal = vImageConvolve_ARGB8888(&source, &intermediate, nil, 0, 0, kernel, 1, UInt32(kernel.count), divisor, &background, flags)
    let vertical = vImageConvolve_ARGB8888(&intermediate, &destination, nil, 0, 0, kernel, UInt32(kernel.count), 1, divisor, &background, flags)
    guard horizontal == kvImageNoError, vertical == kvImageNoError else {
      return nil
    }
    return try? destination.createCGImage(format: format)
  }
}
