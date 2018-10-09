<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      // 默认不要监听滚动事件的位置
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        // console.log('9999');
        this._initScroll();
      }, 20)
    },
    methods: {
      _initScroll() {
        // console.log('888');
        if (!this.$refs.wrapper) {
          // console.log('7777');
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });
        // 实现监听滚动事件的位置信息
        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos);
          })
        }
        // console.log('6666');
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        // console.log('111');
        setTimeout(() => {
          this.refresh();
        }, 20)
      }
    }
  }
</script>

<style>

</style>
