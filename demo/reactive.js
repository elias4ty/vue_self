/**
 * 副作用桶(依赖收集集合)
 * 
 * 三级对应关系，分别是
 * 1. 对象(Map)
 * 2. 对象的属性(Set)
 * 3. 对象属性的副作用函数组
 * 
 * target -> key -> effect
 */
const bucket = new WeakMap();

const data = { text: 'hello', ok: true };
let activeEffect;

function cleanUp(fn) {
  const deps = fn.deps;

  for (let dep of deps) {
    dep.delete(fn);
  }

  deps.length = 0;
}

// 依赖收集
function effect(fn) {
  const effectFn = function effectFn(){
    cleanUp(effectFn);
    activeEffect = effectFn;
    fn();
  }
  
  effectFn.deps = [];
  
  effectFn();
}

function trace(target, key) {
  if (!activeEffect) {
    return target[key];
  }

  // 桶里没有对象
  let obj = bucket.get(target);
  if (!obj) {
    obj = new Map();
    bucket.set(target, obj);  
  }

  // 桶里有对象没属性
  let keyEffects = obj.get(key);
  if (!keyEffects) {
    keyEffects = new Set();
    obj.set(key, keyEffects);
  }

  // 向桶里添加副作用函数
  keyEffects.add(activeEffect);  

  // 副作用函数反向收集对象属性，原因在 4.4 分支切换中叙述
  activeEffect.deps.push(keyEffects);
}

function trigger(target, key) {
  const obj = bucket.get(target);
  if (!obj) return true;

  const effects = obj.get(key);
  if (!effects) return true;

  const effectRun = new Set(effects);
  effectRun.forEach(fn => fn());
}

const obj = new Proxy(data, {
  // 记录和存储副作用函数
  get(target, key) {
    trace(target, key);

    return target[key];
  },
  // 取出并执行副作用函数
  set(target, key, val) {
    target[key] = val;
    
    trigger(target, key);

    return true;
  }
});

effect(() => {
  console.log('run');
  document.body.innerText = obj.ok ? obj.text : 'not';
});

setTimeout(() => {
  obj.ok = false;
}, 1500);
