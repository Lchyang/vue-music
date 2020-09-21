<template>
  <transition appear name="detail">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
export default {
  data () {
    return {
      singer_id: '',
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this.generatorSong(res.data.list)).then((songs) => {
            this.songs = songs
            console.log(this.songs)
          })
        }
      })
    },
    generatorSong (list) {
      const res = []
      list.forEach(element => {
        const { musicData } = element
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData))
        }
      })
      return res
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.singer-detail
  z-index: 100
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
.detail-enter, .detail-leave-to
  transform: translate3d(100%, 0, 0)
.detail-enter-active, .detail-leave-active
  transition: all 0.3s
</style>
