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
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

// TODO: 具体什么意思见music-list 组件开发暂时不懂
const elementStyle = document.createElement('div').style

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
