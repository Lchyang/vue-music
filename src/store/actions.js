import * as types from './types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/playModeConfig'
import { saveSearch, deleteSearch, clearSearch, savePlay, deletePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索也点击歌曲时添加歌曲并播放
export const insertSong = function ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequentlist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const currentsong = playlist[currentIndex]
  // 获取当前歌曲索引
  const point = findIndex(playlist, song)
  // 插入歌曲
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 如果歌曲列表存在相同的歌曲，将相同的歌曲删除
  if (point > -1) {
    if (point < currentIndex) {
      playlist.splice(point, 1)
      currentIndex--
    } else {
      playlist.splice(point + 1, 1)
    }
  }
  // 插入到sequentlist 中 如果存在相同的歌曲，删除相同的歌曲
  const currentSIndex = findIndex(sequentlist, currentsong) + 1
  const fsIndex = findIndex(sequentlist, song)
  sequentlist.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (fsIndex < currentSIndex) {
      sequentlist.splice(fsIndex, 1)
    } else {
      sequentlist.splice(fsIndex + 1, 1)
    }
  }
  // commit 数据
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequentlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // 开启全屏
  commit(types.SET_FULL_SCREEN, true)
  // 开启播放
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequentlist = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const playIndex = playlist.findIndex((item) => {
    return song.id === item.id
  })
  const sequentIndex = sequentlist.findIndex((item) => {
    return song.id === item.id
  })
  playlist.splice(playIndex, 1)
  sequentlist.splice(sequentIndex, 1)
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequentlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const clearSong = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const deletePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, deletePlay(song))
}

export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
