import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import axios from 'axios'
import Header from '../components/Header.vue'
import sCourseManage from '../components/student/courseManage.vue'
import sCourseDetail from '../components/student/courseDetail.vue'
import sChapterDetail from '../components/student/chapterDetail.vue'
import tChapterDetail from '../components/teacher/chapterDetail.vue'
import sStudentAnalysis from '../components/student/studentAnalysis.vue'
import tCourseManage from '../components/teacher/courseManage.vue'
import tCourseDetail from '../components/teacher/courseDetail.vue'
import tChapterCatalog from '../components/teacher/chapterCatalog.vue'
import tPointEdit from '../components/teacher/pointEdit.vue'
import preExerciseEdit from '../components/teacher/preExerciseEdit.vue'
import revExerciseEdit from '../components/teacher/revExerciseEdit.vue'
import tStudentList from '../components/teacher/studentList.vue'
import tStudentAnalysis from '../components/teacher/studentAnalysis.vue'
import tExerciseMark from '../components/teacher/exerciseMark.vue'
import tCourseAnalysis from '../components/teacher/courseAnalysis.vue'
import feedback from '../components/student/feedback.vue'
import courseList from '../components/admin/courseList.vue'
import teacherList from '../components/admin/teacherList.vue'
import aCourseAnalysis from '../components/admin/courseAnalysis.vue'
import aCourseGraph from '../components/admin/courseGraph.vue'
import adminManage from '../components/admin/adminManage.vue'
import spoint from '../components/student/sPoint.vue'
import preExercise from '../components/student/preExercise.vue'
import revExercise from '../components/student/revExercise.vue'
import tpoint from '../components/teacher/tPoint.vue'
import tpreExercise from '../components/teacher/preExercise.vue'
import trevExercise from '../components/teacher/revExercise.vue'
import chapterGraph from '../components/student/chapterGraph.vue'

Vue.use(Router)
Vue.prototype.$ajax=axios

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
    }, {
      path: '/student',
      component: Header,
      redirect: '/student/courseManagement',
      children: [{
        path: 'courseManagement',
        name: 'sCourseManagement',
        component: sCourseManage,
        meta: {
          keepAlive: true // 需要缓存
        }
      },{
        path: 'courseDetail',
        name: 'sCourseDetail',
        component: sCourseDetail,
      },{
        path: 'studentAnalysis',
        name: 'sStudentAnalysis',
        component: sStudentAnalysis,
      }, {
        path: 'chapterDetail',
        name: 'sChapterDetail',
        component: sChapterDetail,
        children: [
          {
            path:'point',
            name:'point',
            component:spoint,
          },
          {
            path:'preExercise',
            name:'preExercise',
            component:preExercise,
          },
          {
            path:'revExercise',
            name:'revExercise',
            component:revExercise,
          }
        ],
        meta: {
          keepAlive: true
        },
      }, {
        path: 'feedback',
        name: 'feedback',
        component: feedback
      }, ],
    }, {
      path: '/teacher',
      component: Header,
      redirect: '/teacher/courseManagement',
      children: [
        {
          path: 'courseManagement',
          name: 'tCourseManagement',
          component: tCourseManage,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'chapterEdit',
          name:'tChapterCatalog',
          component:tChapterCatalog,
          children: [
            {
              path:'pointEdit',
              name:'pointEdit',
              component:tPointEdit,
            },
            {
              path:'preEdit',
              name:'preExerciseEdit',
              component:preExerciseEdit,
            },
            {
              path:'revEdit',
              name:'revExerciseEdit',
              component:revExerciseEdit,
            }
          ]
        },{
          path: 'chapterDetail',
          name: 'tChapterDetail',
          component: tChapterDetail,
          meta: {
            keepAlive: true
          },
          children: [
            {
              path:'point',
              name:'tpoint',
              component:tpoint,
            },
            {
              path:'preExercise',
              name:'tpreExercise',
              component:tpreExercise,
            },
            {
              path:'revExercise',
              name:'trevExercise',
              component:trevExercise,
            }
          ]
        },
        {
          path:'mark',
          name:'exerciseMark',
          component:tExerciseMark,
        },
        {
          path:'studentList',
          name:'tStudentList',
          component:tStudentList,
        },
        {
          path:'studentAnalysis',
          name:'tStudentAnalysis',
          component:tStudentAnalysis,
        },
        {
          path: 'courseAnalysis',
          name: 'tCourseAnalysis',
          component: tCourseAnalysis
        },
        {
          path: 'courseDetail',
          name: 'tCourseDetail',
          component: tCourseDetail,
        },
      ]
    }, 
    {
      path:'/adminManage',
      component:adminManage,
      redirect: '/adminManage/courseList',
      name:'adminManage',
      children:[
        {
          path:'courseList',
          name:'courseList',
          component:courseList,
        },
        {
          path:'teacherList',
          name:'teacherList',
          component:teacherList,
        },
        {
          path:'courseAnalysis',
          name:'aCourseAnalysis',
          component:aCourseAnalysis,
        },
        {
          path: 'courseGraph',
          name: 'aCourseGraph',
          component: aCourseGraph
        }
      ]
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
