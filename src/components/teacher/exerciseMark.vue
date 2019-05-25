<template>
  <el-container>
    <el-main class="background">
      <div class="main">
        <el-card :body-style="{ padding: '0' }" v-loading="questionLoading">
          <!-- 标题 -->
          <div align="center" class="header" id="title">
            <el-row>
              <el-col :span="2" align="start">
                <div>
                  <el-button @click="goBack" type="text" class="back-button">
                    <i class="el-icon-back"></i>
                  </el-button>
                </div>
              </el-col>
              <el-col :span="22" align="center">
                <div class="title">{{name}}</div>
              </el-col>
            </el-row>
          </div>
          <!-- 主体 -->
          <div class="cardbody">
            <!-- 成绩和学生信息 -->
            <el-row style="margin-top: 3px;">
              <el-col :span="17" style="padding-left: 40px" align="start">
                <div
                  class="student-info" v-if="studentInfo.length > 0"
                >{{studentInfo[index].id}} {{studentInfo[index].name}}</div>
              </el-col>
            </el-row>
            <!-- 问题答案和选择分数 -->
            <div
              v-if="question.length > 0 && studentInfo.length > 0 && question.length === studentInfo[index].answer.length"
            >
              <div v-for="(question, i) in question" :key="i" align="start" class="question">
                <pre>{{question.order}}.{{question.content}}({{question.score}}分)</pre>
                <div class="answer"><pre>{{studentInfo[index].answer[i].content}}</pre></div>
                <div style="margin-top: 15px">
                  <span class="notice">得分</span>
                  <span style="margin-left: 10px">
                    <el-select
                      v-model="studentInfo[index].score[i]"
                      size="small"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in scoreOptions"
                        :key="item.value * 10"
                        :label="item.label"
                        :value="item.value * question.score"
                      ></el-option>
                    </el-select>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
                  style="font-size: 14px; margin-left: 40px;margin-top: 13px; font-weight: 450; letter-spacing: 1px">总成绩：{{totalScore[index]}}</div>
          <div style="margin-top: 20px; padding-bottom: 15px;" align="center">
            <el-button type="primary" class="submit-button" size="small" @click="stuBack" :disabled="index === 0">上一名</el-button>
            <el-button type="primary" class="submit-button" size="small" @click="submit" :loading="submitLoading">提交</el-button>
            <el-button type="primary" class="submit-button" size="small" @click="stuForward" :disabled="next">下一名</el-button>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "exerciseMark",
  data() {
    return {
      // 章节id需要传值
      courseID: 0,
      chapterID: 0,
      classID: 0,
      name: "",
      studentId:0,
      // getExercises
      question: [],
      index: 0,
      next: true,
      // getStudentInfo
      studentInfo: [{
        id: '',
        name: '暂无学生信息'
      }],
      // loading
      submitLoading: false,
      questionLoading: true,
      studentLoading: false,
      // 分数设定
      scoreOptions: [
        {
          value: "1",
          label: "优"
        },
        {
          value: "0.9",
          label: "良"
        },
        {
          value: "0.8",
          label: "中"
        },
        {
          value: "0.6",
          label: "及格"
        },
        {
          value: "0",
          label: "不及格"
        }
      ]
    };
  },
  methods: {
    // 返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.push({path: '/teacher/courseDetail', query: {
          courseID: this.courseID,
          classID: this.classID
        }});
      }
    },
    stuBack() {
      this.index--;
      this.next = false;
      window.location.hash = "#title"
    },
    stuForward() {
      this.index++;
      this.next = true;
      window.location.hash = "#title"
    },
    // 获取
    getExercises() {
      this.question = [];
      this.questionLoading = true;
      this.$http
        .get(
          // 传值chapterid
          "http://10.60.38.173:8765/question/view?chapterId=" +
            this.chapterID +
            "&type=review",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let exerciseList = JSON.parse(response.bodyText);
              if (exerciseList.state === 1) {
                let i = 0;
                while (i < exerciseList.data.length) {
                  if (exerciseList.data[i].exercise.exerciseType === 6) {
                    this.question.push({
                      id: exerciseList.data[i].exercise.exerciseId,
                      content: exerciseList.data[i].exercise.exerciseContent,
                      score: exerciseList.data[i].exercise.exercisePoint,
                      order: exerciseList.data[i].exercise.exerciseNumber
                    });
                  }
                  i++;
                }
                this.getStudentInfo();
                this.question.sort(this.compare("order"));
                this.questionLoading = false;
              }
            } else {
              this.questionLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.questionLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getStudentInfo() {
      this.studentInfo = [];
      this.studentLoading = true;
      this.$http
        .get(
          // 传值班级号
          "http://10.60.38.173:8765/getStudentsByClassID?courseClassID=" +
            this.classID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let studentList = JSON.parse(response.bodyText);
              if (studentList.state === 1) {
                let i = 0;
                while (i < studentList.data.length) {
                  this.studentInfo.push({
                    answer: new Array(),
                    score: new Array(),
                    id: studentList.data[i].workID,
                    name: studentList.data[i].name,
                    studentId: studentList.data[i].userID
                  });
                  if (this.studentInfo[i].studentId === this.$route.query.studentId) {
                    this.index = i;
                  }
                  this.getAnswers(i);
                  i++;
                }
              }
              this.studentLoading = false;
              console.log(this.studentInfo.length);
            } else {
              this.studentLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.studentLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getAnswers(index) {
      this.$http
        .get(
          "http://10.60.38.173:8765/question/viewSomeAnswer?chapterId=" +
            this.chapterID +
            "&studentId=" +
            this.studentInfo[index].studentId +
            "&type=review",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              if (this.studentInfo[index].studentId === 1) {
              alert(response.bodyText)
              }
              let answer = JSON.parse(response.bodyText);
              if (answer.state === 1) {
                let i = 0;
                while (i < answer.data.exerciseSets.length) {
                  if (answer.data.exerciseSets[i].exercise.exerciseType === 6) {
                    this.studentInfo[index].answer.push({
                      id: answer.data.exerciseSets[i].exercise.exerciseId,
                      content: answer.data.exerciseSets[i].answer,
                      order: answer.data.exerciseSets[i].exercise.exerciseNumber
                    });
                    this.studentInfo[index].score.push((answer.data.scores[i]/answer.data.exerciseSets[i].exercise.exercisePoint).toFixed(1));
                  }
                  i++;
                }
                this.studentInfo[index].answer.sort(this.compare("order"));
              } else {
                for (let i = 0; i < this.question.length; i++) {
                  this.studentInfo[index].answer.push({
                    id: this.question[i].id,
                    content: "[[[该学生未完成习题作业!]]]",
                    order: this.question[i].order
                  });
                  this.studentInfo[index].score.push(0);
                }
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    submit() {
      if (this.studentInfo[this.index].score.length === 0) {
        this.$message({ type: "warning", message: "学生没有作答，无法评分!" });
        return;
      }
      let scores =
        this.studentInfo[this.index].score.length === 1
          ? this.studentInfo[this.index].score[0]
          : this.studentInfo[this.index].score;
          this.submitLoading = true;
      this.$http
        .post(
          "http://10.60.38.173:8765/question/correctAll",
          {
            scores: scores,
            studentId: this.studentInfo[this.index].studentId,
            chapterId: this.chapterID,
            type: "review"
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              this.submitLoading = false;
              if (this.index !== this.studentInfo.length - 1) {
                this.next = false;
              }
              this.$message({ type: "success", message: "提交成功!" });
            } else {
              this.submitLoading = false;
              this.$message({ type: "error", message: "提交失败!" });
            }
          },
          response => {
            this.submitLoading = false;
            this.$message({ type: "error", message: "提交失败!" });
          }
        );
    },
    // 比较器
    compare(propertyName) {
      return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
          return 1;
        } else if (value2 > value1) {
          return -1;
        } else {
          return 0;
        }
      };
    }
  },
  created() {
    this.chapterID = this.$route.query.chapterID;
    this.classID = this.$route.query.classID;
    this.courseID = this.$route.query.courseID;
    this.name = this.$route.query.name;
    this.studentId = this.$route.query.studentId;
    this.getExercises();
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
  computed: {
    totalScore() {
      let result = [];
      for (let i = 0; i < this.studentInfo.length; i++) {
        let sum = 0;
        for (let j = 0; j < this.question.length; j++) {
          sum += this.studentInfo[i].score[j];
        }
        result.push(sum);
      }
      return result;
    }
  }
};
</script>

<style scoped>
.buttonHid {
  visibility: hidden;
}

.main {
  width: 800px;
  margin: 0 auto;
}

.title {
  margin-top: 13px;
  font-size: 14px;
  color: #292929;
  margin-left: -40px;
  font-weight: 450;
  letter-spacing: 1px;
}

.question {
  padding: 15px 40px 15px 40px;
}

.question .notice {
  font-weight: 400;
  letter-spacing: 0.8px;
  font-size: 14px;
}

.question .answer {
  background-color: #fcfcfc;
  min-height: 80px;
  padding: 10px 10px 10px 10px;
  margin-top: 15px;
  font-size: 14px;
  letter-spacing: 0.8px;
}

.background {
  background-image: url("../../assets/background.jpg"); /*背景图片地址*/
  background-repeat: repeat-y; /*背景图片不重复*/
  background-size: cover; /*背景图片拉伸铺满*/
  width: 100%; /* 宽度为100%；*/
}

.header {
  height: 42px;
  border-bottom: 1px solid #eaeef3;
  word-spacing: 4px;
  padding: 3px 10px 3px 15px;
}

.back-button {
  margin-top: 3px;
  color: #292929;
}

.switch-button {
  margin-top: 13px;
  color: #292929;
  font-size: 16px;
  padding: 0 0 0 0;
}

.student-info {
  color: #41abf1;
  font-size: 14px;
  font-weight: 500;
  margin-top: 13px;
  letter-spacing: 1px;
}

.student-option {
  margin-top: 8px;
}

.cancel-button {
  color: #ccd3dd;
  font-size: 15px;
  margin-left: 5px;
  margin-top: 4px;
}

.cardbody {
  min-height: 680px;
}

.submit-button {
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}

pre {
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.8px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
