import { playMode } from 'common/js/playModeConfig'

const state = {
  // 歌手
  singer: {},
  // 是否播放
  playing: false,
  // 全屏
  fullScreen: false,
  // 当前播放列表
  playlist: [],
  // 歌曲的顺序列表
  sequenceList: [],
  // 播放模式：顺序，随机， 单曲
  mode: playMode.sequence,
  // 当前歌曲的索引
  currentIndex: -1,
  // 歌单详情
  disc: {}
}

export default state
