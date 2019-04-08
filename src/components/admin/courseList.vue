<template>
  <div>
    <el-row style="padding-top:20px">
      <el-col :span="20" :offset="2">
        <el-row>
          <el-col :span="4" style="margin-top:10px">
            <el-button size="mini" @click="edit">编辑课程</el-button>
          </el-col>
          <el-col :span="2" style="margin-top:10px">
            <div v-if="!analysisMode"><el-button size="mini" @click="analysisMode = true">分析课程</el-button></div>
            <div v-else><el-button size="mini" @click="analysisMode = false">退出分析课程</el-button></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" :offset="1" v-for="(item,index) in items" :key="index">
            <el-card :body-style="{padding:0}" style="margin:20px 0;">
              <el-row class="top">
                <p
                  id="name"
                  v-if="!analysisMode"
                  @click="courseDetail(item.courseInfo.courseID)"
                >{{item.courseInfo.courseName}}</p>
                <p
                  id="toAnalysis"
                  v-else
                  @click="$router.push('/adminManage/courseAnalysis')"
                >{{item.courseInfo.courseName}}</p>
                <el-row><el-col :span="5" :offset="18" style="margin-top:10px">
                  <span id="teacher">老师：{{item.courseInfo.teacherName}}</span>
                </el-col></el-row>
                <el-row><el-col :span="5" :offset="18" >
                  <span id="teacherID">ID：{{item.courseInfo.teacherID}}</span>
                </el-col></el-row>
              </el-row>
              <el-row class="bottom">
                <el-row></el-row>
                <el-row style="padding-bottom:10px">
                    <el-col>{{item.courseInfo.courseYear+item.courseInfo.courseSemester}}</el-col>
                </el-row>
                <el-row style="padding-bottom:10px">
                  <el-col>{{item.courseInfo.startTime+" - "+item.courseInfo.endTime}}</el-col>
                </el-row>
                <el-row style="padding-bottom:10px;"><el-col>邀请码：{{item.courseClass.classCode}}</el-col></el-row>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rate: null,
      textarea: "",
      items: [
        {
          courseInfo: {
            courseID: 1,
            teacherID: 433,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            courseYear: 2018,
            courseSemester: "秋季",
            currentExerciseChapter: null,
            startTime: "2018-09-01",
            endTime: "2019-01-31"
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
            teacherID: 433,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            courseYear: 2018,
            courseSemester: "秋季",
            currentExerciseChapter: null,
            startTime: "2018-09-01",
            endTime: "2019-01-31"
          },
          courseClass: {
            id: 2,
            courseID: 2,
            classNum: 1,
            classCode: "100001"
          }
        },
        {
          courseInfo: {
            courseID: 3,
            teacherID: 433,
            courseName: "JavaEE",
            teacherName: "范鸿飞",
            courseYear: 2018,
            courseSemester: "秋季",
            currentExerciseChapter: null,
            startTime: "2018-09-01",
            endTime: "2019-01-31"
          },
          courseClass: {
            id: 3,
            courseID: 3,
            classNum: 1,
            classCode: "100001"
          }
        }
      ],
      analysisMode: false
    };
  },
  methods: {
    feedbackBack() {
      this.$router.back({
        path: "/student/courseDetail"
      });
    },
    submit() {},
    edit() {
      this.$router.push({
        path: "/admin/edit"
      });
    },
    chart() {},
    courseList() {},
    teacherList(){},
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
.header {
  height: 60px;
  background-color: cadetblue;
  color: #fff;
  font-size: 17px;
  font-weight: 700px;
  font-family: "Courier New", Courier, monospace;
}
.logo {
  /* width:230px; */
  height: 60px;
  font-size: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.logo-width {
  width: 200px;
}
.subhead {
  font: 12px 黑体;
  font-weight: bold;
  position: absolute;
  letter-spacing: 3px;
}
.icon-right {
  text-align: right;
  float: right;
  line-height: 60px;
  padding-right: 40px;
  font-size: 25px;
}
.top {
  /*   background-color: rgba(54, 88, 241, 0.808);*/
  background-image: url(../../assets/course/img-5.jpg);
  /* background-image: image-set(); */
  height: 110px;
  background-size: cover;
}
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

#toAnalysis {
  position: relative;
  top: 25%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: rgba(240, 248, 255, 0.925);
}
#toAnalysis:hover {
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
}
#newest:hover {
  text-decoration: underline;
}
.bottom {
  height: 100px;
  /* text-align: left; */
  font: 12px 黑体;
  font-weight: bold;
  padding-top: 15px;
  color: rgb(102, 161, 163);
}
</style>

