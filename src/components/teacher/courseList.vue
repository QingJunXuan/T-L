<template>
  <div ref="background" style="height:778px">
    <el-row style="padding-top:20px">
        <el-col :span="4" align="right">
          <div style="margin-top:10px">
            <el-button @click="goBack" circle style="box-shadow: 0 0 8px 1px #dbdbdb">
              <i class="el-icon-back"></i>
            </el-button>
          </div>
        </el-col>
      <el-col :span="17" style="padding-left:20px">

        <el-card>
		<!--列表-->
		<el-table :data="courses" highlight-current-row v-loading="listLoading"  style="width: 100%;text-align:center;margin-bottom:20px">
	<!-- 		<el-table-column type="selection" width="50">
			</el-table-column> -->
			<el-table-column  prop="courseInfo.courseID" label="课程编号" width="140" sortable>
			</el-table-column>
			<el-table-column prop="courseInfo.courseName" label="课程名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="courseClass.classNum" label="班级号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="courseClass.classCode" label="班级邀请码" width="140"  sortable>
			</el-table-column>
      <el-table-column prop="courseInfo.courseYear" label="年份" width="140" sortable>
			</el-table-column>
      <el-table-column prop="courseInfo.courseSemester" label="学期" width="140" sortable>
			</el-table-column>
			<el-table-column prop="courseInfo.startTime" label="开课时间" width="160" sortable>
			</el-table-column>
			<el-table-column prop="courseInfo.endTime" label="结课时间" width="110" sortable>
			</el-table-column>
		</el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name:'courseList',
  data() {
    return {
      rate: null,
      textarea: "",
      courses:[],
      //sels:[], 
      listLoading:false,
    };
  },
  created(){
    console.log(window.screen.height,"height")
     this.$axios
     .get('http://10.60.38.173:8765/getCoursesByTeacherID',{
       headers: {
            'Authorization':
              "Bearer "+localStorage.getItem("token")
          },
          params: {
          teacherID: localStorage.getItem('userID')
        }
    }).then(resp=>{
      if(resp.data.state==1){
        
        this.courses=resp.data.data
		console.log("TCL: created -> courses", resp.data)
      }
    }).catch(err=>{
      console.log(err)
    })
  },
 /*  mounted(){
    const that = this;
    window.onresize=function() {
      
       //window.screenHeight = document.body.clientHeight;
       that.$refs.background.style.height = window.screen.height
    };
    console.log(this.$refs.background,"height")

  }, */
  methods: {
     goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
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
</style>

<style>
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

