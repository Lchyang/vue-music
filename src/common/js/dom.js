export function addClassName (el, className) {
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  const re = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return re.test(el.className)
}
