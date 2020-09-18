<template>
  <scroll class="listview" ref="listview" @scroll="scroll" :listen-scroll="listenScroll">
    <ul>
      <li v-for="(group,index) in singerData" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            @click="selectItem(item)"
            v-for="(item,index) in group.items"
            :key="index"
            class="list-group-item"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="touchStart">
      <ul>
        <li class="item" v-for="(item,index) in shortcutData" :key="index" :data="index">{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

import Vue from 'vue'
Vue.prototype.bus = new Vue()

export default {
  components: {
    Scroll
  },
  data () {
    return {
      touch: {},
      listHeight: []
    }
  },
  props: {
    singerData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  created () {
    this.listenScroll = true
  },
  computed: {
    shortcutData () {
      return this.singerData.map(
        (group) => {
          return group.title.substr(0, 1)
        }
      )
    }
  },
  methods: {
    touchStart (e) {
      console.log(e.target)
      const anchorIndex = getData(e.target, 'data')
      console.log(anchorIndex)
      const firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      console.log(this.$refs.listview)
      // this.scroll = new Scroll(this.$refs.listview, {})
      this.scroll.scrollToElement(this.$refs.listGroup[index], 0)
      this.scrollY = this.$refs.listview.scroll.y
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      overflow: hidden
      align-items: center
      border-bottom: 0.1px solid $color-highlight-background
      padding: 10px 0 10px 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
