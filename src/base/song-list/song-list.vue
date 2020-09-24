<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(item, index) of songs"
        :key="item.id"
        @click="selectItem(item, index)"
      >
        <div class="title">{{ item.name }}</div>
        <div class="desc">{{ desc(item) }}</div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    desc (song) {
      return `${song.singer}·${song.name}`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.item
  padding: 10px 0
  .title
    line-height: 20px
    font-size: $font-size-medium
  .desc
    line-height: 20px
    font-size: $font-size-medium
    color: $color-text-d
    padding-top: 4px
</style>
