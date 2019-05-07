<template>
  <div>
    <el-row class="courseBack">
      <el-row style="line-height:50px">
        <el-col :span="2">
          <i class="el-icon-back" @click="courseBack"></i>
        </el-col>
      </el-row>
      <el-row>
        <div style="line-height:150px">JAVA</div>
      </el-row>
      <el-row>
        <el-col :span="1" :offset="21">
          <el-button type="text" @click="stuDetail">学生</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <div class="tabs">
        <el-col :span="4" :offset="6">
          <div @click="showNotice" class="tabBack" :class="{'clickDiv':isNotice}">
            <el-button
              @click="getNotice"
              type="text"
              class="tab"
              :class="{'clickButton':isNotice}"
            >公告</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="showLesson" class="tabBack" :class="{'clickDiv':isLesson}">
            <el-button type="text" class="tab" :class="{'clickButton':isLesson}">课程及练习</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="getGrade" class="tabBack" :class="{'clickDiv':isGrade}">
            <el-button type="text" class="tab" :class="{'clickButton':isGrade}">评分</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div>
        <div v-show="isNotice" class="noticeBack">
          <el-col :span="10" :offset="7">
            <div class="notice">{{textarea}}</div>
            <el-input type="textarea" :rows="5" placeholder="请输入课程介绍" v-model="textarea"></el-input>
            <el-row style="padding-top:20px">
              <el-button size="mini" type="primary" @click="changeNotice">确 认</el-button>
            </el-row>
          </el-col>
        </div>
        <div v-show="isLesson" class="noticeBack">
          <el-row>
            <el-col :span="1" :offset="17" style="margin-top:-130px">
              <el-button type="text" @click="editChapter">编辑章节</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6" style="margin-top:-80px;margin-bottom:40px">
              <div style="height:300px;border:1px solid #ddd;margin-bottom:20px" ref="graph"></div>
              <el-tree
                :data="tree"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent"
              ></el-tree>
            </el-col>
          </el-row>
        </div>
        <div v-show="isGrade" class="gradeBack">
          <el-col :span="10" :offset="7" v-for="(item,index) in tree" :key="index">
            <div v-if="gradeItem(index)">
              <el-row style="padding-bottom:20px">
                <el-card shadow="hover" class="grade">
                  <p style="margin-bottom:0px">{{item.contentName+"（"+item.exerciseDeadline_2+"）"}}</p>
                  <el-button type="text" @click="grade(item.id, item.exerciseTitle)">点击进入评分</el-button>
                </el-card>
              </el-row>
            </div>
          </el-col>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
