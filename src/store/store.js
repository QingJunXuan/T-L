import Vue from 'vue'
import Vuex from 'vuex'/* 
import { stat } from 'fs';
import { addListener } from 'cluster'; */
import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        List: [
            {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "软件工程",
                teacherName: "范鸿飞",
                courseYear: "2018",
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: [],
               /*  class: [{
                    classNum: 1
                },{
                    classNum:2
                }] */
            }, {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "web",
                teacherName: "范鸿飞",
                courseYear: "2018",
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: [],
            }, {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "软件项目与过程管理",
                teacherName: "范鸿飞",
                courseYear: "2018",
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: ["软件工程"],
            },
        ],
        courseList: [
            {
                courseName: {
                  courseNameID: 1,
                  createTime: "2019-04-20T05:08:08.000+0000",
                  updateTime: "2019-04-20T05:08:08.000+0000",
                  courseName: "数据结构"
                },
                preCoursesName: []
            },
            {
              courseName: {
                courseNameID: 2,
                createTime: "2019-04-20T05:08:08.000+0000",
                updateTime: "2019-04-20T05:08:08.000+0000",
                courseName: "算法"
              },
              preCoursesName: [
                {
                  courseNameID: 1,
                  createTime: "2019-04-20T05:08:08.000+0000",
                  updateTime: "2019-04-20T05:08:08.000+0000",
                  courseName: "数据结构"
                }
              ]
            },
            {
                courseName:{
                    courseNameID: 3,
                    createTime: "2019-04-20T05:08:08.000+0000",
                    updateTime: "2019-04-20T05:08:08.000+0000",
                    courseName: "C语言"
                  },
                  preCoursesName:[],
            },
          ],
          data:[{
              name:"start",
              x:250,
              y:50,
          }],
          links:[],
          catalog:[],
    },
    mutations: {
        set(state,resp){
            state.courseList=resp.list
            state.data=resp.data
            state.links=resp.links
        },
        setCatalog(state,catalog){
            state.catalog=catalog
            console.log(state.catalog,"state catalog")
        },
        setAllCourse(state,data){
            state.courseList=data
        },
        addCourse(state, course) {
            state.courseList.push(course)
            console.log(state.courseList,"state.list")
        },
        addData(state, data) {
            state.data.push(data)
        },
        addLinks(state, link) {
            state.links.push(link)
        },
        delNode(state, arr) {
            var length = arr.length;
            //var length2 = state.courseList.length;
            var i = 0, j = 0, k = 0, z = 0;
            for (i; i < length; i++) {
                var name = arr[i].courseName;
                for (j; j < state.courseList.length; j++) {
                    if (state.courseList[j].courseName == name) {
                        state.courseList.splice(j, 1);
                        break;
                    };
                }
                for (k; k < state.data.length; k++) {
                    if (state.data[k].name == name) {
                        state.data.splice(k, 1);
                        break;
                    };
                }
                for (z; z < state.links.length; z++) {
                    if (state.links[z].target == name) {
                        state.data.splice(k, 1);
                        break;
                    };
                }
            }

        },
        delNode2(state, index) {
            //var length = arr.length;
            //var length2 = state.courseList.length;
            var i = 0;
            //for (i; i < length; i++) {
            var name = state.data[index].name;

            state.courseList.splice(index - 1, 1);
            state.data.splice(index, 1);

            for (i; i < state.links.length; i++) {
                if (state.links[i].target == name) {
                    state.links.splice(i, 1);
                    i--;
                    break;
                };
                if (state.links[i].source == name) {
                    state.links.splice(i, 1);
                    i--;
                    break;
                };
            }
            //}

        },
        editCourseListName(state, change) {
            state.courseList[change.index - 1].courseName.courseName = change.form.courseName
        },
        
        editCourseListLinks(state, change) {
            ///links
        },
        editName(state, change) {
            /* //修改courseList里的name
            state.courseList[change.index].courseName=change.name */
            //修改data里的name
            var oldName = state.data[change.index].name
            console.log(oldName)
            state.data[change.index].name = change.name
            console.log(state.data[change.index].name)
            //修改links里的name
            var length = state.links.length
            for (var i = 0; i < length; i++) {
                if (state.links[i].target == oldName) {
                    state.links[i].target = change.name
                    break;
                }
                if (state.links[i].source == oldName) {
                    state.links[i].source = change.name
                    break;
                }
            }
        },
        editLinks(state, change) {
            var newLength = change.new.length
            var name = state.data[change.index].name

            var array = state.links.filter(function (item) {
                if (item.target != name) {
                    return item
                }
            })
            console.log(array,"array")
            if (newLength == 0 ) {
                
                var addLink = {
                    target: name,
                    source: "start",
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    lineStyle: {
                        normal: { curveness: 0.2 }
                    }
                };
                array.push(addLink)
            } else if(newLength!=0){
                for (var i = 0; i < newLength; i++) {
                    var addLink = {
                        target: name,
                        source: change.new[i],
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        lineStyle: {
                            normal: { curveness: 0.2 }
                        }
                    };
                    array.push(addLink)
                }
            }
            state.links = array
            console.log(state.links,"links")
        },
    }
})