<template>
  <div style="height:778px">
    <el-col :span="20" :offset="2">
      <el-row>
        <el-col :span="2" :offset="2" style="margin-top:30px;">
          <el-row style="margin-bottom:20px">
            <el-button size="mini" type="success" @click="couAnalysis">课程分析</el-button>
          </el-row>
          <el-row>
            <el-button size="mini" type="primary" @click="courseList">历史课程</el-button>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-card
            style="margin-top:10px;height:600px;text-align:center"
            body-style="{padding:'0px'}"
            shadow="never"
          >
            <graph></graph>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="font-size:18px;letter-spacing:5px" v-show="noCourse">
        <el-row style="padding:30px">还没有课？</el-row>
        <el-row>
          请联系
          <span style="color:darkcyan;font-weight:bold">学院管理员</span>为您开课吧
        </el-row>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="22" :offset="1">
        <span v-for="(item,index) in items" :key="index">
          <el-col :span="8" v-for="(item2,index2) in item.courseClasses" :key="index2">
          <el-card :body-style="{padding:0}" style="margin:20px 0;">
            <el-row class="top">
              <p
                id="name"
                @click="courseDetail(item.courseInfo.courseID, item2.id,item.courseName)"
                style="cursor: pointer"
              >{{item.courseName+'('+item2.classNum+'班)'}}</p>
              <el-row>
                <el-col :span="5" :offset="18" style="margin-top:0px">
                  <span
                    style="font-size: 10px;color: rgb(238, 235, 235);"
                  >老师：{{item.courseInfo.teacherName}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" :offset="18">
                  <span
                    style="font-size: 10px;color: rgb(238, 235, 235);"
                  >ID：{{item.courseInfo.teacherID}}</span>
                </el-col>
              </el-row>
            </el-row>
            <el-row style="height: 90px;">
              <el-row>
                <el-col :span="16" :offset="1" style="text-align:left">
                  <p style="font-size:13px;color:#000">近期作业</p>
                  <p v-if="item2.currentExerciseChapter != -1"
                    id="newest"
                    @click="homework(item2.currentExerciseChapter)"
                  >第 {{item2.currentExerciseChapter}} 章课后习题</p>
                </el-col>
              </el-row>
              <el-row>
                <el-row style="font-size:12px;text-align:right">
                  <el-col :span="10" :offset="13">邀请码：{{item2.classCode}}</el-col>
                </el-row>
              </el-row>
            </el-row>
          </el-card>
          </el-col>
        </span>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>
<script>
import graph from "./courseGraph.vue";
import bus from "../../bus.js";
export default {
  name: "tCourseManage",
  components: {
    graph
  },
  data() {
    return {
      noCourse: true,
      code: "",
      isPlus: false,
      isConfirm: false,
      items: []
    };
  },
  created() {
    this.$axios
      .get("http://10.60.38.173:8765/question/currentCourseByTeacherId", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        params: {
          teacherId: localStorage.getItem('userID')
        }
      })
      .then(resp => {
        if (resp.data.state == 1) {
          this.items = resp.data.data;
          var length = this.items.length;
          if (length != 0) {
            this.noCourse = false;
          }
        }
      })
    
      .catch(err => {
        console.log(err);
      });
    window.onstorage = e => {
      if (e.key === "username") {
        if (e.newValue === null) {
          this.$alert("你已退出登录", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              bus.$emit("reload", false);
            }
          });
        }
      }
    };
  },
  methods: {
    couAnalysis() {
      this.$router.push("/teacher/courseAnalysis");
    },
    courseList() {
      this.$router.push("/teacher/courseList");
    },
    courseDetail: function(courseID, classID, courseName) {
      this.$router.push({
        path: "/teacher/courseDetail",
        query: {
          courseID: courseID,
          classID: classID,
          courseName: courseName
        }
      });
    },
    homework(chapterID) {
      this.$router.push({
        path: "/teacher/chapterDetail",
        query: {
          chapterID: chapterID
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
#name {
  position: relative;
  top: 25%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: rgba(240, 248, 255, 0.925);
}
#name:hover {
  text-decoration: underline;
}
#teacher {
  font-size: 10px;
  color: rgb(238, 235, 235);
}
#newest {
  font-size: 11px;
  color: rgb(36, 89, 187);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 13px;
}
#newest:hover {
  text-decoration: underline;
}
.top {
  /*   background-color: rgba(54, 88, 241, 0.808);*/
  background-image: url(../../assets/course/img-5.jpg);
  /* background-image: image-set(); */
  height: 100px;
  background-size: cover;
} 
</style>