let chapterNum = 0;
let sectionNum = 0;
export default {
  name: "tCourseDetail",
  data() {
    return {
      number: 0, //章节号
      courseID: 1,
      classID: 1,
      isNotice: false,
      isLesson: true,
      isGrade: false,
      notice: "Java是一门面向对象编程语言.",
      textarea: "添加/修改课程介绍",
      //data: null,
      rate: 20,
      lesson: null,
      data: [
        {
          name: "start",
          x: 250,
          y: 0
        }
      ],
      links: [],
      defaultProps: {
        children: "subCatalog",
        label: "contentName"
      },
      graphTree: [],
      tree: [],
      /*  tree: [
        {
          id: 1,
          createTime: "2019-03-30T06:16:14.000+0000",
          updateTime: "2019-03-31T00:36:54.000+0000",
          courseID: 1,
          contentName: "Java I/O",
          parentID: 0,
          siblingID: 0,
          content: "一",
          exerciseVisible_1: false,
          exerciseVisible_2: false,
          exerciseDeadline_1: "2019-04-20",
          exerciseDeadline_2: "2019-04-20",
          exerciseTotal_1: 100,
          exerciseTotal_2: 100,
          subCatalog: [
            {
              id: 4,
              createTime: "2019-03-30T06:30:18.000+0000",
              updateTime: "2019-03-31T00:36:54.000+0000",
              courseID: 1,
              contentName: "I/O介绍",
              parentID: 1,
              siblingID: 0,
              content: "一.1",
              exerciseVisible_1: false,
              exerciseVisible_2: false,
              exerciseDeadline_1: null,
              exerciseDeadline_2: null,
              exerciseTotal_1: null,
              exerciseTotal_2: null,
              subCatalog: []
            }
          ]
        },
        {
          id: 2,
          createTime: "2019-03-30T06:16:14.000+0000",
          updateTime: "2019-03-31T00:36:54.000+0000",
          courseID: 1,
          contentName: "Java I/O",
          parentID: 0,
          siblingID: 0,
          content: "一",
          exerciseVisible_1: false,
          exerciseVisible_2: false,
          exerciseDeadline_1: "2019-04-27",
          exerciseDeadline_2: "2019-04-27",
          exerciseTotal_1: 100,
          exerciseTotal_2: 100,
          subCatalog: []
          }
      ], */
      items: [
        {
          id: 1,
          content: "点击开始评分-1"
        },
        {
          id: 2,
          content: "开始评分-2"
        },
        {
          id: 3,
          content: "开始评分-3"
        }
      ]
    };
  },
  created() {
    //获得课程目录
    this.getParams();
    console.log(this.courseID);
    const routerParams = this.$route.query.courseID;
    this.courseID = routerParams;
    console.log(this.courseID);

    this.getChapterGraph();
    this.getNotice();
    this.getLesson();
  },
  methods: {
    getChapterGraph() {
      axios
        .get("/api/getChapterRelationByCourseID", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: { courseID: this.courseID }
        })
        .then(resp => {
          console.log(resp.data);
          if (resp.data.state == 1) {
            this.graphTree = resp.data.data;
            console.log(this.graphTree, "graphtree-teacher");
            this.init();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getParams() {
      const routerParams = this.$route.query.courseID;
      this.courseID = routerParams;
      this.classID = this.$route.query.classID;
      //console.log(routerParams);
      this.getNotice();
    },
    getNotice() {
      axios
        .get("/api/getNoticeByCouID", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            this.textarea = resp.data.data.courseNotice;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeNotice() {
      var params = new URLSearchParams();
      params.append("courseID", this.courseID);
      params.append("courseNotice", this.textarea);
      axios
        .post("/api/addCourseNotice", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(resp => {
          console.log("notice success", resp.data);

          if (resp.data.state == 1) {
            this.$message("修改成功");
          } else {
            this.$message(resp.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLesson() {
      axios
        .get("/api/getCourseCatalog", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            this.tree = resp.data.data;
            console.log(this.tree, "lesson-tree");
          }
          console.log(this.courseID);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getGrade() {
      if (this.isGrade == false) {
        this.isNotice = false;
        this.isLesson = false;
        this.isGrade = true;
      }
    },
    showNotice() {
      if (this.isNotice == false) {
        this.isNotice = true;
        this.isLesson = false;
        this.isGrade = false;
      }
    },
    showLesson() {
      if (this.isLesson == false) {
        this.isNotice = false;
        this.isLesson = true;
        this.isGrade = false;
      }
    },
    gradeItem(index) {
      var currentDate = new Date();
      var stringDate = this.tree[index].exerciseDeadline_2;
      var deadDate = new Date(stringDate);
      //console.log(stringDate,deadDate,currentDate)
      if (deadDate < currentDate) {
        return true;
      }
    },
    grade(id, title) {
      this.$router.push({
        path: "/teacher/mark",
        name: "exerciseMark",
        query: {
          chapterID: id,
          classID: this.classID,
          name: title
        }
      });
    },
    handleNodeClick(object) {
      if (object.subCatalog.length == 0) {
        this.$router.push({
          path: "chapterDetail/point",
          query: {
            chapterIDt: object.id,
            courseIDt: this.courseID
          }
        });
      }
    },
    editChapter() {
      this.$router.push({
        path: "/teacher/chapterEdit",
        query: {
          id: this.courseID,
          classID: this.classID
        }
      });
    },
    courseBack() {
      this.$router.push({ path: "/teacher/courseManagement" });
    },

    init() {
      //var list = state.courseList

      var length = this.graphTree.length;
      for (var i = 0; i < length; i++) {
        var name = this.graphTree[i].chapterNode.contentName;

        var num = this.graphTree[i].preChapterNodes.length;
        if (num == 0) {
          //无前继节点的，连接start
          var addData = {
            name: name,
            //category: "test",
            x: Math.round(Math.random() * 500),
            y: Math.round(Math.random() * 500) + 100
          };
          this.data.push(addData);
          var addLink = {
            target: name,
            source: "start",
            label: {
              normal: {
                show: false
              }
            }
            /*  lineStyle: {
                            normal: { curveness: 0.2 }
                        } */
          };
          this.links.push(addLink);
        } else {
          //所有前继节点
          var addData = {
            name: name,
            //category: "test",
            x: Math.round(Math.random() * 500),
            y: Math.round(Math.random() * 500) + 700
          };
          this.data.push(addData);
          for (var j = 0; j < num; j++) {
            var addLink = {
              target: name,
              source: this.graphTree[i].preChapterNodes[j].contentName,
              label: {
                normal: {
                  show: false
                }
              }
              /* lineStyle: {
                                normal: { curveness: 0.2 }
                            } */
            };
            this.links.push(addLink);
          }
        }
      }
      console.log(this.data, "this.data");
      console.log(this.links, "this.links");
      this.draw();
    },
    draw() {
      console.log("draw");
      var init = this.$refs.graph;
      var myChart = this.$echarts.init(init);
      var option = {
        /*  title: {
          text: "章节关系图"
        }, */
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        toolbox: {
          feature: {
            //保存为图片
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 20,
            color: "#ec7814",
            roam: true,
            label: {
              normal: {
                show: true
              }
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            //edgeColor:"#000",
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 10,
                  fontColor: "#000"
                }
              }
            },
            //data: this.data,
            //links: this.links,
            data: this.data,
            links: this.links,
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      var that = this;
      myChart.on("click", function(params) {
        console.log(params);
        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          //显示边
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          that.dataIndex = params.dataIndex;
        }
      });
      //取消右键的弹出菜单
      document.oncontextmenu = function() {
        return false;
      };
      that.myChart = myChart;
    },
    renderContent(h, { node, data, store }) {
      //console.log(h,"h",node,"node",data,"data",store,"store")
      if (data.parentID == 0) {
        chapterNum = chapterNum + 1;
        sectionNum = 0;
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span style="color:#000;font-size:15px">
                {"第 " + chapterNum + " 章 "}&nbsp;
              </span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button
                style="font-size: 12px;color:#000;"
                size="mini"
                on-click={() => this.pre(data)}
                round
              >
                课前摸底
              </el-button>
              <el-button
                style="font-size: 12px;"
                size="mini"
                type="info"
                on-click={() => this.rev(node, data)}
                round
              >
                课后作业
              </el-button>
            </span>
          </span>
        );
      } else {
        sectionNum = sectionNum + 1;
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{chapterNum + "." + sectionNum}&nbsp;</span>
              <span>{node.label}</span>
            </span>
          </span>
        );
      }
    },
    pre(data) {
      console.log(data, "pre");
      this.$router.push({
        path: "chapterDetail/preExercise",
        query: {
          tpreid: data.id,
          courseIDt: this.courseID
        }
      });
    },
    rev(node, data) {
      console.log(node, data, "rev");
      this.$router.push({
        path: "chapterDetail/revExercise",
        query: {
          trevid: data.id,
          courseIDt: this.courseID
        }
      });
    },
    stuDetail() {
      this.$router.push({
        path: "/teacher/studentList",
        query: {
          classID: this.classID,
          courseID: this.courseID
        }
      });
    }
  }
};
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.courseBack {
  height: 240px;
  /* background-color: cadetblue; */
  /* line-height: 350px; */
  font-size: 25px;
  font-weight: 700;
  color: rgb(235, 235, 235);
  background-image: url("../../assets/about.jpg");
  background-size: cover;
}
.tabs {
  height: 60px;
  background-color: #292929;
} /* 
.tabBack:hover {
  background-color: rgba(172, 200, 201, 0.8);
} */
.clickDiv {
  background-color: rgba(255, 255, 255, 0.1);
}
.tab {
  line-height: 40px;
  height: 60px;
  color: rgba(255, 255, 255, 0.85);
}
.tab:hover {
  color: #fff;
}
.tab:focus {
  color: #fff;
}
.clickButton {
  color: #fff;
}
.notice {
  font-size: 15px;
  font-family: "Courier New", Courier, monospace;
  /* text-align: justify; */
  white-space: pre-wrap;
  margin-top: -50px;
  padding-bottom: 30px;
}
.noticeBack {
  padding: 150px 0;
  height: 100px;
}
.gradeBack {
  padding: 20px 0;
  height: 500px;
  padding-top: 50px;
}
.grade {
  height: 100px;
}

.el-tree {
  background-color: #fff;
}
.el-tree-node__content {
  background-color: rgb(221, 240, 240);
  height: 50px;
  border: #ddd;
  border-bottom-style: dashed;
}
.el-tree-node__content:hover {
  background-color: rgb(221, 240, 240);
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(204, 221, 221);
}
.el-tree-node__children .el-tree-node__content {
  background-color: #fff;
  height: 50px;
  border: #ddd;
  border-bottom-style: dashed;
}
.el-tree-node__children .el-tree-node__content:hover {
  background-color: rgb(251, 251, 251);
}
.el-tree-node__children .el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(255, 251, 251);
}
</style>
