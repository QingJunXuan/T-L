<template>
    <div style="margin:0 auto;width:778px">
        <h3 align="start">
        作业题（
        <span>{{totalPoint}}</span>分）
        <span v-if="isScored==false" style="font-size:14px">
          客观题得分:
          <span style="color:red;">{{totalScore}}</span> 分
        </span>
        <span v-else style="font-size:14px">
          总得分:
          <span style="color:red;">{{totalScore}}</span> 分
        </span>
      </h3>
      <h4 align="start" style="color:rgb(150,150,150)" v-if="time!=null">截止时间：{{time}}</h4>
      <div>
        <div
          style="margin-top:15px;font-size:14px;padding-bottom:10px"
          align="start"
          v-for="(item,index) in exercises"
          :key="index"
        >
          <p style="margin-left:5px">
            <pre>{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</pre>
            <span
              v-if="item.exercise.exerciseType===4 || item.exercise.exerciseType ===5"
            >
              <span style="font-size:12px;color:rgb(100,100,100)">
                你的选择:
                <span style="color:red;">{{item.answer}}&nbsp;&nbsp;</span>
              </span>
              <span style="font-size:12px;color:rgb(100,100,100)">
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
              <span :class="setAnswerClass(item.exercise.exerciseAnswer, String.fromCharCode(j+64))">{{String.fromCharCode(j+64)}}. {{item.exerciseChoiceList[j-1].choice}}</span>
            </span>
          </span>
          <div
            v-else-if="item.exercise.exerciseType===6"
            style="padding:10px;background-color:#ddd;height:50px"
          >你的答案：{{item.answer}}</div>

          <div
            style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
          >解析：<pre>{{item.exercise.exerciseAnalysis}}</pre></div>
        </div>
      </div>
      <!-- 评分 -->
      <div style="background-color:#545c64;height:120px">
        <p style="padding-top:10px;color:#fff">评分</p>
        <el-rate v-model="rate" disabled show-score text-color="#ff9900" score-template="{value}" :allow-half="false"></el-rate>
        <p style="color:#fff">{{comment}}</p>
      </div>
    </div>
</template>
<script>
import store from '../../store/store.js';
export default {
    data(){
        return{
            rate:0,
            comment:'',
            sid:0,
            exercises:[],
            score:[],
            totalPoint:0,
            totalScore:0,
            isScored:false,
            time:null
        }
    },
    mounted(){
        //判断是否评分，根据评分显示totalscore
        this.setTime()
        this.getRev()
    },
    watch: {
    $route(to, from) {
      this.setTime()
      this.getRev();
    }
  },
methods:{
  getScore(){
    this.$axios
        .get("http://10.60.38.173:8765/question/exerciseScore", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            studentId:localStorage.getItem('userID'),
            chapterId: this.sid,
            type: "review"
          }
        })
        .then(resp => {
          console.log("/question/exerciseScore", resp.data);
          if (resp.data.state == 1) {
            this.score=resp.data.data
            var count=0;
            for (var i = 0; i < this.score.length; i++) { 
              count += this.score[i]
            }
            this.totalScore=count;
            if(this.score.length==this.exercises.length){
              this.isScored=true
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
  },
    setTime(){
      const index =this.$route.query.index
      var catalog = store.state.catalog
      if(catalog.length!=0 && catalog[index].exerciseDeadline_2!=null){
      this.time = catalog[index].exerciseDeadline_2
      }
    },
    setAnswerClass(item, j) {
      if (item.indexOf(j) >= 0 ) return "answer";
      else return "";
    },
    getRev() {
      const sid = this.$route.query.srevid;
      this.sid = sid;
      const index = this.$route.query.index;
      this.rate=store.state.score[index].studentChapter.rate;
      this.comment=store.state.score[index].studentChapter.comment
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: this.sid,
            studentId:localStorage.getItem('userID'),
            type: "review"
          }
        })
        .then(resp => {
          console.log("rev", resp.data);
          if (resp.data.state == 1) {
            this.exercises = resp.data.data;
            this.getScore();
            this.setTotalPoint();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setTotalPoint() {
      var count=0;
      for (var i = 0; i < this.exercises.length; i++) {
        count += this.exercises[i].exercise.exercisePoint;
      }
      this.totalPoint = count;
    },
   /*  setScore(){
      var count=0;
      for (var i = 0; i < this.exercises.length; i++) {
        if(this.exercises[i].answer==this.exercises[i].exercise.exerciseAnswer){
            this.score[i]=this.exercises[i].exercise.exercisePoint
            count += this.score[i]
        }else{
            this.score[i]=0
        }
      }
      this.totalScore=count;
    } */
  }
}
</script>
<style scoped>

</style>

