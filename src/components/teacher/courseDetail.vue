<template>
  <div>
    <el-row class="courseBack">
      <el-row style="line-height:50px">
        <el-col :span="2">
          <i class="el-icon-back" @click="courseBack"></i>
        </el-col>
      </el-row>
      <el-row>
        <div style="line-height:200px">JAVA</div>
      </el-row>
      <el-row>
        <el-col :span="1" :offset="21"><el-button type="text" @click="stuDetail">学生</el-button></el-col>
        <el-col :span="2"><el-button type="text" @click="couAnalysis">课程分析</el-button></el-col>
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
          <div @click="getGrade" class="tabBack" :class="{'clickDiv':isGrade}">
            <el-button type="text" class="tab" :class="{'clickButton':isGrade}">评分</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div style="background-color:rgba(118, 162, 163, 0.26);">
        <div v-show="isNotice" class="noticeBack">
          <el-col :span="10" :offset="7">
            <div class="notice">{{textarea}}</div>
            <el-input type="textarea" :rows="5" placeholder="请输入课程介绍" v-model="textarea"></el-input>
          </el-col>
        </div>
        <div v-show="isLesson" class="noticeBack">
          <el-row>
            <el-col :span="1" :offset="17" style="margin-top:-90px">
              <el-button type="text" @click="editChapter">编辑章节</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6" style="margin-top:-40px">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-col>
          </el-row>
        </div>
        <div v-show="isGrade" class="gradeBack">
          <el-col :span="10" :offset="7" v-for="(item,index) in items" :key="index">
            <el-row style="padding-bottom:20px">
              <el-card shadow="never" class="grade"><el-button type="text" @click="grade(item.id)">{{item.content}}</el-button></el-card>
            </el-row>
          </el-col>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "sCourseDetail",
  data() {
    return {
      courseID: 1,
      isNotice: true,
      isLesson: false,
      isGrade: false,
      notice: "Java是一门面向对象编程语言.",
      textarea: "",
      //data: null,
      rate: 20,
      lesson: null,
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
      },
      items:[{
        id:1,
        content:"点击开始评分-1"
      },{
        id:2,
        content:"开始评分-2"
      },{
        id:3,
        content:"开始评分-3"
      }]
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
        this.isGrade = false;
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
        this.isGrade = false;

        axios
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
          });
      }
    },
    getGrade() {
      if (this.isGrade == false) {
        this.isNotice = false;
        this.isLesson = false;
        this.isGrade = true;
      }
    },
    grade(id) {
      this.$router.push({
        path: '/teacher/mark',
        name: 'exerciseMark',
        query: {
          chapter_id: id
        }
      })
    },
    handleNodeClick(object) {
      this.$router.push({
        path: "/student/courseDetail",
        query: {
          id: object.id
        }
      });
    },
    editChapter() {
      this.$router.push({
        path: "/teacher/chapterEdit",
        query: {
          id: this.courseID
        }
      });
    },
    courseBack() {
      this.$router.push({ path: "/teacher/courseManagement" });
    },
    stuDetail(){
      this.$router.push('/teacher/studentList');
    },
    couAnalysis(){
      this.$router.push('/teacher/courseAnalysis');
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
  height: 300px;
  /* background-color: cadetblue; */
  /* line-height: 350px; */
  font-size: 25px;
  font-weight: 700;
  color: rgb(92, 87, 87);
  background-image: url("../../assets/course/img-8.jpg");
  background-size: cover;
}
.tabs {
  height: 70px;
  background-color: rgba(95, 158, 160, 0.8);
} /* 
.tabBack:hover {
  background-color: rgba(172, 200, 201, 0.8);
} */
.clickDiv {
  background-color: rgba(83, 139, 141, 0.8);
}
.tab {
  line-height: 50px;
  height: 70px;
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
}
.gradeBack {
  padding: 20px 0;
  height: 500px;
  padding-top: 50px;
}
.grade {
  height: 80px;
}
.el-tree {
  background-color: rgba(118, 162, 163, 0.26);
}
.el-tree-node__content:hover {
  background-color: rgb(95, 158, 160, 0.8);
}
</style>
