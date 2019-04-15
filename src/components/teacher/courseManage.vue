<template>
  <div style="height:550px">
    <el-col :span="20" :offset="2">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-card style="margin-top:10px;height:200px">
            <p>demo1</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="8" v-for="(item,index) in items" :key="index">
          <el-card :body-style="{padding:0}" style="margin:20px 0;">
            <el-row class="top">
              <p
                id="name"
                @click="courseDetail(item.courseInfo.courseID)"
              >{{item.courseInfo.courseName}}</p>
              <el-row>
                <el-col :span="5" :offset="18" style="margin-top:10px">
                  <span style="font-size: 10px;color: rgb(238, 235, 235);">老师：{{item.courseInfo.teacherName}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" :offset="18">
                  <span style="font-size: 10px;color: rgb(238, 235, 235);">ID：{{item.courseInfo.teacherID}}</span>
                </el-col>
              </el-row>
            </el-row>
            <el-row style="height: 90px;">
              <el-row>
                <el-col :span="16" :offset="1" style="text-align:left">
                  <p style="font-size:13px;color:#000">近期作业</p>
                  <p id="newest" @click="homework">{{item.courseInfo.currentExerciseChapter}}</p>
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
      </el-row>
    </el-col>
  </div>
</template>
<script>
export default {
  name: "tCourseManage",
  data() {
    return {
      code: "",
      isPlus: false,
      isConfirm: false,
      items: [
        {
          courseInfo: {
            courseID: 1,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            teacherID:123,
            currentExerciseChapter: "JAVA I/O 课后作业"
          },
          courseClass: {
            id: 1,
            courseID: 1,
            classNum: 1,
            classCode: "100001"
          }
        },
        {
          courseInfo: {
            courseID: 2,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            teacherID:123,
            currentExerciseChapter: "JAVA I/O 课后作业"
          },
          courseClass: {
            id: 2,
            courseID: 2,
            classNum: 1,
            classCode: "100002"
          }
        },
        {
          courseInfo: {
            courseID: 3,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            teacherID:123,
            currentExerciseChapter: "JAVA I/O 课后作业"
          },
          courseClass: {
            id: 3,
            courseID: 3,
            classNum: 1,
            classCode: "100003"
          }
        }
      ]
    };
  },
  /*  created() {
    axios
      .get("/api/getStuCourseList", {
        params: {
          studentID: 1
        }
      })
      .then(resp => {
        this.items = resp.data;
        console.log(resp.data);
        console.log(this.items)
      })
      .catch(err => {
        console.log(err);
      });
  }, */
  methods: {
    courseDetail: function(courseID) {
      this.$router.push({
        path: "/teacher/courseDetail",
        query: {
          courseID: courseID
        }
      });
    },
    homework() {
      this.$router.push({
        path: "/teacher/currentHomework",
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