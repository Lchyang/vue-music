
<template>
  <scroll ref="scroll" class="suggest" :pullup="pullup" :data="result" @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import scroll from '../../base/scroll/scroll.vue'
import loading from '@/base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 30

export default {
  components: { scroll, loading },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * 监听query变化时请求数据
     */
    async search () {
      // 重置结果和页数hsamore
      this.result = []
      this.page = 1
      this.hasMore = true
      const res = await search(this.query, this.page, this.showSinger, perpage)
      if (res.code === ERR_OK) {
        this.result = await this._genResult(res.data)
        this._checkMore(res.data)
      }
    },
    listScroll () {
      this.$emit('listScroll')
    },
    /**
     * 下拉到底部搜索更多
     */
    async searchMore () {
      if (!this.searchMore) {
        return
      }
      this.page++
      const res = await search(this.query, this.page, this.showSinger, perpage)
      if (res.code === ERR_OK) {
        this.result = this.result.concat(await this._genResult(res.data))
        this._checkMore(res.data)
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${(item.singer)}`
      }
    },
    async selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
        this.$router.push({ path: `/search/${singer.id}` })
      } else {
        this.insertSong(item)
      }
    },
    /**
     * 根据当前数据判断是否还有多余的数据需要请求
     */
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    /**
     * 格式化数据
     */
    async _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        const songs = await processSongsUrl(this._normalizeSongs(data.song.list))
        ret = ret.concat(songs)
      }
      return ret
    },
    /**
     * 格式化数据
     */
    _normalizeSongs (list) {
      const ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({ setSinger: 'SET_SINGER' }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^='icon-']
        font-size: 14px
        color: $color-text-d
    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden
      .text
        no-wrap()
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
