import UIKit

extension ContextMenuView: UIContextMenuInteractionDelegate {
  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configurationForMenuAtLocation location: CGPoint
  ) -> UIContextMenuConfiguration? {
    guard !items.isEmpty, !isExcluded(at: location) else {
      return nil
    }

    return UIContextMenuConfiguration(
      identifier: nil,
      previewProvider: { [weak self] in
        self?.renderPreview()
      },
      actionProvider: { [weak self] _ in
        self?.makeMenu()
      }
    )
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configuration: UIContextMenuConfiguration,
    highlightPreviewForItemWithIdentifier identifier: any NSCopying
  ) -> UITargetedPreview? {
    makeWindowTargetedPreview()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configuration: UIContextMenuConfiguration,
    dismissalPreviewForItemWithIdentifier identifier: any NSCopying
  ) -> UITargetedPreview? {
    committedZoomIdentifier == nil ? makeWindowTargetedPreview() : nil
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willDisplayMenuFor configuration: UIContextMenuConfiguration,
    animator: (any UIContextMenuInteractionAnimating)?
  ) {
    touchCanceller.cancelTouches()
    isPreviewCommitted = false
    onMenuOpen()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willPerformPreviewActionForMenuWith configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionCommitAnimating
  ) {
    isPreviewCommitted = true
    let transition = previewTransition ?? (zoomSourceIdentifier == nil ? "pop" : "zoom")
    if transition != "pop" {
      animator.preferredCommitStyle = .dismiss
    }

    let preloadedScreen = preloadedScreenId.flatMap { ContextMenuPreloadedScreen(screenId: $0, from: self) }
    guard transition == "zoom", let preview,
      let identifier = startZoom(from: preview, into: preloadedScreen)
    else {
      animator.addCompletion { [weak self] in
        preloadedScreen?.push()
        self?.onPreviewPress()
      }
      return
    }
    committedZoomIdentifier = identifier
    onPreviewPress()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willEndFor configuration: UIContextMenuConfiguration,
    animator: (any UIContextMenuInteractionAnimating)?
  ) {
    onMenuClose(["isCommitted": isPreviewCommitted])

    guard committedZoomIdentifier != nil else {
      return
    }

    let finish: () -> Void = { [weak self] in
      self?.committedZoomIdentifier = nil
    }

    guard let animator else {
      finish()
      return
    }
    animator.addCompletion(finish)
  }

  private func startZoom(
    from preview: ContextMenuPreview,
    into preloadedScreen: ContextMenuPreloadedScreen?
  ) -> String? {
    let backdrop = preloadedScreen == nil ? nil : window.flatMap { ContextMenuBackdrop(in: $0, behind: self) }
    let handoff: ContextMenuPreviewZoom.Handoff =
      backdrop.map { .morph(style: $0.platterStyle, onHandOver: $0.handOver(from:)) } ?? .covered

    guard let identifier = ContextMenuPreviewZoom.start(from: preview, in: self, handoff: handoff) else {
      return nil
    }
    backdrop?.detachMenu()
    preloadedScreen?.push()
    return identifier
  }
}
