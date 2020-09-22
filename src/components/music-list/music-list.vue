<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bg-image">
      <div class="play-button">
        <i class="icon-play-mini"></i>
        随机播放全部
      </div>
      <div class="filter"></div>
    </div>
    <scroll class="scroll" :data="songs">
      <div class="songs-swapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import songList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    songList,
    Scroll
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImg})`
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.music-list
  z-index: 100
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: $color-background
  .back
    z-index: 50
    position: absolute
    top: 0
    left: 6px
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    z-index: 20
    position: absolute
    top: 0
    width: 100%
    text-align: center
    line-height: 40px
    color: $color-text
    font-size: $font-size-large
  .bg-image
    z-index: 10
    position: absolute
    top: 0
    height: 0
    width: 100%
    padding-bottom: 70%
    // 使图片铺满
    background-size: cover
    .filter
      // 添加背景图片透明度
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
    .play-button
      z-index: 50
      position: absolute
      bottom: 20px
      left: 50%
      transform: translate(-50%)
      height: 30px
      width: 133px
      border: 1px solid $color-theme
      border-radius: 100px
      line-height: 30px
      color: $color-theme
      text-align: center
      font-size: $font-size-small
      .icon-play-mini
        font-size: $font-size-medium-x
        line-height: 30px
        padding-right: 2px
        vertical-align: middle
  // better scroll 滚动的条件父容器的高度小于子容器
  .scroll
    position: absolute
    top:0
    bottom:0
    width:100%
    .songs-swapper
      padding: 20px 30px
      background: $color-background
</style>
