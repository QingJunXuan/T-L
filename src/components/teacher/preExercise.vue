<template>
<div>
  <div style="margin:0 auto;width:700px"  v-if="havePre">
    <h4 align="start">
      客观题（<span>{{totalPoint}}</span>分）
      <span v-show="after">得分：{{totalScore}} 分</span>
    </h4>
    <el-form  v-show="before">
      <div
        style="margin-top:15px;font-size:14px"
        align="start"
        v-for="(item,index) in exercises"
        :key="index"
      >
        <p
          style="margin-left:5px"
        >{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</p>
        <!-- 单选 -->
        <el-form-item
          style="margin-top:10px;margin-left:10px;padding-bottom:10px"
          v-if="item.exercise.exerciseType===1"
        >
          <el-radio-group>
            <el-radio
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              :value="i - 1"
              :label="i - 1"
            >{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item style="margin-left: 10px" v-else-if="item.exercise.exerciseType===2">
          <el-checkbox-group>
            <el-checkbox
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              :value="i - 1"
              :label="i - 1"
            >{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
         <!-- 主观 -->
         <el-form-item style="margin-left: 10px" v-else-if="item.exercise.exerciseType===3">
          <el-input type="textarea" :rows="4" placeholder="请输入答案"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('answer')" size="mini" disabled>确认提交</el-button>
      </el-form-item>
    </el-form>
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
      tid:0,
      havePre:false,
      before: true,
      after: false,
      type: 0,
      rate: 0,
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
   //this.test()
  },
  mounted(){
   this.getPre()
  },
  methods: {
     getPre() {
      const tid = this.$route.query.tpreid;
      this.tid=tid
      axios
        .get("/api/question/view", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterId: this.tid,
            type: "preview"
          }
        })
        .then(resp => {
          console.log("pre", resp.data);
          this.exercises = resp.data.data;
          var length = this.exercises.length
      if(length!=0){
        this.havePre=true
      }
          this.test()
        })
        .catch(err => {
          console.log(err);
        });
    },
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
