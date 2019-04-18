<template>
  <el-row>
    <el-row class="head">
      <el-col :span="2" style="padding-top:20px">
        <i class="el-icon-back" @click="feedbackBack"></i><span style="cursor: pointer" @click="feedbackBack">返回</span>
      </el-col>
    </el-row>
    <el-row style="padding-top:50px">
      <el-col :span="14" :offset="5">
        <el-row>
          <p>本学期已经结束啦，对课程进行一下评分和评价吧~</p>
          <el-row style="padding-bottom:20px">
              <el-col :span="2" :offset="9">
                  <span style="font-size:13px">评分：</span>
                  </el-col>
              <el-col :span="4">
            <el-rate v-model="rate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :allow-half="half"></el-rate></el-col>
          </el-row>
          <el-input type="textarea" :rows="6" placeholder="请输入"
          :autosize="{ minRows: 6, maxRows: 10}" v-model="textarea"></el-input>
        </el-row>
        <el-row style="padding-top:20px">
          <el-col :span="2" :offset="22">
            <el-button size="mini" @click="submit">提交</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name:'feedback',
  data() {
    return {
      rate: null,
      textarea: "",
      half:true,
    };
  },
  methods: {
    feedbackBack() {
      this.$router.back({
        path: "/student/courseDetail"
      });
    },
    submit(){

    }
  }
};
</script>
<style>
html,body{
padding:0;
margin:0;
width:100%;
height: 100%;
}
.head {
  height: 60px;
  background-color:#292929;
  color:#fff;
  font-size: 17px;
  font-weight: 700px;
  font-family: 'Courier New', Courier, monospace;
}
</style>

