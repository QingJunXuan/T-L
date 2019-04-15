<template>
  <el-container>
    <el-main>
      <div class="main">
        <el-row style="margin-bottom: 20px">
          <el-col align="left" :span="12">
            <el-button @click="goBack">
              <i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回
            </el-button>
          </el-col>
          <el-col align="right" :span="12">
            <el-select v-model="index" placeholder="跳转学生">
              <el-option
                v-for="item in studentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-card>
          <div slot="header">
            <span>
              <el-button
                circle
                style="border-color: #fff"
                @click="index--"
                :class="index === 0? 'buttonHid' : ''"
              >
                <i class="el-icon-arrow-left"></i>
              </el-button>
            </span>
            <span style="font-weight: bold">{{studentInfo[index].id}} {{studentInfo[index].name}}</span>
            <span>
              <el-button
                circle
                style="border-color: #fff"
                @click="index++"
                :class="index === studentInfo.length - 1? 'buttonHid' : ''"
              >
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </span>
          </div>
          <div>总成绩：{{totalScore[index]}}</div>
          <div v-for="i in question.length" :key="i" align="start" class="question">
            <div>{{i}}.{{question[i - 1].content}}({{question[i-1].score}}分)</div>
            <div class="answer">答案：{{studentInfo[index].answer[i - 1]}}</div>
            <div style="margin-top: 15px">
              <span>得分</span>
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
        </el-card>
        <el-row style="margin-top: 20px">
          <el-button>保存</el-button>
          <el-button>提交</el-button>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "exerciseMark",
  data() {
    return {
      // 题目信息
      question: [
        {
          content: "第1题的题目",
          score: "10"
        },
        {
          content: "第2题的题目",
          score: "10"
        },
        {
          content: "第3题的题目",
          score: "15"
        },
        {
          content: "第4题的题目",
          score: "15"
        }
      ],
      index: 0,
      // 学生信息和答案
      studentInfo: [
        {
          id: "1612341",
          name: "学生1",
          answer: ["第1题的答案", "第2题的答案", "第3题的答案", "第4题的答案"],
          score: [0, 0, 0, 0]
        },
        {
          id: "1612342",
          name: "学生2",
          answer: ["第1题的答案", "第2题的答案", "第3题的答案", "第4题的答案"],
          score: [0, 0, 0, 0]
        },
        {
          id: "1612343",
          name: "学生3",
          answer: ["第1题的答案", "第2题的答案", "第3题的答案", "第4题的答案"],
          score: [0, 0, 0, 0]
        }
      ],
      studentOptions: [
        {
          value: 0,
          label: "1612341 学生1"
        },
        {
          value: 1,
          label: "1612341 学生2"
        },
        {
          value: 2,
          label: "1612341 学生3"
        }
      ],
      submitLoading: false,
      questionLoading: false,
      studentLoading: false,
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
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    }
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

.question {
  font-size: 15px;
  padding: 15px 30px 15px 30px;
}

.answer {
  background-color: #fcfcfc;
  min-height: 80px;
  padding: 10px 10px 10px 10px;
  margin-top: 15px;
}
</style>
