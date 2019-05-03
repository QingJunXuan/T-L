<template>
  <el-container>
    <el-main class="background">
      <el-row
        :gutter="10"
        style="margin: 0 auto; width: 90%; max-height: 685px"
        type="flex"
        justify="center"
      >
        <el-col :span="2" align="right">
          <div>
            <el-button @click="goBack" circle style="box-shadow: 0 0 8px 1px #dbdbdb">
              <i class="el-icon-back"></i>
            </el-button>
          </div>
        </el-col>
        <el-col :span="6" align="right">
          <el-card class="info-card" :body-style="{ padding: '0' }">
            <div class="cardbody" align="start">
              <div class="course-info">
                <div class="name">
                  <span>章节1 IO接口</span>
                </div>
                <div class="grade">
                  <el-row>
                    <el-col :span="6" class="text">课程评分</el-col>
                    <el-col :span="18">
                      <el-rate
                        v-model="courseGrade"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                        style="width: 100%"
                      ></el-rate>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="select-card" :body-style="{ padding: '0' }">
            <div class="cardbody" align="center">
              <div style="width: 64%" align="start">
                <el-row class="select-title">指标</el-row>
                <el-row>
                  <el-select v-model="xy" @change="handleComparison" size="small">
                    <el-option
                      v-for="item in xyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row>
                  <el-select
                    v-model="gradeAttribute"
                    @change="handleGrade"
                    v-if="xy === 0"
                    size="small"
                    class="select"
                  >
                    <el-option
                      v-for="item in gradeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row class="select-title">对比组</el-row>
                <el-row>
                  <el-select v-model="comparison" @change="handleDetail" size="small">
                    <el-option
                      :disabled="item.disabled"
                      v-for="item in cOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row class="select-title">选择{{cOptions[comparison].label}}</el-row>
                <el-row v-if="comparison !== 0">
                  <el-select
                    multiple
                    size="small"
                    v-model="detailValue"
                    @change="handleDetailValue"
                    :multiple-limit="cOptions[comparison].limit+4"
                    :filterable="cOptions[comparison].filterable"
                  >
                    <el-option
                      v-for="item in detailOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row v-if="comparison === 0">
                  
                
                  <el-row>
                    <el-cascader
                      :options="studentOptions"
                      v-model="studentMap[0]"
                      @change="handleChange(0)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
                  <el-row v-if="gradeAttribute !== 3">
                  <el-row class="select">
                    <el-cascader
                      :options="studentOptions"
                      v-model="studentMap[1]"
                      @change="handleChange(1)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
                  <el-row class="select">
                    <el-cascader
                      :options="studentOptions"
                      v-model="studentMap[2]"
                      @change="handleChange(2)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
                  <el-row class="select">
                    <el-cascader
                      :options="studentOptions"
                      v-model="studentMap[3]"
                      @change="handleChange(3)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
                </el-row>
                </el-row>
                <el-row class="select">
                  <el-button type="primary" @click="getCharts" class="select-button" size="small">确定</el-button>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="content-card" :body-style="{ padding: '0' }">
            <div class="cardbody">
              <el-scrollbar wrap-style="height: 650px; margin-top: 5px" :native="false">
                <div>
                  <el-collapse v-model="activeNames" class="collapse">
                    <el-collapse-item title="成绩分析" name="1">
                      <el-row type="flex" justify="start" style="padding: 10px 20px 0 50px">
                        <el-select v-model="courseIndex" size="small" @change="handleCourse">
                          <el-option
                            v-for="item in courseOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-row>
                      <el-row>
                        <div id="myChart" class="my-chart"></div>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="反馈信息" name="2">
                      <el-row>
                        <el-col :span="2" style="margin-top: 5px">章节</el-col>
                        <el-col :span="10" align="start">
                          <el-select v-model="chapter" @change="handleResponse" size="small" style="width: 300px">
                            <el-option
                              v-for="item in chapterOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12" align="start">
                          <el-rate
                            v-model="courseGrade"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                            style="zoom: 90%; margin-top: 8px;margin-left: 25px"
                          ></el-rate>
                        </el-col>
                      </el-row>
                      <div align="start" class="response" style="margin-top: 10px">
                        <el-row>
                          <div class="title">1612345 学生1</div>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="6">
                            <span class="grade">课前成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">课后成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">总成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">排名：15</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <div>
                            <el-rate
                              v-model="courseGrade"
                              disabled
                              show-score
                              text-color="#ff9900"
                              score-template="{value}"
                              class="rate"
                            ></el-rate>
                          </div>
                        </el-row>
                        <el-row style="margin-top: 13px">
                          <div class="text">反馈内容</div>
                        </el-row>
                      </div>
                      <div style="margin-top: 20px" align="start" class="response">
                        <el-row>
                          <div class="title">1612345 学生2</div>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="6">
                            <span class="grade">课前成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">课后成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">总成绩：85</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">排名：15</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <div>
                            <el-rate
                              v-model="courseGrade"
                              disabled
                              show-score
                              text-color="#ff9900"
                              score-template="{value}"
                              class="rate"
                            ></el-rate>
                          </div>
                        </el-row>
                        <el-row style="margin-top: 13px">
                          <div class="text">反馈内容</div>
                        </el-row>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import echarts from "echarts";
