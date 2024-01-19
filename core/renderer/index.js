/**
 * 第七章 渲染器的设计
 * 第八章 挂载与更新
 */
import VNode from "./vdom";
import { VNodeType } from "./config";

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
    unmount,
    createTextNode
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

    const { type } = n2;

    // 元素节点
    if (typeof type === 'string') {
      // 没有旧 vnode，说明是第一次挂载
      if (!n1) {
        mountElement(n2, container);
      }
      // 这里开始 diff 两个节点，并更新
      else {
        patchElement(n1, n2);
      }     
    }
    // 文本节点
    else if (type === VNodeType.TEXT) {
      if (!n1) {
        n2.el = createTextNode(n2.children);

        insert(n2.el, container);
      } else {
        n2.el = n1.el;

        if (n1.children !== n2.children) {
          n2.el.nodeValue = n2.children;
        }
      }      
    }
    // Fragment 片段
    else if (type === VNodeType.FRAGMENT) {
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container));
      } else {
        patchChildren(n1.children, n2.children, container);
      }
    } else {
      console.error('[patch] vnode is invalid');
    }
  }

  // 更新子节点
  function patchChildren(c1, c2, container) {
    const oldArr = Array.isArray(c1);
    const newArr = Array.isArray(c2);

    // 新节点是文本节点，直接卸载就旧节点，设置新的文本节点
    if (typeof c2 === 'string') {
      if (oldArr) {
        c1.forEach(c => unmount(c));
      }

      setElementText(container, c1);
    }
    // 新节点是一组
    else if (newArr) {
      // 旧节点也是一组，需要用到 diff 算法
      if (oldArr) {
        // 暂时先粗暴一点，卸载所有旧节点，挂载所有新节点
        c1.forEach(c => unmount(c));
        c2.forEach(c => patch(null, c, container));
      }
      // 旧节点是文本或者无，直接置空，并渲染新节点
      else {
        setElementText(container, '');

        c2.forEach(c => patch(null, c, container));
      }
    }
    // 没有新节点，说明需要卸载
    else {
      if (oldArr) {
        c1.forEach(c => unmount(c));
      }

      setElementText(container, '');
    }
  }

  // 更新节点
  function patchElement(n1, n2) {
    n2.el = n1.el;
    const el = n2.el;

    // 更新属性
    const oldProps = n1.props;
    const newProps = n2.props;

    // 旧属性更新
    for (let key in oldProps) {
      if (oldProps[key] !== newProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }

    // 添加新属性
    for (let key in newProps) {
      if (!oldProps.hasOwnProperty(key)) {
        patchProps(el, key, null, newProps[key]);
      }
    }

    patchChildren(n1.children, n2.children, el);
  }

  // 挂载节点
  function mountElement(vnode, container) {
    const { type, children, props } = vnode;
    const el = createElement(type);

    // 处理元素的属性
    if (props) {
      for (const key in props) {
        const val = props[key];
        patchProps(el, key, null, val);
      }
    }

    if (children) {
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
    }

    // 建立虚拟节点和真实节点的联系
    vnode.el = el;

    insert(el, container);
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
