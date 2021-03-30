<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-left" ref="middleLeft">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper">
                <img
                  class="image"
                  :src="currentSong.image"
                  :class="cdRoate"
                  ref="image"
                />
              </div>
            </div>
            <div class="lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll
            class="middle-right"
            :data="currentLyric && currentLyric.lines"
            ref="middleRight"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <li
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(item, index) of currentLyric.lines"
                  :key="item.time"
                  ref="text"
                >
                  {{ item.txt }}
                </li>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: dotShow === 'cd' }"></span>
            <span class="dot" :class="{ active: dotShow === 'lyric' }"></span>
          </div>
          <play-bar
            :playTime="formatTime(currentTime)"
            :totalTime="formatTime(currentSong.duration)"
            :timePercent="percent"
            @percentChanging="percentChanging"
            @percentChange="percentChange"
            class="play-bar"
          ></play-bar>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="changePlayingState" :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini" v-show="!fullScreen" @click="handleFullScreen">
        <div class="icon">
          <div class="img-swapper" ref="miniWrapper">
            <img
              width="40px"
              heigth="40px"
              :src="currentSong.image"
              :class="cdRoate"
              ref="miniImage"
            />
          </div>
        </div>
        <div class="text">
          <h1>{{ currentSong.name }}</h1>
          <h2>{{ currentSong.singer }}</h2>
        </div>
        <div class="control" @click.stop="changePlayingState">
          <i :class="miniPlayIcon"></i>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="timeUpdate"
      @ended="end"
    ></audio>
    <play-list ref="playList"></play-list>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import playBar from 'base/play-bar/play-bar'
