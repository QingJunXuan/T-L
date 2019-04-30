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
        <el-col :span="2" :offset="22">
          <el-button type="text" @click="feedback" style="color:#fff">教学反馈</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <div class="tabs">
        <el-col :span="4" :offset="8">
          <div @click="showNotice" class="tabBack" :class="{'clickDiv':isNotice}">
            <el-button type="text" class="tab" :class="{'clickButton':isNotice}">公告</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="showLesson" class="tabBack" :class="{'clickDiv':isLesson}">
            <el-button type="text" class="tab" :class="{'clickButton':isLesson}">课程及练习</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div>
        <div v-show="isNotice" class="noticeBack">
          <el-col :span="10" :offset="7">
            <div class="notice">{{notice}}</div>
          </el-col>
        </div>
        <div v-show="isLesson" class="lessonBack">
          <el-col :span="12" :offset="6" style="padding-top:20px;margin-bottom:40px">
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
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import store from '../../store/store.js'
import graph from "./chapterGraph.vue";
import axios from "axios";
let  chapterNum = 0;
let  sectionNum=0;
export default {
  name: "sCourseDetail",
  components: {
    graph
  },
  data() {
    return {
      courseID: 1,
      classID: 1,
      isNotice: false,
      isLesson: true,
      notice: "Java是一门面向对象编程语言.",
      rate: 20,
      lesson: null,
      showButton: true,

      dataIndex: 0,
      graphTree: [],
      data: [
        {
          name: "start",
          x: 200,
          y: 0
        }
      ], //node：name+坐标信息
      links: [], //连线信息

      tree: [],
      defaultProps: {
        children: "subCatalog",
        label: "contentName"
      }
    };
  },
  created() {
    //获得课程目录
    console.log(this.courseID);
    const routerParams1 = this.$route.query.courseID;
    this.courseID = routerParams1;
    const routerParams2 = this.$route.query.classID;
    this.classID = routerParams2;
    console.log(this.courseID);
    this.getChapterGraph();//图
    this.getNotice();
    this.getLesson();
  },
  mounted() {
    //console.log(this.data);
    this.draw();
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
            console.log(resp.data,"chapter-tree")
            this.graphTree = resp.data.data;
            this.init();
          }
        })
        .catch(err => {
          console.log(err);
        });
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
          console.log(resp.data, "notice data");
          if (resp.data.state == 1) {
            this.notice = resp.data.data.courseNotice;
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
            store.commit('setCatalog',this.tree)
          }
          console.log(resp.data, "resp.data");
          console.log(this.courseID, "courseID");
        })
        .catch(err => {
          console.log(err);
        });
    },
    showNotice() {
      if (this.isNotice == false) {
        this.isNotice = true;
        this.isLesson = false;
      }
    },
    showLesson() {
      if (this.isLesson == false) {
        this.isNotice = false;
        this.isLesson = true;
      }
    },
    handleNodeClick(object) {
      console.log(object, "node-object");
      if (object.subCatalog.length == 0) {
        this.$router.push({
          path: "chapterDetail/point",
          query: {
            chapterID: object.id,
            courseIDs: this.courseID
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      if (data.parentID == 0) {
        //console.log("h",h,"node",node,"data",data,"store",store)
        chapterNum=chapterNum+1;
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
                on-click={() => this.rev(node, data,chapterNum)}
                round
              >
                课后作业
              </el-button>
            </span>
          </span>
        );
      } else {
        sectionNum=sectionNum+1
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
            <span>{chapterNum +'.'+sectionNum}&nbsp;</span>
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
          spreid: data.id,
          courseIDs: this.courseID
        }
      });
    },
    rev(node, data,num) {
      console.log(node, data, "rev");
      this.$router.push({
        path: "chapterDetail/revExercise",
        query: {
          srevid: data.id,
          courseIDs: this.courseID,
          index:num-1,
        }
      });
    },
    courseBack() {
      this.$router.push({ path: "/student/courseManagement" });
    },
    feedback() {
      this.$router.push({
        path: "/student/feedback",
        query: {
          courseClassID: this.classID
        }
      });
    },
    init() {
      //var list = state.courseList
      // 计算节点位置
      let nodes = this.graphTree.map(i => [
        i.chapterNode.contentName,
        { level: 0, subCourses: i.subChapterNodes.map(k => k.contentName) }
      ]);
			console.log("TCL: init -> nodes", nodes)
      for (let j = 0; j < nodes.length; j++) {
        let curr = nodes[j][1];
        if (curr.subCourses.length) {
          curr.subCourses.forEach(p => {
            let findIndex = nodes.findIndex(node => node[0] === p);
            nodes[findIndex] = [
              nodes[findIndex][0],
              Object.assign({}, nodes[findIndex][1], { level: nodes[findIndex][1].level > curr.level ? nodes[findIndex][1].level : curr.level + 1 })
            ];
          });
        }
      }

      let tempData = new Map();
      nodes.forEach(n => {
        tempData.set(n[1].level, []);
      });
      nodes.forEach(n => {
        tempData.set(n[1].level, tempData.get(n[1].level).concat([n[0]]));
      });

      let data = [];
      for (let item of tempData.entries()) {
        console.log("TCL: set -> item", item[0]);
        item[1].forEach((value, index) => {
          let addData = {
            name: value,
            x: Math.round((1000 / item[1].length) * index),
            y: (parseInt(item[0]) + 1) * 300
          };
          data.push(addData);
        });
      }

      data.push({
        name: "start",
        x: 0,
        y: 0
      });

      this.data = data;
      console.log("TCL: set -> data", data);

      // 计算结束

      
      var length = this.graphTree.length;
      for (var i = 0; i < length; i++) {
        // var addData = {
        //   name: this.graphTree[i].chapterNode.content,
        //   //category: "test",
        //   x: Math.round(Math.random() * 500),
        //   y: Math.round(Math.random() * 500) + 50
        // };
        // this.data.push(addData);
        var num = this.graphTree[i].preChapterNodes.length;
        var name = this.graphTree[i].chapterNode.contentName;
        if (num == 0) {
          //无前继节点的，连接start
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
  color: rgb(236, 235, 235);
  background-image: url("../../assets/img2.jpg");
  background-size: cover;
}
.tabs {
  height: 60px;
  background-color: #292929;
}
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
  margin-top: -20px;
}
.noticeBack {
  padding: 150px 0;
  height: 100px;
}
.lessonBack {
  padding: 20px 0;
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
