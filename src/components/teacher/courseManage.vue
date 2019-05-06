<template>
  <div style="height:700px">
    <el-col :span="20" :offset="2">
      <el-row>
        <el-col :span="2" :offset="2" style="margin-top:30px;">
          <el-button size="mini" type="success" @click="couAnalysis">课程分析</el-button>
        </el-col>
        <el-col :span="16">
          <el-card
            style="margin-top:10px;height:600px;text-align:center"
            body-style="{padding:'0px'}" shadow="never"
          >
            <graph></graph>
          </el-card>
        </el-col>
        </el-row>
       <el-row style="font-size:18px;letter-spacing:5px" v-show="noCourse">
        <el-row style="padding:30px">还没有课？</el-row>
        <el-row>请联系<span style="color:darkcyan;font-weight:bold">学院管理员</span>为您开课吧
        </el-row>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="22" :offset="1">
        <el-col :span="8" v-for="(item,index) in items" :key="index">
          <el-card :body-style="{padding:0}" style="margin:20px 0;">
            <el-row class="top">
              <p
                id="name"
                @click="courseDetail(item.courseInfo.courseID, item.courseClass.id)"
              >{{item.courseInfo.courseName+'('+item.courseClass.classNum+')'}}</p>
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
                  <p
                    id="newest"
                    @click="homework(item.courseClass.currentExerciseChapter)"
                  >第 {{item.courseClass.currentExerciseChapter}} 章课后习题</p>
                </el-col>
              </el-row>
              <el-row>
                <el-row style="font-size:12px;text-align:right">
                  <el-col :span="10" :offset="13">邀请码：{{item.courseClass.classCode}}</el-col>
                </el-row>
              </el-row>
            </el-row>
          </el-card>
        </el-col>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>
<script>
import graph from "./courseGraph.vue";
import axios from 'axios'
export default {
  name: "tCourseManage",
  components: {
    graph
  },
  data() {
    return {
      noCourse:true,
      code: "",
      isPlus: false,
      isConfirm: false,
      items: []
    };
  },
  created() {
    axios
      .get("/api/getCoursesByTeacherID", {
        headers: {
          Authorization:
            "Bearer "+localStorage.getItem("token")
        },
        params: {
          teacherID: 202
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
        this.items = resp.data.data;
        console.log(resp.data, "resp.data");
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    couAnalysis(){
      this.$router.push({
        path: '/teacher/courseAnalysis', 
        query: {
          teacherID: 202
        }
      });
    },
    courseDetail: function(courseID, classID) {
      this.$router.push({
        path: "/teacher/courseDetail",
        query: {
          courseID: courseID,
          classID: classID
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
} /* 
.bottom {
  height: 90px;
  text-align: left;
} */
</style>