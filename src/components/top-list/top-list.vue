<template>
  <transition name="top">
    <music-list :title="title" :bgImg="bgImg"></music-list>
  </transition>
</template>
<script>
import MusicList from '../music-list/music-list.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['toplist']),
    title () {
      return this.toplist.topTitle
    },
    bgImg () {
      return this.toplist.picUrl
    }
  },
  mounted () {
    console.log(this.toplist)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.top-enter-actve, .top-leave-active
  transition: all 0.3s ease
.top-enter, .top-leave-to
  transform: translate3d(100%, 0, 0)
</style>
