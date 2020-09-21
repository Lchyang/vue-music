let _uid = ''

// 获取歌曲播放url中 的uid参数
export function getUid () {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date()).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}
