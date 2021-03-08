<template>
  <transition appear name="detail">
    <music-list :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
import musicList from 'components/music-list/music-list'
export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    musicList
  },
  computed: {
    // 通过 mapGetter 在state 中获取数据，再通过组件中传值把数据传给music-list
    title () {
      return this.singer.name
    },
    bgImg () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    async _getDetail () {
      // 直接在歌手详情页刷新是跳转回歌手页
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      // 获取歌手详情
      const res = await getSingerDetail(this.singer.id)
      console.log(res, 'res')
      if (res.code === ERR_OK) {
        const songs = await processSongsUrl(this.generatorSong(res.data.list))
        console.log(songs, 'songs')
        this.songs = songs
      }
    },
    // 获取歌曲对象
    generatorSong (list) {
      const res = []
      list.forEach(element => {
        const { musicData } = element
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData))
        }
      })
      console.log(res, 'generatorSong')
      return res
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// singer->singer-detail 的过渡动画
.detail-enter, .detail-leave-to
  transform: translate3d(100%, 0, 0)
.detail-enter-active .detail-leave-active
  transition: all 0.3s
</style>
