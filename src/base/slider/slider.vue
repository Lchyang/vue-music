<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <!-- TODO :class="{active: ..}" 是什么意思，具体的用法 -->
      <!-- vue class绑定 当active=true 可以渲染不同的样式 -->
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClassName } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()
      if (this.autoPlay) {
        this._play()
      }
      // 监听一个resize事件，当窗口大小改变时，重新setWidth，刷新slider
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    }, 20)
  },
  destroyed () {
    // 设置setTimeOut时，要及时清理
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth (isResize) {
      // 获取sliderGroup 的子元素
      this.children = this.$refs.sliderGroup.children
      // 获取slider元素得页面宽度
      const sliderWdith = this.$refs.slider.clientWidth
      let width = 0
      // 循环每个slider添加classname，添加每个slider的宽度
      // 计算sliderGroup的总宽度
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClassName(child, 'slider-item')
        child.style.width = sliderWdith + 'px'
        width += sliderWdith
      }
      // 当slider loop 为 true 时，应该设置多余两倍的slider的宽度
      // isResize 是一个mark变量当窗口改变重新计算width时，不需要执行if语句
      if (this.loop && !isResize) {
        width += sliderWdith * 2
      }
      // 然后设置sliderGroup的宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      // 在使用scorll时，会生成多余的两个slider-item,把这个长度减掉
      this.dots = new Array(this.children.length - 2)
    },
    _initSlider () {
      // ref 的用法，映射dom中元素得属性
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        // silider 获取当前page的index
        const pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        // FIXED: 当自动手动干预轮播之后时间间隔会改变 _play 函数中 this.timer 没有设置
        if (this.autoPlay) {
          // 手动滑动时清空timer防止自动轮播冲突
          clearTimeout(this.timer)
          // 滑动之后再次启用自动轮播
          this._play()
        }
      })
    },
    _play () {
      // 暂停一段时间继续播放
      // TODO: timer 是啥没看懂
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.slider
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
