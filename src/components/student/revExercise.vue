<template>
  <div>
    <div style="margin:0 auto;width:700px" v-if="haveRev">
      <h3 align="start">
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
      </h3>
      <h4 align="start" style="color:rgb(150,150,150)" v-if="time!=null">截止时间：{{time}}</h4>
      <el-form ref="answer" :model="answer" v-show="before">
        <div
          style="margin-top:15px;font-size:14px"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <p style="margin-left:5px">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. （{{item.exercise.exercisePoint}}分）{{item.exercise.exerciseContent}}</pre>
            <span
              v-if="item.exercise.exerciseType===5"
            >（多选）</span>
          </p>
          <!-- 单选 -->
          <el-form-item
            style="margin-top:10px;margin-left:10px;padding-bottom:10px"
            v-if="item.exercise.exerciseType===4"
            :prop="index.toString()"
            :rules="[
      { required: true, message: '请选择'},
      { type: 'number', message: '请选择'}
    ]"
          >
            <el-radio-group v-model="answer[index]">
              <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              style="margin-top: 10px"
              >
                <el-radio :label="i - 1" :value="i - 1">{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <!-- 多选 -->
          <el-form-item
            style="margin-left: 10px"
            v-else-if="item.exercise.exerciseType===5"
            :prop="index.toString()"
            :rules="[
      { required: true, message: '请选择'},
    ]"
          >
            <el-checkbox-group v-model="answer[index]">
              <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              >
                <el-checkbox :value="i - 1" :label="i - 1">{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <!-- 主观 -->
          <el-form-item
            style="margin-left: 10px;"
            v-else-if="item.exercise.exerciseType===6"
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
          <el-button type="primary" @click="submitForm('answer')" size="mini" :disabled="isOver">保 存</el-button>
          <p style="margin-top:0">*保存后不可更改*</p>
        </el-form-item>
      </el-form>
      <div v-show="after">
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px;"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. （{{item.exercise.exercisePoint}}分）{{item.exercise.exerciseContent}}</pre>
          <span v-if="item.exercise.exerciseType===4 || item.exercise.exerciseType ===5">
            <span
              v-for="j in item.exerciseChoiceList.length"
              :key="j"
              :value="j - 1"
              :label="j - 1"
              style="margin-left:10px"
            >
              <span v-if="isRated==false">{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>              
              <span :class="setAnswerClass(item.exercise.exerciseAnswer, String.fromCharCode(j+64))" v-else>{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>
            </span>
          </span>
            <span v-else-if="item.exercise.exerciseType===6 && isScored==true">
              <span style="font-size:14px;color:rgb(100,100,100);font-weight:bold">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
          <div
            v-else-if="item.exercise.exerciseType===6"
            style="padding:10px;background-color:#ddd;height:50px"
          >你的答案：{{answer[index]}}</div>
          <p style="margin-left:5px;">
            <span
              v-if="item.exercise.exerciseType===4 || item.exercise.exerciseType ===5"
            >
              <span style="font-size:14px;color:rgb(100,100,100);font-weight:bold">
                你的选择:
                <span
                  style="color:red;"
                  v-if="item.exercise.exerciseType===4"
                >{{String.fromCharCode(answer[index]+65)}}&nbsp;&nbsp;</span>
                <span style="color:red;" v-else-if="item.exercise.exerciseType===5">
                  <span
                    v-for="(num,index) in answer[index]"
                    :key="index"
                  >{{String.fromCharCode(num+65)}}</span>
                </span>
              </span>
              <span style="font-size:14px;color:rgb(100,100,100);font-weight:bold" v-show="isRated">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
          </p>
          <div
            v-show="isRated"
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：<pre style="white-space: pre-wrap; word-wrap: break-word;">{{item.exercise.exerciseAnalysis}}</pre></div>
        </div>
      </div>
      <div v-if="isRated==false" style="border:1px solid #ddd;background-color:#fff;height:250px;border-radius:5px">
        <p style="padding-top:10px;color:#000">
          评分
          <span style="font-size:12px;">（评分后方可提交作业）</span>
        </p>
        <el-rate
          v-model="rate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          style="margin-top:-5px;padding-bottom:10px"
        ></el-rate>
        <el-input type="textarea" placeholder="输入评价" v-model="comment" rows="4" resize="none" style="width:480px;padding-top:10px" maxlength="100"></el-input>
        <p><el-button size="mini" type="primary" @click="submit" round :disabled="isOver">提 交</el-button></p>
      </div>
      <div v-else style="background-color:#545c64;height:200px;border-radius:5px">
        <p style="padding-top:10px;color:#fff">评分</p>
        <el-rate v-model="rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
        <p style="color:#fff;width:80%;margin:auto;padding-top:10px">{{comment}}</p>
      </div>
    </div>
    <div v-else>
      <h3>老师尚未发布习题</h3>
    </div>
  </div>
</template>
<script>
import store from "../../store/store.js";
export default {
  data() {
    return {
      isOver:false,//超出答题时间
      time: null,
      haveRev: false,
      before: true,
      after: false,
      isScored: false,
      isRated: false,
      type: 0,
      rate: 0,
      comment: "",
      sid: 0,
      answer: {},
      score: {},
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: []
    };
  },
  mounted() {
    this.getRev();
    this.setTime();
  },
  watch: {
    $route(to, from) {
      this.initValue();
      this.getRev();
      this.setTime();
    }
  },
  methods: {
    initValue(){
      this.rate = 0
      this.comment=''
      this.totalPoint=0;
      this.score={};
      this.answer={};
    },
    setAnswerClass(item, j) {
      if (item.indexOf(j) >= 0) return "answer";
      else return "";
    },
    setTime() {
      const index = this.$route.query.index;
      var catalog = store.state.catalog;
      if(catalog.length!=0 ){
      this.totalPoint = catalog[index].exerciseTotal_2
      }
      if (catalog.length != 0 && catalog[index].exerciseDeadline_2 != null) {
        this.time = catalog[index].exerciseDeadline_2;
      }
    },
    setTotalPoint() {
      for (var i = 0; i < this.exercises.length; i++) {
        this.totalPoint += this.exercises[i].exercise.exercisePoint;
      }
    },
    getRev() {
      const sid = this.$route.query.srevid;
      this.sid = sid;
      //判断是否发布
      const index = this.$route.query.index;
      var catalog = store.state.catalog;
      if(catalog.length!=0 && catalog[index].exerciseVisible_2==true)
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: sid,
            type: "review"
          }
        })
        .then(resp => {
          //1->有且发布；2->有但未发布；3->无；->超出截止时间未做题
          if (resp.data.state == 1) {
            this.exercises = resp.data.data;
            var length = this.exercises.length;
            if (length != 0) {
              this.haveRev = true;
              //this.setTotalPoint();
              this.setAnswer();
            }
          }
          else if (resp.data.state == 4) {
            this.exercises = resp.data.data;
            var length = this.exercises.length;
            if (length != 0) {
              this.haveRev = true;
              this.isOver=true
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setAnswer() {
      var length = this.exercises.length;
      var temp=new Object()
      for (var i = 0; i < length; i++) {
        if (this.exercises[i].exercise.exerciseType == 4) {
          temp[i.toString()] = null
        } else if (this.exercises[i].exercise.exerciseType == 5) {
          temp[i.toString()] = [];
        } else if (this.exercises[i].exercise.exerciseType == 6) {
          temp[i.toString()] = "";          
        }
        this.score[i] = "";
      }
      this.answer=Object.assign({},temp)
    },
    submitForm(formname) {
      //暂存
      var length = Object.keys(this.answer).length;
      this.$refs[formname].validate(valid => {
        if (valid) {
          for (var i = 0; i < length; i++) {
            var type = typeof this.answer[i];
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
              var isEqual = try1 === ansArray;

              if (isEqual) {
                this.score[i] = this.exercises[i].exercise.exercisePoint;
              } else {
                this.score[i] = 0;
              }
            } else {
              this.score[i] = 0;
            }
          }
          this.before = false;
          this.after = true;
        } else {
          alert("有习题未完成");
        }
      });
      for (var i = 0; i < this.exercises.length; i++) {
        this.totalScore += this.score[i];
      }
    },
    submit() {
      //提交
      if (this.before == true) {
        alert("请先完成题目");//表单判断
      } else if (this.rate == 0 || this.comment == '') {
        alert("请填写评分及评价");
      } else {
        this.isRated = true;
        var params = new URLSearchParams();
        params.append("answers", this.answer);
        params.append("studentId", localStorage.getItem("userID"));
        params.append("chapterId", this.sid);
        params.append("type", "review");
        params.append("comment", this.comment);
        params.append("rate", this.rate);
        this.$axios
          .post("http://10.60.38.173:8765/question/answerAll", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })
          .then(resp => {
            if (resp.data.state == 1) {
              this.$message("提交成功");
            }
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
.answer {
  color: red;
}
</style>
