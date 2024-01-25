import { VNodeType } from "../core/renderer/config";
import VNode from "../core/renderer/vdom";
import Component from "../core/component";

const t = new VNode({
  type: VNodeType.TEXT,
  children: '哈哈哈'
});

const p = new VNode({
  type: 'p',
  children: t,
  props: {
    class: 'bbb',
    onClick: [
      () => {
        console.log('component')
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

const mycoms = new VNode({
  type: new Component({
    name: 'mycompnent',
    render() {
      return p;
    }
  })
});

const vnode = new VNode({
  type: 'div',
  props: {
    id: 'foo',
    class: 'bar'
  },
  children: [t, mycoms]
});

export {
  vnode
};