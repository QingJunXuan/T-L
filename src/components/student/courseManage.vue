<template>
  <div style="height:778px">
    <el-col :span="20" :offset="2"> 
      <!-- <el-row style="font-size:18px;letter-spacing:5px;text-align:left">
        <el-row style="padding-top:30px;" v-if="items.length!=0">当前学期：{{items[0].courseInfo.courseYear+'-'+items[0].courseInfo.courseSemester}}</el-row>
      </el-row> -->
      <el-row :gutter="10" style="padding-top:30px;padding-bottom:20px">
        <el-col :span="2" style="margin-top:10px">
          <el-button type="primary" size="mini" @click="isPlus=true">加入班级</el-button>
        </el-col>
        <el-col :span="1" style="margin-top:10px;margin-right:40px">
          <el-button type="success" size="mini" @click="toAnalysis">课程分析</el-button>
        </el-col>
        <el-col :span="4" style="margin-top:10px">
           <el-row style="font-size:18px;letter-spacing:4px;text-align:left">
             <el-row v-if="items.length!=0">当前学期：{{items[0].courseInfo.courseYear+'-'+items[0].courseInfo.courseSemester}}</el-row>
            </el-row>
        </el-col>
      </el-row>
      <el-row style="font-size:18px;letter-spacing:5px" v-show="noCourse">
        <el-row style="padding:30px">还没有课？</el-row>
        <el-row>
          点击上方的
          <span style="color:darkcyan;font-weight:bold">加入班级</span>，输入专属
          <span style="color:darkcyan;font-weight:bold">邀请码</span>加入课程吧！
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
                    style="cursor: pointer"
                    @click="courseDetail(item.courseInfo.courseID,item2.id,item.courseName)"
                  >{{item.courseName}}</p>
                  <el-col :span="5" :offset="18" style="margin-top:10px">
                    <span id="teacher">老师：{{item.courseInfo.teacherName}}</span>
                  </el-col>
                </el-row>
                <el-row style="height:90px">
                  <el-row>
                    <el-col :span="16" :offset="1" style="text-align:left">
                      <p style="font-size:13px;color:#000">近期作业</p>
                      <p
                        v-if="item2.currentExerciseChapter != -1"
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
      <el-dialog :visible.sync="isPlus" title="加入班级" width="30%" center>
        <el-form>
          <el-form-item label="邀请码" label-width="70px">
            <el-input
              v-model="code"
              auto-complete="off"
              placeholder="请输入邀请码"
              @keyup.native.enter="submit"
            ></el-input>
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
import bus from "../../bus.js";
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
  created() {
    this.getCourses();
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
    getCourses() {
      this.$axios
        .get("http://10.60.38.173:8765/question/currentCourseByStudentId", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            studentId: localStorage.getItem("userID")
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            var length = resp.data.data.length;
            if (length != 0) {
              this.noCourse = false;
              resp.data.data.splice(2, 1);
              this.items = resp.data.data;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toAnalysis() {
      this.$router.push({ path: "/student/studentAnalysis" });
    },
    submit: function() {
      //获取课程信息，进行确认
      this.$axios
        .get("http://10.60.38.173:8765/getCourseByCode", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseCode: this.code
          }
        })
        .then(resp => {
          if (resp.data.state == 0) {
            alert("该课程不存在");
          } else {
            this.courseConfirm = resp.data.data;
            //this.items.push(resp.data);
            this.isConfirm = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirm() {
      //确认加入班级
      this.isPlus = false;
      this.isConfirm = false;
      this.$axios
        .get("http://10.60.38.173:8765/joinCourse", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            studentID: localStorage.getItem("userID"),
            courseClassID: this.courseConfirm.courseClass.id
          }
        })
        .then(resp => {
          //==============================将新获得的班级添加到当前列表
          if (resp.data.state === 1) {
            this.$message("添加成功");
            this.getCourses();
          } else {
            this.$message({
              type: "warning",
              message: "本学期你已经学习过该课程!"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.code = "";
    },
    courseDetail: function(courseID, classID, courseName) {
      this.$router.push({
        path: "/student/courseDetail",
        query: {
          courseID: courseID,
          classID: classID,
          courseName: courseName
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