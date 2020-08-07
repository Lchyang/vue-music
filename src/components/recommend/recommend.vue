<template>
  <div>
    <div class="recommend-content">
      <!-- v-if 确保recommend有数据了然后渲染子元素，否则可能会导致，数据还没有取到， -->
      <!-- 子组件的monted已经执行，导致子组件中的函数失效 -->
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  data () {
    return {
      recommends: []
    }
  },
  components: {
    Slider
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
