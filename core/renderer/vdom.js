export default class VNode{
  constructor({
    type,
    children,
    props
  }) {
    this.type = type;
    this.children = children;
    this.props = props;
  }
}
