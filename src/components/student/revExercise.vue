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
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</pre>
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
            v-else-if="item.exercise.exerciseType===5"
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
          <el-button type="primary" @click="submitForm('answer')" size="mini">保 存</el-button>
        </el-form-item>
      </el-form>
      <div v-show="after">
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px;"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <p style="margin-left:5px;">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</pre>
            <span
              v-if="item.exercise.exerciseType===4 || item.exercise.exerciseType ===5"
            >
           <!--  <span  style="font-size:12px;color:rgb(100,100,100)"
            >答案：<span style="color:red;">
              {{item.exercise.exerciseAnswer}}&nbsp;&nbsp;
            </span>
            </span> -->
              <span style="font-size:12px;color:rgb(100,100,100)">
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
              <span style="font-size:12px;color:rgb(100,100,100)" v-show="isRated">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
            <span v-else-if="item.exercise.exerciseType===6 && isScored==true">
              <span style="font-size:12px;color:rgb(100,100,100)">
                得分:
                <span style="color:red;">{{score[index]}}</span> 分
              </span>
            </span>
          </p>
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
          <div
            v-else-if="item.exercise.exerciseType===6"
            style="padding:10px;background-color:#ddd;height:50px"
          >你的答案：{{answer[index]}}</div>

          <div
            v-show="isRated"
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：<pre style="white-space: pre-wrap; word-wrap: break-word;">{{item.exercise.exerciseAnalysis}}</pre></div>
        </div>
      </div>
      <div v-if="isRated==false" style="border:1px solid #ddd;height:200px">
        <p style="padding-top:10px;color:#000">
          评分
          <span style="font-size:12px;">（评分后方可提交作业）</span>
        </p>
        <el-rate
          v-model="rate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          :allow-half="half"
          style="margin-top:-5px;padding-bottom:10px"
        ></el-rate>
        <el-input type="textarea" placeholder="输入评价" v-model="comment" rows="2" resize="none" style="width:400px;padding-top:10px"></el-input>
        <p><el-button size="mini" type="primary" @click="submit" round>提 交</el-button></p>
      </div>
      <div v-else style="background-color:#545c64;height:120px">
        <p style="padding-top:10px;color:#fff">评分</p>
        <el-rate v-model="rate" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
        <p style="color:#fff">{{comment}}</p>
      </div>
    </div>
    <div v-else>
      <h3>老师尚未发布习题</h3>
    </div>
  </div>
</template>
<script>
import store from '../../store/store.js'
export default {
  data() {
    return {
      time:null,
      haveRev: false,
      half: true,
      before: true,
      after: false,
      isScored: false,
      isRated: false,
      type: 0,
      rate: 0,
      comment:'',
      sid: 0,
      answer: [],
      score: {},
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: [],
    };
  },
  create() {},
  mounted() {
    this.getRev();
    this.setTime();
    this.setAnswer();
  },
  watch: {
    $route(to, from) {
      this.getRev();
      this.setTime();
      this.setAnswer();
    }
  },
  methods: {
    setAnswerClass(item, j) {
      if (item.indexOf(j) >= 0 ) return "answer";
      else return "";
    },
    setTime(){
      const index =this.$route.query.index
      var catalog = store.state.catalog
      if(catalog.length!=0 && catalog[index].exerciseDeadline_2!=null){
      this.time = catalog[index].exerciseDeadline_2
      }
    },
    getTime(){
      this.$axios
        .get("http://10.60.38.173:8765/getChapterByID", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: this.sid
          }
        })
        .then(resp => {
          console.log("pre", resp.data);
          if (resp.data.state == 1) {
            console.log(resp.data.data,"time")
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    setTotalPoint() {
      for (var i = 0; i < this.exercises.length; i++) {
        this.totalPoint += this.exercises[i].exercise.exercisePoint;
      }
    },
    getRev() {
      const sid = this.$route.query.srevid;
      this.sid = sid;
      const index =this.$route.query.index
      var catalog = store.state.catalog
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterId: sid,
            type: "review"
          }
        })
        .then(resp => {
          console.log("rev", resp.data);
          if(resp.data.state==1){
          this.exercises = resp.data.data;
          var length = this.exercises.length;
          if (length != 0) {
             this.haveRev=true
          }
          this.setTotalPoint();
          }
        })
        .catch(err => {
          console.log(err);
        });
/*       if(catalog.length!=0 && catalog[index].exerciseVisible_2==true){
				console.log("TCL: getRev -> exerciseVisible_2", catalog[index].exerciseVisible_2)
        this.$axios
         .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterId: sid,
            type: "review"
          }
        })
        .then(resp => {
          console.log("rev", resp.data);
          if(resp.data.state==1){
          this.exercises = resp.data.data;
          var length = this.exercises.length;
          if (length != 0) {
             this.haveRev=true
          }
          this.setTotalPoint();
          }
        })
        .catch(err => {
          console.log(err);
        });
     } */
      
    },
    setAnswer(){   
       var length = this.exercises.length;
       for(var i=0;i<length;i++){
              if(this.exercises[i].exercise.exerciseType==4){
                this.answer[i.toString()]=null
              }else if(this.exercises[i].exercise.exerciseType==5){
                this.answer[i.toString()]=[]
              }else if(this.exercises[i].exercise.exerciseType==6){
                this.answer[i.toString()]=''
              }
              this.score[i]=''
            }
    },
    submitForm(formname) {//暂存
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
    submit() {//提交
      if (this.before == true) {
        alert("请先完成题目");
      } else if (this.rate == 0) {
        alert("评分不可为0");
      } else {
        this.isRated = true;
         var params = new URLSearchParams()
        params.append("answers",this.answer)
        params.append("studentId",localStorage.getItem('userID'))
        params.append("chapterId",this.sid)
        params.append('type',"review")
        params.append('comment',this.comment)
        params.append('rate',this.rate)
        this.$axios
          .post(
            "http://10.60.38.173:8765/question/answerAll",
           params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                  "Bearer "+localStorage.getItem("token")
              }
            }
          )
          .then(resp => {
            console.log(resp.data);
            console.log("rev submit success");
            if(resp.data.state==1){
              this.$message("提交成功")
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
<style scoped>
.test {
  color: #747a81;
}
.answer{
  color: red;
}
</style>
