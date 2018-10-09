<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: 'slider',
    data: function() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      atuoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        // 计算窗口宽度并设置sliderGroup的宽度
        this._setSliderWidth();
        // 初始化dot点
        this._initDots();
        // 实现滑动
        this._initSlider();
        // 自动播放
        if (this.atuoPlay) {
          this._play();
        }
      }, 20)
      // 当窗口重置时重新计算窗口的宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        // 当窗口重置时不需要两倍宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initDots() {
        this.dots = new Array(this.children.length);
        console.log(this.children.length);
      },
      _initSlider() {
        // console.log('hshs');
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;

          if (this.atuoPlay) {
            clearTimeout(this.timer);
            this._play();
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1;
        console.log(pageIndex);
        if (this.loop) {
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval);
      }
    },
    // 当组件摧毁时清除定时器
    destroyed() {
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

