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
                <el-row>
                  <el-select
                    multiple
                    size="small"
                    v-model="detailValue"
                    @change="handleChange"
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
                      <el-row>
                          <div id="myChart" class="my-chart"></div>
                      </el-row>
                      <el-row v-if="comparison === 0">
                        <el-row v-for="(item, index) in detail" :key="index">
                          <el-row style="height: 100px" v-if="item !== undefined">
                            <el-row>
                              <el-row>{{item.label}}（copy teacher list）</el-row>
                              <el-row>
                                <el-col :span="4">本学年开课数：3</el-col>
                                <el-col :span="4">本学年选课人数：100</el-col>
                                <el-col :span="4">综合评分：4.5</el-col>
                              </el-row>
                            </el-row>
                          </el-row>
                        </el-row>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="反馈信息" name="2">
                      <el-row>
                        <el-col :span="2" style="margin-top: 5px">章节</el-col>
                        <el-col :span="5">
                          <el-select v-model="chapter" @change="handleResponse" size="small">
                            <el-option
                              v-for="item in chapterOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-rate
                            v-model="courseGrade"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                            style="zoom: 90%; margin-top: 8px;margin-left: 25px"
                          ></el-rate>
                        </el-col>
                        <el-col :span="9" align="right">
                          <el-input size="small" placeholder="输入关键词" style="width: 180px; margin-right: 10px"></el-input>
                        </el-col>
                        <el-col :span="3" align="right" style="padding-right: 21px;">
                          <el-button type="primary" size="small" class="search-button">搜索</el-button>
                        </el-col>
                      </el-row>
                      <div align="start" class="response" style="margin-top: 10px">
                        <el-row>
                          <el-col :span="6">
                            <div class="title">1612345 学生1</div>
                          </el-col>
                        </el-row>
                        
                        <el-row :gutter="10">
                          <el-col :span="6"><span class="grade">课前成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">课后成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">总成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">排名：15</span></el-col>
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
                        
                        <el-row style="margin-top: 8px">
                          <div class="text">反馈内容</div>
                        </el-row>
                      </div>
                      <div style="margin-top: 20px" align="start" class="response">
                        <el-row>
                            <div class="title">1612345 学生2</div>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="6"><span class="grade">课前成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">课后成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">总成绩：85</span></el-col>
                          <el-col :span="6"><span class="grade">排名：15</span></el-col>
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
                        <el-row style="margin-top: 8px">
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
      activeNames: ["1"],
      courseGrade: 4.5,
      xyOptions: [
        {
          value: 0,
          label: "课程-选课人数",
          xName: "课程",
          yName: "选课人数"
        },
        {
          value: 1,
          label: "年份-课程总成绩",
          xName: "年份",
          yName: "课程总成绩"
        },
        {
          value: 2,
          label: "学期-课程总成绩",
          xName: "学期",
          yName: "课程总成绩"
        },
        {
          value: 3,
          label: "课程-课程总成绩",
          xName: "课程",
          yName: "课程总成绩"
        },
        {
          value: 4,
          label: "年份-课程评分",
          xName: "年份",
          yName: "课程评分"
        },
        {
          value: 5,
          label: "学期-课程评分",
          xName: "学期",
          yName: "课程评分"
        }
      ],
      cOptions: [
        {
          value: 0,
          label: "教师",
          disabled: false,
          limit: 4,
          filterable: true
        },
        {
          value: 1,
          label: "课程",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 2,
          label: "学期",
          disabled: false,
          limit: 4,
          filterable: false
        },
        {
          value: 3,
          label: "学年",
          disabled: false,
          limit: 4,
          filterable: false
        }
      ],
      detail: [],
      xy: 0,
      comparison: 0,
      xData: [],
      yData: [],
      detailValue: [],
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
      courseOptions: [],
      courses: [],
      semesterOptions: [],
      semesters: [],
      yearOptions: [],
      years: [],
      chapterOptions: [],
      chapterList: [],
      chapter: 0,
      // 成绩 只能数字
      gradeList: [[88, 93, 90], [76, 82, 85], [90, 89, 95]],
      // 课程评分 只能数字
      evaluateList: [[4.3, 3.8, 4.1], [4.5, 4.2, 3.7]],
      // 人数 只能数字
      amountList: [[8, 17, 29, 18], [7, 19, 22, 24], [12, 16, 31, 13]],
      // 年份
      yearList: [],
      // 学期
      semesterList: [],
      // 课程
      courseList: [],
      colors: ["#003366", "#4cabce", "#e5323e"]
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
      // TODO: 获取教师列表
    },
    getSemesterOptions() {
      this.semesterOptions = [];
      // 登录时存teacherID
      this.$http
        .get("http://localhost:8080/getCoursesByTeacherID?teacherID=443", {
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
                this.semesterList.push(
                  courseList.data[i].courseInfo.courseYear +
                    courseList.data[i].courseInfo.courseSemester
                );
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
        .get("http://localhost:8080/getCoursesByTeacherID?teacherID=443", {
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
                this.yearList.push(
                  courseList.data[i].courseInfo.courseYear + "年"
                );
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
    getChapterOptions() {
      this.chapterOptions = [];
      // 登录时存teacherID
      this.$http
        .get("http://localhost:8080/getCourseCatalog?courseID=1", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.chapterOptions.push({
                  value: i,
                  label:
                    "第" +
                    courseList.data[i].id +
                    "章-" +
                    courseList.data[i].contentName
                });
                this.chapterList.push(courseList.data[i].contentName);
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
    getCourseOptions() {
      this.courseOptions = [];
      // 登录时存teacherID
      this.$http
        .get("http://localhost:8080/getAllCourses", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.courseOptions.push({
                  value: courseList.data[i].courseID,
                  label: courseList.data[i].courseName
                });
                this.courseList.push(courseList.data[i].courseName);
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
    // 下拉框事件
    handleComparison() {
      switch (this.xy) {
        // 课程-选课人数
        case 0: {
          this.comparison = 0;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.courseList;
          this.yData = this.amountList;
          break;
        }
        // 年份-课程总成绩
        case 1: {
          this.comparison = 0;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i > 1) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.yearList;
          this.yData = this.gradeList;
          break;
        }
        // 学期-课程总成绩
        case 2: {
          this.comparison = 0;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i > 1) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.semesterList;
          this.yData = this.gradeList;
          break;
        }
        // 课程-课程总成绩
        case 3: {
          this.comparison = 0;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 0) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.courseList;
          this.yData = this.gradeList;
          break;
        }
        // 年份-课程评分
        case 4: {
          this.comparison = 1;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 1) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.yearList;
          this.yData = this.evaluateList;
          break;
        }
        // 学期-评分
        case 5: {
          this.comparison = 1;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 1) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.semesterList;
          this.yData = this.evaluateList;
          break;
        }
        default:
          break;
      }
    },
    handleDetail() {
      this.detailValue = [];
      this.detail = [];
    },
    handleChange(val) {
      this.detail = [];
      for (let i in val) {
        this.detail.push(this.detailOptions[i]);
      }
    },
    handleResponse() {},
    // 按键事件
    getCharts() {
      // TODO: 发送请求获取图表数据
      this.drawChart();
    },
    // 图表绘制
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let seriesData = [];
      let colorOptions = [];
      let legendData = [];
      for (let i = 0; i < this.yData.length; i++) {
        seriesData.push({
          name: "对比组" + i,
          type: "bar",
          barGap: 0,
          data: this.yData[i]
        });
        colorOptions.push(this.colors[i]);
        legendData.push("对比组" + i);
      }
      // 绘制图表
      myChart.setOption({
        color: colorOptions,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        legend: {
          data: legendData
        },
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
        series: seriesData
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
    this.getCourseOptions();
    //this.getTeacherOptions();
    this.getSemesterOptions();
    this.getYearOptions();
    this.getChapterOptions();
    this.xData = this.courseList;
    this.yData = this.amountList;
  },
  mounted() {
    this.drawChart();
  },
  computed: {
    detailOptions() {
      let result = [];
      switch (this.comparison) {
        case 0: {
          result = this.teacherOptions;
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
