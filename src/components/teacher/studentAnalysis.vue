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
          <el-col :span="4">
            <h4>1612345 学生姓名</h4>
          </el-col>
          <el-col :span="4"></el-col>
          <el-col :span="4">
            <h4>最近学到章节3</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <h4>平均课前成绩：85</h4>
          </el-col>
          <el-col :span="4">
            <h4>平均课后成绩：85</h4>
          </el-col>
          <el-col :span="4">
            <h4>平均总成绩：85</h4>
          </el-col>
          <el-col :span="4">
            <h4>最近班级排名：10↑</h4>
          </el-col>
        </el-row>
        <el-row>
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
                  <el-row>
                    <el-select
                      v-model="gradeAttribute"
                      @change="handleGrade"
                      size="small"
                      v-if="xy === 0"
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
                  <el-row class="select-title" v-if="gradeAttribute !== 3">对比组</el-row>
                  <el-row v-if="gradeAttribute !== 3">
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
                  <el-row
                    class="select-title"
                    v-if="comparison !== 2 && gradeAttribute !== 3"
                  >选择{{cOptions[comparison].label}}</el-row>
                  <el-row v-if="!(comparison === 0 || comparison === 2 || gradeAttribute === 3)">
                    <el-select
                      multiple
                      size="small"
                      v-model="detail"
                      :multiple-limit="cOptions[comparison].limit"
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
                  <el-row v-if="comparison === 0 && gradeAttribute !== 3">
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
                  <el-row class="select">
                    <el-button type="primary" @click="getCharts" style="width: 70%" size="small">确定</el-button>
                  </el-row>
                </el-col>
                <el-col :span="18">
                  <div id="myChart" style="width: 90%;height: 500px;margin-top: 40px"></div>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="成绩与反馈" name="2">
              <div style="height: 150px">
                <el-row>章节1</el-row>
                <el-row :gutter="10">
                  <el-col :span="6">课前成绩：85</el-col>
                  <el-col :span="6">课后成绩：85</el-col>
                  <el-col :span="6">总成绩：85</el-col>
                  <el-col :span="6">排名：15</el-col>
                </el-row>
                <el-row>评分：4.2</el-row>
                <el-row>
                  <div style="height: 100px">反馈内容</div>
                </el-row>
              </div>
              <div style="height: 150px">
                <el-row>章节2</el-row>
                <el-row :gutter="10">
                  <el-col :span="6">课前成绩：85</el-col>
                  <el-col :span="6">课后成绩：85</el-col>
                  <el-col :span="6">总成绩：85</el-col>
                  <el-col :span="6">排名：10</el-col>
                </el-row>
                <el-row>评分：4.2</el-row>
                <el-row>
                  <div style="height: 100px">反馈内容</div>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "studentAnalysis",
  data() {
    return {
      activeNames: ["1"],
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
        }
      ],
      cOptions: [
        {
          value: 0,
          label: "学生",
          disabled: false,
          limit: 4
        },
        {
          value: 1,
          label: "性别",
          disabled: false,
          limit: 1
        },
        {
          value: 2,
          label: "班级平均分",
          disabled: false,
          limit: 4
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
      xy: 0,
      comparison: 0,
      xData: [],
      yData: [],
      studentOptions: [],
      students: [],
      chapterList: [],
      studentMap: [],
      // 成绩 只能数字
      gradeList: [[88, 93, 90], [76, 82, 85]],
      // 课前成绩 只能数字
      gradePreList: [[88, 93, 90], [76, 82, 85]],
      // 课后成绩 只能数字
      gradeRevList: [[88, 93, 90], [76, 82, 85]],
      // 班级平均分
      gradeClass: [83, 84, 85],
      // 成绩阶段
      gradeEnumList: [60, 70, 80, 90],
      // 人数 只能数字
      amountList: [[8, 17, 29, 18], [7, 19, 22, 24], [12, 16, 31, 13]],
      colors: ["#003366", "#4cabce", "#e5323e"]
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
    // 获取列表
    getStudentOptions(index) {
      this.$http
        .get(
          "http://localhost:8080/getStudentsByClassID?courseClassID=" +
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
    getClassOptions() {
      this.studentOptions = [];
      // 登录时存teacherID
      // 根据课程号和老师id
      this.$http
        .get("http://localhost:8080/getCoursesByTeacherID?teacherID=443", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < classList.data.length) {
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
    // 下拉框事件
    handleComparison() {
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          this.comparison = 0;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 6) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.chapterList;
          this.yData = this.gradeList;
          break;
        }
        // 分数段-人数
        case 1: {
          this.comparison = 1;
          this.detail = [];
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 0 || i === 6) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          this.xData.length = 0;
          this.yData.length = 0;
          this.xData = this.gradeEnumList;
          this.yData = this.amountList;
          break;
        }
        default:
          break;
      }
    },
    handleChange(index) {
      let val = this.studentMap[index];
      if (Object.keys(val).length === 0) {
        this.detail[index] = undefined;
      } else {
        if (this.detail[index] !== undefined) {
          let lOld = this.detail[index][0];
          let rOld = this.detail[index][1];
          this.studentOptions[lOld - 1].children[rOld].disabled = false;
        }
        let lNew = val[0];
        let rNew = val[1];
        this.studentOptions[lNew - 1].children[rNew].disabled = true;
        this.detail[index] = this.objDeepCopy(
          this.studentOptions[lNew - 1].children[rNew]
        );
      }
    },
    handleGrade() {},
    handleDetail() {
      this.detail = [];
    },
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
    this.getChapterOptions();
    this.getClassOptions();
    this.xData = this.chapterList;
    this.yData = this.gradeList;
    this.detail = new Array(4);
  },
  mounted() {
    this.drawChart();
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
        default:
          break;
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
