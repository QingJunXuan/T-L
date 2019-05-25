<template>
  <el-row>
    <el-main class="background">
      <el-row
        :gutter="15"
        
      >
        <!-- <el-col :span="2" align="right">
          <div>
            <el-button @click="goBack" circle style="box-shadow: 0 0 8px 1px #dbdbdb">
              <i class="el-icon-back"></i>
            </el-button>
          </div>
        </el-col> -->
        <el-col :span="6" :offset="2" align="right">
          <el-card class="info-card" :body-style="{ padding: '0' }">
            <div class="cardbody" align="start">
              <div class="course-info">
                <div class="name">
                  <span>课程分析</span>
                </div>
                <div class="grade" v-loading="courseLoading">
                  <el-row>
                    <el-col :span="6" class="text">课程数目</el-col>
                    <el-col
                      :span="18"
                      class="amount"
                      style="margin-top: 1px; padding-left: 5px"
                    >{{courseOptions.length}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="text">老师数目</el-col>
                    <el-col
                      :span="18"
                      class="amount"
                      style="margin-top: 1px; padding-left: 5px"
                    >{{teacherOptions.length}}人</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="text">学生数目</el-col>
                    <el-col
                      :span="18"
                      class="amount"
                      style="margin-top: 1px; padding-left: 5px"
                    >271人</el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="select-card" :body-style="{ padding: '0' }">
            <div class="cardbody" align="center">
              <div style="width: 64%" align="start">
                <el-row class="select-title">分析内容</el-row>
                <el-row>
                  <el-cascader
                    :options="xyOptions"
                    v-model="xyIndex"
                    @change="handleComparison"
                    filterable
                    size="small"
                  ></el-cascader>
                </el-row>
                <el-row class="select-title">对比组</el-row>
                <el-row>
                  <el-select v-model="comparison" @change="handleDetail" size="small" filterable>
                    <el-option
                      v-show="!item.disabled"
                      v-for="item in cOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row v-if="setCourse">
                  <el-row class="select-title">选择课程</el-row>
                  <el-row>
                    <el-select
                      v-model="courseSettings"
                      size="small"
                      filterable
                      @change="handleCourseDetail"
                    >
                      <el-option
                        v-for="item in courseOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                </el-row>
                <el-row class="select-title">选择{{cOptions[comparison].label}}</el-row>
                <el-row>
                  <el-select
                    multiple
                    size="small"
                    v-model="detailValue"
                    @change="handleDetailValue"
                    :multiple-limit="cOptions[comparison].limit+4"
                    filterable
                  >
                    <el-option
                      v-for="item in detailOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-show="!item.self"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row class="select">
                  <el-button
                    type="primary"
                    @click="getCharts"
                    class="select-button"
                    size="small"
                    :loading="drawLoading"
                  >确定</el-button>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="content-card" :body-style="{ padding: '0' }">
            <div class="cardbody">
              <el-scrollbar wrap-style="height: 778px; margin-top: 5px;overflow-x: hidden;" :native="false">
                <div>
                  <el-collapse v-model="activeNames" class="collapse" accordion>
                    <el-collapse-item title="数据分析" name="1">
                      <el-row>
                        <div id="myChart" class="my-chart"></div>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-row>
</template>

<script>
import echarts from "echarts";
export default {
  name: "courseAnalysis",
  data() {
    return {
      activeNames: ["1"],
      courseGrade: 0,
      courseID: 0,
      courseAmountBoy: 0,
      courseAmountGirl: 0,
      courseClassAmount: 0,
      courseLoading: false,
      courseOptions: [],
      courseSettings: 0,
      setCourse: false,
      xyOptions: [
        {
          value: 0,
          label: "选课人数",
          children: [
            {
              value: 0,
              label: "按课程",
              xyValue: 0,
              xName: "课程",
              yName: "选课人数"
            }
          ]
        },
        {
          value: 1,
          label: "课程成绩",
          children: [
            {
              value: 0,
              label: "按年份",
              xyValue: 1,
              xName: "年份",
              yName: "课程成绩"
            },
            {
              value: 1,
              label: "按学期",
              xyValue: 2,
              xName: "学期",
              yName: "课程成绩"
            },
            {
              value: 2,
              label: "按课程",
              xyValue: 3,
              xName: "课程",
              yName: "课程成绩"
            }
          ]
        },
        {
          value: 2,
          label: "课程评分",
          children: [
            {
              value: 0,
              label: "按年份",
              xyValue: 4,
              xName: "年份",
              yName: "课程评分"
            },
            {
              value: 1,
              label: "按学期",
              xyValue: 5,
              xName: "学期",
              yName: "课程评分"
            },
            {
              value: 2,
              label: "按课程",
              xyValue: 6,
              xName: "课程",
              yName: "课程评分"
            }
          ]
        }
      ],
      cOptions: [
        {
          value: 0,
          label: "教师",
          disabled: false,
          limit: 4
        },
        {
          value: 1,
          label: "课程",
          disabled: true,
          limit: 4
        },

        {
          value: 2,
          label: "学期",
          disabled: false,
          limit: 4
        },
        {
          value: 3,
          label: "学年",
          disabled: false,
          limit: 4
        }
      ],
      detail: [],
      xy: 0,
      comparison: 3,
      xyIndex: [0, 0],
      xData: [],
      detailValue: [],
      teacherOptions: [],
      courseOptions: [],
      semesterOptions: [],
      yearOptions: [],
      chapter: 0,
      colors: ["#0997F7", "#92DD22", "#FFFF33", "#FFAAEE"],
      seriesData: [],
      colorOptions: [],
      legendData: [],
      drawLoading: false,
      drawCount: 0
    };
  },
  methods: {
    // 返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    getTeacherOptions() {
      this.teacherOptions = [];
      this.$http
        .get("http://10.60.38.173:8765/getTeacherInfoByNID", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let teacherList = JSON.parse(response.bodyText);
              let i = 0;
              let teacherIndex = 0;
              while (i < teacherList.data.length) {
                if (
                  this.search(
                    this.teacherOptions,
                    teacherList.data[i].courseInfo.teacherName,
                    "label"
                  ) === -1
                ) {
                  this.teacherOptions.push({
                    value: teacherIndex,
                    label: teacherList.data[i].courseInfo.teacherName,
                    id: teacherList.data[i].courseInfo.teacherID
                  });
                  teacherIndex++;
                }
                i++;
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getCourseTeacherOptions(index) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getTeacherInfoByNID?courseNameID=" +
            this.courseOptions[index].id,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let teacherList = JSON.parse(response.bodyText);
              let i = 0;
              let teacherValue = 0;
              while (i < teacherList.data.length) {
                let teacherIndex = this.search(
                  this.courseOptions[index].teachers,
                  teacherList.data[i].courseInfo.teacherID,
                  "id"
                );
                if (teacherIndex !== -1) {
                  this.courseOptions[index].teachers[teacherIndex].courses.push(
                    {
                      courseID: teacherList.data[i].courseInfo.courseID,
                      semester:
                        teacherList.data[i].courseInfo.courseYear +
                        teacherList.data[i].courseInfo.courseSemester,
                      score: 0,
                      rate: 0
                    }
                  );
                } else {
                  this.courseOptions[index].teachers.push({
                    value: teacherValue,
                    label: teacherList.data[i].courseInfo.teacherName,
                    id: teacherList.data[i].courseInfo.teacherID,
                    courses: [
                      {
                        courseID: teacherList.data[i].courseInfo.courseID,
                        semester:
                          teacherList.data[i].courseInfo.courseYear +
                          teacherList.data[i].courseInfo.courseSemester,
                        score: 0,
                        rate: 0
                      }
                    ]
                  });
                  teacherValue++;
                }
                i++;
              }
              for (
                let m = 0;
                m < this.courseOptions[index].teachers.length;
                m++
              ) {
                for (
                  let j = 0;
                  j < this.courseOptions[index].teachers[m].courses.length;
                  j++
                ) {
                  this.getBaseData(
                    this.courseOptions[index].teachers[m].courses[j].courseID,
                    index,
                    m,
                    j
                  );
                }
              }
              this.courseLoading = false;
            } else {
              this.courseLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.courseLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getSemesterOptions() {
      this.semesterOptions = [];
      // 登录时存teacherID
      this.$http
        .get("http://10.60.38.173:8765/getAllCourses", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              let semesterIndex = 0;
              while (i < courseList.data.length) {
                let notExist = true;
                let label =
                  courseList.data[i].courseYear +
                  courseList.data[i].courseSemester;
                for (let j = 0; j < this.semesterOptions.length; j++) {
                  if (this.semesterOptions[j].label === label) {
                    notExist = false;
                    break;
                  }
                }
                if (notExist) {
                  this.semesterOptions.push({
                    value: semesterIndex,
                    label: label
                  });
                  semesterIndex++;
                }
                i++;
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getYearOptions() {
      this.yearOptions = [];
      // 登录时存teacherID
      this.$http
        .get("http://10.60.38.173:8765/getAllCourses", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              let yearIndex = 0;
              while (i < courseList.data.length) {
                let label = courseList.data[i].courseYear;
                let notExist = true;
                for (let j = 0; j < this.yearOptions.length; j++) {
                  if (this.yearOptions[j].label === label) {
                    notExist = false;
                    break;
                  }
                }
                if (notExist) {
                  this.yearOptions.push({
                    value: yearIndex,
                    label: label
                  });
                  yearIndex++;
                }
                i++;
              }
              let n = this.yearOptions.length < 4 ? this.yearOptions.length : 4;
              for (let j = 0; j < n; j++) {
                this.detailValue.push(j);
                this.detail.push(this.yearOptions[j]);
              }
              this.getCharts();
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getCourseOptions() {
      this.courseOptions = [];
      this.$http
        .get("http://10.60.38.173:8765/getCourseList", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.courseOptions.push({
                  value: i,
                  label: courseList.data[i].courseName,
                  id: courseList.data[i].courseNameID,
                  teachers: []
                });
                this.getCourseTeacherOptions(i);
                i++;
              }
              this.getYearOptions();
              this.getSemesterOptions();
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    // 下拉框事件
    handleComparison(val) {
      this.xy = this.xyOptions[val[0]].children[val[1]].xyValue;
      this.drawLoading = false;
      switch (this.xy) {
        // 课程-选课人数
        case 0: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 1) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 年份-课程总成绩
        case 1: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = true;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i > 1) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 学期-课程总成绩
        case 2: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = true;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i > 1) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 课程-课程总成绩
        case 3: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i !== 1) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 年份-课程评分
        case 4: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = true;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i < 2) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 学期-评分
        case 5: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = true;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i < 2) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 课程-评分
        case 6: {
          this.comparison = 0;
          this.detail = [];
          this.detailValue = [];
          this.setCourse = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i !== 1) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        default:
          break;
      }
    },
    handleCourseDetail() {
      this.drawLoading = false;
      this.detailValue = [];
      this.detail = [];
    },
    handleDetail(val) {
      this.drawLoading = false;
      this.detailValue = [];
      this.detail = [];
      switch (val) {
        case 0: {
          if (this.xy === 0 || this.xy === 3 || this.xy === 6) {
            this.setCourse = false;
          } else {
            this.setCourse = true;
          }
          break;
        }
        case 1: {
          this.setCourse = false;
          break;
        }
        default:
          break;
      }
    },
    handleDetailValue(val) {
      this.detail = [];
      for (let i = 0; i < this.detailValue.length; i++) {
        this.detail.push(this.detailOptions[this.detailValue[i]]);
      }
    },
    getBaseData(courseID, courseIndex, teacherIndex, index) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseClassAvgScore?courseID=" +
            courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (res.state === 1) {
                this.courseOptions[courseIndex].teachers[teacherIndex].courses[
                  index
                ].score = (
                  Number(
                    res.data.courseBoyAvgScore + res.data.courseGirlAgeScore
                  ) / 2
                ).toFixed(2);
                this.courseOptions[courseIndex].teachers[teacherIndex].courses[
                  index
                ].rate = (
                  Number(
                    res.data.courseGirlAvgRate + res.data.courseBoyAvgRate
                  ) / 2
                ).toFixed(1);
                console.log(
                  "[" + courseIndex + "," + teacherIndex + "," + index + "]"
                );
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getTeacherNumData(teacherID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getStudentNumByTeacher?teacherID=" +
            teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 0 && this.comparison === 0) {
                if (res.state === 1) {
                  for (var key in res.data) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = res.data[key];
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getSemesterNumData(year, semester, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getStudentNumBySemesterAndYear?year=" +
            year +
            "&semester=" +
            semester,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 0 && this.comparison === 2) {
                if (res.state === 1) {
                  for (var key in res.data) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = res.data[key];
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getYearNumData(year, seriesIndex) {
      this.$http
        .get("http://10.60.38.173:8765/getStudentNumByYear?year=" + year, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 0 && this.comparison === 3) {
                if (res.state === 1) {
                  for (var key in res.data) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = res.data[key];
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getTeacherYearRateData(courseNameID, teacherID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID +
            "&teacherID=" +
            teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 4 && this.comparison === 0) {
                if (res.state === 1) {
                  for (var key in res.data.year) {
                    let index = this.xData.indexOf(Number(key));
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.year[key].rate
                      ).toFixed(1);
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getYearRateData(courseNameID, seriesIndex, index, year) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getRateBySemesterAndYear?courseNameID=" +
            courseNameID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 4 && this.comparison === 1 || (this.xy === 6 && this.comparison === 3)) {
                if (res.state === 1) {
                  let i = 0;
                  let count = 0;
                  let rate = 0;

                  while (i < res.data.length) {
                    if (res.data[i].semesterAndYear.year == year) {
                      rate += res.data[i].avgRate;
                      count++;
                    }
                    i++;
                  }
                  if (count !== 0) {
                    rate = (rate / count).toFixed(1);
                  }
                  this.seriesData[seriesIndex].data[index] = rate;
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getTeacherSemesterRateData(courseNameID, teacherID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID +
            "&teacherID=" +
            teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 5 && this.comparison === 0) {
                if (res.state === 1) {
                  for (var key in res.data.semester) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.semester[key].rate
                      ).toFixed(1);
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getSemesterRateData(courseNameID, seriesIndex, index, semester) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getRateBySemesterAndYear?courseNameID=" +
            courseNameID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 6 && this.comparison === 2 || (this.xy === 5 && this.comparison === 1)) {
                if (res.state === 1) {
                  let i = 0;
                  let count = 0;
                  let rate = 0;
                  while (i < res.data.length) {
                    if (
                      res.data[i].semesterAndYear.year +
                        res.data[i].semesterAndYear.semester ===
                      semester
                    ) {
                      rate += res.data[i].avgRate;
                      count++;
                    }
                    i++;
                  }
                  if (count !== 0) {
                    rate = (rate / count).toFixed(1);
                  }
                  this.seriesData[seriesIndex].data[index] = rate;
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getTeacherYearScoreData(courseNameID, teacherID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID +
            "&teacherID=" +
            teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 1 && this.comparison === 0) {
                if (res.state === 1) {
                  for (var key in res.data.year) {
                    let index = this.xData.indexOf(Number(key));
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.year[key].score
                      ).toFixed(2);
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getYearScoreData(courseNameID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 1 && this.comparison === 1 || (this.xy === 3 && this.comparison === 3)) {
                if (res.state === 1) {
                  for (var key in res.data.year) {
                    if (this.xy === 1) {
                      let index = this.xData.indexOf(Number(key));
                      if (index !== -1) {
                        this.seriesData[seriesIndex].data[index] = Number(
                          res.data.year[key].score
                        ).toFixed(2);
                      }
                    }
                    if (this.xy === 3) {
                      let index = this.search(
                        this.courseOptions,
                        courseNameID,
                        "id"
                      );
                      let sIndex = this.search(
                        this.detail,
                        Number(key),
                        "label"
                      );
                      if (sIndex !== -1) {
                        this.seriesData[sIndex].data[index] = Number(
                          res.data.year[key].score
                        ).toFixed(2);
                      }
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getTeacherSemesterScoreData(courseNameID, teacherID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID +
            "&teacherID=" +
            teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 2 && this.comparison === 0) {
                if (res.state === 1) {
                  for (var key in res.data.semester) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.semester[key].score
                      ).toFixed(2);
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getSemesterScoreData(courseNameID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            courseNameID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (this.xy === 2 && this.comparison === 1 || (this.xy === 3 && this.comparison === 2)) {
                if (res.state === 1) {
                  for (var key in res.data.semester) {
                    if (this.xy === 2) {
                      let index = this.xData.indexOf(key);
                      if (index !== -1) {
                        this.seriesData[seriesIndex].data[index] = Number(
                          res.data.semester[key].score
                        ).toFixed(2);
                      }
                    }
                    if (this.xy === 3) {
                      let index = this.search(
                        this.courseOptions,
                        courseNameID,
                        "id"
                      );
                      let sIndex = this.search(this.detail, key, "label");
                      if (sIndex !== -1) {
                        this.seriesData[sIndex].data[index] = Number(
                          res.data.semester[key].score
                        ).toFixed(2);
                      }
                    }
                  }
                }
                this.drawChart();
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    // 按键事件
    getCharts() {
      if (this.detail.length === 0) {
        this.$message({
          type: "warning",
          message: "请添加选项!"
        });
        return;
      }
      this.xData = new Array();
      this.seriesData = new Array();
      this.colorOptions = new Array();
      this.legendData = new Array();
      this.drawLoading = true;
      this.drawCount = 0;
      switch (this.xy) {
        // 课程-选课人数
        case 0: {
          for (let m = 0; m < this.courseOptions.length; m++) {
            this.xData.push(this.courseOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getTeacherNumData(this.detail[i].id, i);
              }
              break;
            }
            // 学期
            case 2: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getSemesterNumData(
                  this.detail[i].label.substr(0, 4),
                  this.detail[i].label.substr(4),
                  i
                );
              }
              break;
            }
            // 年份
            case 3: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label.toString());
                this.getYearNumData(this.detail[i].label, i);
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 年份-成绩
        case 1: {
          for (let m = 0; m < this.yearOptions.length; m++) {
            this.xData.push(this.yearOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                let course = this.courseOptions[this.courseSettings];
                this.getTeacherYearScoreData(course.id, this.detail[i].id, i);
              }
              break;
            }
            // 课程
            case 1: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getYearScoreData(this.detail[i].id, i);
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 学期-成绩
        case 2: {
          for (let m = 0; m < this.semesterOptions.length; m++) {
            this.xData.push(this.semesterOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                let course = this.courseOptions[this.courseSettings];
                this.getTeacherSemesterScoreData(
                  course.id,
                  this.detail[i].id,
                  i
                );
              }
              break;
            }
            // 课程
            case 1: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getSemesterScoreData(this.detail[i].id, i);
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 课程-成绩
        case 3: {
          for (let m = 0; m < this.courseOptions.length; m++) {
            this.xData.push(this.courseOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.courseOptions.length; j++) {
                  let teacherIndex = this.search(
                    this.courseOptions[j].teachers,
                    this.detail[i].id,
                    "id"
                  );
                  if (teacherIndex !== -1) {
                    let score = 0;
                    let count = this.courseOptions[j].teachers[teacherIndex]
                      .courses.length;
                    for (let k = 0; k < count; k++) {
                      score += this.courseOptions[j].teachers[teacherIndex]
                        .courses[k].score;
                    }
                    if (count !== 0) {
                      this.seriesData[i].data[j] = (score / count).toFixed(2);
                    }
                  }
                }
                this.drawChart();
              }
              break;
            }
            // 学期
            case 2: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.courseOptions.length; j++) {
                  this.getSemesterScoreData(this.courseOptions[j].id, i);
                }
              }
              break;
            }
            // 年份
            case 3: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label.toString());
                for (let j = 0; j < this.courseOptions.length; j++) {
                  this.getYearScoreData(this.courseOptions[j].id, i);
                }
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 年份-评分
        case 4: {
          for (let m = 0; m < this.yearOptions.length; m++) {
            this.xData.push(this.yearOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                let course = this.courseOptions[this.courseSettings];
                this.getTeacherYearRateData(course.id, this.detail[i].id, i);
              }
              break;
            }
            // 课程
            case 1: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.xData.length; j++) {
                  this.getYearRateData(this.detail[i].id, i, j, this.xData[j]);
                }
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 学期-评分
        case 5: {
          for (let m = 0; m < this.semesterOptions.length; m++) {
            this.xData.push(this.semesterOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                let course = this.courseOptions[this.courseSettings];
                this.getTeacherSemesterRateData(
                  course.id,
                  this.detail[i].id,
                  i
                );
              }
              break;
            }
            // 课程
            case 1: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.xData.length; j++) {
                  this.getSemesterRateData(
                    this.detail[i].id,
                    i,
                    j,
                    this.xData[j]
                  );
                }
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        // 课程-评分
        case 6: {
          for (let m = 0; m < this.courseOptions.length; m++) {
            this.xData.push(this.courseOptions[m].label);
          }
          switch (this.comparison) {
            // 老师
            case 0: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.courseOptions.length; j++) {
                  let teacherIndex = this.search(
                    this.courseOptions[j].teachers,
                    this.detail[i].id,
                    "id"
                  );
                  if (teacherIndex !== -1) {
                    let rate = 0;
                    let count = this.courseOptions[j].teachers[teacherIndex]
                      .courses.length;
                    for (let k = 0; k < count; k++) {
                      rate += this.courseOptions[j].teachers[teacherIndex]
                        .courses[k].rate;
                    }
                    if (count !== 0) {
                      this.seriesData[i].data[j] = (rate / count).toFixed(1);
                    }
                  }
                }
                this.drawChart();
              }
              break;
            }
            // 学期
            case 2: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.courseOptions.length; j++) {
                  this.getSemesterRateData(
                    this.courseOptions[j].id,
                    i,
                    j,
                    this.detail[i].label
                  );
                }
              }
              break;
            }
            // 年份
            case 3: {
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.xData.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label.toString());
                for (let j = 0; j < this.courseOptions.length; j++) {
                  this.getYearRateData(
                    this.courseOptions[j].id,
                    i,
                    j,
                    this.detail[i].label
                  );
                }
              }
              break;
            }
            default:
              break;
          }
          break;
        }
        default:
          break;
      }
    },
    // 图表绘制
    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.clear();
      this.drawCount += 1;
      console.log(this.xData.length);
      // 绘制图表
      myChart.setOption({
        color: this.colorOptions,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        legend: {
          data: this.legendData
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 7,
            orient: "horizontal",
            minValueSpan: 5
          }
        ],
        toolbox: {
          show: true,
          orient: "vertical",
          right: "20px",
          top: "center",
          itemGap: 20,
          feature: {
            mark: { show: true },
            //dataView: {show: true, readOnly: false},
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            name: this.xyOptions[this.xyIndex[0]].children[this.xyIndex[1]]
              .xName,
            axisTick: { show: false },
            data: this.xData
          }
        ],
        yAxis: [
          {
            name: this.xyOptions[this.xyIndex[0]].children[this.xyIndex[1]]
              .yName,
            type: "value"
          }
        ],
        series: this.seriesData
      });
      if (this.drawCount === this.detail.length) {
        this.drawLoading = false;
      }
    },
    // 深拷贝
    objDeepCopy(source) {
      let sourceCopy = source instanceof Array ? [] : {};
      for (let item in source) {
        if (source.hasOwnProperty(item)) {
          sourceCopy[item] =
            typeof source[item] === "object"
              ? this.objDeepCopy(source[item])
              : source[item];
        }
      }
      return sourceCopy;
    },
    // 重复项
    search(arr, value, keyName) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][keyName] === value) {
          return i;
        }
      }
      return -1;
    }
  },
  created() {
    this.getCourseOptions();
    this.getTeacherOptions();
    this.courseLoading = true;
  },
  computed: {
    detailOptions() {
      let result = [];
      switch (this.comparison) {
        case 0: {
          if (this.setCourse) {
            result = this.courseOptions[this.courseSettings].teachers;
          } else {
            result = this.teacherOptions;
          }
          break;
        }
        case 1: {
          result = this.courseOptions;
          break;
        }
        case 2: {
          result = this.semesterOptions;
          break;
        }
        case 3: {
          result = this.yearOptions;
          break;
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
/* .html,body{
  padding:0px;
  margin:0px;
  width:100%;
  height: 100%;
} */
.main {
  padding-top: 18px;
  
  height: 800px;
}

.select {
  margin-top: 15px;
}

.select-title {
  font-size: 13px;
  margin: 15px 0 10px 0;
}

.select-button {
  width: 100%;
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}

.background {
  background-image: url("../../assets/background.jpg"); /*背景图片地址*/
  background-repeat: no-repeat; /*背景图片不重复*/
  background-size: cover; /*背景图片拉伸铺满*/
  width: 100%; /* 宽度为100%；*/
}

.info-card {
  width: 300px;
  height: 200px;
}

.course-info {
  padding: 10px 0 10px 0;
}

.course-info .grade {
  padding: 20px 10px 10px 20px;
}

.course-info .grade .text {
  font-size: 14px;
  font-weight: 450;
  margin-bottom: 10px;
}

.course-info .grade .amount {
  font-size: 13px;
  letter-spacing: 1px;
}

.course-info .name {
  height: 40px;
  padding: 15px 10px 15px 20px;
  border-bottom: 1px solid #e7edf5;
}

.course-info .name span {
  font-size: 24px;
  font-weight: bold;
  color: #41abf1;
}

.select-card {
  margin-top: 10px;
  width: 300px;
  height: 520px;
}

.content-card {
  width: 800px;
  height: 730px;
}

.content-card .collapse {
  padding: 0 20px 0 20px;
  margin-top: -5px;
}

.my-chart {
  width: 100%;
  height: 500px;
  margin-top: 40px;
}

.header {
  height: 42px;
  border-bottom: 1px solid #eaeef3;
}

.cardbody {
  height: 100%;
  position: relative;
}
</style>
