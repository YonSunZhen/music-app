<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Mheader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default{
    components: {
      myHeader: Mheader,
      tab: Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>