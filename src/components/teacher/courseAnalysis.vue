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
                <el-dropdown @command="handleCourse" trigger="click">
                  <div class="name">
                    <span>{{courseName}}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in courseOptions"
                      :key="item.value"
                      :command="item.value"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="grade" v-loading="courseLoading">
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
                  <el-row>
                    <el-col :span="6" class="text">班级数目</el-col>
                    <el-col
                      :span="18"
                      class="amount"
                      style="margin-top: 2px; padding-left: 5px"
                    >{{courseClassAmount}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="text">选课人数</el-col>
                    <el-col
                      :span="18"
                      class="amount"
                      style="margin-top: 1px"
                    >男生{{courseAmountBoy}}人 / 女生{{courseAmountGirl}}人</el-col>
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
                <el-row>
                  <el-select
                    v-model="gradeAttribute"
                    v-if="setGradeAttribute"
                    size="small"
                    class="select"
                  >
                    <el-option
                      v-for="item in gradeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-show="!item.disabled"
                    ></el-option>
                  </el-select>
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
                <el-row v-if="setChapter">
                  <el-row class="select-title">选择章节</el-row>
                  <el-row>
                    <el-select v-model="chapterSettings" size="small" filterable>
                      <el-option
                        v-for="item in chapterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-row>
                </el-row>
                <el-row class="select-title">选择{{cOptions[comparison].label}}</el-row>
                <el-row v-if="comparison !== 0 && comparison !== 1">
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
                <el-row v-if="comparison === 0">
                  <el-row>
                    <el-cascader
                      :options="studentOptions"
                      v-model="studentMap[0]"
                      @change="handleStudent(0)"
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
                        @change="handleStudent(1)"
                        filterable
                        size="small"
                        clearable
                      ></el-cascader>
                    </el-row>
                    <el-row class="select">
                      <el-cascader
                        :options="studentOptions"
                        v-model="studentMap[2]"
                        @change="handleStudent(2)"
                        filterable
                        size="small"
                        clearable
                      ></el-cascader>
                    </el-row>
                    <el-row class="select">
                      <el-cascader
                        :options="studentOptions"
                        v-model="studentMap[3]"
                        @change="handleStudent(3)"
                        filterable
                        size="small"
                        clearable
                      ></el-cascader>
                    </el-row>
                  </el-row>
                </el-row>
                <el-row v-if="comparison === 1">
                  <el-row>
                    <el-cascader
                      :options="genderOptions"
                      v-model="genderMap[0]"
                      @change="handleGender(0)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
                  <el-row class="select">
                    <el-cascader
                      :options="genderOptions"
                      v-model="genderMap[1]"
                      @change="handleGender(1)"
                      filterable
                      size="small"
                      clearable
                    ></el-cascader>
                  </el-row>
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
              <el-scrollbar wrap-style="height: 650px; margin-top: 5px" :native="false">
                <div>
                  <el-collapse v-model="activeNames" class="collapse" accordion>
                    <el-collapse-item title="数据分析" name="1">
                      <el-row>
                        <div id="myChart" class="my-chart"></div>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="教学反馈" name="2" id="start">
                      <el-row class="chapter-set">
                        <el-col
                          :span="7"
                          align="start"
                          style="padding-top: 5px; padding-bottom: 5px;"
                        >
                          <el-radio
                            v-model="responseType"
                            :label="0"
                            style="zoom: 90%"
                            @change="handleResponse"
                          >按课程</el-radio>
                          <el-radio
                            v-model="responseType"
                            :label="1"
                            style="zoom: 90%"
                            @change="handleResponse"
                          >按章节</el-radio>
                        </el-col>
                        <el-col :span="9" align="start" v-if="responseType === 1">
                          <el-select
                            v-model="chapterIndex"
                            @change="handleChapter"
                            filterable
                            size="small"
                            style="width: 250px"
                          >
                            <el-option
                              v-for="item in chapterOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="8" align="start" v-if="responseType === 1">
                          <el-rate
                            v-model="chapterRate"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                            style="zoom: 90%; margin-top: 8px;margin-left: 25px"
                          ></el-rate>
                        </el-col>
                      </el-row>
                      <el-row>
                        <div
                          align="start"
                          class="response"
                          style="margin-top: 10px"
                          v-for="(item, index) in classInfo"
                          :key="index"
                          v-loading="commentLoading"
                        >
                          <el-row>
                            <div class="title">班级{{item.classNum}}</div>
                          </el-row>
                          <el-row :gutter="5" style="margin-top: 20px">
                            <el-col :span="5" align="right">
                              <div class="notice" v-if="responseType === 0">课程评分</div>
                              <div class="notice" v-else>章节评分</div>
                            </el-col>
                            <el-col :span="14" style="padding-left: 20px">
                              <el-rate
                                v-model="item.rate"
                                disabled
                                show-score
                                text-color="#ff9900"
                                score-template="{value}"
                                class="rate"
                              ></el-rate>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10" style="margin-top: 20px">
                            <el-col :span="5" align="end">
                              <div class="notice">{{item.positive}}人赞赏</div>
                            </el-col>
                            <el-col :span="14" align="center">
                              <vs-bar :percentage="item.percentage" :studentNum="item.num" :width="90"></vs-bar>
                            </el-col>
                            <el-col :span="5" align="start">
                              <div class="notice">{{item.negative}}人吐槽</div>
                            </el-col>
                          </el-row>
                        </div>
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
  </el-container>
</template>

<script>
import echarts from "echarts";
import vsBar from "../tools/vsbar.vue";
export default {
  name: "courseAnalysis",
  components: {
    vsBar
  },
  data() {
    return {
      // 传值
      courseID: 0,
      teacherID: localStorage.getItem("userID"),
      teacherName: localStorage.getItem("name"),
      activeNames: ["1"],
      courseGrade: 0,
      courseAmountBoy: 0,
      courseAmountGirl: 0,
      courseClassAmount: 0,
      courseLoading: false,
      courseOptions: [],
      courseIndex: 0,
      courseName: "",
      courseNameID: 0,
      xyOptions: [
        {
          value: 0,
          label: "教学评分",
          children: [
            {
              value: 0,
              label: "按章节",
              xyValue: 2,
              xName: "课程章节",
              yName: "教学评分"
            },
            {
              value: 1,
              label: "按分数段",
              xyValue: 3,
              xName: "教学评分",
              yName: "人数"
            },
            {
              value: 2,
              label: "按学期",
              xyValue: 7,
              xName: "课程学期",
              yName: "教学评分"
            },
            {
              value: 3,
              label: "按学年",
              xyValue: 5,
              xName: "课程学年",
              yName: "教学评分"
            }
          ]
        },
        {
          value: 1,
          label: "学习成绩",
          children: [
            {
              value: 0,
              label: "按章节",
              xyValue: 0,
              xName: "课程章节",
              yName: "成绩分数"
            },
            {
              value: 1,
              label: "按分数段",
              xyValue: 1,
              xName: "成绩分数",
              yName: "人数"
            },
            {
              value: 2,
              label: "按学期",
              xyValue: 6,
              xName: "课程学期",
              yName: "课程成绩"
            },
            {
              value: 3,
              label: "按学年",
              xyValue: 4,
              xName: "课程学年",
              yName: "课程成绩"
            }
          ]
        }
      ],
      cOptions: [
        {
          value: 0,
          label: "学生",
          disabled: true,
          limit: 4
        },
        {
          value: 1,
          label: "性别",
          disabled: true,
          limit: 1
        },
        {
          value: 2,
          label: "班级",
          disabled: false,
          limit: 4
        },
        {
          value: 3,
          label: "教师",
          disabled: true,
          limit: 4
        },
        {
          value: 4,
          label: "章节",
          disabled: true,
          limit: 4
        }
      ],
      gradeOptions: [
        {
          value: 0,
          label: "总平均成绩",
          disabled: false
        },
        {
          value: 1,
          label: "课前平均成绩",
          disabled: false
        },
        {
          value: 2,
          label: "课后平均成绩",
          disabled: false
        },
        {
          value: 3,
          label: "课前-课后平均成绩",
          disabled: false
        }
      ],
      genderOptions: [],
      gradeAttribute: 0,
      detail: [],
      detailValue: [],
      xy: 2,
      xyIndex: [0, 0],
      comparison: 2,
      xData: [],
      setGradeAttribute: false,
      setChapter: false,
      teacherInfo: [],
      // 班级
      classOptions: [],
      // 成绩的选定章节
      chapterOptions: [],
      chapterSettings: 0,
      // 性别
      genderMap: [],
      genderIndex: [],
      // 反馈
      responseType: 0,
      chapterIndex: 0,
      chapterRate: 0,
      classInfo: [
        {
          classNum: 0,
          rate: 0,
          positive: "-",
          negative: "-",
          percentage: 0,
          num: 0
        }
      ],
      commentLoading: false,
      // 学生和成绩
      studentOptions: [],
      studentMap: [],
      studentIndex: [],
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
    // 获取列表
    getCourses() {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCoursesByTeacherID?teacherID=" +
            this.teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              if (courseList.state === 1) {
                let i = 0;
                let courseIndex = 0;
                this.courseID = courseList.data[i].courseInfo.courseID;
                this.courseName =
                  courseList.data[i].courseInfo.courseName +
                  "[" +
                  courseList.data[i].courseInfo.courseYear +
                  courseList.data[i].courseInfo.courseSemester +
                  "]";
                this.courseNameID = courseList.data[i].courseNameID;
                while (i < courseList.data.length) {
                  let notExist = true;
                  for (let j = 0; j < this.courseOptions.length; j++) {
                    if (
                      this.courseOptions[j].courseID ===
                      courseList.data[i].courseInfo.courseID
                    ) {
                      notExist = false;
                      break;
                    }
                  }
                  if (notExist) {
                    this.courseOptions.push({
                      value: courseIndex,
                      label:
                        courseList.data[i].courseInfo.courseName +
                        "[" +
                        courseList.data[i].courseInfo.courseYear +
                        courseList.data[i].courseInfo.courseSemester +
                        "]",
                      courseID: courseList.data[i].courseInfo.courseID,
                      courseNameID: courseList.data[i].courseNameID
                    });
                    courseIndex++;
                  }
                  i++;
                }
                this.getChapters();
                this.getTeacherInfo();
                this.getBaseInfo();
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
          "http://10.60.38.173:8765/getStudentsByClassID?courseClassID=" +
            this.studentOptions[index].id,
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
      this.genderOptions = [];
      // 登录时存teacherID
      this.$http
        .get(
          "http://10.60.38.173:8765/getClassesByCourseID?courseID=" +
            this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < classList.data.length) {
                this.classOptions.push({
                  value: i,
                  id: classList.data[i].id,
                  label: classList.data[i].classNum + "班"
                });
                this.studentOptions.push({
                  value: i,
                  id: classList.data[i].id,
                  label: classList.data[i].classNum + "班",
                  children: []
                });
                this.genderOptions.push({
                  value: i,
                  id: classList.data[i].id,
                  label: classList.data[i].classNum + "班",
                  children: new Array(2)
                });
                this.getStudentOptions(i);
                this.genderOptions[i].children[0] = {
                  value: 0,
                  label: "男生",
                  disabled: false
                };
                this.genderOptions[i].children[1] = {
                  value: 1,
                  label: "女生",
                  disabled: false
                };
                i++;
              }
              let n =
                this.classOptions.length < 4 ? this.classOptions.length : 4;
              for (let i = 0; i < n; i++) {
                this.detail.push(this.classOptions[i]);
                this.detailValue.push(i);
              }
              this.getClassInfo();
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
    getBaseInfo() {
      this.courseLoading = true;
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseClassAvgScore?courseID=" +
            this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              // 课程评分
              let rateAvg = Number(
                (
                  (classList.data.courseGirlAvgRate +
                    classList.data.courseBoyAvgRate) /
                  2
                ).toFixed(1)
              );
              this.courseGrade = rateAvg;
              this.courseAmountBoy = classList.data.courseBoyNum;
              this.courseAmountGirl = classList.data.courseGirlNum;
              this.courseClassAmount = classList.data.classInfo.length;
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
    // 教师
    getTeacherInfo() {
      this.teacherInfo = [];
      this.$http
        .get(
          "http://10.60.38.173:8765/getTeacherInfoByNID?courseNameID=" +
            this.courseNameID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              let teacherIndex = 0;
              while (i < courseList.data.length) {
                let notExist = true;
                for (let j = 0; j < this.teacherInfo.length; j++) {
                  if (
                    this.teacherInfo[j].teacherID ===
                    courseList.data[i].courseInfo.teacherID
                  ) {
                    this.teacherInfo[j].courseInfo.push({
                      courseID: courseList.data[i].courseInfo.courseID
                    });
                    notExist = false;
                    break;
                  }
                }
                if (notExist) {
                  this.teacherInfo.push({
                    value: teacherIndex,
                    label: courseList.data[i].courseInfo.teacherName,
                    teacherID: courseList.data[i].courseInfo.teacherID,
                    self: false,
                    courseInfo: [
                      {
                        courseID: courseList.data[i].courseInfo.courseID
                      }
                    ]
                  });
                  if (
                    courseList.data[i].courseInfo.teacherID === this.teacherID
                  ) {
                    this.teacherInfo[teacherIndex].self = true;
                  }
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
    // 章节
    getChapters() {
      this.chapterOptions = [];
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseCatalog?courseID=" + this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < courseList.data.length) {
                this.chapterOptions.push({
                  value: i,
                  label: courseList.data[i].contentName,
                  id: courseList.data[i].id
                });
                i++;
              }
              this.getClassOptions();
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getClassInfo() {
      this.commentLoading = true;
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseClassAvgScore?courseID=" +
            this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              if (this.classInfo[0].classNum === 0) {
                let i = 0;
                this.classInfo = [];
                while (i < classList.data.classInfo.length) {
                  this.classInfo.push({
                    classNum: i + 1, //classList.data.classInfo[i].classNum,
                    rate: Number(
                      Number(
                        (classList.data.classInfo[i].girlAvgRate +
                          classList.data.classInfo[i].boyAvgRate) /
                          2
                      ).toFixed(1)
                    ),
                    percentage: 0,
                    positive: "-",
                    negative: "-",
                    num: 0
                  });
                  i++;
                }
                this.getClassNLP();
              } else {
                let i = 0;
                while (i < classList.data.classInfo.length) {
                  this.classOptions[i].rate = Number(
                    Number(
                      (classList.data.classInfo[i].girlAvgRate +
                        classList.data.classInfo[i].boyAvgRate) /
                        2
                    ).toFixed(1)
                  );
                  this.classInfo[i].positive = "-";
                  this.classInfo[i].negative = "-";
                  i++;
                }
                this.getClassNLP();
              }
              this.commentLoading = false;
            } else {
              this.commentLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.commentLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getClassNLP() {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseClassNLPRateNum?courseID=" +
            this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < classList.data.classInfo.length) {
                for (let j = 0; j < this.classInfo.length; j++) {
                  if (
                    this.classInfo[j].classNum ===
                    classList.data.classInfo[i].classNum
                  ) {
                    this.classInfo[j].num = Number(
                        classList.data.classInfo[i].classPositiveNum +
                          classList.data.classInfo[i].classNegativeNum
                      );
                    if ( this.classInfo[j].num
                       !== 0
                    ) {
                      this.classInfo[j].percentage = Math.round(
                        Number(classList.data.classInfo[i].classPositiveNum) /
                          this.classInfo[j].num *
                          100
                      );
                    }
                    this.classInfo[j].positive =
                      classList.data.classInfo[i].classPositiveNum;
                    this.classInfo[j].negative =
                      classList.data.classInfo[i].classNegativeNum;
                  }
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
    // 按班级和章节获取反馈信息
    getChapterClassInfo(chapterID) {
      this.commentLoading = true;
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseScoreAndCommentByGender?chapterID=" +
            chapterID +
            "&getDetail=0",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              if (this.classInfo[0].classNum === 0) {
                let i = 0;
                this.classInfo = [];
                while (i < classList.data.length) {
                  this.classInfo.push({
                    classNum: classList.data[i].classNum,
                    rate: Number(
                      Number(classList.data[i].scoreInfo.totalRateAvg).toFixed(
                        1
                      )
                    ),
                    percentage: 0,
                    positive: "-",
                    negative: "-",
                    num: 0
                  });
                  i++;
                }
                this.getChapterClassNLP(chapterID);
              } else {
                let i = 0;
                while (i < this.classInfo.length) {
                  this.classInfo[i].rate = Number(
                    Number(classList.data[i].scoreInfo.totalRateAvg).toFixed(1)
                  );
                  this.classInfo[i].positive = "-";
                  this.classInfo[i].negative = "-";
                  i++;
                }
                this.getChapterClassNLP(chapterID);
              }
              this.chapterRate = Number(
                classList.data[0].scoreInfo.totalRateAvg.toFixed(1)
              );
              this.commentLoading = false;
            } else {
              this.commentLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.commentLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getChapterClassNLP(chapterID) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getChapterNLPRateNum?chapterID=" +
            chapterID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let classList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < classList.data.classInfo.length) {
                for (let j = 0; j < this.classInfo.length; j++) {
                  if (
                    this.classInfo[j].classNum ===
                    classList.data.classInfo[i].classNum
                  ) {
                    this.classInfo[j].num = Number(
                        classList.data.classInfo[i].classPositiveNum +
                          classList.data.classInfo[i].classNegativeNum
                      )
                    if (this.classInfo[j].num
                       !== 0
                    ) {
                      this.classInfo[j].percentage = Math.round(
                        Number(classList.data.classInfo[i].classPositiveNum) /
                          this.classInfo[j].num *
                          100
                      );
                    }
                    this.classInfo[j].positive =
                      classList.data.classInfo[i].classPositiveNum;
                    this.classInfo[j].negative =
                      classList.data.classInfo[i].classNegativeNum;
                  }
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
    getStudentScoreData(studentID, index, i) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseScoreAndComment?courseID=" +
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
              if (res.state === 1) {
                if (i >= res.data.length) {
                  return;
                }
                let avg =
                  (Number(res.data[i].studentChapter.totalScore_1) +
                    Number(res.data[i].studentChapter.totalScore_2)) /
                  2;
                if (this.xy === 0 && this.gradeAttribute !== 3) {
                  switch (this.gradeAttribute) {
                    case 0: {
                      // 总
                      this.seriesData[index].data[i] = avg;
                      break;
                    }
                    case 1: {
                      // 课前
                      this.seriesData[index].data[i] =
                        res.data[i].studentChapter.totalScore_1;
                      break;
                    }
                    case 2: {
                      // 课后
                      this.seriesData[index].data[i] =
                        res.data[i].studentChapter.totalScore_2;
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                }
                if (this.xy === 0 && this.gradeAttribute === 3) {
                  // 课前对比课后
                  this.seriesData[0].data[i] =
                    res.data[i].studentChapter.totalScore_1;
                  this.seriesData[1].data[i] =
                    res.data[i].studentChapter.totalScore_2;
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
    getOtherScoreData(chapterID, classID, index, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseScoreAndCommentByGender?courseID=" +
            this.courseID +
            "&chapterID=" +
            chapterID +
            "&getDetail=0&courseClassID=" +
            classID,
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
                if (this.comparison === 1) {
                  // 性别
                  switch (this.gradeAttribute) {
                    case 0: {
                      // 总
                      let avgBoy =
                        Number(res.data[0].scoreInfo.boyAverage1) +
                        Number(res.data[0].scoreInfo.boyAverage2) / 2;
                      let avgGirl =
                        Number(res.data[0].scoreInfo.girlAverage1) +
                        Number(res.data[0].scoreInfo.girlAverage2) / 2;
                      this.seriesData[0].data[index] = avgBoy.toFixed(2);
                      this.seriesData[1].data[index] = avgGirl.toFixed(2);
                      break;
                    }
                    case 1: {
                      // 课前
                      this.seriesData[0].data[
                        index
                      ] = res.data[0].scoreInfo.boyAverage1.toFixed(2);
                      this.seriesData[1].data[
                        index
                      ] = res.data[0].scoreInfo.girlAverage1.toFixed(2);
                      break;
                    }
                    case 2: {
                      // 课后
                      this.seriesData[0].data[
                        index
                      ] = res.data[0].scoreInfo.boyAverage2.toFixed(2);
                      this.seriesData[1].data[
                        index
                      ] = res.data[0].scoreInfo.girlAverage2.toFixed(2);
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                }
                if (this.comparison === 2) {
                  // 班级
                  switch (this.gradeAttribute) {
                    case 0: {
                      // 总
                      let avg =
                        Number(
                          res.data[0].scoreInfo.totalAverage1 +
                            res.data[0].scoreInfo.totalAverage2
                        ) / 2;
                      this.seriesData[seriesIndex].data[index] = avg.toFixed(2);
                      break;
                    }
                    case 1: {
                      // 课前
                      let avg = res.data[0].scoreInfo.totalAverage1;
                      this.seriesData[seriesIndex].data[index] = avg.toFixed(2);
                      break;
                    }
                    case 2: {
                      // 课后
                      let avg = res.data[0].scoreInfo.totalAverage2;
                      this.seriesData[seriesIndex].data[index] = avg.toFixed(2);
                      break;
                    }
                    default:
                      break;
                  }
                }
                this.drawChart();
              }
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
    getScoreDistributeData(chapterID, classID, seriesIndex, gender) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseScoreAndCommentByGender?courseID=" +
            this.courseID +
            "&chapterID=" +
            chapterID +
            "&getDetail=0&courseClassID=" +
            classID,
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
                    this.seriesData[seriesIndex].data =
                      gender === 0
                        ? res.data[0].scoreInfo.boyScoreAvgDistribute
                        : res.data[0].scoreInfo.girlScoreAvgDistribute;
                    break;
                  }
                  case 1: {
                    // 课前
                    this.seriesData[seriesIndex].data =
                      gender === 0
                        ? res.data[0].scoreInfo.boyScoreDistribute1
                        : res.data[0].scoreInfo.girlScoreDistribute1;
                    break;
                  }
                  case 2: {
                    this.seriesData[seriesIndex].data =
                      gender === 0
                        ? res.data[0].scoreInfo.boyScoreDistribute2
                        : res.data[0].scoreInfo.girlScoreDistribute2;
                    // 课后
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
              if (this.comparison === 2) {
                // 班级
                switch (this.gradeAttribute) {
                  case 0: {
                    // 总
                    this.seriesData[seriesIndex].data =
                      res.data[0].scoreInfo.totalScoreAvgDistribute;
                    break;
                  }
                  case 1: {
                    // 课前
                    this.seriesData[seriesIndex].data =
                      res.data[0].scoreInfo.totalScoreDistribute1;
                    break;
                  }
                  case 2: {
                    // 课后
                    this.seriesData[seriesIndex].data =
                      res.data[0].scoreInfo.totalScoreDistribute2;
                    break;
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
    getClassRateData(chapterID, classID, index, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseScoreAndCommentByGender?courseID=" +
            this.courseID +
            "&chapterID=" +
            chapterID +
            "&getDetail=0&courseClassID=" +
            classID,
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
              if (res.data[0].scoreInfo.totalRateAvg !== undefined) {
                this.seriesData[seriesIndex].data[
                  index
                ] = res.data[0].scoreInfo.totalRateAvg.toFixed(2);
                this.drawChart();
              }
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
    getRateDistribute(chapterID, seriesIndex) {
      this.$http
        .get(
          "http://10.60.38.173:8765/question/rateNumber?chapterId=" + chapterID,
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
              this.seriesData[seriesIndex].data = res.data;
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
    getTeacherYearRateData(teacherID, seriesIndex, self) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            this.courseNameID +
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
              if (res.state === 1) {
                if (self) {
                  for (var key in res.data.year) {
                    this.xData.push(key);
                    this.seriesData[seriesIndex].data.push(
                      Number(res.data.year[key].rate).toFixed(1)
                    );
                  }
                } else {
                  this.seriesData[seriesIndex].data = new Array(
                    this.xData.length
                  );
                  for (var key in res.data.year) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.year[key].rate
                      ).toFixed(1);
                    }
                  }
                }
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
    getTeacherSemesterRateData(teacherID, seriesIndex, self) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            this.courseNameID +
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
              if (res.state === 1) {
                if (self) {
                  for (var key in res.data.semester) {
                    this.xData.push(key);
                    this.seriesData[seriesIndex].data.push(
                      Number(res.data.semester[key].rate).toFixed(1)
                    );
                  }
                } else {
                  this.seriesData[seriesIndex].data = new Array(
                    this.xData.length
                  );
                  for (var key in res.data.semester) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.semester[key].rate
                      ).toFixed(1);
                    }
                  }
                }
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
    getTeacherYearScoreData(teacherID, seriesIndex, self) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            this.courseNameID +
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
              if (res.state === 1) {
                if (self) {
                  for (var key in res.data.year) {
                    this.xData.push(key);
                    this.seriesData[seriesIndex].data.push(
                      Number(res.data.year[key].score).toFixed(2)
                    );
                  }
                } else {
                  this.seriesData[seriesIndex].data = new Array(
                    this.xData.length
                  );
                  for (var key in res.data.year) {
                    let index = this.xData.indexOf(key);
                    if (index !== -1) {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.year[key].score
                      ).toFixed(2);
                    }
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
    getTeacherSemesterScoreData(teacherID, seriesIndex, self) {
      this.$http
        .get(
          "http://10.60.38.173:8765/getCourseYearAvgScoreRate?courseNameID=" +
            this.courseNameID +
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
              if (res.state === 1) {
                if (self) {
                  for (var key in res.data.semester) {
                    this.xData.push(key);
                    this.seriesData[seriesIndex].data.push(
                      Number(res.data.semester[key].score).toFixed(2)
                    );
                  }
                } else {
                  this.seriesData[seriesIndex].data = new Array(
                    this.xData.length
                  );
                  for (var key in res.data.semester) {
                    let index = this.xData.indexOf(key);
                    if (index === -1) continue;
                    else {
                      this.seriesData[seriesIndex].data[index] = Number(
                        res.data.semester[key].score
                      ).toFixed(2);
                    }
                  }
                }
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
    // 下拉框事件
    handleCourse(val) {
      this.drawLoading = false;
      this.courseID = this.courseOptions[val].courseID;
      this.courseName = this.courseOptions[val].label;
      this.courseNameID = this.courseOptions[val].courseNameID;
      this.detailValue = [];
      this.detail = [];
      this.xyIndex = [0, 0];
      this.xy = 2;
      this.comparison = 2;
      this.getChapters();
      this.getTeacherInfo();
      this.getBaseInfo();
      this.studentIndex = new Array(4);
      this.studentMap = new Array(4);
      this.genderMap = new Array(2);
      this.genderIndex = new Array(2);
    },
    handleComparison(val) {
      this.drawLoading = false;
      this.xy = this.xyOptions[val[0]].children[val[1]].xyValue;
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          this.comparison = 0;
          this.gradeAttribute = 0;
          this.chapterSettings = 0;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = true;
          this.setChapter = false;
          this.gradeOptions[3].disabled = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 4 || i === 3) this.cOptions[i].disabled = true;
            else this.cOptions[i].disabled = false;
          }
          break;
        }
        // 分数段-人数
        case 1: {
          this.comparison = 1;
          this.gradeAttribute = 0;
          this.chapterSettings = 0;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = true;
          this.setChapter = true;
          this.gradeOptions[3].disabled = true;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 1 || i === 2) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 章节-评分
        case 2: {
          this.comparison = 2;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = false;
          this.setChapter = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 2) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 评分-人数
        case 3: {
          this.comparison = 4;
          this.detail = [];
          this.detailValue = [];
          this.setChapter = false;
          this.setGradeAttribute = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 4) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 年份-总成绩
        case 4: {
          this.comparison = 3;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = false;
          this.setChapter = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 年份-评分
        case 5: {
          this.comparison = 3;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = false;
          this.setChapter = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 学期-总成绩
        case 6: {
          this.comparison = 3;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = false;
          this.setChapter = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        // 学期-评分
        case 7: {
          this.comparison = 3;
          this.detail = [];
          this.detailValue = [];
          this.setGradeAttribute = false;
          this.setChapter = false;
          this.drawLoading = false;
          for (let i = 0; i < this.cOptions.length; i++) {
            if (i === 3) this.cOptions[i].disabled = false;
            else this.cOptions[i].disabled = true;
          }
          break;
        }
        default:
          break;
      }
    },
    handleDetail() {
      this.drawLoading = false;
      this.detailValue = [];
      this.detail = [];
      this.gradeAttribute = 0;
      if (this.comparison === 0) {
        this.gradeOptions[3].disabled = false;
      } else {
        this.gradeOptions[3].disabled = true;
      }
    },
    handleDetailValue(val) {
      this.detail = [];
      for (let i = 0; i < this.detailValue.length; i++) {
        this.detail.push(this.detailOptions[this.detailValue[i]]);
      }
    },
    handleStudent(index) {
      let val = this.studentMap[index];
      if (
        this.studentIndex[index] !== undefined &&
        Object.keys(val).length === 0
      ) {
        // 原来有值现在没值
        let c = this.studentIndex[index][0];
        let s = this.studentIndex[index][1];
        this.studentOptions[c].children[s].disabled = false;
      } else {
        // 现在有值
        let c = val[0];
        let s = val[1];
        this.studentOptions[c].children[s].disabled = true;
        this.studentIndex[index] = new Array();
        this.studentIndex[index] = val;
      }
    },
    handleGender(index) {
      let val = this.genderMap[index];
      if (
        this.genderIndex[index] !== undefined &&
        Object.keys(val).length === 0
      ) {
        // 原来有值现在没值
        let c = this.genderIndex[index][0];
        let s = this.genderIndex[index][1];
        this.genderOptions[c].children[s].disabled = false;
      } else {
        // 现在有值
        let c = val[0];
        let s = val[1];
        this.genderOptions[c].children[s].disabled = true;
        this.genderIndex[index] = new Array();
        this.genderIndex[index] = val;
      }
    },
    handleChapter(val) {
      let chapterID = this.chapterOptions[val].id;
      this.getChapterClassInfo(chapterID);
    },
    handleResponse() {
      if (this.responseType === 0) {
        this.classInfo = [
          {
            classNum: 0,
            rate: 0,
            positive: "-",
            negative: "-",
            percentage: 0,
            num: 0
          }
        ];
        this.getClassInfo();
      }
      if (this.responseType === 1) {
        this.classInfo = [
          {
            classNum: 0,
            rate: 0,
            positive: "-",
            negative: "-",
            percentage: 0,
            num: 0
          }
        ];
        this.getChapterClassInfo(this.chapterOptions[this.chapterSettings].id);
      }
    },
    // 按键事件
    getCharts() {
      this.xData = new Array();
      this.seriesData = new Array();
      this.colorOptions = new Array();
      this.legendData = new Array();
      this.drawLoading = true;
      this.drawCount = 0;
      switch (this.xy) {
        // 章节-平均成绩
        case 0: {
          for (let m = 0; m < this.chapterOptions.length; m++) {
            this.xData.push(this.chapterOptions[m].label);
          }
          switch (this.comparison) {
            // 学生
            case 0: {
              if (this.gradeAttribute !== 3) {
                let opIndex = 0;
                for (let i = 0; i < this.studentMap.length; i++) {
                  let val = this.studentMap[i];
                  if (val !== undefined && Object.keys(val).length !== 0) {
                    let c = val[0];
                    let s = val[1];
                    this.seriesData.push({
                      name: this.studentOptions[c].children[s].label,
                      type: "bar",
                      barGap: 0,
                      data: new Array(this.chapterOptions.length)
                    });
                    this.colorOptions.push(this.colors[opIndex]);
                    this.legendData.push(
                      this.studentOptions[c].children[s].label.toString()
                    );
                    for (let j = 0; j < this.chapterOptions.length; j++) {
                      this.getStudentScoreData(
                        this.studentOptions[c].children[s].userID,
                        opIndex,
                        j
                      );
                    }
                    opIndex += 1;
                  }
                }
                if (this.seriesData.length === 0) {
                  this.$message({
                    type: "warning",
                    message: "请选择学生!"
                  });
                  this.drawLoading = false;
                }
              } else {
                let val = this.studentMap[0];
                let c = val[0];
                let s = val[1];
                this.seriesData = new Array(2);
                this.seriesData[0] = {
                  name: "课前成绩",
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.chapterOptions.length)
                };
                this.seriesData[1] = {
                  name: "课后成绩",
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.chapterOptions.length)
                };
                this.colorOptions.push(this.colors[0]);
                this.colorOptions.push(this.colors[1]);
                this.legendData.push("课前成绩");
                this.legendData.push("课后成绩");
                for (let j = 0; j < this.chapterOptions.length; j++) {
                  this.getStudentScoreData(
                    this.studentOptions[c].children[s].userID,
                    0,
                    j
                  );
                }
              }
              break;
            }
            // 性别
            case 1: {
              for (let i = 0; i < 2; i++) {
                let val = this.genderMap[i];
                if (val === undefined || Object.keys(val).length === 0) {
                  this.$message({
                    type: "warning",
                    message: "请将选项选择完整!"
                  });
                  this.drawLoading = false;
                  return;
                }
                let c = val[0];
                let g = val[1];
                this.seriesData.push({
                  name:
                    this.genderOptions[c].label +
                    this.genderOptions[c].children[g].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.chapterOptions.length)
                });
                this.legendData.push(
                  this.genderOptions[c].label +
                    this.genderOptions[c].children[g].label
                );
                for (let j = 0; j < this.chapterOptions.length; j++) {
                  this.getOtherScoreData(
                    this.chapterOptions[j].id,
                    this.genderOptions[c].id,
                    j
                  );
                }
              }
              this.colorOptions.push(this.colors[2]);
              this.colorOptions.push(this.colors[1]);
              break;
            }
            // 班级
            case 2: {
              if (this.detail.length === 0) {
                this.$message({
                  type: "warning",
                  message: "请选择班级!"
                });
                this.drawLoading = false;
                return;
              }
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.chapterOptions.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.chapterOptions.length; j++) {
                  this.getOtherScoreData(
                    this.chapterOptions[j].id,
                    this.detail[i].id,
                    j,
                    i
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
        // 分数段-人数
        case 1: {
          this.xData = ["60以下", "60-70", "70-80", "80-90", "90-100"];
          switch (this.comparison) {
            // 性别
            case 1: {
              for (let i = 0; i < 2; i++) {
                let val = this.genderMap[i];
                if (val === undefined || Object.keys(val).length === 0) {
                  this.$message({
                    type: "warning",
                    message: "请将选项选择完整!"
                  });
                  this.drawLoading = false;
                  return;
                }
                let c = val[0];
                let g = val[1];
                this.seriesData.push({
                  name:
                    this.genderOptions[c].label +
                    this.genderOptions[c].children[g].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(6)
                });
                this.legendData.push(
                  this.genderOptions[c].label +
                    this.genderOptions[c].children[g].label
                );
                this.getScoreDistributeData(
                  this.chapterOptions[this.chapterSettings].id,
                  this.genderOptions[c].id,
                  i,
                  this.genderOptions[c].children[g].value
                );
              }
              this.colorOptions.push(this.colors[2]);
              this.colorOptions.push(this.colors[1]);
              break;
            }
            // 班级
            case 2: {
              if (this.detail.length === 0) {
                this.$message({
                  type: "warning",
                  message: "请选择班级!"
                });
                this.drawLoading = false;
                return;
              }
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(6)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getScoreDistributeData(
                  this.chapterOptions[this.chapterSettings].id,
                  this.detail[i].id,
                  i
                );
              }
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
            // 班级
            case 2: {
              for (let m = 0; m < this.chapterOptions.length; m++) {
                this.xData.push(this.chapterOptions[m].label);
              }
              if (this.detail.length === 0) {
                this.$message({
                  type: "warning",
                  message: "请选择班级!"
                });
                this.drawLoading = false;
                return;
              }
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(this.chapterOptions.length)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                for (let j = 0; j < this.chapterOptions.length; j++) {
                  this.getClassRateData(
                    this.chapterOptions[j].id,
                    this.detail[i].id,
                    j,
                    i
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
        // 评分-人数
        case 3: {
          this.xData = ["1分", "2分", "3分", "4分", "5分"];
          switch (this.comparison) {
            // 章节
            case 4: {
              if (this.detail.length === 0) {
                this.$message({
                  type: "warning",
                  message: "请选择章节!"
                });
                this.drawLoading = false;
                return;
              }
              for (let i = 0; i < this.detail.length; i++) {
                this.seriesData.push({
                  name: this.detail[i].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array(5)
                });
                this.colorOptions.push(this.colors[i]);
                this.legendData.push(this.detail[i].label);
                this.getRateDistribute(this.detail[i].id, i);
              }
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
            // 教师
            case 3: {
              // 获取自己的
              this.seriesData.push({
                name: this.teacherName,
                type: "bar",
                barGap: 0,
                data: new Array()
              });
              this.colorOptions.push(this.colors[0]);
              this.legendData.push(this.teacherName);
              this.getTeacherYearScoreData(this.teacherID, 0, true);
              for (let k = 0; k < this.detail.length; k++) {
                this.seriesData.push({
                  name: this.detail[k].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                });
                this.colorOptions.push(this.colors[k + 1]);
                this.legendData.push(this.detail[k].label);
                this.getTeacherYearScoreData(
                  this.detail[k].teacherID,
                  k + 1,
                  false
                );
              }
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
            // 教师
            case 3: {
              // 获取自己的
              this.seriesData.push({
                name: this.teacherName,
                type: "bar",
                barGap: 0,
                data: new Array()
              });
              this.colorOptions.push(this.colors[0]);
              this.legendData.push(this.teacherName);
              this.getTeacherYearRateData(this.teacherID, 0, true);
              for (let k = 0; k < this.detail.length; k++) {
                this.seriesData.push({
                  name: this.detail[k].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                });
                this.colorOptions.push(this.colors[k + 1]);
                this.legendData.push(this.detail[k].label);
                this.getTeacherYearRateData(
                  this.detail[k].teacherID,
                  k + 1,
                  false
                );
              }
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
            // 教师
            case 3: {
              // 获取自己的
              this.seriesData.push({
                name: this.teacherName,
                type: "bar",
                barGap: 0,
                data: new Array()
              });
              this.colorOptions.push(this.colors[0]);
              this.legendData.push(this.teacherName);
              this.getTeacherSemesterScoreData(this.teacherID, 0, true);
              for (let k = 0; k < this.detail.length; k++) {
                this.seriesData.push({
                  name: this.detail[k].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                });
                this.colorOptions.push(this.colors[k + 1]);
                this.legendData.push(this.detail[k].label);
                this.getTeacherSemesterScoreData(
                  this.detail[k].teacherID,
                  k + 1,
                  false
                );
              }
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
            // 教师
            case 3: {
              // 获取自己的
              this.seriesData.push({
                name: this.teacherName,
                type: "bar",
                barGap: 0,
                data: new Array()
              });
              this.colorOptions.push(this.colors[0]);
              this.legendData.push(this.teacherName);
              this.getTeacherSemesterRateData(this.teacherID, 0, true);
              for (let k = 0; k < this.detail.length; k++) {
                this.seriesData.push({
                  name: this.detail[k].label,
                  type: "bar",
                  barGap: 0,
                  data: new Array()
                });
                this.colorOptions.push(this.colors[k + 1]);
                this.legendData.push(this.detail[k].label);
                this.getTeacherSemesterRateData(
                  this.detail[k].teacherID,
                  k + 1,
                  false
                );
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
      if (
        this.comparison <= 1 ||
        (this.comparison === 3 && this.drawCount > this.detail.length) ||
        ((this.comparison === 2 || this.comparison === 4) &&
          this.drawCount === this.detail.length)
      ) {
        this.drawLoading = false;
      }
    }
  },
  created() {
    this.getCourses();
    this.studentIndex = new Array(4);
    this.studentMap = new Array(4);
    this.genderMap = new Array(2);
    this.genderIndex = new Array(2);
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
          result = this.teacherInfo;
          break;
        }
        case 4: {
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

.course-info .grade .amount {
  font-size: 13px;
  letter-spacing: 1px;
}

.course-info .name {
  height: 40px;
  padding: 15px 10px 15px 20px;
  border-bottom: 1px solid #e7edf5;
  cursor: pointer;
}

.course-info .name span {
  font-size: 21px;
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

.chapter-set {
  border-top: 1px solid #eaeef3;
  padding: 10px 20px 0 40px;
}

.chapter-set .notice {
  letter-spacing: 0.6px;
  font-size: 12px;
}

.response {
  border-top: 1px solid #eaeef3;
  padding: 20px 40px 20px 40px;
}

.response .notice {
  letter-spacing: 0.6px;
  font-size: 13px;
  color: #616161;
}

.response .title {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #41abf1;
  padding-top: 2px;
  padding-bottom: 2px;
}

.response .rate {
  zoom: 90%;
  margin-top: 2px;
  margin-bottom: 3px;
}
</style>
