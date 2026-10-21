import SwiftUI
import UIKit

internal enum TooltipMetrics {
  static let arrowWidth: CGFloat = 16
  static let arrowHeight: CGFloat = 13.86
  static let cornerRadius: CGFloat = 8
  static let padding: CGFloat = 16
  static let textSpacing: CGFloat = 4
  static let actionHitOutset: CGFloat = 12
  static let actionSpacing: CGFloat = 8
}

internal final class TooltipBubbleModel: ObservableObject {
  @Published var title: String?
  @Published var message: String?
  @Published var actions: [TooltipAction] = []
  @Published var actionsAlignment = TooltipActionsAlignment.end
  @Published var titleStyle = TooltipTextStyle.fallback
  @Published var messageStyle = TooltipTextStyle.fallback
  @Published var actionStyle = TooltipTextStyle.fallback
  @Published var bubbleColor = UIColor.secondarySystemBackground
  @Published var titleColor = UIColor.label
  @Published var messageColor = UIColor.secondaryLabel
  @Published var linkColor = UIColor.label
  @Published var primaryTint = UIColor.label
  @Published var secondaryTint = UIColor.label
  @Published var shadowColor = UIColor.black.withAlphaComponent(0.15)
  @Published var width: CGFloat = 250
  @Published var arrowCenterX: CGFloat = 125

  var onAction: (Int) -> Void = { _ in }
}

internal struct TooltipArrow: Shape {
  func path(in rect: CGRect) -> Path {
    var path = Path()
    path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
    path.addLine(to: CGPoint(x: rect.midX, y: rect.minY))
    path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
    path.closeSubpath()
    return path
  }
}

internal struct TooltipBubble: View {
  @ObservedObject var model: TooltipBubbleModel

  var body: some View {
    VStack(alignment: .leading, spacing: -1) {
      TooltipArrow()
        .fill(Color(model.bubbleColor))
        .frame(width: TooltipMetrics.arrowWidth, height: TooltipMetrics.arrowHeight + 1)
        .offset(x: model.arrowCenterX - TooltipMetrics.arrowWidth / 2)

      VStack(alignment: .leading, spacing: 0) {
        VStack(alignment: .leading, spacing: TooltipMetrics.textSpacing) {
          if let title = model.title {
            line(title, style: model.titleStyle, color: model.titleColor)
          }
          if let message = model.message {
            line(message, style: model.messageStyle, color: model.messageColor)
          }
        }
        if !model.actions.isEmpty {
          actionsRow
        }
      }
      .padding(TooltipMetrics.padding)
      .frame(width: model.width, alignment: .leading)
      .background(
        RoundedRectangle(cornerRadius: TooltipMetrics.cornerRadius, style: .continuous)
          .fill(Color(model.bubbleColor))
      )
    }
    .frame(width: model.width, alignment: .leading)
    .compositingGroup()
    .shadow(color: Color(model.shadowColor), radius: 0.25, x: 0, y: 1)
    .shadow(color: Color(model.shadowColor), radius: 2, x: 0, y: 2)
    .accessibilityElement(children: .contain)
  }

  private func line(_ text: String, style: TooltipTextStyle, color: UIColor) -> some View {
    Text(text)
      .font(Font(style.font))
      .kerning(style.letterSpacing)
      .lineSpacing(style.leading)
      .padding(.vertical, style.leading / 2)
      .foregroundColor(Color(color))
      .fixedSize(horizontal: false, vertical: true)
      .frame(maxWidth: .infinity, alignment: .leading)
  }

  private var actionsRow: some View {
    HStack(spacing: TooltipMetrics.actionSpacing) {
      if model.actionsAlignment == .end {
        Spacer(minLength: 0)
      }
      ForEach(Array(model.actions.enumerated()), id: \.offset) { index, action in
        actionButton(action, index: index)
      }
      if model.actionsAlignment == .start {
        Spacer(minLength: 0)
      }
    }
    .padding(.top, model.actions.contains { $0.variant != .link } ? TooltipMetrics.actionSpacing : 0)
  }

  @ViewBuilder
  private func actionButton(_ action: TooltipAction, index: Int) -> some View {
    switch action.variant {
    case .link:
      linkButton(action.label, index: index)
    case .primary:
      Button(action.label) { model.onAction(index) }
        .buttonStyle(.borderedProminent)
        .controlSize(.small)
        .tint(Color(model.primaryTint))
    case .secondary:
      Button(action.label) { model.onAction(index) }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .tint(Color(model.secondaryTint))
    }
  }

  private func linkButton(_ label: String, index: Int) -> some View {
    Button {
      model.onAction(index)
    } label: {
      Text(label)
        .font(Font(model.actionStyle.font))
        .kerning(model.actionStyle.letterSpacing)
        .padding(.vertical, model.actionStyle.leading / 2)
        .foregroundColor(Color(model.linkColor))
        .overlay(
          Rectangle()
            .fill(Color(model.linkColor))
            .frame(height: 1),
          alignment: .bottom
        )
        .padding(TooltipMetrics.actionHitOutset)
        .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .padding(-TooltipMetrics.actionHitOutset)
    .accessibilityAddTraits(.isButton)
  }
}
