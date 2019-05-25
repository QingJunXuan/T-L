<!--<template>
  <div>
    <el-row style="padding-top:20px">
      <el-col :span="20" :offset="2">
        <el-row>
          <el-col :span="4" style="margin-top:10px">
            <el-button size="mini" @click="edit">编辑课程</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" :offset="1" v-for="(item,index) in allCourse" :key="index">
            <el-card :body-style="{padding:0}" style="margin:20px 0;">
              <el-row class="top">
                <p
                  id="name"
                >{{item.courseName}}</p>
                <el-row><el-col :span="5" :offset="18" style="margin-top:10px">
                  <span style="font-size: 10px;color: rgb(238, 235, 235);">老师：{{item.teacherName}}</span>
                </el-col></el-row>
                <el-row><el-col :span="5" :offset="18" >
                  <span style="font-size: 10px;color: rgb(238, 235, 235);">ID：{{item.teacherID}}</span>
                </el-col></el-row>
              </el-row>
              <el-row class="bottom">
                <el-row></el-row>
                <el-row style="padding-bottom:10px">
                    <el-col>{{item.courseYear+item.courseSemester}}</el-col>
                </el-row>
                <el-row style="padding-bottom:10px">
                  <el-col>{{item.startTime+" - "+item.endTime}}</el-col>
                </el-row>
                                  <el-row style="padding-bottom:10px;"><el-col>邀请码：{{item.courseClass.classCode}}</el-col></el-row> 
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>-->
<script>
import bus from "../../bus.js";
export default {
  name:'courseList',
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
            classCode: "100002"
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
            classCode: "100003"
          }
        }
      ],
      analysisMode: false,
      allCourse:[]
    };
  },
  created(){
    this.$axios
    .get('http://10.60.38.173:8765/getAllCourses',{
headers: {
            'Authorization':
              "Bearer "+localStorage.getItem("token")
          }
    }).then(resp=>{
      if(resp.data.state==1){
        this.allCourse=resp.data.data
        console.log(this.allCourse,"allcourse")
      }
    }).catch(err=>{
      console.log(err)
    })
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
    edit() {
      this.$router.push({
        path: "/adminManage/courseGraph"
      });
    },
  }
}; */
</script>
<style>
/* html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
} */
</style>

<style >
/* .top {
  background-image: url(../../assets/course/img-5.jpg);
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
  font: 12px 黑体;
  font-weight: bold;
  padding-top: 15px;
  color: rgb(102, 161, 163);
} */
</style>
 