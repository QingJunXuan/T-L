<template>
  <el-container>
    <el-main class="background">
      <el-card class="card" :body-style="{ padding: '0' }">
        <div class="cardbody">
          <div class="header">
            <div style="float: left; padding-top: 5px">
              <el-button @click="goBack" type="text" class="button">
              <i class="el-icon-back" style="margin-right: 6px"></i>
            </el-button>
            </div>
            <div class="title">学生列表</div>
          </div>
          <div>
            <el-row :gutter="30" class="margin" style="padding-left: 20px">
              <el-col :span="8">
                <el-input placeholder="按学号查找" v-model="searchId" size="small"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" class="searchbutton">
                  <i class="el-icon-search" style="margin-right: 10px"></i>搜索
                </el-button>
              </el-col>
            </el-row>
            <el-row class="margin">
              <el-table :data="studentInfo" @row-click="goAnalysis" size="small" class="table">
                <el-table-column label="学号" align="center">
                  <template slot-scope="scope"><p class="text">{{scope.row.id}}</p></template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                  <template slot-scope="scope"><p class="text">{{scope.row.name}}</p></template>
                </el-table-column>
                <el-table-column label="联系方式" align="center">
                  <template slot-scope="scope"><p class="text">{{scope.row.email}}</p></template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div class="bottom page">
            <el-pagination :page-size="20" layout="prev, pager, next" small :total="studentCount"></el-pagination>
          </div>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "studentList",
  data() {
    return {
      classID: 0,
      // 学生信息
      studentInfo: [{
        id: '1612345',
        name: '学生名字',
        email: '96234164@qq.com'
      }],
      listLoading: false,
      searchId: "",
      studentCount: 0
    };
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    goAnalysis(row, column, cell, event) {
      // 传值
      this.$router.push({path: '/teacher/studentAnalysis', query: {studentID: row.id, studentName: row.name}});
    },
    // 获取列表
    getStudentInfo(index) {
      this.studentInfo = [];
      this.$http
        .get(
          // 传值班级号
          "/api/getStudentsByClassID?courseClassID=" + this.classID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let studentList = JSON.parse(response.bodyText);
              if (studentList.state === 1) {
                let i = 0;
                while (i < studentList.data.length) {
                  this.studentInfo.push({
                    id: studentList.data[i].workID,
                    name: studentList.data[i].name,
                    email: studentList.data[i].mail
                  });
                  i++;
                  this.studentCount++;
                }
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    }
  },
  created() {
    this.classID = this.$route.query.classID;
    this.getStudentInfo();
  }
};
</script>

<style scoped>
.background {
  background-image: url('../../assets/background.jpg'); /*背景图片地址*/
  background-repeat: no-repeat;/*背景图片不重复*/
  background-size: cover;/*背景图片拉伸铺满*/
  width:100%; /* 宽度为100%；*/
}

.card {
  margin: 0 auto;
  width: 900px;
  height: 680px;
}

.header {
  height: 50px;
  border-bottom: 1px solid #eaeef3;
}

.cardbody {
  height: 680px; 
  position: relative;
}

.header > div > .button {
  padding-left: 10px;
  color: #292929;
}

.header > .title {
  font-size: 14px;
  padding-top: 15px;
  font-weight: 600;
  position: absolute;
  left: 46.8%;
}

.margin {
  margin-top: 12px;
}

.searchbutton {
  background-color: #7CC8FB;
  border-color: #7CC8FB;
}

.table {
  border-top: 1px solid #eaeef3;
}

.text {
  font-weight: 430;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  height: 15px;
}

.page {
  color: rgba(118, 162, 163, 0.26);
}

.bottom {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
