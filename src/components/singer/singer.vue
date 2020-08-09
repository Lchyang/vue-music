<template>
  <div>歌手页面</div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
export default {
  data () {
    return {
      singerList: []
    }
  },
  mounted () {
    this._initSingerList()
  },
  methods: {
    _initSingerList () {
      getSingerList().then((res) => {
        if (res.response.code === ERR_OK) {
          this.singerList = res.response.singerList.data.singerlist
          console.log(this.singerList)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
