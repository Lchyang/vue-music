// jsonp 请求的公共参数
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  loginUin: 0,
  notice: 0,
  format: 'jsonp'
}

// jsonp 调用参数中的options 对象
export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const ERR_OK = 0
