<template>
  <ul class="switches">
    <li
      v-for="(item, index) in switches"
      :key = index
      class="switch-item"
      :class="{ active: currentIndex === index }"
      @click="changeIndex(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default () {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeIndex (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.switches
  display: flex
  align-items: center
  width: 240px
  margin: 0 auto
  border: 1px solid $color-highlight-background
  border-radius: 5px
  .switch-item
    flex: 1
    padding: 8px
    text-align: center
    font-size: $font-size-medium
    color: $color-text-d
    &.active
      background: $color-highlight-background
      color: $color-text
</style>
