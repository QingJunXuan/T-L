import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Header from '../components/Header.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: Header,
      name: '教与学',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/home', name: 'Home', component: Home },
      ]
    },
  ]
})
