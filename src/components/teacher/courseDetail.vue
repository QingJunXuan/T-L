<template>
  <div>
    <el-row class="courseBack">
      <el-row style="line-height:50px">
        <el-col :span="1">
          <i class="el-icon-back" @click="courseBack" style="color:#000"></i>
        </el-col>
      </el-row>
      <el-row>
        <div style="line-height:150px">{{courseName}}</div>
      </el-row>
    </el-row>
    <el-row>
      <div class="tabs">
        <el-col :span="4" :offset="4">
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
            <el-button type="text" class="tab" :class="{'clickButton':isLesson}">编辑课程</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="getGrade" class="tabBack" :class="{'clickDiv':isGrade}">
            <el-button type="text" class="tab" :class="{'clickButton':isGrade}">作业评分</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="stuDetail" class="tabBack" :class="{'clickDiv':isList}">
            <el-button type="text" class="tab" :class="{'clickButton':isList}">学生列表</el-button>
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
          <el-row style="margin-bottom:20px">
            <el-col :span="4" :offset="17" style="margin-top:-120px">
              <el-button type="success" size="small" @click="changeLesson">
                <span v-if="isGraph==true">查看章节目录</span>
                <span v-else>查看关系图</span>
              </el-button>
              <el-button type="primary" size="small" @click="editChapter">编辑章节及练习</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="3" style="margin-top:-60px;margin-bottom:40px">
              <div v-show="isGraph==true">
                <div style="height:1000px;border:1px solid #ddd;margin-bottom:20px" ref="graph"></div>
              </div>
            </el-col>
            <el-col  :span="12" :offset="6" style="margin-top:-80px;margin-bottom:40px">
              <div v-show="isGraph==false">
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
          </el-row>
        </div>
        <div v-show="isGrade" class="gradeBack">
          <el-col :span="10" :offset="7" v-for="(item,index) in unratedChapters" :key="index">
              <el-row style="padding-bottom:20px">
                <el-card shadow="hover" class="grade">
                  <p style="margin-bottom:0px">{{item.chapterNode.contentName+"（作业截至提交时间："+item.chapterNode.exerciseDeadline_2+"）"}}</p>
                  <el-button type="text" @click="grade(item.chapterNode.id, item.chapterNode.exerciseTitle,item.studentId)">点击进入评分</el-button>
                </el-card>
              </el-row>
          </el-col>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "tCourseDetail",
  data() {
    return {
      setHeight:'',
      courseName:'',
      number: 0, //章节号
      courseID: 1,
      classID: 1,
      isNotice: false,
      isLesson: true,
      isGrade: false,
      isGraph: true,
      isList:false,
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
      unratedChapters:[],
    };
  },
  created() {
    //获得参数
    this.getParams();

    //获取课程名
    this.getCourseName();
    //获取章节关系
    this.getChapterGraph();
    //获取章节目录
    this.getLesson();
    //获取未评分章节
    this.getUnratedChapters();
  },
  mounted(){
 //获取章节关系
    this.getChapterGraph();
  },
  methods: {
    getCourseName(){///getCourseInfoByID
    this.$axios
        .get("http://10.60.38.173:8765/getCourseInfoByID", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: { courseID: this.courseID }
        })
        .then(resp => {
          console.log(resp.data);
          if (resp.data.state == 1) {
            this.courseName = resp.data.data.courseName;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getChapterGraph() {
      this.$axios
        .get("http://10.60.38.173:8765/getChapterRelationByCourseID", {
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
      this.getNotice();
    },
    getNotice() {
      this.$axios
        .get("http://10.60.38.173:8765/getNoticeByCouID", {
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
      this.$axios
        .post("http://10.60.38.173:8765/addCourseNotice", params, {
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
      this.$axios
        .get("http://10.60.38.173:8765/getCourseCatalog", {
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
    changeLesson() {
      if (this.isGraph == true) this.isGraph = false;
      else {
        this.isGraph = true;
      }
    },
    getUnratedChapters() {//获取未评分章节
      this.$axios
        .get("http://10.60.38.173:8765/question/getUnratedChapters", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            classId: this.classID
          }
        })
        .then(resp => {
           console.log("TCL: getGrade -> resp", resp)
          if (resp.data.state == 1) {
            this.unratedChapters = resp.data.data;
            console.log("TCL: getGrade -> unratedChapters", this.unratedChapters)
          }
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
    /* gradeItem(index) {
      var currentDate = new Date();
      var stringDate = this.tree[index].exerciseDeadline_2;
      var deadDate = new Date(stringDate);
      //console.log(stringDate,deadDate,currentDate)
      if (deadDate < currentDate) {
        return true;
      }
    }, */
    grade(chapterId, title,stuId) {
      this.$router.push({
        path: "/teacher/mark",
        name: "exerciseMark",
        query: {
          chapterID: chapterId,
          classID: this.classID,
          name: title,
          studentId:stuId
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
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    init() {
      // 计算节点位置
      let nodes = this.graphTree.map(i => [
        i.chapterNode.contentName,
        { level: 0, subChapter: i.subChapterNodes.map(k => k.contentName) }
      ]);
      for (let j = 0; j < nodes.length; j++) {
        let curr = nodes[j][1];
        if (curr.subChapter.length) {
          curr.subChapter.forEach(p => {
            let findIndex = nodes.findIndex(node => node[0] === p);
            nodes[findIndex] = [
              nodes[findIndex][0],
              Object.assign({}, nodes[findIndex][1], {
                level:
                  nodes[findIndex][1].level > curr.level
                    ? nodes[findIndex][1].level
                    : curr.level + 1
              })
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

      var lastNode= nodes.slice(-1);
      var maxLevel = lastNode[0][1].level;
      this.setHeight=(maxLevel+2)*70+'px'
console.log(this.setHeight,"height")

      let data = [];
      var width = 4800;
      var init = 0;
      

      for (let item of tempData.entries()) {
        var num = item[1].length;
        init = 2400 / num;
        item[1].forEach((value, index) => {
          let addData = {
            name: value,
            x: Math.round(init + (width / num) * index),
            y: (parseInt(item[0]) + 1) * 450
          };
          data.push(addData);
        });
      }
      data.push({
        name: "start",
        x: 2400,
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
        tooltip: {
          trigger:'item',
          formatter:function(params){
            if(params.dataType=="node"){
              return '坐标('+params.data.x+','+params.data.y+')';
            }
            else{
              return params.data.source+' > '+params.data.target;
            }
          }
        },
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
            top: 30,
            symbolSize: 20,
            color: "#ec7814",
            roam: true,
            
            itemStyle: {
              normal: {
                color: "#ec7814",
                //opacity:0.8,
                label: {
                  show: true,
                  fontSize: 12,
                  //color: '#000',
                  formatter: function(val) {
                    //让series 中的文字进行换行
                     if(val.name.indexOf("、") == -1 && val.name.indexOf(":") != -1)  
                      return val.name.split(":").join("\n");
                    else if (val.name.indexOf("、") != -1 && val.name.indexOf(":") == -1)
                      return val.name.split("、").join("\n");
                    else return val.name;
                  }
                }
              }
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
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
      myChart.getDom().style.height = this.setHeight
      myChart.resize()

      var that = this;
      let focusNum = 0;
      myChart.on("click", function(params) {
        focusNum++;
        if (params.dataType == "edge") {
          that.dataIndex = params.dataIndex;
          //显示边
          var value = that.links[that.dataIndex].label.normal.show;
          if (value == false) {
            that.links[that.dataIndex].label.normal.show = true;
          } else {
            that.links[that.dataIndex].label.normal.show = false;
          }
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          if (focusNum % 2 == 1) {
            //点击高亮
            that.myChart.dispatchAction({
              type: "focusNodeAdjacency",
              // 使用 dataIndex 来定位节点。
              dataIndex: params.dataIndex
            });
          } else if (focusNum % 2 == 0) {
            //再次点击取消高亮
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
    },
    renderContent(h, { node, data, store }) {
      if (data.parentID == 0) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
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
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
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
</style>

<style>
.courseBack {
  height: 240px;
  /* background-color: cadetblue; */
  /* line-height: 350px; */
  font-size: 25px;
  font-weight: 700;
  color: rgb(235, 235, 235);
  background-image: url("../../assets/img2.jpg");
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