export default {
  name: "courseAnalysis",
  data() {
    return {
      // 传值
      courseID: 0,
      classID: 0,
      teacherID: 1001,
      activeNames: ["1"],
      courseGrade: 4.5,
      courseOptions: [],
      courseIndex: 0,
      xyOptions: [
        {
          value: 0,
          label: "章节-平均成绩",
          xName: "章节",
          yName: "平均成绩"
        },
        {
          value: 1,
          label: "分数段-人数",
          xName: "分数段",
          yName: "人数"
        },
        {
          value: 2,
          label: "章节-评分",
          xName: "章节",
          yName: "评分"
        },
        {
          value: 3,
          label: "评分-人数",
          xName: "评分",
          yName: "人数"
        },
        {
          value: 4,
          label: "年份-总成绩",
          xName: "年份",
          yName: "总成绩"
        },
        {
          value: 5,
          label: "年份-评分",
          xName: "年份",
          yName: "评分"
        },
        {
          value: 6,
          label: "学期-总成绩",
          xName: "学期",
          yName: "总成绩"
        },
        {
          value: 7,
          label: "学期-评分",
          xName: "学期",
          yName: "评分"
        },
        {
          value: 8,
          label: "班级-总成绩",
          xName: "班级",
          yName: "总成绩"
        },
        {
          value: 9,
          label: "班级-评分",
          xName: "班级",
          yName: "评分"
        }
      ],
      cOptions: [
        {
          value: 0,
          label: "学生",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 1,
          label: "性别",
          disabled: false,
          limit: 1,
          filterable: false
        },
        {
          value: 2,
          label: "班级",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 3,
          label: "教师",
          disabled: false,
          limit: 4,
          filterable: true
        },
        {
          value: 4,
          label: "学期",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 5,
          label: "学年",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 6,
          label: "章节",
          disabled: true,
          limit: 4,
          filterable: true
        }
      ],
      gradeOptions: [
        {
          value: 0,
          label: "总平均成绩"
        },
        {
          value: 1,
          label: "课前平均成绩"
        },
        {
          value: 2,
          label: "课后平均成绩"
        },
        {
          value: 3,
          label: "课前-课后平均成绩"
        }
      ],
      genderOptions: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "只看男生"
        },
        {
          value: 2,
          label: "只看女生"
        }
      ],
      gradeAttribute: 0,
      detail: [],
      detailValue: [],
      xy: 0,
      comparison: 0,
      xData: [],
      teacherOptions: [
        {
          value: 0,
          label: "老师1"
        },
        {
          value: 1,
          label: "老师2"
        }
      ],
      teachers: [],
      classOptions: [],
      classes: [],
      semesterOptions: [],
      semesters: [],
      yearOptions: [],
      years: [],
      chapterOptions: [],
      chapters: [],
      chapter: 0,
      studentMap: [],
      // 学生和成绩
      studentOptions: [],
      studentMap: [],
      studentIndex: [],
      // 课程评分 只能数字
      evaluateList: [[4.3, 3.8, 4.1], [4.5, 4.2, 3.7]],
      // 成绩阶段
      gradeEnumList: [60, 70, 80, 90],
      // 评分阶段
      evaluateEnumList: [1, 2, 3, 4],
      // 人数 只能数字
      amountList: [[8, 17, 29, 18], [7, 19, 22, 24], [12, 16, 31, 13]],
      colors: ["#0997F7", "#92DD22", "#FFFF33", "#FFAAEE"],
      seriesData : [],
      colorOptions : [],
      legendData : []
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
    goStudentAnalysis() {
      this.$router.push("/teacher/studentAnalysis");
    },
    // 获取列表
    getCourses() {
      this.$http
        .get("/api/getCoursesByTeacherID?teacherID=" + this.teacherID, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              if (courseList.state === 1) {
                let i = 0;
                this.courseID = courseList.data[i].courseInfo.courseID;
                //this.classID = courseList.data[i].courseClass.id;
                while (i < courseList.data.length) {
                  let notExist = true;
                  for (let j = 0;j < this.courseOptions.length;j++) {
                    if (this.courseOptions[j].courseID === courseList.data[i].courseInfo.courseID) {
                      notExist = false;
                      break;
                    }
                  }
                  if (notExist) {
                    this.courseOptions.push({
                    value: i,
                    label: courseList.data[i].courseInfo.courseName,
                    courseID: courseList.data[i].courseInfo.courseID,
                    //classID: courseList.data[i].courseClass.id
                  });
                  }
                  i++;
                }
                this.getChapters();
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
    // 学生
    getStudentOptions(index) {
      this.$http
        .get(
          "/api/getStudentsByClassID?courseClassID=" +
            this.studentOptions[index].value,
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
                  this.studentOptions[index].children.push({
                    value: i,
                    label: studentList.data[i].name,
                    userID: studentList.data[i].userID,
                    disabled: false
                  });
                  i++;
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
    },
    // 班级
    getClassOptions() {
      this.classOptions = [];
      this.studentOptions = [];
      // 登录时存teacherID
      this.$http
        .get("/api/getCoursesByTeacherID?teacherID=" + this.teacherID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < classList.data.length) {
                this.classOptions.push({
                  value: classList.data[i].courseClass.id,
                  label: classList.data[i].courseClass.classNum + "班"
                });
                this.studentOptions.push({
                  value: classList.data[i].courseClass.id,
                  label: classList.data[i].courseClass.classNum + "班",
                  children: []
                });
                this.getStudentOptions(i);
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
    // 教师
    getTeacherOptions() {
      // TODO: 获取教师列表
    },
    // 学期
    getSemesterOptions() {
      this.semesterOptions = [];
      // 登录时存teacherID
      this.$http
        .get("/api/getCoursesByTeacherID?teacherID=" + this.teacherID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.semesterOptions.push({
                  value: i,
                  label:
                    courseList.data[i].courseInfo.courseYear +
                    courseList.data[i].courseInfo.courseSemester
                });
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
    // 年份
    getYearOptions() {
      this.yearOptions = [];
      // 登录时存teacherID
      this.$http
        .get("/api/getCoursesByTeacherID?teacherID=" + this.teacherID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.yearOptions.push({
                  value: i,
                  label: courseList.data[i].courseInfo.courseYear + "年"
                });
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
    // 章节
    getChapters() {
      this.chapterOptions = [];
      this.$http
        .get("/api/getCourseCatalog?courseID=" + this.courseID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 1;
              while (i <= courseList.data.length) {
                this.chapterOptions.push({
                  value: i - 1,
                  label: courseList.data[i - 1].contentName
                });
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
    // 按班级和章节获取反馈信息
    getCourseInfo(chapterID, classID) {
      this.$http
        .get("/api/getCourseScoreAndCommentByGender?courseID=" + this.courseID + "&chapterID=" + chapterID + "&getDetail=0&courseClassID=" + classID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 1;
              while (i <= courseList.data.length) {
                this.chapterOptions.push({
                  value: i - 1,
                  label: courseList.data[i - 1].contentName
                });
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
    getStudentData(studentID, index) {
      this.xData.length = 0;
      this.$http
        .get(
          "/api/getCourseScoreAndComment?courseID=" +
            this.courseID +
            "&studentID=" +
            studentID,
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
              let i = 0;
              while (i < res.data.length) {
                let avg =
                  (Number(res.data[i].studentChapter.totalScore_1) +
                    Number(res.data[i].studentChapter.totalScore_2)) /
                  2;
                if (this.xy === 0 && this.gradeAttribute !== 3) {
                  switch (this.gradeAttribute) {
                    case 0: {
                      // 总
                      this.seriesData[index].data.push(avg);
                      break;
                    }
                    case 1: {
                      // 课前
                      this.seriesData[index].data.push(
                        res.data[i].studentChapter.totalScore_1
                      );
                      break;
                    }
                    case 2: {
                      // 课后
                      this.seriesData[index].data.push(
                        res.data[i].studentChapter.totalScore_2
                      );
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                }
                if (this.xy === 0 && this.gradeAttribute === 3) {
                  // 课前对比课后
                  this.seriesData[0].data.push(
                    res.data[i].studentChapter.totalScore_1
                  );
                  this.seriesData[1].data.push(
                    res.data[i].studentChapter.totalScore_2
                  );
                }
                if (this.seriesData[0].data.length > this.xData.length) {
                  let end = res.data[i].chapterName.toString().indexOf("章");
                  this.xData.push(
                    res.data[i].chapterName.toString().substring(0, end + 1)
                  );
                }
                i++;
              }
              this.drawChart();
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getGenderData(chapterID, index) {
      this.$http
        .get(
          "/api/getCourseScoreAndCommentByGender?courseID=" + this.courseID + "&chapterID=" + chapterID + "&getDetail=0",
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
              let i = 0;
              if (this.comparison === 1) {
                // 性别
                switch (this.gradeAttribute) {
                  case 0: {
                    // 总
                      let avgBoy = 
                        Number(res.data[0].scoreInfo.boyAverage1) +
                        Number(res.data[0].scoreInfo.boyAverage2) /
                        2;
                      let avgGirl =
                        Number(res.data[0].scoreInfo.girlAverage1) +
                          Number(res.data[0].scoreInfo.girlAverage2) /
                        2;
                      this.seriesData[0].data[index] = avgBoy.toFixed(2);
                      this.seriesData[1].data[index] = avgGirl.toFixed(2);
                    break;
                  }
                  case 1: {
                    // 课前
                      this.seriesData[0].data[index] = res.data[0].scoreInfo.boyAverage1.toFixed(2);
                      this.seriesData[1].data[index] = res.data[0].scoreInfo.girlAverage1.toFixed(2);
                    break;
                  }
                  case 2: {
                    // 课后
                      this.seriesData[0].data[index] = res.data[0].scoreInfo.boyAverage2.toFixed(2);
                      this.seriesData[1].data[index] = res.data[0].scoreInfo.girlAverage2.toFixed(2);
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
              if (this.comparison === 2) {
                // 班级平均
                switch (this.gradeAttribute) {
                  case 0: {
                    // 总
                      let avg =
                        Number(res.data[0].scoreInfo.totalAverage1 +
                          res.data[0].scoreInfo.totalAverage2) /
                        2;
                      this.seriesData[1].data[index] = avg.toFixed(2);
                    break;
                  }
                  case 1: {
                    // 课前
                      let avg = res.data[0].scoreInfo.totalAverage1;
                      this.seriesData[1].data[index] = avg.toFixed(2);
                    break;
                  }
                  case 2: {
                    // 课后
                      let avg = res.data[0].scoreInfo.totalAverage2;
                        this.seriesData[1].data[index] = avg.toFixed(2);
                    break;
                  }
                  default: break;
                }
              }
              this.drawChart();
            } else {
              this.drawLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.drawLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getScoreDistributeData(chapterID) {
      this.$http
        .get(
          "/api/getCourseScoreAndCommentByGender?courseID=" + this.courseID + "&chapterID=" + chapterID + "&getDetail=0",
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
              let i = 0;
              if (this.comparison === 1) {
                // 性别
                 switch (this.gradeAttribute) {
                  case 0: {
                    // 总
                    let sumGirl = new Array();
                    let sumBoy = new Array();
                    for (let i = 0;i < 5;i++) {
                      sumGirl.push(Number(res.data[0].scoreInfo.girlScoreDistribute1[i] + res.data[0].scoreInfo.girlScoreDistribute2[i])/2);
                      sumBoy.push(Number(res.data[0].scoreInfo.boyScoreDistribute1[i] + res.data[0].scoreInfo.boyScoreDistribute2[i])/2);
                    }
                    this.seriesData[0].data = sumBoy;
                    this.seriesData[1].data = sumGirl;
                    break;
                  }
                  case 1: {
                    // 课前
                    this.seriesData[0].data = res.data[0].scoreInfo.girlScoreDistribute1;
                    this.seriesData[1].data = res.data[0].scoreInfo.boyScoreDistribute1;
                    break;
                  }
                  case 2: {
                    this.seriesData[0].data = res.data[0].scoreInfo.girlScoreDistribute2;
                    this.seriesData[1].data = res.data[0].scoreInfo.boyScoreDistribute2;
                    // 课后
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
              if (this.comparison === 2) {
                // 班级平均
                 switch (this.gradeAttribute) {
                  case 0: {
                    // 总
                    let sum = new Array();
                    for (let i = 0;i < 5;i++) {
                      sum.push(Number(res.data[0].scoreInfo.girlScoreDistribute1[i] + res.data[0].scoreInfo.boyScoreDistribute1[i]));
                    }
                    this.seriesData[0].data = sum;
                    break;
                  }
                  case 1: {
                    // 课前
                    let avg = new Array();
                    for (let i = 0;i < 5;i++) {
                      avg.push(Number(res.data[0].scoreInfo.girlScoreDistribute1[i] + res.data[0].scoreInfo.boyScoreDistribute1[i]));
                    }
                    this.seriesData[0].data = avg;
                    break;
                  }
                  case 2: {
                    // 课后
                    let avg = new Array();
                    for (let i = 0;i < 5;i++) {
                      avg.push(Number(res.data[0].scoreInfo.girlScoreDistribute2[i] + res.data[0].scoreInfo.boyScoreDistribute2[i]));
                    }
                    this.seriesData[0].data = avg;
                    break;
                  }
                  case 3: {
                    this.seriesData.push({});
                    this.seriesData[0].name = '班级课后';
              this.seriesData[1] = {
                name: '班级课前',
                type: "bar",
                barGap: 0,
                data: new Array()
              };            
              this.colorOptions.push(this.colors[1]);
              this.legendData[0] = '班级课前'
              this.legendData.push('班级课后');          
                    let avgPre = new Array();
                    let avgRev = new Array();
                    for (let i = 0;i < 5;i++) {
                      avgPre.push(Number(res.data[0].scoreInfo.girlScoreDistribute1[i] + res.data[0].scoreInfo.boyScoreDistribute1[i]));
                      avgRev.push(Number(res.data[0].scoreInfo.girlScoreDistribute2[i] + res.data[0].scoreInfo.boyScoreDistribute2[i]));
                    }
                    this.seriesData[0].data = avgPre;
                    this.seriesData[1].data = avgRev;
                  }
                  default: {
                    break;
                  }
                }
              }
              this.drawChart();
            } else {
              this.drawLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.drawLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    // 下拉框事件
    handleCourse(val) {
      //this.classID = this.courseOptions[val].classID;
      this.courseID = this.courseOptions[val].courseID;
    },
    handleComparison() {
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          this.comparison = 0;
          this.studentMap = new Array(4);
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 6) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 分数段-人数
        case 1: {
          this.comparison = 1;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 0 || i === 6) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 章节-评分
        case 2: {
          this.comparison = 3;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i < 3 || i === 6) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 评分-人数
        case 3: {
          this.comparison = 6;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 6) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 年份-总成绩
        case 4: {
          this.comparison = 2;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2 || i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 年份-评分
        case 5: {
          this.comparison = 2;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2 || i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 学期-总成绩
        case 6: {
          this.comparison = 2;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2 || i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 学期-评分
        case 7: {
          this.comparison = 2;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2 || i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 班级-总成绩
        case 8: {
          this.comparison = 4;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 4 || i === 5) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 班级-评分
        case 9: {
          this.comparison = 4;
          this.detail = [];
          this.detailValue = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 4 || i === 5) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        default:
          break;
      }
    },
    handleGrade() {},
    handleDetail() {
      this.detailValue = [];
      this.detail = [];
    },
    handleDetailValue(val) {
      this.detail = [];
      for (let i in val) {
        this.detail.push(this.detailOptions[i]);
      }
    },
    handleChange(index) {
      let val = this.studentMap[index];
      if (this.studentIndex[index] !== undefined && Object.keys(val).length === 0) {
        // 原来有值现在没值
        let c = this.studentIndex[index][0];
        let s = this.studentIndex[index][1];
        this.studentOptions[c - 1].children[s].disabled = false;
      }
      else {
        // 现在有值
        let c = val[0];
        let s = val[1];
        this.studentOptions[c - 1].children[s].disabled = true;
        this.studentIndex[index] = new Array();
        this.studentIndex[index] = val;
      }
    },
    handleResponse() {},
    // 按键事件
    getCharts() {
      // TODO: 发送请求获取图表数据
      this.xData = new Array();
      this.seriesData = new Array();
      this.colorOptions = new Array();
      this.legendData = new Array();
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          switch (this.comparison) {
            // 学生
            case 0: {
              if (this.gradeAttribute !== 3) {
                let opIndex = 0;
                for (let i = 0; i < this.studentMap.length; i++) {
                  let val = this.studentMap[i];
                  if (
                    val !== undefined &&
                    Object.keys(val).length !== 0
                  ) {
                    let c = val[0] - 1;
                    let s = val[1];
                    this.seriesData.push({
                      name: this.studentOptions[c].children[s].label,
                      type: "bar",
                      barGap: 0,
                      data: new Array()
                    });
                    this.colorOptions.push(this.colors[opIndex]);
                    this.legendData.push(
                      this.studentOptions[c].children[s].label.toString()
                    );
                    this.getStudentData(this.studentOptions[c].children[s].userID, opIndex);
                    opIndex += 1;
                  }
                }
              } else {
                let val = this.studentMap[0];
                let c = val[0] - 1;
                let s = val[1];
                this.seriesData = new Array(2);
                this.seriesData[0] = {
                  name: "课前成绩",
                  type: "bar",
                  barGap: 0,
                  data: []
                };
                this.seriesData[1] = {
                  name: "课后成绩",
                  type: "bar",
                  barGap: 0,
                  data: []
                };
                this.colorOptions.push(this.colors[0]);
                this.colorOptions.push(this.colors[1]);
                this.legendData.push("课前成绩");
                this.legendData.push("课后成绩");
                this.getStudentData(this.studentOptions[c].children[s].userID, 0);
              }
              break;
            }
            // 性别
            case 1: {
              break;
            }
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            // 学期
            case 4: {
              break;
            }
            // 学年
            case 5: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 分数段-人数
        case 1: {
          switch (this.comparison) {
            // 性别
            case 1: {
              break;
            }
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            // 学期
            case 4: {
              break;
            }
            // 学年
            case 5: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 章节-评分
        case 2: {
          switch (this.comparison) {
            // 教师
            case 3: {
              break;
            }
            // 学期
            case 4: {
              break;
            }
            // 学年
            case 5: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 评分-人数
        case 3: {
          switch (this.comparison) {
            // 章节
            case 6: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 年份-总成绩
        case 4: {
          switch (this.comparison) {
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 年份-评分
        case 5: {
          switch (this.comparison) {
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 学期-总成绩
        case 6: {
          switch (this.comparison) {
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 学期-评分
        case 7: {
          switch (this.comparison) {
            // 班级
            case 2: {
              break;
            }
            // 教师
            case 3: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 班级-总成绩
        case 8: {
          switch (this.comparison) {
            // 学期
            case 4: {
              break;
            }
            // 学年
            case 5: {
              break;
            }
            default:
              break;
          }
          break;
        }
        // 班级-评分
        case 9: {
          switch (this.comparison) {
            // 学期
            case 4: {
              break;
            }
            // 学年
            case 5: {
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
            name: this.xyOptions[this.xy].xName,
            axisTick: { show: false },
            data: this.xData
          }
        ],
        yAxis: [
          {
            name: this.xyOptions[this.xy].yName,
            type: "value"
          }
        ],
        series: this.seriesData
      });
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
    }
  },
  created() {
    this.getCourses();
    this.getClassOptions();
    this.getSemesterOptions();
    this.getYearOptions();
    this.studentIndex = new Array(4);
    this.studentMap = new Array(4);
  },
  computed: {
    detailOptions() {
      let result = [];
      switch (this.comparison) {
        case 0: {
          result = this.studentOptions;
          break;
        }
        case 1: {
          result = this.genderOptions;
          break;
        }
        case 2: {
          result = this.classOptions;
          break;
        }
        case 3: {
          result = this.teacherOptions;
          break;
        }
        case 4: {
          result = this.semesterOptions;
          break;
        }
        case 5: {
          result = this.yearOptions;
          break;
        }
        case 6: {
          result = this.chapterOptions;
          break;
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
.main {
  padding-top: 20px;
  margin: 0 auto;
  width: 80%;
  height: 650px;
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
  height: 480px;
}

.content-card {
  width: 800px;
  height: 690px;
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

.search-button {
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}

.response {
  border-top: 1px solid #eaeef3;
  padding: 5px 20px 20px 20px;
}

.response .title {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #41abf1;
  padding-top: 15px;
  padding-bottom: 2px;
}

.response .rate {
  zoom: 90%;
  margin-top: 4px;
  margin-bottom: 3px;
}

.response .grade {
  letter-spacing: 0.6px;
  font-size: 12px;
}

.response .text {
  min-height: 100px;
  background-color: #fafafa;
  padding: 5px 10px 5px 10px;
}
</style>
