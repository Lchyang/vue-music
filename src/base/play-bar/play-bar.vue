<template>
  <div class="play-bar-wrapper">
    <div class="time-l">{{ playTime }}</div>
    <div
      class="time-line"
      ref="timeLine"
      @touchstart.prevent="touchStart"
      @touchmove.prevent="touchMove"
      @touchend="touchEnd"
      @click="click"
    >
      <div class="line">
        <div class="line-left" ref="lineLeft"></div>
      </div>
      <div class="button-wrapper" ref="buttonWrapper">
        <div class="button"></div>
      </div>
    </div>
    <div class="time-r">{{ totalTime }}</div>
  </div>
</template>

<script type="text/ecmascript-6">
const BtnWidth = 10
export default {
  props: {
    playTime: {
      type: String,
      default: '0:00'
    },
    totalTime: {
      type: String,
      defalut: ''
    },
    timePercent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    // 使用transform 进行移动
    transWidth (percent) {
      if (percent > 0 && !this.touch.inited) {
        const timeLineWidth = this.$refs.timeLine.clientWidth - BtnWidth
        const offsetWidth = timeLineWidth * percent
        this.offset(offsetWidth)
      }
    },
    touchStart (e) {
      this.touch.inited = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.lineLeft.clientWidth
    },
    touchMove (e) {
      if (!this.touch.inited) { return }
      const moveX = e.touches[0].pageX - this.touch.startX
      // touchmove 最大移动的距离，向左移时moveX为负值和0之间取最大值保证不超过做边框
      // 向右移时和dom宽度取最小值保证不超过右边框
      const offsetWidth = Math.min(this.$refs.timeLine.clientWidth - BtnWidth,
        Math.max(0, this.touch.left + moveX))
      this.offset(offsetWidth)
      this.$emit('percentChanging', this.getPercent())
    },
    touchEnd () {
      this.touch.inited = false
      this._triggerPercent()
    },
    // 设置滑块左边的宽度，分两种情况，当不滑动的时候根据播放时间的百分比设置
    // 当touch时候按照touch的距离设置
    offset (offsetWidth) {
      this.$refs.lineLeft.style.width = `${offsetWidth}px`
      this.$refs.buttonWrapper.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    },
    getPercent () {
      const barWidth = this.$refs.timeLine.clientWidth - BtnWidth
      const result = this.$refs.lineLeft.clientWidth / barWidth
      return result
    },
    _triggerPercent () {
      this.$emit('percentChange', this.getPercent())
    },
    click (e) {
      const rest = this.$refs.timeLine.getBoundingClientRect()
      const offsetWidth = e.pageX - rest.left
      this.offset(offsetWidth)
      this._triggerPercent()
    }
  },
  watch: {
    timePercent (newPercent) {
      this.transWidth(newPercent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.play-bar-wrapper
  display: flex
  padding: 10px 0
  .time-l
    line-height: 30px
    width: 30px
    height: 30px
    font-size: $font-size-small
  .time-line
    flex: 1
    position: relative
    .line
      position: absolute
      top: 13px
      height: 4px
      width: 100%
      background: rgba(0, 0, 0, 0.3)
      .line-left
        height: 100%
        background: $color-theme
        width: 0
    .button-wrapper
      position: absolute
      height: 30px
      width: 30px
      left: -10px
      .button
        box-sizing: border-box
        position: relative
        top: 7px
        left: 7px
        width: 16px
        height: 16px
        border: 2px solid $color-text
        background: $color-theme
        border-radius: 50%
  .time-r
    text-align: right
    line-height: 30px
    width: 30px
    height: 30px
    font-size: $font-size-small
</style>
