import Foundation
import SDWebImage
import SDWebImageSVGCoder
import UIKit

/**
 An image by its source, at a height: a URL (http, https, file or a data URI) or an image in the app's bundle, a raster
 or an SVG (SDWebImage's coder). Each source is decoded once and each rendered height kept, so a segment that redraws
 asks for nothing again. Completion runs on the main queue, with nil for a source that could not be loaded.
 */
enum NativeImageLoader {
  private static let sources = NSCache<NSString, UIImage>()
  private static let renders = NSCache<NSString, UIImage>()
  private static let queue = DispatchQueue(
    label: "kara-ui.native-image-loader",
    qos: .userInitiated,
    attributes: .concurrent
  )

  static func loadImage(_ source: String, height: CGFloat, scale: CGFloat, completion: @escaping (UIImage?) -> Void) {
    let key = "\(scale)|\(height)|\(source)" as NSString

    if let image = renders.object(forKey: key) {
      completion(image)
      return
    }

    load(source) { image in
      let rendered = image.flatMap { NativeImage.rendered($0, height: height, scale: scale) }
      if let rendered {
        renders.setObject(rendered, forKey: key)
      }
      DispatchQueue.main.async {
        completion(rendered)
      }
    }
  }

  private static func load(_ source: String, completion: @escaping (UIImage?) -> Void) {
    if let image = sources.object(forKey: source as NSString) {
      queue.async {
        completion(image)
      }
      return
    }

    let finish: (UIImage?) -> Void = { image in
      if let image {
        sources.setObject(image, forKey: source as NSString)
      }
      completion(image)
    }

    guard let url = URL(string: source), let scheme = url.scheme?.lowercased() else {
      queue.async {
        finish(loadBundled(named: source))
      }
      return
    }

    switch scheme {
    case "http", "https":
      URLSession.shared.dataTask(with: url) { data, response, _ in
        let status = (response as? HTTPURLResponse)?.statusCode ?? 200

        guard let data, (200..<300).contains(status) else {
          finish(nil)
          return
        }
        finish(decode(data, url: url, mimeType: response?.mimeType))
      }.resume()
    case "file":
      queue.async {
        finish((try? Data(contentsOf: url)).flatMap { decode($0, url: url, mimeType: nil) })
      }
    case "data":
      queue.async {
        finish(decodeDataURI(source))
      }
    default:
      queue.async {
        finish(loadBundled(named: source))
      }
    }
  }

  private static func loadBundled(named name: String) -> UIImage? {
    if let url = Bundle.main.url(forResource: name, withExtension: nil), let data = try? Data(contentsOf: url) {
      return decode(data, url: url, mimeType: nil)
    }

    return UIImage(named: name)
  }

  private static func decodeDataURI(_ source: String) -> UIImage? {
    guard let comma = source.firstIndex(of: ",") else {
      return nil
    }

    let header = source[source.index(source.startIndex, offsetBy: 5)..<comma].lowercased()
    let payload = String(source[source.index(after: comma)...])
    let mimeType = header.split(separator: ";").first.map(String.init)
    let data = header.hasSuffix(";base64")
      ? Data(base64Encoded: payload, options: .ignoreUnknownCharacters)
      : payload.removingPercentEncoding?.data(using: .utf8)

    return data.flatMap { decode($0, url: nil, mimeType: mimeType) }
  }

  private static func decode(_ data: Data, url: URL?, mimeType: String?) -> UIImage? {
    if isSVG(data, url: url, mimeType: mimeType) {
      return SDImageSVGCoder.shared.decodedImage(with: data, options: nil)
    }

    return UIImage(data: data)
  }

  private static func isSVG(_ data: Data, url: URL?, mimeType: String?) -> Bool {
    if mimeType?.lowercased() == "image/svg+xml" || url?.pathExtension.lowercased() == "svg" {
      return true
    }

    return String(decoding: data.prefix(512), as: UTF8.self).lowercased().contains("<svg")
  }
}
