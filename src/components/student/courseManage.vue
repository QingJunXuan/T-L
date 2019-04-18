<template>
  <div style="height:550px">
    <el-col :span="20" :offset="2">
      <el-row :gutter="40">
        <el-col :span="3" style="margin-top:10px">
          <el-button type="primary" size="mini" @click="isPlus=true">添加课程</el-button>
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
              <el-col :span="5" :offset="18" style="margin-top:10px">
                <span id="teacher">老师：{{item.courseInfo.teacherName}}</span>
              </el-col>
            </el-row>
            <el-row style="height:90px">
              <el-row>
                <el-col :span="16" :offset="1" style="text-align:left">
                  <p style="font-size:13px;color:#000">近期作业</p>
                  <p id="newest" @click="homework(item.courseClass.currentExerciseChapter)">{{item.courseClass.currentExerciseChapter}}</p>
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
      <el-dialog :visible.sync="isConfirm" title="课程信息确认" width="25%" center>
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
      code: "",
      isPlus: false,
      isConfirm: false,
      courseConfirm: {
        courseInfo: {
          courseID: 3,
          courseName: "JavaEE",
          teacherName: "范鸿飞"
        },
        courseClass: {
          id: 3,
          courseID: 3,
          classNum: 1,
          classCode: "100001",
          currentExerciseChapter: -1
        }
      },
      items: [
        {
          courseInfo: {
            courseID: 1,
            courseName: "JavaEE",
            teacherName: "范鸿飞"
          },
          courseClass: {
            id: 1,
            courseID: 1,
            classNum: 1,
            classCode: "100001",
            currentExerciseChapter: -1
          }
        },
        {
          courseInfo: {
            courseID: 2,
            courseName: "JavaEE",
            teacherName: "范鸿飞"
          },
          courseClass: {
            id: 2,
            courseID: 2,
            classNum: 1,
            classCode: "100002",
            currentExerciseChapter: -1
          }
        },
        {
          courseInfo: {
            courseID: 3,
            courseName: "JavaEE",
            teacherName: "范鸿飞"
          },
          courseClass: {
            id: 3,
            courseID: 3,
            classNum: 1,
            classCode: "100003",
            currentExerciseChapter: -1
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
        var length = this.items.length;
        for (var i = 0; i < length; i++) {
          var chapterNode = this.items[i].courseClass.currentExerciseChapter;
          axios
            .get("/api/getChapterByID", {
              params: {
                chapterID: chapterNode
              }
            })
            .then(resp => {
              this.items[i].courseClass.chapterName =
                resp.data.contentName;
            })
            .catch(err => {
              console.log(err);
            });
        }
        console.log(resp.data);
        console.log(this.items);
      })
      .catch(err => {
        console.log(err);
      });
  }, */
  methods: {
    submit: function() {
      /*  axios
        .get("/api/getCourseByCode", {
          params: {
            courseCode: this.code
          }
        })
        .then(resp => {
          console.log(resp.data);
          this.courseConfirm = resp.data;
          //this.items.push(resp.data);
        })
        .catch(err => {
          console.log(err);
        }); */
      this.isConfirm = true;
    },
    confirm() {
      this.isPlus = false;
      this.isConfirm = false;
      /* axios
        .get("/api/getCourseByCode", {
          params: {
            studentID: 1,
            courseClassID: this.courseConfirm.courseClass.id
          }
        })
        .then(resp => {
          //==============================将新获得的课程添加到当前列表
          this.items.push(this.courseConfirm)
          console.log(resp);
          this.$message(resp.message)
        })
        .catch(err => {
          console.log(err);
        }); */
      this.code = "";
    },
    courseDetail: function(courseID) {
      this.$router.push({
        path: "/student/courseDetail",
        query: {
          courseID: courseID
        }
      });
    },
    homework(chapterID) {
      this.$router.push({
        path: "/student/currentHomework",
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