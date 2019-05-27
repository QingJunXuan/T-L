<template>
  <div>
    <div style="margin:0 auto;width:778px" v-if="havePre">
      <h3 align="start">
        客观题（
        <span>{{totalPoint}}</span>分）
        <span v-show="after">得分：{{totalScore}} 分</span>
      </h3>
      <el-form ref="answer" :model="answer" v-show="before">
        <div
          style="margin-top:15px;font-size:14px"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <p style="margin-left:5px">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. <span v-if="item.exercise.exerciseType===2">（多选）</span>（{{item.exercise.exercisePoint}}分）{{item.exercise.exerciseContent}}
            </pre>
          </p>
          <!-- 单选 -->
          <el-form-item
            style="margin-top:10px;margin-left:10px;padding-bottom:10px"
            v-if="item.exercise.exerciseType===1"
            :prop="index.toString()"
            :rules="[
      { required: true, message: '请选择'},
      { type: 'number', message: '请选择'}
    ]"
          >
            <el-radio-group v-model="answer[index.toString()]">
              <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              style="margin-top: 10px"
              >
                <el-radio :value="i - 1" :label="i - 1">{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <!-- 多选 -->
          <el-form-item
            style="margin-left: 10px"
            v-else-if="item.exercise.exerciseType===2"
            :prop="index.toString()"
            :rules="[
      { required: true, message: '请选择'},
    ]"
          >
            <el-checkbox-group v-model="answer[index.toString()]">
              <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              >
                <el-checkbox :value="i - 1" :label="i - 1">{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('answer')" size="mini">确认提交</el-button>
        </el-form-item>
      </el-form>
      <!-- 提交后 -->
      <div v-show="after">
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</pre>
          <span v-if="item.exercise.exerciseType===1 || item.exercise.exerciseType ===2">
            <span
              v-for="j in item.exerciseChoiceList.length"
              :key="j"
              :value="j - 1"
              :label="j - 1"
              style="margin-left:10px"
            >
              <span :class="setAnswerClass(item.exercise.exerciseAnswer, String.fromCharCode(j+64))">{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>
            </span>
          </span>
          <p style="margin-left:5px">
            <span
              v-if="item.exercise.exerciseType===1 || item.exercise.exerciseType ===2"
            >
              <span style="font-size:12px;color:rgb(100,100,100)">
                你的选择：
                <span
                  style="color:red;"
                  v-if="item.exercise.exerciseType===1"
                >{{String.fromCharCode(answer[index]+65)}}&nbsp;&nbsp;</span>
                <span style="color:red;" v-else-if="item.exercise.exerciseType===2">
                  <span
                    v-for="(num,index) in answer[index]"
                    :key="index"
                  >{{String.fromCharCode(num+65)}}</span>
                </span>
              </span>
              <span style="font-size:12px;color:rgb(100,100,100)">
                得分：
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
          </p>
          <div
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：<pre style="white-space: pre-wrap; word-wrap: break-word;">{{item.exercise.exerciseAnalysis}}</pre></div>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>老师尚未发布习题</h3>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isScored: false,
      havePre: false,
      before: true,
      after: false,
      beforeRate: true,
      afterRate: false,
      sid: 0,
      type: 0,
      rate: 0,
      answer: {},
      score: {},
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: [],
      length: 1
    };
  },
  mounted() {
    this.getPre();
  },
  watch: {
    $route(to, from) {
      this.getPre();
    }
  },
  methods: {
    setAnswerClass(item, j) {
      if (item.indexOf(j) >= 0) return "answer";
      else return "";
    },
    getPre() {
      const sid = this.$route.query.spreid;
      this.sid = sid;
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: sid,
            type: "preview"
          }
        })
        .then(resp => {
          console.log("TCL: getPre -> resp", resp)
          if (resp.data.state == 1) {
            this.havePre = true;
            this.exercises = resp.data.data;
            this.setTotalPoint();
            this.setAnswer();
          }
        })
        
        .catch(err => {
          console.log(err);
        });
    },
    setAnswer() {
      var length = this.exercises.length;
      var temp = new Object();
      for (var i = 0; i < length; i++) {
        if (this.exercises[i].exercise.exerciseType == 1) {
          temp[i.toString()] = ''
        } else if (this.exercises[i].exercise.exerciseType == 2) {
          temp[i.toString()] = [];
        }
        this.score[i] = "";
      }
      this.answer=Object.assign({},temp)
    },
    setTotalPoint() {
      var count = 0;
      for (var i = 0; i < this.exercises.length; i++) {
        count += this.exercises[i].exercise.exercisePoint;
      }
      this.totalPoint = count;
    },
    submitForm(formname) {
      var length = Object.keys(this.answer).length;
      this.$refs[formname].validate(valid => {
        if (valid) {
          for (var i = 0; i < length; i++) {
            var type = typeof this.answer[i.toString()];
            if (type == "number") {
              var resp = String.fromCharCode(this.answer[i.toString()] + 65);
              var ans = this.exercises[i].exercise.exerciseAnswer;
              if (resp == ans) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else if (type == "object") {
              var respNum = this.answer[i.toString()].length;
              this.answer[i.toString()] = this.answer[i.toString()].sort();
              var array = new Array();
              for (var j = 0; j < respNum; j++) {
                array[j] = String.fromCharCode(this.answer[i.toString()][j] + 65);
              }

              var ansArray = this.exercises[i].exercise.exerciseAnswer;
              var ansNum = ansArray.length;
              var try2 = array.join("");
              var isEqual = (try2 === ansArray);

              if (isEqual) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else {
              this.score[i] = 0;
            }
          }

          var params = new URLSearchParams();
          params.append("answers", this.answer);
          params.append("studentId", localStorage.getItem("userID"));
          params.append("chapterId", this.sid);
          params.append("type", "preview");
          params.append("comment", 1);
          params.append("rate", 1);
          this.$axios
            .post("http://10.60.38.173:8765/question/answerAll", params, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(resp => {
              if (resp.data.state == 1) {
                this.before = false;
                this.after = true;
              }
            })
            .catch(err => {
              console.log(err);
            });
          //对比正确答案确定“得分”
        } else {
          alert("有习题未完成");
        }
      });

      for (var i = 0; i < this.exercises.length; i++) {
        this.totalScore += this.score[i];
      }
    }
  }
};
</script>
<style>
.test {
  color: #747a81;
}
.answer {
  color: red;
}
</style>
