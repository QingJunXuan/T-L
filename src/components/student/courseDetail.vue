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
          <el-button type="text" @click="feedback">教学反馈</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <div class="tabs">
        <el-col :span="4" :offset="6">
          <div @click="getNotice" class="tabBack" :class="{'clickDiv':isNotice}">

            <el-button
              @click="getNotice"
              type="text"
              class="tab"
              :class="{'clickButton':isNotice}"
            >公告</el-button>

          </div>
        </el-col>
        <el-col :span="4">
          <div @click="setLesson" class="tabBack" :class="{'clickDiv':isLesson}">
            <el-button type="text" class="tab" :class="{'clickButton':isLesson}">课程及练习</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div @click="toAnalysis" class="tabBack" :class="{'clickDiv':isAnalysis}">
            <el-button type="text" class="tab" :class="{'clickButton':isAnalysis}">学习分析</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div>
        <!-- style="background-color:rgba(118, 162, 163, 0.26);" -->
        <div v-show="isNotice" class="noticeBack">
          <el-col :span="10" :offset="7">
            <div class="notice">{{notice}}</div>
          </el-col>
        </div>
        <div v-show="isLesson" class="lessonBack">
          <el-col :span="12" :offset="6" style="padding-top:20px;margin-bottom:40px">
            <graph></graph>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"  default-expand-all></el-tree>
          </el-col>
        </div>
        <div v-show="isAnalysis" class="analysisBack">
          <el-row>
            <el-col :span="12" :offset="6">
              <p style="text-align:left">学习进度：</p>
              <el-progress :text-inside="true" :stroke-width="18" :percentage="rate"></el-progress>
            </el-col>
          </el-row>
          <el-row></el-row>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import graph from './chapterGraph.vue'
import axios from 'axios'
export default {
  name: "sCourseDetail",
  components:{
    graph,
  },
  data() {
    return {
      courseID: 1,
      isNotice: false,
      isLesson: true,
      isAnalysis: false,
      notice: "Java是一门面向对象编程语言.",
      //data: null,
      rate: 20,
      lesson: null,
      /*
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1"
            },
            {
              label: "课前预习题"
            },
            {
              label: "课后作业题"
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1"
            },
            {
              label: "二级 2-2"
            },
            {
              label: "课前预习题"
            },
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1"
            },
            {
              label: "二级 3-2"
            },
            {
              label: "课前预习题"
            },
          ]
        }
      ], 
      defaultProps: {
        children: "children",
        label: "label"
      },*/
      
      data: [
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
        }
      ],
      defaultProps: {
        children: "subCatalog",
        label: "contentName"
      } 
    };
  },
  created() {
    //获得课程目录
    console.log(this.courseID);
    const routerParams = this.$route.query.courseID;
    this.courseID = routerParams;
    console.log(this.courseID);
  },
  methods: {
    getParams() {
      const routerParams = this.$route.query.courseID;
      this.courseID = routerParams;
      //console.log(routerParams);
      this.getNotice();
    },
    getNotice() {
      if (this.isNotice == false) {
        this.isNotice = true;
        this.isLesson = false;
        this.isAnalysis = false;
        /* axios.get("/api/getNoticeByCouID", {
            params: {
              courseID: this.courseID
            }
          }).then(resp => {
            this.notice = resp.data.courseNotice;
          }).catch(err => {
            console.log(err);
          });  */
      }
    },
    setLesson() {
      if (this.isLesson == false) {
        this.isNotice = false;
        this.isLesson = true;
        this.isAnalysis = false;

        /* axios
          .get("/api/getCourseCatalog", {
            params: {
              courseID: this.courseID
            }
          })
          .then(resp => {
            console.log(this.data);
            //this.data = resp.data;
            console.log(resp.data);
            console.log(this.courseID);
          })
          .catch(err => {
            console.log(err);
          }); */
      }
    },
    getAnalysis() {
      if (this.isAnalysis == false) {
        this.isNotice = false;
        this.isLesson = false;
        this.isAnalysis = true;
      }
    },
    toAnalysis() {
      this.$router.push({path: '/student/studentAnalysis'})
    },
    handleNodeClick(object) {
      console.log(object);
      if (object.subCatalog.length == 0) {
        this.$router.push({
          path: "chapterDetail",
          query: {
            id: object.id
          }
        });
      }
    },
    courseBack() {
      this.$router.push({ path: "/student/courseManagement" });
    },
    feedback() {
      this.$router.push({
        path: "/student/feedback"
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
  color: rgb(236, 235, 235);
  background-image: url("../../assets/img2.jpg");
  background-size: cover;
}
.tabs {
  height: 60px;
  background-color: #292929;
}
.clickDiv {
  background-color:rgba(255, 255, 255, 0.1);
}
.tab {
  line-height: 40px;
  height: 60px;
  color: rgba(255, 255, 255,0.85);
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
.lessonBack{
  padding: 20px 0;
}
.analysisBack {
  padding: 20px 0;
  height: 500px;
}
.el-tree {
  background-color: #fff;
}
.el-tree-node__content{
  background-color: rgb(221, 240, 240);
  height: 50px;
  border: #ddd;
  border-bottom-style: dashed;
}
.el-tree-node__content:hover {
  background-color:rgb(204, 221, 221);

}
.el-tree-node:focus>.el-tree-node__content{
   background-color:rgb(204, 221, 221);
}
.el-tree-node__children .el-tree-node__content{
  background-color: #fff;
  height: 50px;
  border: #ddd;
  border-bottom-style: dashed;
}
.el-tree-node__children .el-tree-node__content:hover{
  background-color: rgb(251, 251, 251);
}
.el-tree-node__children .el-tree-node:focus>.el-tree-node__content {
  background-color: rgb(255, 251, 251);
}

</style>
