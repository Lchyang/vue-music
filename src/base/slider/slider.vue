<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClassName } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
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
    }, 20)
  },
  methods: {
    _setSliderWidth () {
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
      if (this.loop) {
        width += sliderWdith * 2
      }
      // 然后设置sliderGroup的宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
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
</style>
