<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
       <div>
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            @click="addQuery(item.k)"
            class="item"
            v-for="(item, index) in hotKeys"
            :key="index"
          >
            <span>{{ item.k }}</span>
          </li>
        </ul>
      </div>
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
      </div>
      </div>
    </scroll>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" confirmBtnText="清空" ref="confirm" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box.vue'
import Confirm from 'base/confirm/confirm'
import SearchList from 'base/search-list/search-list.vue'
import Scroll from 'base/scroll/scroll.vue'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  data () {
    return {
      hotKeys: []
    }
  },
  computed: {
    shortcut () {
      return this.hotKeys.concat(this.searchHistory)
    }
  },
  watch: {
    query (newValue) {
      if (!newValue) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    onQueryChange (query) {
      this.query = query
    },
    async _initGetHotKey () {
      const res = await getHotKey()
      if (res.code === ERR_OK) {
        this.hotKeys = res.data.hotkey.slice(0, 10)
      }
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    deleteAll () {
      this.clearSearchHistory()
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    ...mapActions(['clearSearchHistory'])
  },
  created () {
    this._initGetHotKey()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
