import originJSONP from 'jsonp'

// jsonp 自定义的函数 originJSONP 是引入的库
export default function jsonp (url, data, opts) {
  // 如果url中有问号在末尾添加&，如果没有问号就添加问号，然后合并parm中的url
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
    // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
    url += `&${k}=${encodeURIComponent(val)}`
  }
  return url ? url.substring(1) : ''
}
