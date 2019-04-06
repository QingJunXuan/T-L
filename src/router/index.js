import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Header from '../components/Header.vue'
import sCourseManage from '../components/student/sCourseManage.vue'
import sCourseDetail from '../components/student/sCourseDetail.vue'
import sChapterDetail from '../components/student/sChapterDetail.vue'
import tCourseManage from '../components/teacher/tCourseManage.vue'
import tCourseDetail from '../components/teacher/tCourseDetail.vue'
import feedback from '../components/student/feedback.vue'
import adminManage from '../components/admin/adminManage.vue'
import courseList from '../components/admin/courseList.vue'
import teacherList from '../components/admin/teacherList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/',
      component: Header,
      name: '教与学',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/home', name: 'Home', component: Home },
      ]
    }, {
      path: '/student',
      component: Header,
      children: [{
        path: 'courseManagement',
        name: 'sCourseManagement',
        component: sCourseManage,
        meta: {
          keepAlive: true // 需要缓存
        }
      },],
    }, {
      path: '/student/courseDetail',
      name: 'sCourseDetail',
      component: sCourseDetail,
    }, {
      path: '/student/chapterDetail',
      name: 'sChapterDetail',
      component: sChapterDetail,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/student/feedback',
      name: 'feedback',
      component: feedback
    }, {
      path: '/teacher',
      component: Header,
      children: [
        {
          path: 'courseManagement',
          name: 'tCourseManagement',
          component: tCourseManage,
          meta: {
            keepAlive: true // 需要缓存
          }
        }]
    }, {
      path: '/teacher/courseDetail',
      name: 'tCourseDetail',
      component: tCourseDetail,
    },{
      path:'/adminManage',
      component:adminManage,
      name:'adminManage',
      children:[{
        path:'courseList',
        name:'courseList',
        component:courseList,
      },{
        path:'teacherList',
        name:'teacherList',
        component:teacherList,
      }]
    }],
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
