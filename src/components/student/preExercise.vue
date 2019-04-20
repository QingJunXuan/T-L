<template>
  <div style="margin:0 auto;width:700px">
    <h4 align="start">
      客观题（<span>{{totalPoint}}</span>分）
      <span v-show="after">得分：{{totalScore}} 分</span>
    </h4>
    <el-form ref="answer" :model="answer" v-show="before">
      <div
        style="margin-top:15px;font-size:14px"
        align="start"
        v-for="(item,index) in exercises"
        :key="index"
      >
        <p
          style="margin-left:5px"
        >{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）<span v-if="item.exercise.exerciseType===2">（多选）</span></p>
        <el-form-item
          style="margin-top:10px;margin-left:10px;padding-bottom:10px"
          v-if="item.exercise.exerciseType===1"
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
        <el-form-item style="margin-left: 10px" v-else-if="item.exercise.exerciseType===2">
          <el-checkbox-group v-model="answer[index]">
            <el-checkbox
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              :value="i - 1"
              :label="i - 1"
            >{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('answer')" size="mini">确认提交</el-button>
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
            style="font-size:12px;color:rgb(100,100,100)"
          >
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
        </p>
        <span
          v-for="j in item.exerciseChoiceList.length"
          :key="j"
          :value="j - 1"
          :label="j - 1"
          style="margin-left:10px"
        >
          <span>{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>
        </span>
        <div
          style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
        >解析：{{item.exercise.exerciseAnalysis}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
export default {
  data() {
    return {
      before: true,
      after: false,
      beforeRate: true,
      afterRate: false,
      type: 0,
      rate: 0,
      answer: {
        0: "",
        1: "",
        2: "",
        3: []
      },
      score: {
        0: "",
        1: "",
        2: "",
        3: ""
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
        {
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
        },
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
   /*  var sid = this.$route.query.sid + 1;
    this.$axios.get("/api/question/view", {
      params: {
        chapterId: sid,
        type: "preview"
      }.then(resp => {
        this.exercises = resp.data;
      })
    }); */
   this.test()
  },
  mounted(){
   this.test()
  },
  methods: {
    test(){
       for(var i=0;i<this.exercises.length;i++){
        this.totalPoint += this.exercises[i].exercise.exercisePoint
      }
      console.log(this.totalPoint)
    },
    submitForm(formname) {
      var length = 0;
      for (var i in this.answer) {
        length++;
      }

      //var length=Object.getOwnPropertyNames(this.answer).length
      if (length == this.exercises.length) {
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
          } else {
            var respNum = this.answer[i].length;
            var array = [];
            for (var j = 0; j < respNum; j++) {
              array[j] = String.fromCharCode(this.answer[i][j] + 65);
            }
            var ansArray = this.exercises[i].exercise.exerciseAnswer;
            var ansNum = ansArray.length;
            var isEqual = array.sort().toString() === ansArray.toString();

            if (isEqual) {
              this.score[i] = this.exercises[i].exercise.exercisePoint;
            } else {
              this.score[i] = 0;
            }
          }
        }
        console.log(this.score, "score");

        this.before = false;
        this.after = true;
        //对比正确答案确定“得分”
      } else {
        alert("有习题未完成");
      }

      for(var i=0;i<this.exercises.length;i++){
        this.totalScore+=this.score[i]
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
