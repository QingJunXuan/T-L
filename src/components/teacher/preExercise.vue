<template>
<div>
  <div style="margin:0 auto;width:700px"  v-if="havePre">
    <h4 align="start">
      客观题（<span>{{totalPoint}}</span>分）
    </h4>
    <el-form>
      <div
        style="margin-top:15px;font-size:14px"
        align="start"
        v-for="(item,index) in exercises"
        :key="index"
      >
        <p
          style="margin-left:5px"
        >
        <pre style="white-space: pre-wrap; word-wrap: break-word;">{{index+1}}. <span v-if="item.exercise.exerciseType===2">（多选）</span>（{{item.exercise.exercisePoint}}分）{{item.exercise.exerciseContent}}
        </pre>
        </p>
        <!-- 单选 -->
        <el-form-item
          style="margin-top:10px;margin-left:10px;padding-bottom:10px"
          v-if="item.exercise.exerciseType===1"
        >
          <el-radio-group>
            <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              style="margin-top: 10px"
              >
              <el-radio :value="i - 1" :label="i - 1">{{String.fromCharCode(i+64)}}. {{item.exerciseChoiceList[i-1].choice}}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item style="margin-left: 10px" v-else-if="item.exercise.exerciseType===2">
          <el-checkbox-group>
            <div 
              v-for="i in item.exerciseChoiceList.length"
              :key="i"
              >
              <el-checkbox :value="i - 1" :label="i - 1">{{String.fromCharCode(i+64)}}.{{item.exerciseChoiceList[i-1].choice}}</el-checkbox>
            </div>
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
import bus from "../../bus.js";
export default {
  data() {
    return {
      tid: 0,
      havePre: false,
      type: 0,
      rate: 0,
      totalPoint: 0, //题目总分数
      totalScore: 0, //总得分
      exercises: []
    };
  },
  mounted() {
    this.getPre();
  },
  methods: {
    getPre() {
      const tid = this.$route.query.tpreid;
      this.tid = tid;
      this.$axios
        .get("http://10.60.38.173:8765/question/view", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            chapterId: this.tid,
            type: "preview"
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            this.exercises = resp.data.data;
            var length = this.exercises.length;
            if (length != 0) {
              this.havePre = true;
              this.setTotalPoint();
            }
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
    }
  },
  created() {
    window.onstorage = e => {
      if (e.key === "username") {
        if (e.newValue === null) {
          this.$alert("你已退出登录", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              bus.$emit("reload", false);
            }
          });
        }
      }
    };
  }
};
</script>
