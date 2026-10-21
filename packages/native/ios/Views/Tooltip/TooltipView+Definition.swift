import ExpoModulesCore

extension TooltipView {
  static func definition() -> ViewDefinition<TooltipView> {
    View(TooltipView.self) {
      Events("onShown", "onAction", "onDismissRequest")

      Prop("isPresented") { (view: TooltipView, isPresented: Bool) in
        view.setPresented(isPresented)
      }
      Prop("title") { (view: TooltipView, title: String?) in
        view.model.title = title
        view.setContentNeedsMeasure()
      }
      Prop("message") { (view: TooltipView, message: String?) in
        view.model.message = message
        view.setContentNeedsMeasure()
      }
      Prop("actions") { (view: TooltipView, actions: [TooltipActionRecord]) in
        view.model.actions = actions.map(TooltipAction.init(record:))
        view.setContentNeedsMeasure()
      }
      Prop("actionsAlignment") { (view: TooltipView, alignment: String) in
        view.model.actionsAlignment = TooltipActionsAlignment(rawValue: alignment) ?? .end
      }
      Prop("titleStyle") { (view: TooltipView, style: TooltipTextStyleRecord) in
        view.model.titleStyle = TooltipTextStyle(record: style)
        view.setContentNeedsMeasure()
      }
      Prop("messageStyle") { (view: TooltipView, style: TooltipTextStyleRecord) in
        view.model.messageStyle = TooltipTextStyle(record: style)
        view.setContentNeedsMeasure()
      }
      Prop("actionStyle") { (view: TooltipView, style: TooltipTextStyleRecord) in
        view.model.actionStyle = TooltipTextStyle(record: style)
        view.setContentNeedsMeasure()
      }
      Prop("bubbleColor") { (view: TooltipView, color: UIColor) in
        view.model.bubbleColor = color
      }
      Prop("titleColor") { (view: TooltipView, color: UIColor) in
        view.model.titleColor = color
      }
      Prop("messageColor") { (view: TooltipView, color: UIColor) in
        view.model.messageColor = color
      }
      Prop("linkColor") { (view: TooltipView, color: UIColor) in
        view.model.linkColor = color
      }
      Prop("primaryTint") { (view: TooltipView, color: UIColor) in
        view.model.primaryTint = color
      }
      Prop("secondaryTint") { (view: TooltipView, color: UIColor) in
        view.model.secondaryTint = color
      }
      Prop("bubbleShadowColor") { (view: TooltipView, color: UIColor) in
        view.model.shadowColor = color
      }
      Prop("bubbleWidth") { (view: TooltipView, width: Double) in
        view.setBubbleWidth(width)
      }
      Prop("boundaryInsetTop") { (view: TooltipView, inset: Double) in
        view.setBoundaryInsets(top: inset, bottom: nil)
      }
      Prop("boundaryInsetBottom") { (view: TooltipView, inset: Double) in
        view.setBoundaryInsets(top: nil, bottom: inset)
      }
    }
  }
}
