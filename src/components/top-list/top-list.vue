<template>
  <transition appear name="detail">
    <music-list :rank="rank" :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from '../music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
export default {
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['toplist']),
    title () {
      return this.toplist.topTitle
    },
    bgImg () {
      if (this.songs.length) {
        return this.songs[0].image
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    async _initMusicList () {
      if (!this.toplist.id) {
        this.$router.push({ path: '/rank' })
        return
      }
      const res = await getMusicList(this.toplist.id)
      if (res.code === ERR_OK) {
        this.songs = await processSongsUrl(this.normalMusic(res.songlist))
      }
    },
    normalMusic (songlist) {
      const ret = []
      songlist.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._initMusicList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// .top-enter, .top-leave-to
//   transform: translate3d(100%, 0, 0)
// .top-enter-active, .top-leave-active
//   transition: all 0.3s
.detail-enter, .detail-leave-to
  transform: translate3d(100%, 0, 0)
.detail-enter-active, .detail-leave-active
  transition: all 0.3s ease
</style>
