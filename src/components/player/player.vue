<template>
  <div class="player" v-show="playList.length > 0">
    <div class="full-screen" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image" />
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="middle">
        <div class="middle-left">
          <div class="cd-wrapper">
            <div class="cd">
              <img class="image" :src="currentSong.image" />
            </div>
          </div>
        </div>
        <div class="middle-right"></div>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i class="icon-play"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini" v-show="!fullScreen" @click="handleFullScreen">
      <div class="icon">
        <img width="40px" heigth="40px" :src="currentSong.image" />
      </div>
      <div class="text">
        <h1>{{ currentSong.name }}</h1>
        <h2>{{ currentSong.singer }}</h2>
      </div>
      <div class="control">
        <i class="icon-play-mini"></i>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong'
    ])
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    back () {
      this.setFullScreen(false)
    },
    handleFullScreen () {
      this.setFullScreen(true)
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// TODO: 样式回头看一下尤其是flex布局
@import '~common/stylus/variable'

.player
  .full-screen
    background: $color-background
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 50
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 1
      // TODO: ???? 什么意思？
      filter: blur(20px)
    .top
      position: relative
      top: 0
      .back
        position: absolute
        top: 0
        left: 6px
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        line-height: 40px
        color: $color-text
        font-size: $font-size-large
        text-align: center
      .subtitle
        line-height: 20px
        color: $color-text
        font-size: $font-size-medium
        text-align: center
  .middle
    position: fixed
    top: 80px
    width: 100%
    bottom: 170px
    // white-space: nowrap
    .middle-left
      position: relative
      width: 100%
      height: 0
      padding-top: 80%
      .cd-wrapper
        position: absolute
        top: 0
        left: 10%
        width: 80%
        height: 100%
        .image
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          box-sizing: border-box
          border-radius: 50%
          border: 10px solid rgba(255, 255, 255, 0.1)
  .bottom
    position: absolute
    bottom: 50px
    width: 100%
    .operators
      display: flex
      align-items: center
      .icon
        flex: 1
        color: $color-theme
        i
          font-size: 30px
      .i-left
        text-align: right
      .i-center
        text-align: center
        margin: 0 20px
        .icon-play
          font-size: 40px
      .i-right
        text-align: left
  .mini
    display: flex
    align-items: center
    position: fixed
    bottom: 0
    left: 0
    right: 0
    width: 100%
    height: 60px
    background: $color-highlight-background
    .icon
      flex: 0 0 40px
      line-height: 60px
      padding: 10px
      padding-left: 20px
      img
        display: block
        border-radius: 20px
    .text
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      line-height: 20px
      h1
        font-size: $font-size-medium
        color: $color-text
        margin-bottom: 2px
      h2
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0
</style>
