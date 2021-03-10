<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-button" ref="playBtn" v-show="songs.length > 0" @click="handleRandomPlay">
        <i class="icon-play-mini"></i>
        随机播放全部
      </div>
      <div class="filter"></div>
    </div>
    <scroll
      class="scroll"
      :data="songs"
      ref="list"
      :style="scrollStyle"
      v-if="showdom"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
    >
      <div class="songs-swapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
// TODO: 下拉放大的动画效果，高斯模糊，浏览器兼容性类的封装
<script type="text/ecmascript-6">
import songList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'

const HEADER_HEIGHT = 40
export default {
  data () {
    return {
      showdom: false,
      scrollY: 0
    }
  },
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
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  components: {
    songList,
    Scroll,
    Loading
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImg})`
    },
    // 用内联样式的方式
    scrollStyle () {
      return {
        top: `${this.$refs.bgImage.clientHeight}px`
      }
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.showdom = true
    // 使用this.$refs 时要在mounted 之后使用
    // 不能再v-if === false 中使用
    // ref 在组件中指向的实例对象，在dom中指向dom元素
    // this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + HEADER_HEIGHT
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    handleRandomPlay () {
      this.randomPlay({ list: this.songs })
    }
  },
  watch: {
    scrollY (newY) {
      if (newY < this.minTranslateY) {
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${HEADER_HEIGHT}px`
        this.$refs.bgImage.style['z-index'] = 15
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style['z-index'] = 0
        this.$refs.playBtn.style.display = ''
      }
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
    position: absolute
    top: 0
    height: 0
    width: 100%
    padding-top: 70%
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
      z-index: 5
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
    z-index: 10
    touch-action: none
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    .songs-swapper
      // 60px 防止mini播放栏挡住song-list内容
      padding: 20px 30px 60px 30px
      background: $color-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
