<template>
  <div>
    <div style="margin:0 auto;width:700px" v-if="haveRev">
      <h4 align="start">
        作业题（
        <span>{{totalPoint}}</span>分）
        <span v-show="isRated" style="font-size:14px">
          客观题得分:
          <span style="color:red;">{{totalScore}}</span> 分
        </span>
        <span v-show="isScored" style="font-size:14px">
          总得分:
          <span style="color:red;">{{totalScore}}</span> 分
        </span>
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
      { required: true, message: '请选择'},
      { type: 'string', message: '请选择'}
    ]"
          >
            <el-input type="textarea" :rows="4" placeholder="请输入答案" v-model="answer[index]"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('answer')" size="mini">保 存</el-button>
        </el-form-item>
      </el-form>
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
            <span  style="font-size:12px;color:rgb(100,100,100)"
            >答案：<span style="color:red;">
              {{item.exercise.exerciseAnswer}}&nbsp;&nbsp;
            </span>
            </span>
              <span style="font-size:12px;color:rgb(100,100,100)">
                你的选择:
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
              <span style="font-size:12px;color:rgb(100,100,100)" v-show="isRated">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
            <span v-else-if="item.exercise.exerciseType===3 && isScored==true">
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
            v-show="isRated"
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：{{item.exercise.exerciseAnalysis}}</div>
        </div>
      </div>
      <div v-if="isRated==false" style="background-color:#545c64;height:110px">
        <p style="padding-top:10px;color:#fff">
          评分
          <span style="font-size:12px;">（评分后方可提交作业）</span>
        </p>
        <el-rate
          v-model="rate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          :allow-half="half"
          style="margin-top:-5px;padding-bottom:10px"
        ></el-rate>
        <el-button size="mini" type="primary" @click="submit" round>提 交</el-button>
      </div>
      <div v-else style="background-color:#545c64;height:90px">
        <p style="padding-top:10px;color:#fff">评分</p>

        <el-rate v-model="rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
      </div>
    </div>
    <div v-else>
      <h3>老师尚未发布习题</h3>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      haveRev: false,
      half: true,
      before: true,
      after: false,
      isScored: false,
      isRated: false,
      //beforeRate: true,
      //afterRate: false,
      type: 0,
      rate: 0,
      sid: 0,
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
      exercises: []
      /*  exercises: [
        {
          exercise: {
            exerciseId: 1,
            chapterId: 1,
            exerciseType: 4,
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
            exerciseType: 4,
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
            exerciseId: 3,
            chapterId: 1,
            exerciseType: 4,
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
            exerciseId: 4,
            chapterId: 1,
            exerciseType: 5,
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
        },
        {
          exercise: {
            exerciseId: 4,
            chapterId: 1,
            exerciseType: 6,
            exerciseNumber: 1,
            exerciseContent: "主观题测试",
            exerciseAnswer: "aaaaa",
            exerciseAnalysis: "因为。。。",
            exercisePoint: 5
          }
        }
      ] */
    };
  },
  create() {
    /*  var sid = this.$route.query.sid + 1;
    this.$axios.get("/api/question/view", {
      params: {
        chapterId: sid,
        type: "preview"
      }.then(resp => {
        this.exercises = resp.data;
      })
    }); */
    //进入界面确定界面状态  before after isScored 总得分
  },
  /*  beforeMount(){
    this.getRev()
  }, */
  mounted() {
    this.getRev();
    //this.test();
  },
  methods: {
    test() {
      for (var i = 0; i < this.exercises.length; i++) {
        this.totalPoint += this.exercises[i].exercise.exercisePoint;
      }
      console.log(this.totalPoint, "totalPoint");
    },
    getRev() {
      const sid = this.$route.query.srevid;
      this.sid = sid;
      axios
        .get("/api/question/view", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dGgiLCJleHAiOjE1NTY0NTI0MTEsImlhdCI6MTU1NTg0NzYxMX0.fv3xdxZ3z4nfVLBvFT3ruHFBCJJ5rLFSsdluahhTnekuy2VSDizqRdbstA1kgIDPJycPhi4OSD3O0fRpMQThNg"
          },
          params: {
            chapterId: sid,
            type: "preview"
          }
        })
        .then(resp => {
          console.log("rev", resp.data);
          this.exercises = resp.data.data;
          var length = this.exercises.length;
          if (length != 0) {
            this.haveRev = true;
          }

          this.test();
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formname) {
      var length = Object.keys(this.answer).length;
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
              var try1 = array.join("");
              var isEqual = (try1 === ansArray);

              if (isEqual) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else{
              this.score[i] = 0;
            }
          }
          this.before = false;
          this.after = true;
        } else {
          alert("有习题未完成");
          //break;
        }

        console.log(this.score, "score");
      });
       for (var i = 0; i < this.exercises.length; i++) {
        //total += this.score[i];
        this.totalScore += this.score[i];
      }
      //var total = 0
    },
    submit() {
      if (this.before == true) {
        alert("请先完成题目");
      } else if (this.rate == 0) {
        alert("评分不可为0");
      } else {
        this.isRated = true;
        axios
          .post(
            "/api/question/answerAll",
            {
              answers: this.answer,
              studentId: 1, //存在本地
              chapterId: this.chapterId,
              type: "review",
              comment:"test",
              rate: this.rate
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dGgiLCJleHAiOjE1NTY0NTI0MTEsImlhdCI6MTU1NTg0NzYxMX0.fv3xdxZ3z4nfVLBvFT3ruHFBCJJ5rLFSsdluahhTnekuy2VSDizqRdbstA1kgIDPJycPhi4OSD3O0fRpMQThNg"
              }
            }
          )
          .then(resp => {
            console.log(resp.data);
            console.log("rev submit success");
          })
          .catch(err => {
            console.log(err);
          });
      }
      //提交给后端
    }
  }
};
</script>
<style>
.test {
  color: #747a81;
}
</style>
