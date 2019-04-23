<template>
  <el-container>
    <el-main class="background">
      <div class="main">
        <el-card :body-style="{ padding: '0' }">
          <!-- 标题 -->
          <div align="center" class="header">
            <el-row>
              <el-col :span="2" align="start">
                <div>
                  <el-button @click="goBack" type="text" class="back-button">
                    <i class="el-icon-back"></i>
                  </el-button>
                </div>
              </el-col>
              <el-col :span="22" align="start">
                <div class="title">第{{chapterID}}章-课前习题</div>
              </el-col>
            </el-row>
          </div>
          <!-- 主体 -->
          <div class="cardbody">
            <!-- 成绩和学生信息 -->
            <el-row style="margin-top: 3px">
              <el-col :span="4" align="center">
                <div class="grade">
                  总成绩：{{totalScore[index]}}
                </div>
              </el-col>
              <el-col :span="13" align="end">
                <div v-if="notSelect">
                  <el-button
                    type="text"
                    @click="index--"
                    :class="index === 0? 'buttonHid' : 'switch-button'"
                  >
                    <i class="el-icon-caret-left"></i>
                  </el-button>
                </div>
                <div v-else>
                  <br>
                </div>
              </el-col>
              <el-col :span="5" align="center">
                <div
                  v-if="notSelect"
                  @dblclick="notSelect = false"
                  class="student-info"
                >{{studentInfo[index].id}} {{studentInfo[index].name}}</div>
                <div v-else class="student-option">
                  <el-select v-model="index" placeholder="跳转到学生" filterable size="small">
                    <el-option
                      v-for="item in studentOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="2" align="start">
                <div v-if="notSelect">
                  <el-button
                    type="text"
                    @click="index++"
                    :class="index === studentInfo.length - 1? 'buttonHid' : 'switch-button'"
                  >
                    <i class="el-icon-caret-right"></i>
                  </el-button>
                </div>
                <div v-else>
                  <el-button @click="notSelect = true" class="cancel-button" type="text">
                    <i class="el-icon-circle-close"></i>
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <!-- 问题答案和选择分数 -->
            <div>
              <div v-for="i in question.length" :key="i" align="start" class="question">
                <div class="notice">{{i}}.{{question[i - 1].content}}({{question[i-1].score}}分)</div>
                <div class="answer">{{studentInfo[index].answer[i - 1].content}}</div>
                <div style="margin-top: 15px">
                  <span class="notice">得分</span>
                  <span style="margin-left: 10px">
                    <el-select
                      v-model="studentInfo[index].score[i - 1]"
                      size="small"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in scoreOptions"
                        :key="item.value * 10"
                        :label="item.label"
                        :value="item.value * question[i-1].score"
                      ></el-option>
                    </el-select>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px; padding-bottom: 15px;" align="center">
            <el-button type="primary" class="submit-button" size="small">提交</el-button>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "exerciseMark",
  data() {
    return {
      // 章节id需要传值
      chapterID: 0,
      classID: 0,
      // 控制选框的显示
      notSelect: true,
      // getExercises
      question: [
        {
          id: 1,
          content: "第1题的题目",
          score: "10"
        }
      ],
      index: 0,
      // getStudentInfo
      studentInfo: [
        {
          id: "1612341",
          name: "学生1",
          answer: [
            {
              id: 1,
              content: "第1题的答案"
            },
            {
              id: 2,
              content: "第2题的答案"
            },
            {
              id: 3,
              content: "第3题的答案"
            },
            {
              id: 4,
              content: "第4题的答案"
            }
          ],
          score: [0, 0, 0, 0]
        },
        {
          id: "1612341",
          name: "学生2",
          answer: [
            {
              id: 1,
              content: "第1题的答案"
            },
            {
              id: 2,
              content: "第2题的答案"
            },
            {
              id: 3,
              content: "第3题的答案"
            },
            {
              id: 4,
              content: "第4题的答案"
            }
          ],
          score: [0, 0, 0, 0]
        }
      ],
      studentOptions: [
        {
          value: 0,
          label: "1612341 学生1"
        }
      ],
      // loading
      submitLoading: false,
      questionLoading: false,
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
        this.$router.go(-1);
      }
    },
    // 获取
    getExercises() {
      this.question = [];
      this.$http
        .get(
          // 传值chapterid
          "http://localhost:8080/question/view?chapterId=" +
            this.chapterID +
            "&type=preview",
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
                  if (exerciseList.data[i].exercise.exerciseType === 3) {
                    this.question.push({
                      id: exerciseList.data[i].exercise.exerciseId,
                      content: exerciseList.data[i].exercise.exerciseContent,
                      score: exerciseList.data[i].exercise.exercisePoint
                    });
                  }
                  i++;
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
    getStudentInfo(index) {
      this.studentInfo = [];
      this.studentOptions = [];
      this.$http
        .get(
          // 传值班级号
          "http://localhost:8080/getStudentsByClassID?courseClassID=" + this.classID,
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
                    answer: [],
                    score: [],
                    id: studentList.data[i].workID,
                    name: studentList.data[i].name,
                    studentId: studentList.data[i].userID
                  });
                  this.studentOptions.push({
                    value: i,
                    label:
                      studentList.data[i].workID +
                      " " +
                      studentList.data[i].name
                  });
                  for (let k = 0; k < this.question.length; k++) {
                    this.studentInfo[i].score.push(0);
                    //this.getAnswers(i, this.question[k].id, this.studentInfo[i].studentId)
                    this.studentInfo[i].answer.push({
                      id: i * 10 + k,
                      content: "学生答案"
                    });
                  }
                  i++;
                }
              }
              console.log(this.studentInfo.length);
              console.log(this.studentOptions.length);
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getAnswers(index, exerciseId, studentId) {
      this.$http
        .get(
          "http://localhost:8080/question/findOneAnswer?exerciseId=" +
            exerciseId +
            "&studentId=1",
          // + studentId
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let answer = JSON.parse(response.bodyText);
              if (answer.state === 1) {
                this.studentInfo[index].answer.push({
                  id: answer.data.id,
                  content: answer.data.studentAnswer
                });
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    }
  },
  created() {
    this.chapterID = this.$route.query.chapterID;
    this.classID = this.$route.query.classID;
    //this.getStudentInfo();
    this.getExercises();
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
  margin-left: 40%;
  font-weight: 450;
  letter-spacing: 1px;
}

.grade {
  margin-top: 13px;
  font-size: 14px;
  letter-spacing: 1px;
  color: #292929;
  font-weight: 450;
  margin-left: 20px;
}

.question {
  padding: 15px 40px 15px 40px;
}

.question .notice {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.8px;
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
  background-repeat: no-repeat; /*背景图片不重复*/
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
  margin-top: 1.5px;
  color: #292929;
  font-size: 16px;
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
  height: 680px;
  position: relative;
}

.submit-button {
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}
</style>
