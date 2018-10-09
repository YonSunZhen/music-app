<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview" 
          :listenScroll="listenScroll"
          :probeType = 3
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
            class="item" 
            :data-index="index"
            :class="{'current': currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18;

  export default {
    created() {
      // touch这个值在两个函数中共享
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3;
    },
    data: function() {
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },
    // props中的数据是从父组件传过来的
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    methods: {
      // 将这个方法select派发到父组件,父组件可以监听到这个方法
      selectItem(item) {
        this.$emit('select', item);
      },
      // 点击跳转
      onShortcutTouchStart(e) {
        // 点击时是第几个锚点
        let anchorIndex = getData(e.target, 'index');
        // 获取点击时手指的位置,这个值需要在两个函数中共享
        let firstTouch = e.touches[0];
        // 计算出纵坐标的值
        this.touch.y1 = firstTouch.pageY;
        // 将点击时是第几个锚点添加到touch对象中
        this.touch.anchorIndex = anchorIndex;
        // 实现跳转
        this._scrollTo(anchorIndex);
      },
      // 滑动跳转
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        // 获取y轴上偏移的高度除以每个锚点的高度得到偏移锚点的个数
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      _scrollTo(index) {
        // 处理点击右侧上边界下边界的bug
        if (!index && index !== 0) {
          return;
        }
        // 处理滑动右侧到边界的bug
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      // 计算每个个区域的高度将数据存放在listHeight这个数组中
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    watch: {
      // 当数据(dom)发生变化时重新获取高度
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      // 监视scrollY,若scrollY发生变化时执行下面函数
      scrollY(newY) {
        const listHeight = this.listHeight;
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        // 当在中间滚动时
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          // console.log(height1);
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            // console.log(i);
            return;
          }
        }
        // 当滚动到底部时
        this.currentIndex = listHeight.length - 1;
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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
        align-items: center
        padding: 20px 0 0 30px
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