<template>
  <transition name="slider">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail();
      // console.log(this.singer);
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.list);
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"

 .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slider-enter-active,.slider-leave-active
    transition: all 0.3s
  .slider-enter,.slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>