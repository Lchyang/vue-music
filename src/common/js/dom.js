export function addClassName (el, className) {
  if (hasClass(el, className)) {
    return
  }
  // 如果没有相应的className，把新的className添加进去
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  // 使用正则表达式检测元素中是否已经有了相应的className
  const re = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return re.test(el.className)
}

export function getData (el, name, val) {
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
