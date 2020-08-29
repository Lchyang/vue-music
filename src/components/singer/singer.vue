<template>
  <div class="singer">
    <listview :singerData="singerData"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Listview from 'base/listview/listview'
export default {
  data () {
    return {
      singerData: []
    }
  },
  components: {
    Listview
  },
  created () {
    this._initSingerList()
  },
  mounted () {
    this.bus.$on('change', (index) => {
      this._initSingerList(index)
    })
  },
  methods: {
    _initSingerList (index) {
      getSingerList(index).then((res) => {
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
