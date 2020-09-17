<template>
  <transition appear name="detail">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {}
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
