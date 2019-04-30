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
            <div class="cardbody">
              <div class="info" align="start">
                <div>
                  <span>{{studentID}}</span>
                  <span>{{studentName}}</span>
                </div>
                <el-row style="margin-top: 3px">
                  <div style="padding-left: 11px; font-size: 12px; color: #8e8e8e">最近学习到 [{{currentName}}]</div>
                </el-row>
              </div>

              <div style="padding: 10px 20px 10px 20px" align="start">
                <el-tag type="danger" size="small" style="margin-top: 5px">学科</el-tag>
                <el-tag type="warning" size="small" style="margin-top: 5px">语言</el-tag>
                <el-tag type="success" size="small" style="margin-top: 5px">专业</el-tag>
                <el-tag type="info" size="small" style="margin-top: 5px">薄弱</el-tag>
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
                  <el-select v-model="gradeAttribute" size="small" class="select">
                    <el-option
                      v-for="item in gradeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row class="select-title" v-if="gradeAttribute !== 3">对比组</el-row>
                <el-row v-if="gradeAttribute !== 3">
                  <el-select v-model="comparison" size="small" @change="handleGradeAttribute">
                    <el-option
                      :disabled="item.disabled"
                      v-for="item in cOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-row v-if="comparison === 0 && gradeAttribute !== 3">
                <el-row class="select-title">选择{{cOptions[comparison].label}}</el-row>
                <el-row>
                  <el-row>
                    <el-select
                      v-model="studentMap[0]"
                      size="small"
                      filterable
                      clearable
                      @change="handleStudent(0)"
                    >
                      <el-option
                        v-for="item in studentOptions"
                        :disabled="item.disabled"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="select">
                    <el-select
                      v-model="studentMap[1]"
                      size="small"
                      filterable
                      clearable
                      @change="handleStudent(1)"
                    >
                      <el-option
                        v-for="item in studentOptions"
                        :disabled="item.disabled"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="select">
                    <el-select
                      v-model="studentMap[2]"
                      size="small"
                      filterable
                      clearable
                      @change="handleStudent(2)"
                    >
                      <el-option
                        v-for="item in studentOptions"
                        :disabled="item.disabled"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                </el-row>
                </el-row>
                <el-row v-if="xy === 1">
                  <el-row class="select-title">选择章节</el-row>
                <el-row>
                  <el-row>
                    <el-select
                      v-model="chapterSettings"
                      size="small"
                      filterable
                    >
                      <el-option
                        v-for="item in chapterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                </el-row>
                </el-row>
                <el-row class="select">
                  <el-button type="primary" @click="getCharts" class="select-button" size="small" :loading="drawLoading">确定</el-button>
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
                    </el-collapse-item>
                    <el-collapse-item title="成绩与反馈" name="2">
                      <div
                        align="start"
                        class="response"
                        v-for="item in studentInfo"
                        :key="item.id"
                      >
                        <el-row>
                          <div class="title">{{item.chapter}}</div>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="6">
                            <span class="grade">课前成绩：{{item.scorePre}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">课后成绩：{{item.scoreRev}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="grade">平均成绩：{{item.scoreAvg}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <div>
                            <el-rate
                              v-model="item.rate"
                              disabled
                              show-score
                              text-color="#ff9900"
                              score-template="{value}"
                              class="rate"
                            ></el-rate>
                          </div>
                        </el-row>
                        <el-row style="margin-top: 13px">
                          <div class="text">{{item.comments}}</div>
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
export default {
  name: "studentAnalysis",
  data() {
    return {
      // 传值
      studentID: 1612345,
      studentName: "学生姓名",
      userID: 0,
      courseID: 0,
      classID: 0,
      currentName: '',
      //
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
          label: "课前-课后平均成绩",
          disabled: false
        }
      ],
      gradeAttribute: 0,
      xy: 0,
      comparison: 0,
      xData: [],
      chapterOptions: [],
      chapterSettings: 0,
      // 学生和成绩
      studentOptions: [],
      studentMap: [],
      studentInfo: [],
      // 班级平均分
      gradeClass: [83, 84, 85],
      // 成绩阶段
      gradeEnumList: [60, 70, 80, 90],
      // 人数 只能数字
      amountList: [[8, 17, 29, 18], [7, 19, 22, 24], [12, 16, 31, 13]],
      colors: ["#0997F7", "#92DD22", "#FFFF33", "#FFAAEE"],
      seriesData: [],
      colorOptions: [],
      legendData: [],
      drawCount: 0,
      drawLoading: false
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
    // 进度
    getProcess() {
      this.$http
        .get(
          "/api/getCurrentProgress?courseClassID=" +
            this.classID +
            "&studentID=" +
            this.userID,
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
                this.currentName = res.data.contentName;
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
    getChapterOptions() {
      this.chapterOptions = [];
      this.$http
        .get("/api/getCourseCatalog?courseID=" + this.courseID, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i <= courseList.data.length) {
                this.chapterOptions.push({
                  value: i,
                  label: courseList.data[i].contentName,
                  id: courseList.data[i].id
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
    getStudentOptions() {
      this.$http
        .get("/api/getStudentsByClassID?courseClassID=" + this.classID, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let studentList = JSON.parse(response.bodyText);
              if (studentList.state === 1) {
                let i = 0;
                while (i < studentList.data.length) {
                  this.studentOptions.push({
                    id: studentList.data[i].userID,
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
    getStudentInfo(studentID) {
      this.studentInfo = [];
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
                this.studentInfo.push({
                  id: res.data[i].studentChapter.id,
                  scorePre: res.data[i].studentChapter.totalScore_1,
                  scoreRev: res.data[i].studentChapter.totalScore_2,
                  scoreAvg: avg,
                  comments: res.data[i].studentChapter.comment,
                  rate: Number(res.data[i].studentChapter.rate),
                  chapter: res.data[i].chapterName,
                  chapterID: res.data[i].studentChapter.chapterID
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
                i++;
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
    getGenderAndClassData(chapterID, index) {
      this.$http
        .get(
          "/api/getCourseScoreAndCommentByGender?courseID=" + this.courseID + "&chapterID=" + chapterID + "&getDetail=0&courseClassID=" + this.classID,
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
          "/api/getCourseScoreAndCommentByGender?courseID=" + this.courseID + "&chapterID=" + chapterID + "&getDetail=0&courseClassID=" + this.classID,
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
    handleComparison() {
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          this.comparison = 0;
          this.xData = new Array();
          this.gradeAttribute = 0;
          this.cOptions[0].disabled = false;
          this.studentMap = new Array(4);
          this.getCharts();
          break;
        }
        // 分数段-人数
        case 1: {
          this.comparison = 1;
          this.xData = new Array();
          this.gradeAttribute = 0;
          this.gradeOptions[3].disabled = true;
          this.cOptions[0].disabled = true;
          this.chapterSettings = 0;
          this.getCharts();
          break;
        }
        default:
          break;
      }
    },
    handleGradeAttribute() {
      if (this.comparison !== 0 && this.xy !== 1) {
        this.gradeOptions[3].disabled = true;
      }
      else {
        this.gradeOptions[3].disabled = false;
      }
    },
    handleStudent(index) {
      // TODO: 禁用
    },
    // 确认
    getCharts() {
      // TODO: 发送请求获取图表数据
      this.xData = [];
      this.seriesData = new Array();
      this.colorOptions = new Array();
      this.legendData = new Array();
      this.drawCount = 0;
      this.drawLoading = true;
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          for (let m = 0;m < this.studentInfo.length;m++) {
            let end = this.studentInfo[m].chapter.indexOf("章");
                  this.xData.push(
                    this.studentInfo[m].chapter.substring(0, end + 1)
                  );
          }
          switch (this.comparison) {
            // 学生
            case 0: {
              if (this.gradeAttribute !== 3) {
                // 获取自己的
                this.seriesData.push({
                  name: this.studentName,
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                });
                this.colorOptions.push(this.colors[0]);
                this.legendData.push(this.studentName.toString());
                this.getStudentData(this.userID, 0);
                let opIndex = 1;
                for (let i = 0; i < this.studentMap.length; i++) {
                  if (
                    this.studentMap[i] !== undefined &&
                    this.studentMap[i] !== ""
                  ) {
                    let index = this.studentMap[i];
                    this.seriesData.push({
                      name: this.studentOptions[index].label,
                      type: "bar",
                      barGap: 0,
                      data: new Array()
                    });
                    this.colorOptions.push(this.colors[opIndex]);
                    this.legendData.push(
                      this.studentOptions[index].label.toString()
                    );
                    this.getStudentData(this.studentOptions[index].id, opIndex);
                    opIndex += 1;
                  }
                }
              } else {
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
                this.getStudentData(this.userID, 0);
              }
              break;
            }
            // 性别
            case 1: {
              this.seriesData = new Array(2);
                this.seriesData[0] = {
                  name: "男生",
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                };
                this.seriesData[1] = {
                  name: "女生",
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                };
                this.colorOptions.push(this.colors[0]);
                this.colorOptions.push(this.colors[3]);
                this.legendData.push("男生");
                this.legendData.push("女生");
              for (let i = 0; i< this.studentInfo.length;i++) {
                this.seriesData[0].data.push(0);
                this.seriesData[1].data.push(0);
                this.getGenderAndClassData(this.studentInfo[i].chapterID, i)
              }
              break;
            }
            // 班级平均分
            case 2: {
              // 获取自己的
              this.seriesData = new Array(2);
              this.seriesData[0] = {
                name: this.studentName,
                type: "bar",
                barGap: 0,
                data: new Array()
              };
              this.seriesData[1] = {
                name: '班级平均',
                type: "bar",
                barGap: 0,
                data: new Array()
              };
              this.colorOptions.push(this.colors[0]);
              this.legendData.push(this.studentName.toString());
              this.getStudentData(this.userID, 0);
              for (let i = 0; i< this.studentInfo.length;i++) {
                this.seriesData[1].data.push(0);
                this.getGenderAndClassData(this.studentInfo[i].chapterID, i)
              }
              this.colorOptions.push(this.colors[2]);
                this.legendData.push("班级平均");
              break;
            }
            default:
              break;
          }
          break;
        }
        // 分数段-人数
        case 1: {
          this.xData = ['90-100', '80-90', '70-80', '60-70', '0-60']
          switch (this.comparison) {
            // 性别
            case 1: {
              this.seriesData = new Array(2);
                this.seriesData[0] = {
                  name: "男生",
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                };
                this.seriesData[1] = {
                  name: "女生",
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                };
                this.colorOptions.push(this.colors[0]);
                this.colorOptions.push(this.colors[3]);
                this.legendData.push("男生");
                this.legendData.push("女生");
                this.getScoreDistributeData(this.chapterOptions[this.chapterSettings].id)
              break;
            }
            // 班级平均分
            case 2: {
              // 获取自己的
              this.seriesData = new Array(1);
              this.seriesData[0] = {
                name: '班级',
                type: "bar",
                barGap: 0,
                data: new Array()
              };            
              this.colorOptions.push(this.colors[0]);
              this.legendData.push('班级');            
              this.getScoreDistributeData(this.chapterOptions[this.chapterSettings].id)
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
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.clear();
      this.drawCount++;
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
      if (this.comparison === 0 && this.drawCount >= Object.keys(this.studentMap).length || this.drawCount === this.studentInfo.length || (this.xy === 1) && this.drawCount === 1) {
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
    getParams() {
      this.studentID = this.$route.query.studentID;
      this.studentName = this.$route.query.studentName;
      this.courseID = this.$route.query.courseID;
      this.classID = this.$route.query.classID;
      this.userID = this.$route.query.userID;
    }
  },
  created() {
    this.getParams();
    this.seriesData.push({
      name: this.studentName,
      type: "bar",
      barGap: 0,
      data: new Array()
    });
    this.xData = new Array();
    this.colorOptions.push(this.colors[0]);
    this.legendData.push(this.studentName);
    this.getStudentData(this.userID, 0);
    this.getStudentInfo(this.userID);
    this.getStudentOptions();
    this.getChapterOptions();
    this.getProcess();
  },
  mounted() {
    this.drawChart();
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

.info {
  height: 50px;
  padding: 20px 10px 15px 10px;
  border-bottom: 1px solid #e7edf5;
}

.info > div > span {
  font-size: 24px;
  font-weight: bold;
  color: #41abf1;
  padding-left: 10px;
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
  margin-top: 10px;
}

.header {
  height: 42px;
  border-bottom: 1px solid #eaeef3;
}

.cardbody {
  height: 680px;
  position: relative;
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
