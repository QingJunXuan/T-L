<template>
  <el-container>
    <el-main>
      <div class="main" align="start">
        <el-button @click="goBack">
          <i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回
        </el-button>
        <h4>学生列表</h4>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-input placeholder="按学号查找" v-model="searchId" size="small"></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="small">
              <i class="el-icon-search" style="margin-right: 10px"></i>搜索
            </el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-table :data="studentInfo" @row-click="goAnalysis">
            <el-table-column label="学号" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="联系方式" align="center">
              <template slot-scope="scope">{{scope.row.email}}</template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 30px">
          <div align="center">
            <el-pagination
              :page-size="20"
              layout="prev, pager, next"
              :total="studentCount"
            ></el-pagination>
          </div>
        </el-row>
      </div>
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
      this.$router.push("/teacher/studentAnalysis");
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
.main {
  padding-top: 10px;
  margin: 0 auto;
  width: 900px;
  min-height: 650px;
}
</style>
