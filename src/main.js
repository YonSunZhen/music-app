import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';

import 'common/stylus/index.styl';

fastclick.attach(document.body);
// 解决移动端300ms延迟

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
// 实现图片懒加载

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
});