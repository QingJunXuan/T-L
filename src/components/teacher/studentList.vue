<template>
  <el-container>
    <el-main class="background">
      <el-card class="card" :body-style="{ padding: '0' }">
        <div class="cardbody">
          <div class="header" align="start">
            <el-button @click="goBack" type="text" class="backbutton">
              <i class="el-icon-arrow-left" style="margin-right: 6px"></i>课程详情
            </el-button>
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
                  <template slot-scope="scope"><p>{{scope.row.id}}</p></template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                  <template slot-scope="scope"><p>{{scope.row.name}}</p></template>
                </el-table-column>
                <el-table-column label="联系方式" align="center">
                  <template slot-scope="scope"><p>{{scope.row.email}}</p></template>
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
      // 学生信息
      studentInfo: [],
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
          "http://localhost:8080/getStudentsByClassID?courseClassID=1",
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
  mounted() {
    this.getStudentInfo();
  }
};
</script>

<style scoped>
.background {
  background-color: rgba(118, 162, 163, 0.26);
}

.card {
  margin: 0 auto;
  width: 900px;
  height: 680px;
}

.header {
  height: 42px;
  background-color: rgb(95, 158, 160, 0.8);

  box-shadow: 0 -1px 5px #aaaaaa;
}

.cardbody {
  height: 680px; 
  position: relative;
}

.backbutton {
  padding-left: 10px;
  color: #fff;
}

.margin {
  margin-top: 12px;
}

.searchbutton {
  background-color: rgb(95, 158, 160, 0.8);
  border-color: rgb(95, 158, 160, 0.8);
}

.table {
  border-top: 1px solid #e7edf5;
}

.table p {
  font-weight: 600;
  font-size: 12.5px;
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
