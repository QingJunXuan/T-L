<template>
  <div style="height:778px">
    <el-col :span="20" :offset="2">
      <el-row :gutter="40">
        <el-col :span="2" style="margin-top:10px">
          <el-button type="primary" size="mini" @click="isPlus=true">添加课程</el-button>
        </el-col>
        <el-col :span="2" style="margin-top:10px">
          <el-button type="success" size="mini" @click="toAnalysis">课程分析</el-button>
        </el-col>
      </el-row>
      <el-row style="font-size:18px;letter-spacing:5px" v-show="noCourse">
        <el-row style="padding:30px">还没有课？</el-row>
        <el-row>
          点击上方的
          <span style="color:darkcyan;font-weight:bold">添加课程</span>，输入专属
          <span style="color:darkcyan;font-weight:bold">邀请码</span>加入课程吧！
        </el-row>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="22" :offset="1">
        <el-col :span="8" v-for="(item,index) in items" :key="index">
          <el-card :body-style="{padding:0}" style="margin:20px 0;">
            <el-row class="top">
              <p
                id="name"
                @click="courseDetail(item.courseInfo.courseID,item.courseClass.id)"
              >{{item.courseInfo.courseName}}</p>
              <el-col :span="5" :offset="18" style="margin-top:10px">
                <span id="teacher">老师：{{item.courseInfo.teacherName}}</span>
              </el-col>
            </el-row>
            <el-row style="height:90px">
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
      <el-dialog :visible.sync="isPlus" title="添加课程" width="30%" center>
        <el-form>
          <el-form-item label="邀请码" label-width="70px">
            <el-input v-model="code" auto-complete="off" placeholder="请输入邀请码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isPlus=false" size="mini">取消</el-button>
          <el-button type="primary" @click="submit" size="mini">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="isConfirm" title="课程信息确认" width="30%" center>
        <div style="text-align:center">
          <p>课程：{{courseConfirm.courseInfo.courseName}}</p>
          <p>教师：{{courseConfirm.courseInfo.teacherName}}</p>
          <p>邀请码：{{courseConfirm.courseClass.classCode}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isConfirm=false" size="mini">返回</el-button>
          <el-button type="primary" @click="confirm" size="mini">确认</el-button>
        </span>
      </el-dialog>
    </el-col>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "sCourseManage",
  data() {
    return {
      noCourse: true,
      code: "",
      isPlus: false,
      isConfirm: false,
      courseConfirm: {
        courseInfo: {
          courseID: -1,
          courseName: "",
          teacherName: ""
        },
        courseClass: {
          id: -1,
          courseID: -1,
          classNum: -1,
          classCode: "",
          currentExerciseChapter: -1
        }
      },
      chapterNameList: [],
      items: []
    };
  },
  /*  var length = this.items.length;
        var test=new Array()
        for (var i = 0; i < length; i++) {
          console.log(i, "in for");
          var chapterNode = this.items[i].courseClass.currentExerciseChapter;
          
          axios
            .get("/api/getChapterByID", {
              headers: {
                Authorization:
                  "Bearer "+localStorage.getItem("token")
              },
              params: {
                chapterID: chapterNode
              }
            })
            .then(resp => {
              console.log(resp.data.data,"in");
              //test[i] =  resp.data.data.exerciseTitle;
              
            })
            .catch(err => {
              console.log(err);
            });
        } */
  created() {
    axios
      .get("/api/getStuCourseList", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        params: {
          studentID: localStorage.getItem('userid')
        }
      })
      .then(resp => {
        if (resp.data.state == 1) {
          var length = resp.data.data.length;
          if (length != 0) {
            this.noCourse = false;
            this.items = resp.data.data;
          }
        }

        console.log(resp, "resp");
        console.log(resp.data, "courselist");
        console.log(this.items, "items");
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    toAnalysis() {
      this.$router.push({ path: "/student/studentAnalysis" ,query:{studentID: 1612345, studentName: '车希彤', userID: 1}});
    },
    submit: function() {
      //获取课程信息，进行确认
      axios
        .get("/api/getCourseByCode", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseCode: this.code
          }
        })
        .then(resp => {
          console.log(resp.data);
          this.courseConfirm = resp.data.data;
          //this.items.push(resp.data);
        })
        .catch(err => {
          console.log(err);
        });
      this.isConfirm = true;
    },
    confirm() {
      //确认添加课程
      this.isPlus = false;
      this.isConfirm = false;
      axios
        .get("/api/joinCourse", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            studentID: 1,
            courseClassID: this.courseConfirm.courseClass.id
          }
        })
        .then(resp => {
          //==============================将新获得的课程添加到当前列表
          this.items.push(this.courseConfirm);
          console.log(resp);
          this.$message(resp.message);
        })
        .catch(err => {
          console.log(err);
        });
      this.code = "";
    },
    courseDetail: function(courseID, classID) {
      this.$router.push({
        path: "/student/courseDetail",
        query: {
          courseID: courseID,
          classID: classID
        }
      });
    },
    homework(chapterID) {
      this.$router.push({
        path: "/student/chapterDetail",
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
}
.bottom {
  height: 90px;
  text-align: left;
}
</style>