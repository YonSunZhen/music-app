<template>
  <div class="music-list">
    <div class="back">
      <router-link class="icon-back" to="/singer"></router-link>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgmusic">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playButton">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <!-- 设置一个偏移层 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  const RESERVED_HEIGHT = 40;

  export default {
    // created() {
    //   console.log(this.title);
    // },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`;
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgmusic.clientHeight;
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y;
      }
    },
    watch: {
      scrollY(newY) {
        // 滚动的最大距离就是图片的高度，两个都是负数
        let translateY = Math.max(this.minTranslateY, newY);
        let zIndex = 0;
        let scale = 1
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
        this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`;
        const percent = Math.abs(newY / this.imageHeight);
        // 当往下拉的时候
        if (newY > 0) {
          // 这里表示头像放大的倍数
          scale = 1 + percent;
          zIndex = 10;
        }
        // 当到达顶部的时候
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgmusic.style.paddingTop = 0;
          this.$refs.bgmusic.style.height = `${RESERVED_HEIGHT}px`;
          this.$refs.playButton.style.display = 'none';
        } else {
          this.$refs.bgmusic.style.paddingTop = '70%';
          this.$refs.bgmusic.style.height = 0;
          this.$refs.playButton.style.display = '';
        }
        this.$refs.bgmusic.style.zIndex = zIndex;
        this.$refs.bgmusic.style['transform'] = `scale(${scale})`;
        this.$refs.bgmusic.style['webkitTransform'] = `scale(${scale})`;
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
      transform: translate3d(0,30px,0)
      -webkit-transform: translate3d(0,30px,0)
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // overflow hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
