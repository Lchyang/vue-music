<template>
  <transition appear name="detail">
    <music-list :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
export default {
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// singer->singer-detail 的过渡动画
.detail-enter, .detail-leave-to
  transform: translate3d(100%, 0, 0)
.detail-enter-active, .detail-leave-active
  transition: all 0.3s
</style>
