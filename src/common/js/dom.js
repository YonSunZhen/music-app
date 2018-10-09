export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split('');
  // 将el的所有class以空格分割转化为数组
  newClass.push(className);
  // 新添加的className压进数组里面
  el.className = newClass.join('');
  // 将新生成的class转化为字符串
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
  // 有的话返回true,没有的话返回false,el.className表示el节点的所有class
}

// 获取dom节点的某个属性
export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}