<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @query="search" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switch="switchItem"
        ></switches>
        <div class="list-wrapper">
          <scroll :key="0" class="list-scroll" v-if="currentIndex === 0" :data="playHistory" ref="songScroll">
            <song-list :songs="playHistory" class="list-inner" @select="selectSong"></song-list>
          </scroll>
          <scroll :key="1" class="list-scroll" v-if='currentIndex === 1' :data="searchHistory" ref="searchScroll">
            <search-list class="list-inner" :searches="searchHistory" @delete="deleteOne"></search-list>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @select="selectItem"
          @listScroll="blurInput"
        ></suggest>
      </div>
    </div>
  </transition>
</template>
<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
import { searchMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest,
    Switches,
    SongList,
    Scroll,
    SearchList
  },
  data () {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  watch: {
    query (newVal) {
      if (!newVal) {
        this.refreshList()
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.refreshList()
    },
    refreshList () {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songScroll.refresh()
        } else {
          this.$refs.searchScroll.refresh()
        }
      }, 100)
    },
    hide () {
      this.showFlag = false
    },
    search (query) {
      this.query = query
    },
    selectItem () {
      this.saveSearch()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
      }
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions(['insertSong', 'deleteSearchHistory'])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.add-song
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index: 200
  background: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
  .header
    position: relative
    height: 44px
    text-align: center
    .title
      line-height: 44px
      font-size: $font-size-large
      color: $color-text
    .close
      position: absolute
      top: 0
      right: 8px
      .icon-close
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
  .search-box-wrapper
    margin: 20px
  .shortcut
    .list-wrapper
      position: absolute
      top: 165px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
  .search-result
    position: fixed
    top: 124px
    bottom: 0
    width: 100%
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
