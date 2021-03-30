import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveSearch (query) {
  const searchs = storage.get(SEARCH_KEY, [])
  insertArray(searchs, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch (query) {
  const searchs = storage.get(SEARCH_KEY, [])
  deleteFromArray(searchs, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay (song) {
  const playlist = storage.get(PLAY_KEY, [])
  insertArray(playlist, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, playlist)
  return playlist
}

export function deletePlay (song) {
  const playlist = storage.get(PLAY_KEY, [])
  deleteFromArray(playlist, (item) => {
    return item.id === song.id
  })
  storage.set(PLAY_KEY, playlist)
  return playlist
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  const list = storage.get(FAVORITE_KEY, [])
  insertArray(list, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, list)
  return list
}

export function deleteFavorite (song) {
  const list = storage.get(FAVORITE_KEY, [])
  deleteFromArray(list, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, list)
  return list
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
