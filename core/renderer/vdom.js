import { VNodeType } from "./config";
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

const t = new VNode({
  type: VNodeType.TEXT,
  children: '哈哈哈'
});

const p = new VNode({
  type: 'p',
  children: t,
  props: {
    class: 'aaa',
    onClick: [
      () => {
        console.log('ppp')
      },
      () => {
        console.log('aaa')
      }
    ],
    onmouseenter() {
      console.log('mouseenter')
    }
  }
});

const vnode = new VNode({
  type: 'div',
  props: {
    id: 'foo',
    class: 'bar'
  },
  children: [t, p]
});

export {
  vnode
};