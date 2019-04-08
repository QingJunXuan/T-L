<template>
  <div>
    <el-row class="header">
      <el-col :span="10" class="logo logo-width">
        <div>
          <div style="display: inline-block;padding-top:20px">
            <i class="fa fa-leanpub" aria-hidden="true" style="margin-right: 10px;"></i>
            <span style="letter-spacing:3px; font-weight: bold;">教与学</span>
          </div>
          <div style="color: #fff; display: inline-block;">
            <div class="subhead" style="top: 13px">专业在线教育平台</div>
            <div class="subhead" style="top: 29px;">TEACH AND LEARN</div>
          </div>
        </div>
      </el-col>
      <!-- 点击跳转到分析页面 -->
      <el-col :span="1" class="icon-right">
        <i class="el-icon-share" @click="chart"></i>
      </el-col>      
      <!-- 老师列表 -->
      <el-col :span="1" class="icon-right">
        <i class="el-icon-service" @click="teacherList"></i>
      </el-col>
      <!-- 点击跳转到课程页面/当前页面 -->
      <el-col :span="1" class="icon-right">
        <i class="el-icon-menu" @click="courseList"></i>
      </el-col>
    </el-row>
    <el-row><router-view></router-view></el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    chart() {
      this.$router.push('/adminManage/courseGraph')
    },
    courseList() {
      this.$router.push('/adminManage/courseList')
    },
    teacherList(){
      this.$router.push('/adminManage/teacherList')
    },
  }
};
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.header {
  height: 60px;
  background-color: cadetblue;
  color: #fff;
  font-size: 17px;
  font-weight: 700px;
  font-family: "Courier New", Courier, monospace;
}
.logo {
  /* width:230px; */
  height: 60px;
  font-size: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.logo-width {
  width: 200px;
}
.subhead {
  font: 12px 黑体;
  font-weight: bold;
  position: absolute;
  letter-spacing: 3px;
}
.icon-right {
  text-align: right;
  float: right;
  line-height: 60px;
  padding-right: 40px;
  font-size: 25px;
}
</style>

