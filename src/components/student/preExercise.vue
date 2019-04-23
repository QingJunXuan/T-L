<template>
  <div>
    <div style="margin:0 auto;width:700px" v-if="havePre">
      <h4 align="start">
        客观题（
        <span>{{totalPoint}}</span>分）
        <span v-show="after">得分：{{totalScore}} 分</span>
      </h4>
      <el-form ref="answer" :model="answer" v-show="before">
        <div
          style="margin-top:15px;font-size:14px"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <p style="margin-left:5px">
            {{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）
            <span
              v-if="item.exercise.exerciseType===2"
            >（多选）</span>
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
            <el-radio-group v-model="answer[index]">
              <el-radio
                v-for="i in item.exerciseChoiceList.length"
                :key="i"
                :value="i - 1"
                :label="i - 1"
              >{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
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
            <el-checkbox-group v-model="answer[index]">
              <el-checkbox
                v-for="i in item.exerciseChoiceList.length"
                :key="i"
                :value="i - 1"
                :label="i - 1"
              >{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 主观 -->
          <el-form-item
            style="margin-left: 10px"
            v-else-if="item.exercise.exerciseType===3"
            :prop="index.toString()"
            :rules="[
      { required: true, message: '请作答'},
      { type: 'string', message: '请作答'}
    ]"
          >
            <el-input type="textarea" :rows="4" placeholder="请输入答案" v-model="answer[index]"></el-input>
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
          <p style="margin-left:5px">
            {{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）
            <span
              v-if="item.exercise.exerciseType===1 || item.exercise.exerciseType ===2"
            >
              <span style="font-size:12px;color:rgb(100,100,100)">
                答案：
                <span style="color:red;">{{item.exercise.exerciseAnswer}}&nbsp;&nbsp;</span>
              </span>
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
            <span v-else-if="item.exercise.exerciseType===3 && isScored===true">
              <span style="font-size:12px;color:rgb(100,100,100)">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
          </p>
          <span v-if="item.exercise.exerciseType===1 || item.exercise.exerciseType ===2">
            <span
              v-for="j in item.exerciseChoiceList.length"
              :key="j"
              :value="j - 1"
              :label="j - 1"
              style="margin-left:10px"
            >
              <span>{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>
            </span>
          </span>
          <div
            v-else-if="item.exercise.exerciseType===3"
            style="padding:10px;background-color:#ddd;height:50px"
          >你的答案：{{answer[index]}}</div>
          <div
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：{{item.exercise.exerciseAnalysis}}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>老师尚未发布习题</h3>
    </div>
  </div>
</template>
<script>
import axios from "axios";
//import qs from 'qs'
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
      answer: {
        0: "",
        1: [],
        2: ""
      },
      score: {
        0: "",
        1: "",
        2: ""
      },
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: [
        {
          exercise: {
            exerciseId: 1,
            chapterId: 1,
            exerciseType: 1,
            exerciseNumber: 1,
            exerciseContent: "选出下列正确的一项",
            exerciseAnswer: "A",
            exerciseAnalysis: "因为。。。",
            exercisePoint: 5
          },
          exerciseChoiceList: [
            {
              id: 1,
              exerciseId: 4,
              exerciceChoiceId: "A",
              choice: "IDEA是JAVA编译器"
            },
            {
              id: 2,
              exerciseId: 4,
              exerciceChoiceId: "B",
              choice: "default"
            },
            {
              id: 3,
              exerciseId: 4,
              exerciceChoiceId: "C",
              choice: "default"
            },
            {
              id: 4,
              exerciseId: 4,
              exerciceChoiceId: "D",
              choice: "default"
            }
          ]
        },
        {
          exercise: {
            exerciseId: 2,
            chapterId: 1,
            exerciseType: 1,
            exerciseNumber: 1,
            exerciseContent: "选出下列正确的一项",
            exerciseAnswer: "A",
            exerciseAnalysis: "因为。。。",
            exercisePoint: 5
          },
          exerciseChoiceList: [
            {
              id: 1,
              exerciseId: 4,
              exerciceChoiceId: "A",
              choice: "IDEA是JAVA编译器"
            },
            {
              id: 2,
              exerciseId: 4,
              exerciceChoiceId: "B",
              choice: "default"
            },
            {
              id: 3,
              exerciseId: 4,
              exerciceChoiceId: "C",
              choice: "default"
            },
            {
              id: 4,
              exerciseId: 4,
              exerciceChoiceId: "D",
              choice: "default"
            }
          ]
        },
        /*  {
          exercise: {
            exerciseId: 3,
            chapterId: 1,
            exerciseType: 1,
            exerciseNumber: 1,
            exerciseContent: "选出下列正确的一项",
            exerciseAnswer: "A",
            exerciseAnalysis: "因为。。。",
            exercisePoint: 5
          },
          exerciseChoiceList: [
            {
              id: 1,
              exerciseId: 4,
              exerciceChoiceId: "A",
              choice: "IDEA是JAVA编译器"
            },
            {
              id: 2,
              exerciseId: 4,
              exerciceChoiceId: "B",
              choice: "default"
            },
            {
              id: 3,
              exerciseId: 4,
              exerciceChoiceId: "C",
              choice: "default"
            },
            {
              id: 4,
              exerciseId: 4,
              exerciceChoiceId: "D",
              choice: "default"
            }
          ]
        }, */
        {
          exercise: {
            exerciseId: 4,
            chapterId: 1,
            exerciseType: 2,
            exerciseNumber: 1,
            exerciseContent: "选出下列正确的一项",
            exerciseAnswer: ["A", "B"],
            exerciseAnalysis: "因为。。。",
            exercisePoint: 5
          },
          exerciseChoiceList: [
            {
              id: 1,
              exerciseId: 4,
              exerciceChoiceId: "A",
              choice: "IDEA是JAVA编译器"
            },
            {
              id: 2,
              exerciseId: 4,
              exerciceChoiceId: "B",
              choice: "default"
            },
            {
              id: 3,
              exerciseId: 4,
              exerciceChoiceId: "C",
              choice: "default"
            },
            {
              id: 4,
              exerciseId: 4,
              exerciceChoiceId: "D",
              choice: "default"
            }
          ]
        }
      ]
    };
  },
  create() {
    //this.getPre();
    //this.test()
  },
  mounted() {
    this.getPre();
    //this.test();
  } /* 
  updated(){
    //this.test()
  }, */,
  watch: {
    $route(to, from) {
      //对路由变化做出响应
      console.log("有变化了"); //测试点击路由的反应
      //页面需要重新加载的地方
      this.getPre();
    }
  },
  methods: {
    getPre() {
      const sid = this.$route.query.spreid;
      this.sid = sid;
      axios
        .get("/api/question/view", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: this.sid,
            type: "preview"
          }
        })
        .then(resp => {
          console.log("pre", resp.data);
          if (resp.data.state == 1) {
            this.exercises = resp.data.data;
            var length = this.exercises.length;

            if (length != 0) {
              this.havePre = true;
            }
            this.test();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    test() {
      for (var i = 0; i < this.exercises.length; i++) {
        count += this.exercises[i].exercise.exercisePoint;

        if (this.exercises[i].exercise.exerciseType == 1) {
          this.answer[i] = "";
        } else if (this.exercises[i].exercise.exerciseType == 2) {
          this.answer[i] = [];
        } else {
          this.answer[i] = "";
        }
      }
      this.totalPoint = count;
      console.log(this.totalPoint);
      console.log(this.answer, "answerinit");
    },
    submitForm(formname) {
      var length = Object.keys(this.answer).length;
      console.log(this.answer);
      this.$refs[formname].validate(valid => {
        if (valid) {
          for (var i = 0; i < length; i++) {
            var type = typeof this.answer[i];
            console.log(type, "type");
            if (type == "number") {
              var resp = String.fromCharCode(this.answer[i] + 65);
              var ans = this.exercises[i].exercise.exerciseAnswer;
              if (resp == ans) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else if (type == "object") {
              var respNum = this.answer[i].length;
              this.answer[i] = this.answer[i].sort();
              var array = new Array();
              for (var j = 0; j < respNum; j++) {
                array[j] = String.fromCharCode(this.answer[i][j] + 65);
              }

              var ansArray = this.exercises[i].exercise.exerciseAnswer;
              var ansNum = ansArray.length;
              var try2 = array.join("");
              var isEqual = try2 === ansArray;

              if (isEqual) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else {
              this.score[i] = 0;
            }
          }
          console.log(this.score, "score");
          /* 
        this.before = false;
        this.after = true;
 */
          ///传后端

          var params = new URLSearchParams();
          params.append("answers", this.answer);
          params.append("studentId", 1);
          params.append("chapterId", this.sid);
          params.append("type", "preview");
          params.append("comment", 1);
          params.append("rate", 1);
          axios
            .post("/api/question/answerAll", params, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(resp => {
              console.log(resp.data);
              console.log("pre submit success");
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
</style>
