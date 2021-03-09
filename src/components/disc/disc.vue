<template>
  <transition appear name="detail">
    <music-list :bgImg="bgImage" :title="discTitle" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['disc']),
    discTitle () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  methods: {
    async _initSongList () {
      if (!this.disc.dissid) {
        this.$router.push({ path: '/recommend' })
      }
      const res = await getSongList(this.disc.dissid)
      if (res.code === ERR_OK) {
        const songs = await processSongsUrl(this._handleSong(res.cdlist[0].songlist))
        this.songs = songs
      }
    },
    _handleSong (songlist) {
      const ret = []
      songlist.forEach((muiscData) => {
        if (isValidMusic(muiscData)) {
          ret.push(createSong(muiscData))
        }
      })
      return ret
    }
  },
  created () {
    this._initSongList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// singer->singer-detail 的过渡动画
.detail-enter, .detail-leave-to
  transform: translate3d(100%, 0, 0)
.detail-enter-active, .detail-leave-active
  transition: all 0.3s
</style>
