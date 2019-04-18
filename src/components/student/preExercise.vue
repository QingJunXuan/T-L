<template>
  <div style="margin:0 auto;width:700px">
    <div>
      <h5 align="start">
        总分：{{totalPoint}} 分
        <span v-if="after">得分：{{totalScore}} 分</span>
      </h5>
      <el-form ref="answer" :model="answer" v-show="before">
        <!-- 单选题 -->
        <h4 align="start">单选题</h4>
        <div
          style="margin-top:15px;font-size:14px"
          align="start"
          v-for="(item,index) in single"
          :key="index"
        >
          <p
            style="margin-left:5px"
          >{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</p>
          <el-form-item style="margin-top:10px;margin-left:10px;padding-bottom:10px">
            <el-radio-group v-model="answer[index]">
              <el-radio
                v-for="i in item.exerciseChoiceList.length"
                :key="i"
                :value="i - 1"
                :label="i - 1"
              >{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 多选题 -->
        <h4 align="start">多选题</h4>
        <div
          style="margin-top:15px;font-size:14px"
          align="start"
          v-for="(item,index) in multiple"
          :key="index"
        >
          <p
            style="margin-left:5px"
          >{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</p>
          <el-form-item style="margin-left: 10px">
            <el-checkbox-group v-model="answer[index+this.singleLength]">
              <el-checkbox
                v-for="i in item.exerciseChoiceList.length"
                :key="i"
                :value="i - 1"
                :label="i - 1"
              >{{String.fromCharCode(i+64)}}{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('answer')" size="mini" round>提交</el-button>
        </el-form-item>
      </el-form>

      <div v-show="after">
        <!-- 单选题 -->
        <h4 align="start">单选题</h4>
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px"
          align="start"
          v-for="(item,index) in single"
          :key="index"
        >
          <p style="margin-left:5px">
            {{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）
            <span
              style="font-size:12px;color:rgb(100,100,100)"
            >
              你的选择：
              <span style="color:red;">{{String.fromCharCode(answer[index]+65)}}&nbsp;&nbsp;</span>
            </span>
            <span style="font-size:12px;color:rgb(100,100,100)" v-if="afterRate">
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
            v-if="afterRate"
          >{{item.exercise.exerciseAnalysis}}</div>
        </div>
        <!-- 多选题 -->
        <h4 align="start">多选题</h4>
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px"
          align="start"
          v-for="(item,index) in multiple"
          :key="index"
        >
          <p style="margin-left:5px">
            {{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）
            <span
              style="font-size:12px;color:rgb(100,100,100)"
            >
              你的选择：
              <!-- ======================================================== -->
              <span
                style="color:red;"
              >{{String.fromCharCode(answer[index+this.singleLength]+65)}}&nbsp;&nbsp;</span>
            </span>
            <span style="font-size:12px;color:rgb(100,100,100)" v-if="afterRate">
              得分：
              <span style="color:red;">{{score[index+this.singleLength]}}</span> 分
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
            v-if="afterRate"
          >解析：{{item.exercise.exerciseAnalysis}}</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
//import Axios from "axios";
export default {
  data() {
    return {
      before: true,
      after: false,
      beforeRate: true,
      afterRate: false,
      scored: false,
      type: 0,
      rate: 0,
      answer: {},
      score: {
        0: 5,
        1: 5,
        2: 0,
        3: 0,
        4:[0,1],
      },
      singleLength: 0,
      multipleLength: 0,
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      single: [],
      multiple: [],
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
        }
      ]
    };
  },
  /* create() {
    //判断当前页习题是否已作答，是否超时未作答
    var sid = this.$route.query.sid + 1;
    this.$axios.get("/api/question/view", {
      params: {
        chapterId: sid,
        type: "preview"
      }.then(resp => {
        this.exercises = resp.data;
        //计算总分

        //single/multiple-length 初始化
        this.single = this.exercises.filter(function(currentValue){
            if(currentValue.exercise.exerciseType==1)
            return currentValue
        })
        this.multiple = this.exercises.filter(function(currentValue){
            if(currentValue.exercise.exerciseType==2)
            return currentValue
        })
        this.singleLength=this.single.length
        this.multipleLength=this.multiple.length
      })
    });
  }, */
  methods: {
    submitForm(formname) {
      //var answerLength = this.answer.length;
      if (this.answer.length == this.exercises.length) {
        console.log(this.answer);
        this.before = false;
        this.after = true;
        //对比正确答案确定   客观题“你的答案”和“得分”
        //计算answer.length判断是否完成题目
        
        //调接口，获取得分
        for (var i = 0; i < this.singleLength; i++) {
          var code = String.fromCharCode(this.answer[i] + 65);
          if (code == this.single.exercise.exerciseAnswer)
            this.score[i] = this.single.exercise.exercisePoint;
          else this.score[i] = 0;
        }
        for (var i = 0; i < this.multipleLength; i++) {
          ///////////////
          this.score[i+this.singleLength].sort
        }
      }else{
        alert('有习题未完成')
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

