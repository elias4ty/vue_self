/**
 * 第12章 组件的实现原理
 */

class Component{
  constructor({ name, render }) {
    this.name = name;
    this.render = render;
  }
}

export default Component;