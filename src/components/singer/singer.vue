<template>
  <div class="singer">
    <listview :singerData="singerData"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Listview from 'base/listview/listview'
// const HOT_SINGER_LEN = 10
// const HOT_NAME = '热门'
export default {
  data () {
    return {
      singerData: []
    }
  },
  components: {
    Listview
  },
  mounted () {
    this._initSingerList()
  },
  methods: {
    _initSingerList () {
      getSingerList().then((res) => {
        if (res.response.code === ERR_OK) {
          this.singerData = res.response.singerList.data
          console.log(this.singerData)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
