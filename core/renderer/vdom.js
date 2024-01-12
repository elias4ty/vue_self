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

const p = new VNode({
  type: 'p',
  children: 'i am a p',
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
  children: [
    'hello',
    p
  ]
});

export {
  vnode
};