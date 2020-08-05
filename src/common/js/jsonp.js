import originJSONP from 'jsonp'

export default function jsonp (url, data, opts) {
  // 如果url中有问号在末尾添加&，如果没有问号就添加问号，然后合并parm中的url
  // TODO 存在一个问题url没有问号的时候直接添加&这种事可行的吗比如 www.baidu.com&hello=world 这种形式
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, opts, (error, data) => {
      if (!error) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    const val = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(val)}`
  }
  return url ? url.substring(1) : ''
}
