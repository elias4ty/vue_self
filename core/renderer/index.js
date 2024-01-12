/**
 * 第七章 渲染器的设计
 * 第八章 挂载与更新
 */
import VNode from "./vdom";

/**
 * 根据配置选择平台渲染器
 * 这是跨平台的重要能力输出
 * @returns render
 */
function createRenderder(options) {
  const {
    createElement,
    setElementText,
    insert,
    patchProps,
    unmount
  } = options;

  /**
   * 挂载与更新，打补丁
   * @param {*} n1 旧的 vdom
   * @param {*} n2 新的 vdom
   * @param {*} container 挂载的真实节点
   */
  function patch(n1, n2, container) {
    /**
     * 1. 区分新旧节点的类型
     * 2. 不一样的类型没有 diff 的必要
     * 3. 直接删除旧节点，挂载新节点
     */
    if (n1 && n1.type !== n2.type) {
      unmount(n1);      
      n1 = null;
    }

    // 没有旧 vnode，说明是第一次挂载
    if (!n1) {
      mountElement(n2, container);
    }
    // 这里开始 diff 两个节点，并更新
    else {
      // todo 更新
    }
  }

  // 挂载节点
  function mountElement(vnode, container) {
    // vnode 是字符串是代表是文本节点
    if (typeof vnode === 'string') {
      setElementText(container, vnode);
    }
    // vnode 是元素节点
    else {
      const { type, children, props } = vnode;
      const el = createElement(type);
  
      // 处理元素的属性
      if (props) {
        for (const key in props) {
          const val = props[key];
          patchProps(el, key, null, val);
        }
      }

      if (typeof children === 'string') {
        setElementText(el, children);
      }
      // 多个子节点
      else if (Array.isArray(children)) {
        children.forEach(child => patch(null, child, el))
      }
      // 单个元素节点
      else if (children instanceof VNode) {
        patch(null, children, el);
      } else {
        console.warn('[render]: children is invalid');
      }
  
      // 建立虚拟节点和真实节点的联系
      vnode.el = el;

      insert(el, container);
    }
  }
  
  // vdom 的渲染器
  function render(vnode, container) {
    const { _vnode } = container;

    if (vnode) {
      patch(_vnode, vnode, container)
    }
    // 没有新的 vnode，说明是卸载
    else { 
      if (_vnode) {
        unmount(_vnode);
      }
    }

    // 新 vnode 替换
    container._vnode = vnode;
  }

  // 其他平台的渲染器，例如 SSR
  function hydrate() {
    // TODO
  }

  return {
    render, 
    hydrate
  };
}

export default createRenderder;