import { playMode } from 'common/js/playModeConfig'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import PlayList from 'components/play-list/play-list'
import { playerMixin } from 'common/js/mixin'
const transform = prefixStyle('transform')
export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: '',
      currentLyric: null,
      currentLineNum: 0,
      dotShow: 'cd',
      playingLyric: ''
    }
  },
  components: {
    playBar,
    Scroll,
    PlayList
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRoate () {
      return this.playing ? 'play' : ''
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ])
  },
  watch: {
    // 监听歌曲的变化来控制播放与暂停
    currentSong (newSong, oldSong) {
      if (!newSong.id) { return }
      if (newSong.id === oldSong.id) { return }
      if (this.currentLyric) {
        this.currentLyric.stop()
        // 重置为null
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (playState) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        playState ? audio.play() : audio.pause()
      })
      if (!playState) {
        if (this.fullScreen) {
          this.syncWrapperTransform('imageWrapper', 'image')
        } else {
          this.syncWrapperTransform('miniWrapper', 'miniImage')
        }
      }
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions(['savePlayHistory']),
    showPlayList () {
      this.$refs.playList.show()
    },
    middleTouchStart (e) {
      this.touch.inited = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.inited) { return }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return 0
      }
      const left = this.dotShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
      this.touch.touchPersent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.middleRight.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleRight.$el.style.transitionDuration = 0
      this.$refs.middleLeft.style.opacity = 1 - this.touch.touchPersent
      // transitionDuration 动画过度时间
      this.$refs.middleLeft.style.transitionDuration = 0
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.dotShow === 'cd') {
        if (this.touch.touchPersent > 0.1) {
          offsetWidth = -window.innerWidth
          this.dotShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.touchPersent < 0.9) {
          offsetWidth = 0
          this.dotShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.middleRight.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleRight.$el.style.transitionDuration = `${time}ms`
      this.$refs.middleLeft.style.opacity = opacity
      this.$refs.middleLeft.style.transitionDuration = `${time}ms`
    },
    // 暂停播放
    changePlayingState () {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    back () {
      this.setFullScreen(false)
    },
    // 控制播放界面全屏显示
    handleFullScreen () {
      this.setFullScreen(true)
    },
    // 播放cd缩放动画
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 600,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      // 利用js绑定dom 实现动画
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale () {
      // 底部mini图像的宽度
      const targetWidth = 40
      // mini图片中心离左边框的距离
      const paddingLeft = 40
      // mini图片中心离底边框的距离
      const paddingBottom = 30
      // cd上边框离顶部边框的距离
      const paddingTop = 80
      // cd 宽度
      const width = window.innerWidth * 0.8
      // 两个元素得比例
      const scale = targetWidth / width
      // x轴偏移量
      const x = -(window.innerWidth / 2 - paddingLeft)
      // y轴偏移量
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return { x, y, scale }
    },
    /**
     * 计算内层Image的transform，并同步到外层容器
     * 实现cd旋转暂停的时候保持位置
     * @param wrapper
     * @param inner
     */
    syncWrapperTransform (wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return
      }
      const imageWrapper = this.$refs[wrapper]
      const image = this.$refs[inner]
      const wTransform = getComputedStyle(imageWrapper)[transform]
      const iTransform = getComputedStyle(image)[transform]
      imageWrapper.style[transform] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
    },
    // 下一首
    // TODO: 处理歌曲列表边界值，当歌曲列表为1的时候
    // TODO: 处理微信后台播放的问题 7-24
    // TODO: 播放器底部高度适配 7-25
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.changePlayingState()
        }
      }
      this.songReady = false
    },
    // 上一首
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.changePlayingState()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    timeUpdate (e) {
      this.currentTime = e.target.currentTime
    },
    formatTime (time_) {
      const time = time_ | 0
      const seconds = this.secondsFormat(time % 60)
      const min = time / 60 | 0
      return `${min}:${seconds}`
    },
    // 格式化time
    secondsFormat (time) {
      const timeLen = time.toString().length
      if (timeLen < 2) {
        return `0${time}`
      } else {
        return time
      }
    },
    percentChanging (percent) {
      this.currentTime = this.currentSong.duration * percent
    },
    percentChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.currentTime = this.$refs.audio.currentTime = currentTime
      // 如果暂停状态下滑动默认自动播放
      if (!this.playing) {
        this.changePlayingState()
      }
      // 跟随进度条切换歌词时间
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 播放结束后歌曲跳转
    end () {
      if (this.mode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 当循环播放时，播放结束时歌词时间重置
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      } else {
        this.next()
      }
    },
    getLyric () {
      this.currentSong.getLyric().then(res => {
        if (this.currentSong.lyric !== res) { return }
        this.currentLyric = new Lyric(res, this.handleLyric)
        this.currentLineNum = this.currentLyric
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        const El = this.$refs.text[lineNum - 5]
        this.$refs.middleRight.scrollToElement(El)
      } else {
        this.$refs.middleRight.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
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
    z-index: 150
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      // 虚化效果
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
      white-space: nowrap
      .middle-left
        vertical-align: top
        display: inline-block
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
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
            .play
              animation: rotate 20s linear infinite
        .lyric-wrapper
          margin: 30px auto 0 auto
          width: 80%
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $fonst-size-medium
            color: $color-text-l
      .middle-right
        vertical-align: top
        display: inline-block
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          text-align: center
          margin: 0 auto
          overflow: hidden
          .text
            font-size: $font-size-medium
            color: $color-text-l
            line-height: 32px
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        .dot
          display: inline-block
          height: 8px
          width: 8px
          background: $color-text-ll
          margin: 0 4px
          border-radius: 50%
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .play-bar
        box-sizing: border-box
        width: 80%
        height: 50px
        margin: 0 auto
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
          i
            font-size: 40px
        .i-right
          text-align: left
  // TODO: 动画仔细看一下
  .normal-enter-active, .normal-leave-active
    transition: all 0.4s
    .top, .bottom
      // 贝塞尔曲线 控制动画效果
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)
  .normal-enter, .normal-leave-to
    opacity: 0
    .top
      transform: translate3d(0, -100px, 0)
    .bottom
      transform: translate3d(0, 100px, 0)
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
    z-index:150
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 10px
      padding-left: 20px
      .img-swapper
        height: 100%
        width: 100%
        img
          display: block
          border-radius: 20px
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
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
  .mini-enter-active, .mini-leave-active
    transition: all 0.5s
  .mini-enter, .mini-leave-to
    opacity: 0
    transform: translate3d(0, 100px, 0)
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
