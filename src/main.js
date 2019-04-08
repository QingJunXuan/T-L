// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import echarts from 'echarts'

Vue.use(ElementUI);
Vue.use(VueResource);
//Vue.use(axios)
Vue.prototype.$ajax = axios;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  //NProgress.start();
  let user = localStorage.getItem('username');
  if (!user && to.path !== '/home') {
    next({path: '/home'})
  } else {
    next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});