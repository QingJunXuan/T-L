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
          <el-row>
            <el-row :gutter="30" class="margin" style="padding-left: 20px">
              <el-col :span="8">
                <el-input placeholder="按学号查找" v-model="searchId" size="small"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" class="searchbutton" @click="getStudentByID">
                  <i class="el-icon-search" style="margin-right: 10px"></i>搜索
                </el-button>
              </el-col>
            </el-row>
            <el-row class="margin">
              <el-table
                :data="studentCurrent"
                @row-click="goAnalysis"
                size="small"
                class="table"
                v-loading="listLoading"
              >
                <el-table-column label="学号" align="center">
                  <template slot-scope="scope">
                    <div class="table-row">
                      <p class="text">{{scope.row.id}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                  <template slot-scope="scope">
                    <div class="table-row">
                      <p class="text">{{scope.row.name}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="联系方式" align="center">
                  <template slot-scope="scope">
                    <div class="table-row">
                      <p class="text">{{scope.row.email}}</p>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
          <el-row class="page">
            <el-pagination
              :page-size="9"
              layout="prev, pager, next"
              small
              :total="studentCount"
              :current-page.sync="currentPage"
              @current-change="getStudentCurrent(currentPage)"
            ></el-pagination>
          </el-row>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "studentList",
  data() {
    return {
      classID: 0,
      courseID: 0,
      // 学生信息
      studentInfo: [],
      studentCurrent: [],
      currentPage: 1,
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
      this.$router.push({
        path: "/teacher/studentAnalysis",
        query: { studentID: row.id, studentName: row.name, classID: this.classID, courseID: this.courseID, userID: row.userID }
      });
    },
    // 获取列表
    getStudentInfo(index) {
      this.studentInfo = [];
      this.listLoading = true;
      this.$http
        .get(
          // 传值班级号
          "http://10.60.38.173:8765/getStudentsByClassID?courseClassID=" + this.classID,
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
                    userID: studentList.data[i].userID,
                    id: studentList.data[i].workID,
                    name: studentList.data[i].name,
                    email: studentList.data[i].mail
                  });
                  i++;
                  this.studentCount++;
                }
                this.getStudentCurrent(1);
              }
              else {
                this.listLoading = false;
              }
            } else {
              this.listLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getStudentCurrent(page) {
      this.studentCurrent = [];
      for (let i = 0; i < 9; i++) {
        let pos = (page - 1) * 9 + i;
        if (pos >= this.studentInfo.length) break;
        this.studentCurrent.push(this.studentInfo[pos]);
      }
      this.currentPage = page;
      this.listLoading = false;
    },
    getStudentByID() {
      if (this.searchId === "") {
        this.getStudentInfo();
        return;
      }
      this.listLoading = true;
      this.studentInfo = [];
      this.$http
        .get(
          // 传值班级号
          "http://10.60.38.173:8765/getStudentsByClassID?courseClassID=" + this.classID,
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
                const keyArr = this.searchId.split(" ");
                var result = [];
                for (let i = 0; i < studentList.data.length; i++) {
                  let match = true;
                  for (let j = 0; j < keyArr.length; j++) {
                    if (
                      studentList.data[i].workID
                        .toString()
                        .search(keyArr[j]) === -1
                    ) {
                      match = false;
                      break;
                    }
                  }
                  if (match) {
                    result.push({
                      id: studentList.data[i].workID,
                      name: studentList.data[i].name,
                      email: studentList.data[i].mail
                    });
                  }
                }
                this.studentInfo = result;
                this.studentCount = this.studentInfo.length;
                this.getStudentCurrent(1);
              }
            } else {
              this.listLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    }
  },
  created() {
    this.classID = this.$route.query.classID;
    this.courseID = this.$route.query.courseID;
    this.getStudentInfo();
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

<style scoped>
.background {
  background-image: url("../../assets/background.jpg"); /*背景图片地址*/
  background-repeat: no-repeat; /*背景图片不重复*/
  background-size: cover; /*背景图片拉伸铺满*/
  width: 100%; /* 宽度为100%；*/
}

.card {
  margin: 0 auto;
  width: 900px;
  height: 680px;
  margin-bottom:57px;
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
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}

.table {
  border-top: 1px solid #eaeef3;
}

.table .table-row {
  cursor: pointer;
  width: 100%;
}

.table .table-row .text {
  font-weight: 430;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  height: 15px;
}

.page {
  margin-top: 20px;
  color: rgba(118, 162, 163, 0.26);
}
</style>
