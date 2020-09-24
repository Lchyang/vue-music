<template>
  <div class="player" v-show="playList.length > 0">
    <div class="full-screen" v-show="fullScreen">播放器</div>
    <div class="mini" v-show="!fullScreen"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.player
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: red
</style>
