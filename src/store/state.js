import { playMode } from 'common/js/playModeConfig'
import { loadSearch } from 'common/js/cache'

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
  disc: {},
  toplist: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: []
}

export default state
