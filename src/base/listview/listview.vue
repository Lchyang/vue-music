<template>
  <scroll class="listview">
    <ul>
      <li class="list-group">
        <h2 class="list-group-title">{{singerData.index}}</h2>
        <ul>
          <li
            class="list-group-item border-bottom"
            v-for="item in singerData.singerlist"
            :key="item.singer_id"
          >
            <img class="list-group-item-img" v-lazy="item.singer_pic" />
            <p class="list-group-item-name">{{item.singer_name}}</p>
          </li>
          <tr></tr>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
export default {
  components: {
    Scroll
  },
  props: {
    singerData: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.border-bottom
  border-color: $color-theme

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
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
      padding: 20px 0 0 30px
      .list-group-item-img
        width: 50px
        height: 50px
        border-radius: 50%
      .list-group-item-name
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
