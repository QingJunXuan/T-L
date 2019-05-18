<template>
<div>
  <div style="margin:0 auto;width:700px" v-if="haveRev">
    <h3 align="start">
      作业题（
      <span>{{totalPoint}}</span>分）
    </h3>
    <h4 align="start" style="color:rgb(150,150,150)" v-if="time!=null">截止时间：{{time}}</h4>
    <el-form>
      <div
        style="margin-top:15px;font-size:14px"
        align="start"
        v-for="(item,index) in exercises"
        :key="index"
      >
        <p style="margin-left:5px">
          <pre>{{index+1}}. {{item.exercise.exerciseContent}}（{{item.exercise.exercisePoint}}分）</pre>
          <span
            v-if="item.exercise.exerciseType===2"
          >（多选）</span>
        </p>
        <!-- 单选 -->
        <el-form-item
          style="margin-top:10px;margin-left:10px;padding-bottom:10px"
          v-if="item.exercise.exerciseType===1"
        >
          <el-radio-group >
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
          <el-checkbox-group >
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
        <el-button type="primary" @click="submitForm('answer')" size="mini" disabled>保 存</el-button>
      </el-form-item>
    </el-form>
   
    <div style="background-color:#545c64;height:110px">
      <p style="padding-top:10px;color:#fff">评分<span style="font-size:12px;">（评分后方可提交作业）</span></p>
      <el-rate
        v-model="rate"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        style="margin-top:-5px;padding-bottom:10px"
      ></el-rate>
      <el-button size="mini" type="primary" @click="submit" round disabled>提 交</el-button>
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
      haveRev:false,
      tid:0,
      type: 0,
      rate: 0,
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: []
    };
  },
  create() {},
  mounted() {
    this.getRev();
    this.setTime();
  },
  watch: {
    $route(to, from) {
      this.getPre();
      this.setTime();
    }
  },
  methods: {
    setTotalPoint() {
      for (var i = 0; i < this.exercises.length; i++) {
        this.totalPoint += this.exercises[i].exercise.exercisePoint;
      }
      console.log(this.totalPoint, "totalPoint");
    },
    setTime(){
      const index =this.$route.query.index
      var catalog = store.state.catalog
      if(catalog.length!=0 && catalog[index].exerciseDeadline_2!=null){
      this.time = catalog[index].exerciseDeadline_2
      }
    },
     getRev() {
      const tid = this.$route.query.trevid;
      this.tid = tid;
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterId: tid,
            type: "review"
          }
        })
        .then(resp => {
          console.log("rev", resp.data);
          this.exercises = resp.data.data;
          var length = this.exercises.length;
          if (length != 0) {
            this.haveRev = true;
            this.setTotalPoint();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>

