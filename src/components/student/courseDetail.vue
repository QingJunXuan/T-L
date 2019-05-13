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
        <div v-show="isNotice" style=" padding: 150px 0;height: 100px;">
          <el-col :span="10" :offset="7">
            <div class="notice">{{notice}}</div>
          </el-col>
        </div>
        <div v-show="isLesson">
          <el-col :span="12" :offset="6" style="margin-bottom:40px;margin-top:80px">
            <div style="padding-bottom:20px">
              <el-col :span="3"><el-button type="success" size="small" @click="changeLesson">
                <span v-if="isGraph==true">查看章节目录</span>
                <span v-else>查看关系图</span>
              </el-button></el-col>
            </div>
            <div v-show="isGraph==true">
              <div style="height:800px;border:1px solid #ddd;margin-bottom:20px;margin-top:40px" ref="graph"></div>
            </div>
            <div v-show="isGraph==false" style="margin-top:40px">
             <el-tree
              :data="tree"
              :props="defaultProps"
              @node-click="handleNodeClick"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
             ></el-tree>
            </div>
          </el-col>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import store from '../../store/store.js'
import axios from "axios";
let  chapterNum = 0;
//let  sectionNum=0;
export default {
  name: "sCourseDetail",
  data() {
    return {
      courseID: 1,
      classID: 1,
      isNotice: false,
      isLesson: true,
      isGraph:true,
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
    console.log(this.courseID,"courseid");
    const routerParams1 = this.$route.query.courseID;
    this.courseID = routerParams1;
    const routerParams2 = this.$route.query.classID;
    this.classID = routerParams2;
    console.log(this.courseID,"courseid");
    chapterNum=0;
    //sectionNum=0;
    this.getChapterGraph();//图
    this.getNotice();
    this.getLesson();
    this.getScore();
  },
  mounted() {
    //this.draw();
  },
  methods: {
    getScore(){
      axios
        .get("/api/getCourseScoreAndComment", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: { courseID: this.courseID,studentID:localStorage.getItem('userid') }
        })
        .then(resp => {
          console.log(resp.data);
          if (resp.data.state == 1) {
            console.log(resp.data,"score")
            store.commit("setScore",resp.data.data)
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    showNotice() {
      if (this.isNotice == false) {
        this.isNotice = true;
        this.isLesson = false;
        //this.isGraph=false;
      }
    },
    showLesson() {
      if (this.isLesson == false) {
        this.isNotice = false;
        this.isLesson = true;
        //this.isGraph=false;
        //this.draw()
      }
    },
    changeLesson(){//切换章节目录和关系图
      if(this.isGraph==true) this.isGraph=false
      else {
        this.isGraph=true
        //this.draw()
      }
    },
    handleNodeClick(object) {
      console.log(object, "node-object");
      if (object.parentID != 0) {
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
        chapterNum=chapterNum+1;
        var num=chapterNum
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button
                style="font-size: 12px;color:#000;"
                size="mini"
                on-click={() => this.pre(data,num)}
                round
              >
                课前摸底
              </el-button>
              <el-button
                style="font-size: 12px;"
                size="mini"
                type="info"
                on-click={() => this.rev(data,num)}
                round
              >
                课后作业
              </el-button>
            </span>
          </span>
        );
      } else {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
          </span>
        );
      }
    },
    pre(data,num) {
      this.$router.push({
        path: "chapterDetail/preExercise",
        query: {
          spreid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
     /*  var length = store.state.score.length
			console.log("TCL: pre -> length", length)
      if(num>length){
      this.$router.push({
        path: "chapterDetail/preExercise",
        query: {
          spreid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
      }else{
        this.$router.push({
        path: "chapterDetail/scoredPre",
        query: {
          spreid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
      } */
    },
    rev(data,num) {
      this.$router.push({
        path: "chapterDetail/revExercise",
        query: {
          srevid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
    /*  var length = store.state.score.length
      if(num>length){
      this.$router.push({
        path: "chapterDetail/revExercise",
        query: {
          srevid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
      }else{
        this.$router.push({
        path: "chapterDetail/scoredRev",
        query: {
          srevid: data.id,
          courseIDs: this.courseID,
          index:num-1
        }
      });
      } */
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
    getChapterGraph() {
      console.log(this.courseID,"getgraph-courseid")
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
    init() {
      // 计算节点位置
      let nodes = this.graphTree.map(i => [
        i.chapterNode.contentName,
        { level: 0, subChapter: i.subChapterNodes.map(k => k.contentName) }
      ]);
			console.log("TCL: init -> nodes", this.graphTree, nodes)
      for (let j = 0; j < nodes.length; j++) {
        let curr = nodes[j][1];
        if (curr.subChapter.length) {
          curr.subChapter.forEach(p => {
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
      var width=3800;
      var init=0;

      for (let item of tempData.entries()) {
        var num=item[1].length
        init=1900/num
        item[1].forEach((value, index) => {
          let addData = {
            name: value,
            x: Math.round(init+(width / num) * index),
            y: (parseInt(item[0]) + 1) * 350
          };
          data.push(addData);
        });
      }
      data.push({
        name: "start",
        x: 1900,
        y: 0
      });
      this.data = data;
      console.log("TCL: set -> data", data);

      // 计算结束
      var length = this.graphTree.length;
      for (var i = 0; i < length; i++) {
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
      this.draw();
    },
    draw() {
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
            top:30,
            symbolSize: 25,
            roam: true,
            itemStyle:{
              normal:{
                color: "#ec7814",
                //opacity:0.8,
                label:{
                  show:true,
                  fontSize:12,
                  //color: '#000',
                  formatter:function(val){   
                    //让series 中的文字进行换行
                    if(val.name.indexOf("、")!= -1)
                      return val.name.split("、").join("\n")
                    else  return val.name.split(" ").join("\n");}
                  }
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
      let focusNum=0;
      myChart.on("click", function(params) {

        focusNum++;
        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          //显示边
          var value = that.links[that.dataIndex].label.normal.show
            if (value == false) {
                that.links[that.dataIndex].label.normal.show = true
            } else {
                that.links[that.dataIndex].label.normal.show = false
            }
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          if(focusNum%2==1){//点击高亮
            that.myChart.dispatchAction({
              type: "focusNodeAdjacency",
              // 使用 dataIndex 来定位节点。
              dataIndex: params.dataIndex
              });
          }else if(focusNum%2==0){//再次点击取消高亮
            that.myChart.dispatchAction({
            type: "unfocusNodeAdjacency",
            // 使用 seriesId 或 seriesIndex 或 seriesName 来定位 series.
            seriesIndex: params.seriesIndex
            });
          } 
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
