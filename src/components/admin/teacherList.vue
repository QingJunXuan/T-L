<template>
  <div>
    <el-row style="padding-top:20px">
      <el-col :span="16" :offset="4">
        <el-row>
          <el-col :span="1" style="margin-top:10px;margin-bottom:20px">
            <el-button size="small" @click="edit" type="success">编 辑 课 程</el-button>
          </el-col>
        </el-row>
        <el-card>
		<!--列表-->
		<el-table :data="teachers" highlight-current-row v-loading="listLoading" style="width: 100%;text-align:center;margin-bottom:20px">
			<el-table-column  prop="courseID" label="课程编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="courseName" label="课程名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="teacherName" label="教师姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="teacherID" label="教师编号" width="120"  sortable>
			</el-table-column>
      <el-table-column prop="courseYear" label="年份" width="140" sortable>
			</el-table-column>
      <el-table-column prop="courseSemester" label="学期" width="140" sortable>
			</el-table-column>
			<el-table-column prop="startTime" label="开课时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="endTime" label="结课时间" width="110" sortable>
			</el-table-column>
		</el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name:'teacherList',
  data() {
    return {
      rate: null,
      textarea: "",
      teachers:[],
      //sels:[], 
      listLoading:false,
    };
  },
  created(){
     this.$axios
     .get('http://10.60.38.173:8765/getAllCourses',{
       headers: {
            'Authorization':
              "Bearer "+localStorage.getItem("token")
          }
    }).then(resp=>{
      if(resp.data.state==1){
        
        this.teachers=resp.data.data
        console.log(this.teachers)
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  methods: {
    edit() {
      this.$router.push({
        path: "/adminManage/courseGraph"
      });
    },
    /* 
    selsChange: function (sels) {
        this.sels = sels;
      },
       */
   /*  handleView(){
        this.$router.push({
        path: "/adminManage/chart"
      })
    } */
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

<style scoped>
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

