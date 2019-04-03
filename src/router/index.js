import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Header from '../components/Header.vue'
import courseManagement from '../components/courseManagement.vue'
import courseDetail from '../components/courseDetail.vue'
import chapterDetail from '../components/chapterDetail'

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
        {
          path: '/courseManagement',
          name: 'courseManagement',
          component: courseManagement,
          meta: {
            keepAlive: true // 需要缓存
          }
        }
      ]
    }, {
      path: '/courseDetail',
      name:'courseDetail',
      component: courseDetail,
      children:[
        {
          path:'/chapterDetail',
          name:'chapterDetail',
          component:chapterDetail,
          meta:{
            keepAlive:true
          }
        }
      ]
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
