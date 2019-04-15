import Vue from 'vue'
import Vuex from 'vuex'/* 
import { stat } from 'fs';
import { addListener } from 'cluster'; */

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        /*   courseList: [
              {
                  courseID: 1,
                  createTime: "2019-03-28T04:53:06.000+0000",
                  updateTime: "2019-04-03T06:23:53.000+0000",
                  teacherID: 443,
                  courseName: "软件测试",
                  teacherName: "范鸿飞",
                  courseYear: 2018,
                  courseSemester: "秋季",
                  startTime: "2019-03-28",
                  endTime: "2019-03-29",
                  successor: ["start"],
  
              }, {
                  teacherName: "李老师",
                  teacherID: 1001,
                  courseNum: 2,
                  courseName: '软件项目与过程管理',
                  courseCode: '100001',
                  startTime: '2018-9-1',
                  endTime: '2019-2-1',
              }, {
                  teacherName: "李老师",
                  teacherID: 1001,
                  courseNum: 2,
                  courseName: 'web系统与技术',
                  courseCode: '100003',
                  startTime: '2018-9-1',
                  endTime: '2019-2-1',
              }, {
                  teacherName: "张老师",
                  teacherID: 1004,
                  courseNum: 1,
                  courseName: '软件测试',
                  courseCode: '100004',
                  startTime: '2018-9-1',
                  endTime: '2019-2-1',
              }, {
                  teacherName: "赵老师",
                  teacherID: 1005,
                  courseNum: 1,
                  courseName: '安全体系结构与管理',
                  courseCode: '100005',
                  startTime: '2018-9-1',
                  endTime: '2019-2-1',
              }
          ],//课程详细信息-ruleForm
           */
        courseList: [
            {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "软件测试",
                teacherName: "范鸿飞",
                courseYear: 2018,
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: ["start"],
            }, {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "web",
                teacherName: "范鸿飞",
                courseYear: 2018,
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: ["start"],
            }, {
                courseID: 1,
                createTime: "2019-03-28T04:53:06.000+0000",
                updateTime: "2019-04-03T06:23:53.000+0000",
                teacherID: 443,
                courseName: "软件项目与过程管理",
                teacherName: "范鸿飞",
                courseYear: 2018,
                courseSemester: "秋季",
                startTime: "2019-03-28",
                endTime: "2019-03-29",
                successor: ["start","web"],
            },
        ],
        data: [{
            name: "start",
            x: 200,
            y: 0
        }, {
            name: '软件测试',
            x: 100,
            y: 100,
        },{
            name: "web",
            x: 270,
            y: 300
        },{
            name: "软件项目与过程管理",
            x: 400,
            y: 190
        },],//node：name+坐标信息
        links: [
            {
                source: 'start',
                target: '软件测试',
                label: {
                    normal: {
                        show: false
                    }
                },
                /* lineStyle: {
                    normal: { curveness: 0.1 }
                } */
            },{ 
                source: 'start',
                target: 'web',
                label: {
                    normal: {
                        show: false
                    }
                },
                /* lineStyle: {
                    normal: { curveness: 0.1 }
                } */
            },{
                source: 'start',
                target: '软件项目与过程管理',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: { curveness: 0.1 }
                }
            }
        ],//连线信息
    },
    mutations: {
        set(state, list) {
            state.courseList = list
            var length = list.length
            for (var i = 0; i < length; i++) {
                var addData = {
                    name: list[i].courseName,
                    //category: "test",
                    x: Math.round(Math.random() * 500),
                    y: Math.round(Math.random() * 500)
                };
                state.data.push(addData)
                var num = list[i].successor.length;
                var name = list[i].courseName
                if (num == 0) {//无前继节点的，连接start
                    var addLink = {
                        target: name,
                        source: 'start',
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        lineStyle: {
                            normal: { curveness: 0.2 }
                        }
                    };
                    state.links.push(addLink)
                }
                else {
                    //所有前继节点
                    for (var j = 0; j < num; j++) {
                        var addLink = {
                            target: name,
                            source: list[i].successor[j],
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            lineStyle: {
                                normal: { curveness: 0.2 }
                            }
                        };
                        state.links.push(addLink)
                    }
                }
            }
        },
        addCourse(state, course) {
            state.courseList.push(course)
            console.log(state.courseList)
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
        editCourseList(state, change) {
            state.courseList[change.index - 1] = change.form
        },
        editName(state, change) {
            /* //修改courseList里的name
            state.courseList[change.index].courseName=change.name */
            //修改data里的name
            var oldName = state.data[change.index].name
            state.data[change.index].name = change.name
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
            var name = state.data[change.index]

            var array = state.links.filter(function (item) {
                if (item.target !== name) {
                    return item
                }
            })
            if (newLength == 0) {
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
            } else {
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
            state.links=array
        },
        edgeStyle(state,index){
            var value=state.links[index].label.normal.show
            if(value==false){
                state.links[index].label.normal.show=true
            }else{
                state.links[index].label.normal.show=false
            }

        }
    }
})