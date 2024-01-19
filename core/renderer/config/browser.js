import { VNodeType } from ".";

// 浏览器平台下的操作函数
const browser = {
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  patchProps(el, key, oldVal, newVal) {
    if (oldVal === newVal) {
      return true;
    }

    // 处理 class
    if (key === 'class') {
      el.className = newVal; 
    }
    // 处理事件
    else if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();

      !el._evs && (el._evs = {});
      let invokers = el._evs;
      let invoker = invokers[event];

      // 没有新值，代表移除事件
      if (!newVal) {
        el.removeEventListener(event, invoker);
        delete invokers[event];
        
        return true;
      }

      // 添加事件
      if (!invoker) {
        invoker = (e) => {
          const fns = invoker.value;

          if (Array.isArray(fns)) {
            fns.forEach(fn => fn(e)); 
          } else {
            fns(e);
          }
        }

        el.addEventListener(event, invoker);
        el._evs[event] = invoker;
      }

      invoker.value = newVal;
    }
    else {
      el.setAttribute(key, newVal);
    }
  },
  unmount(vnode) {
    if (vnode.type === VNodeType.FRAGMENT) {
      vnode.children.forEach(c => this.unmount(c));
    } else {
      const { el } = vnode;
      const parent = el.parentNode;
      parent && parent.removeChild(el);
    }
  },
  createTextNode(text) {
    return document.createTextNode(text);
  }
}

export default browser; 