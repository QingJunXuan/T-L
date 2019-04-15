<template>
  <el-container>
    <el-main>
      <div class="main" align="start">
        <el-row>
          <el-button @click="goBack">
            <i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回
          </el-button>
        </el-row>
        <el-row>
          <h4>课程评分</h4>
          <el-rate
            v-model="courseGrade"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-row>
        <el-collapse v-model="activeNames" style="margin-top: 20px">
          <el-collapse-item title="成绩分析" name="1">
            <el-row :gutter="10">
              <el-col :span="6" style="padding-top: 4%">
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
                  <el-button type="primary" @click="getCharts" style="width: 70%" size="small">确定</el-button>
                </el-row>
              </el-col>
              <el-col :span="18">
                <div id="myChart" style="width: 90%;height: 500px;margin-top: 40px"></div>
              </el-col>
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
            <el-row :gutter="10">
              <el-col :span="4">
                <el-select v-model="chapter" @change="handleResponse" size="small">
                  <el-option
                    v-for="item in chapterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input size="small" placeholder="输入关键词"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="small">搜索</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top: 15px">
              <el-col :span="2">章节评分</el-col>
              <el-col :span="4">
                  <el-rate
                    v-model="courseGrade"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  ></el-rate>
              </el-col>
            </el-row>
            <div style="height: 150px; margin-top: 20px">
              <el-row>章节1</el-row>
              <el-row>1612345 学生1 2019-01-01 12:12:12</el-row>
              <el-row>评分：4.2</el-row>
              <el-row>
                <div style="height: 100px">反馈内容</div>
              </el-row>
            </div>
            <div style="height: 150px">
              <el-row>章节2</el-row>
              <el-row>1612345 学生1 2019-01-01 12:12:12</el-row>
              <el-row>评分：4.2</el-row>
              <el-row>
                <div style="height: 100px">反馈内容</div>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
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
  padding-top: 10px;
  margin: 0 auto;
  width: 80%;
  min-height: 650px;
}

.main .select {
  margin-top: 15px;
}

.main .select-title {
  font-size: 13px;
  margin: 15px 0 10px 0;
}
</style>
