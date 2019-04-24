<template>
  <div>
    <el-row style="padding-top:20px">
      <el-col :span="20" :offset="2">
        <el-row>
		<!--列表-->
		<el-table :data="teachers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;text-align:center">
			<el-table-column type="selection" width="50">
			</el-table-column>
			<el-table-column  prop="courseID" label="课程编号" width="100" sortable>
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
			<el-table-column prop="endTime" label="结课时间" width="150" sortable>
			</el-table-column>
		<!-- 	<el-table-column label="操作" width="70">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
				</template>
			</el-table-column> -->
		</el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name:'teacherList',
  data() {
    return {
      rate: null,
      textarea: "",
      teachers:[{
        teacherName:"李老师",
        teacherID:'1001',
        courseNum:2,
        courseName:'软件项目与过程管理',
        startTime:'2018-9-1',
        endTime:'2019-2-1',
      },{
        teacherName:"王老师",
        teacherID:'1002',
        courseName:'JAVA',
        startTime:'2018-9-1',
        endTime:'2019-2-1',
      },{
        teacherName:"李老师",
        teacherID:'1001',
        courseName:'web系统与技术',
        startTime:'2018-9-1',
        endTime:'2019-2-1',
      },{
        teacherName:"张老师",
        teacherID:'1004',
        courseName:'软件测试',
        startTime:'2018-9-1',
        endTime:'2019-2-1',
      },{
        teacherName:"赵老师",
        teacherID:'1005',
        courseName:'安全体系结构与管理',
        startTime:'2018-9-1',
        endTime:'2019-2-1',
      }],
      sels:[], 
      listLoading:false,
    };
  },
  created(){
     axios.get('/api/getAllCourses',{
headers: {
            'Authorization':
              "Bearer "+localStorage.getItem("token")
          }
    }).then(resp=>{
      if(resp.data.state==1){
        this.teachers=resp.data.data
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  methods: {
    edit() {
      this.$router.push({
        path: "/adminManage/edit"
      });
    },
    selsChange: function (sels) {
        this.sels = sels;
      },
      handleView(){
        this.$router.push({
        path: "/adminManage/chart"
      })
      }
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

