<template>
  <div style="margin:0 auto;width:778px">
      <h3 align="start">
        客观题（
        <span>{{totalPoint}}</span>分）
        <span>得分：{{totalScore}} 分</span>
      </h3>
    <div
      style="margin-top:15px;font-size:14px;padding-bottom:10px"
      align="start"
      v-for="(item, index) in exercises"
      :key="index"
    >
      <pre>{{ index + 1 }}. {{ item.exercise.exerciseContent }}（{{item.exercise.exercisePoint}}分）</pre>
      <span
          v-for="j in item.exerciseChoiceList.length"
          :key="j"
          :value="j - 1"
          :label="j - 1"
          style="margin-left:10px"
      >
      <span :class="setAnswerClass(item.exercise.exerciseAnswer,String.fromCharCode(j + 64))">
            {{ String.fromCharCode(j + 64) }}.
            {{ item.exerciseChoiceList[j - 1].choice }}
          </span>
      </span>
      <p style="margin-left:5px">
        <span v-if="item.exercise.exerciseType === 1 || item.exercise.exerciseType === 2">
          <span style="font-size:12px;color:rgb(100,100,100)">
            你的选择：
            <span style="color:red;">
                {{ item.answer }}&nbsp;&nbsp;
            </span>
          </span>
          <span style="font-size:12px;color:rgb(100,100,100)">
            得分：
            <span style="color:red;">{{ score[index] }}</span> 分
          </span>
        </span>
      </p>
      <div
        style="margin-top: 10px; background-color: rgb(240,240,240); min-height: 80px; padding: 10px 10px 10px 10px"
      >
        解析：<pre>{{ item.exercise.exerciseAnalysis }}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import store from '../../store/store.js';
export default {
  data() {
    return {
      exercises: [],
      score:[],
      sid:null,
      totalPoint:0,
      totalScore:0,
    };
  },
  created() {
      this.getPre()
  },
  watch: {
    $route(to, from) {
      this.getPre();
    }
  },
  methods: {
    setAnswerClass(item, j) {
      if (item.indexOf(j) >= 0 ) return "answer";
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
            chapterId: this.sid,
            studentId:localStorage.getItem('userID'),
            type: "preview"
          }
        })
        .then(resp => {
          console.log("pre", resp.data);
          if (resp.data.state == 1) {
            this.exercises = resp.data.data;
            this.setScore();
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
    setScore(){
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
    }
  }
};
</script>
<style scoped>
.answer{
  color: red;
}
</style>

