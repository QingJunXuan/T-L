<template>
  <el-container class="main">
    <div align="start" style="width: 100%">
      <el-dialog title="请选择截止时间" :visible.sync="dialogTableVisible">
        <div align="center">
          <el-date-picker v-model="time" type="date" size="small" :picker-options="startLimit"></el-date-picker>
          <el-button
            @click="publish"
            :loading="publishLoading"
            type="primary"
            size="small"
            class="confirm-button"
          >确认</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="请选择习题"
        :visible.sync="selectHistoryVisible"
        style="width: 80%; margin: 0 auto"
      >
        <el-row type="flex" justify="center">
          <span style="margin-top: 5px; margin-right: 10px">历史课程</span>
          <el-select size="small" v-model="importSettings" @change="handleChapter">
            <el-option
              v-for="item in importData"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 10px">
          <span style="margin-top: 5px; margin-right: 10px">选择章节</span>
          <el-select size="small" v-model="chapterSettings">
            <el-option
              v-for="item in chapterData"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-row>
        <el-row style="margin-top: 20px;">
          <div
            style="width: 70%; margin: 0 auto; font-size: 12px;"
          >注：你可以将指定学期的某课程中指定章节的习题内容导入成为现在的习题内容，导入的习题将覆盖你所保存的全部习题。</div>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 15px">
          <el-button
            type="primary"
            size="small"
            @click="confirmImport()"
            :loading="importLoading"
          >提交</el-button>
        </el-row>
      </el-dialog>
      <!-- 客观题 -->
      <h4>客观题({{totalObject}}分)</h4>
      <div v-for="(item1, i) in exercisesObj" :key="100+i" align="start" class="exercises">
        <!-- 正常显示 -->
        <div v-if="item1.edit === false" :class="item1.delete? 'is-deleted' : ''">
          <div class="title">
            <pre>{{item1.order}}.（{{item1.score}}分）{{item1.question}}</pre>
          </div>
          <div v-if="item1.type === 4" style="margin: 15px 0 15px 0">
            <el-radio-group v-model="item1.answer[0]" @change="item1.edited = false">
              <div v-for="(item2, j) in item1.options" :key="j" style="margin-top: 10px">
                <el-radio
                  :disabled="item1.delete"
                  :label="j"
                >{{String.fromCharCode(j+65)}}. {{item2.content}}</el-radio>
              </div>
            </el-radio-group>
          </div>
          <div v-else-if="item1.type === 5" style="margin: 15px 0 15px 0">
            <el-checkbox-group v-model="item1.answer" @change="item1.edited = false">
              <div v-for="(item2, j) in item1.options" :key="j" style="margin-top: 10px">
                <el-checkbox
                  :disabled="item1.delete"
                  :label="j"
                >{{String.fromCharCode(j+65)}}. {{item2.content}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div class="detail">
            <pre>{{item1.detail}}</pre>
          </div>
          <div style="margin-top: 15px;" v-if="!item1.delete">
            <span>
              <!-- 进入编辑模式 -->
              <el-button
                size="mini"
                @click="editObject(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >编辑</el-button>
            </span>
            <!-- 删除习题 -->
            <span>
              <el-button
                size="mini"
                @click="deleteObject(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >删除</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveObjUp(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >上移</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveObjDown(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >下移</el-button>
            </span>
          </div>
          <div style="margin-top: 10px;" v-else>
            <span>
              <el-button size="mini" @click="cancelDeleteObject(i)" type="success" round>恢复</el-button>
            </span>
          </div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{i+1}}.</p>
            <p>
              <el-input
                v-model="objectNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容"
              ></el-input>
            </p>
            <el-row style="margin-top: 20px">
              <el-col :span="3" style="padding-top: 5px;">
                <el-radio v-model="objectNew.type" :label="4" @change="handleType">单选题</el-radio>
              </el-col>
              <el-col :span="3" style="padding-top: 5px;">
                <el-radio v-model="objectNew.type" :label="5" @change="handleType">多选题</el-radio>
              </el-col>
              <el-col :span="18" align="right">
                <div>
                  <span>分值</span>
                  <span style="margin-left: 5px">
                    <el-input
                      size="mini"
                      type="number"
                      v-model="objectNew.score"
                      style="width: 80px"
                    ></el-input>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 15px" class="betweenspace">
            <div v-for="j in objectNew.options.length" :key="100+i+j" style="margin-top: 10px">
              <span>{{String.fromCharCode(j+64)}}.</span>
              <span style="margin-left: 7px">
                <el-input v-model="objectNew.options[j-1].content" size="mini" style="width: 240px"></el-input>
              </span>
              <span>
                <el-button type="text" @click="deleteObjOption(j-1)">
                  <i class="el-icon-circle-close"></i>
                </el-button>
              </span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <!-- 添加选项 -->
            <el-button size="small" round @click="addRevOptions()" type="primary" plain>
              <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项
            </el-button>
          </div>
          <div style="margin-top: 15px">
            <!-- 设置答案 -->
            <p>答案</p>
            <p style="margin-top: 10px" v-if="objectNew.type === 4">
              <el-radio-group v-model="objectNew.answer[0]">
                <el-radio
                  v-for="j in objectNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-radio>
              </el-radio-group>
            </p>
            <p style="margin-top: 10px" v-else-if="objectNew.type === 5">
              <el-checkbox-group v-model="objectNew.answer">
                <el-checkbox
                  v-for="j in objectNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-checkbox>
              </el-checkbox-group>
            </p>
          </div>
          <div style="margin-top: 15px">
            <!-- 题目解析 -->
            <p>解析</p>
            <el-input
              v-model="objectNew.detail"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析"
            ></el-input>
          </div>
          <!-- 按键 -->
          <div style="margin-top: 20px">
            <el-button size="mini" @click="saveObject(i)" type="primary" round plain>确认</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="resetObject(i)"
              type="primary"
              round
              plain
            >重置</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="cancelObj(i)"
              type="primary"
              round
              plain
            >取消</el-button>
          </div>
        </div>
      </div>
      <div v-show="objectButton">
        <el-button
          size="small"
          round
          style="margin-top: 20px"
          type="primary"
          plain
          @click="addReviewO"
        >
          <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题
        </el-button>
      </div>
      <!-- 主观题 -->
      <h4>主观题({{totalSubject}}分)</h4>
      <!-- 正常显示 -->
      <div
        v-for="(item, i) in exercisesSub"
        :key="i+600"
        align="start"
        style="font-size: 14px"
        class="exercises"
      >
        <div v-if="item.edit === false" :class="item.delete? 'is-deleted' : ''">
          <div class="title">
            <pre>{{item.order}}.（{{item.score}}分）{{item.question}}</pre>
          </div>
          <div class="answer-text">
            <pre>{{item.answer}}</pre>
          </div>
          <div class="detail">
            <pre>{{item.detail}}</pre>
          </div>
          <div style="margin-top: 15px;" v-if="!item.delete">
            <span>
              <!-- 进入编辑模式 -->
              <el-button
                size="mini"
                @click="editSubject(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >编辑</el-button>
            </span>
            <!-- 删除习题 -->
            <span>
              <el-button
                size="mini"
                @click="deleteSubject(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >删除</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveSubUp(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >上移</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveSubDown(i)"
                type="primary"
                round
                plain
                class="edit-button"
              >下移</el-button>
            </span>
          </div>
          <div style="margin-top: 10px;" v-else>
            <span>
              <el-button size="mini" @click="cancelDeleteSubject(i)" type="success" round>恢复</el-button>
            </span>
          </div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{item.order}}.</p>
            <p>
              <el-input
                v-model="subjectNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容"
              ></el-input>
            </p>
          </div>
          <div>
            <span>分值</span>
            <span style="margin-left: 5px">
              <el-input size="mini" type="number" v-model="subjectNew.score" style="width: 80px"></el-input>
            </span>
          </div>
          <div style="margin-top: 15px">
            <p>答案</p>
            <el-input
              v-model="subjectNew.answer"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目答案"
            ></el-input>
          </div>
          <div style="margin-top: 15px">
            <p>解析</p>
            <el-input
              v-model="subjectNew.detail"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析"
            ></el-input>
          </div>
          <div style="margin-top: 20px">
            <el-button size="mini" @click="saveSubject(i)" type="primary" round plain>确认</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="resetSubject(i)"
              type="primary"
              round
              plain
            >重置</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="cancelSub(i)"
              type="primary"
              round
              plain
            >取消</el-button>
          </div>
        </div>
      </div>
      <div v-show="subjectButton">
        <el-button
          type="primary"
          plain
          round
          size="small"
          style="margin-top: 20px"
          @click="addReviewS"
        >
          <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加主观题
        </el-button>
      </div>
      <div align="center" style="margin-top: 20px">
        <el-button
          type="success"
          plain
          class="edit-button"
          @click="selectHistoryVisible = true"
          size="small"
        >导入</el-button>
        <el-button
          type="success"
          plain
          class="edit-button"
          @click="submitReview"
          :loading="submitLoading"
          v-show="saveButton"
          :disabled="funcButton"
          size="small"
        >保存</el-button>
        <el-button
          type="success"
          @click="setDeadline"
          v-show="publishButton"
          :disabled="funcButton"
          size="small"
        >发布</el-button>
        <el-button type="info" @click="getRevExercises" :disabled="funcButton" size="small">重置</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "revExerciseEdit",
  data() {
    return {
      id: 0,
      chapterInfo: {},
      courseID: 0,
      classID: 0,
      teacherID: localStorage.getItem("userID"),
      // 课后习题
      exercisesObj: [
        {
          exerciseID: 0,
          question: "这里是题目内容",
          options: ["选项A", "选项B", "选项C", "选项D"],
          score: 20,
          answer: [0],
          type: 4,
          detail: "这里是题目解析",
          order: 1,
          edit: false,
          new: false,
          edited: false,
          delete: false,
          cancelDelete: false,
          oldOptions: [],
          longer: false,
          shorter: false
        }
      ],
      exercisesSub: [
        {
          exerciseID: 0,
          question: "这里是题目内容",
          type: 6,
          score: 40,
          answer: "这里是题目答案",
          detail: "这里是题目解析",
          order: 1,
          edit: false,
          new: false,
          edited: false,
          delete: false,
          cancelDelete: false
        }
      ],
      subjectNew: {},
      objectNew: {},
      importData: [],
      importSettings: "暂无数据",
      chapterData: [],
      chapterSettings: "暂无数据",
      totalObject: 0,
      totalSubject: 0,
      objectButton: true,
      subjectButton: true,
      time: "",
      dialogTableVisible: false,
      funcButton: false,
      saveButton: false,
      publishButton: true,
      submitLoading: false,
      importLoading: false,
      publishLoading: false,
      selectHistoryVisible: false,
      startLimit: {
        disabledDate(time) {
          return time.getTime() < Date.now(); //开始时间不选时，结束时间最大值小于等于当天
        }
      }
    };
  },
  methods: {
    getParams() {
      this.courseID = this.$route.query.courseID;
      this.classID = this.$route.query.classID;
      this.id = this.$route.query.id;
    },
    getChapterInfo() {
      this.$http
        .get("http://10.60.38.173:8765/getChapterByID?chapterID=" + this.id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let content = JSON.parse(response.bodyText);
              if (content.state === 1) {
                this.chapterInfo = content.data;
                if (
                  this.chapterInfo.exerciseDeadline_2 !== undefined ||
                  this.chapterInfo.exerciseDeadline_2 !== ""
                ) {
                  this.time = this.chapterInfo.exerciseDeadline_2;
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
    getRevExercises() {
      this.exercisesObj = [];
      this.exercisesSub = [];
      this.totalObject = 0;
      this.totalSubject = 0;
      this.$http
        .get(
          // 传值chapterid
          "http://10.60.38.173:8765/question/view?chapterId=" +
            this.id +
            "&type=review",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let exerciseList = JSON.parse(response.bodyText);
              if (exerciseList.state !== 0) {
                let i = 0;
                while (i < exerciseList.data.length) {
                  if (
                    exerciseList.data[i].exercise.exerciseType === 4 ||
                    exerciseList.data[i].exercise.exerciseType === 5
                  ) {
                    this.exercisesObj.push({
                      exerciseID: exerciseList.data[i].exercise.exerciseId,
                      question: exerciseList.data[i].exercise.exerciseContent,
                      type: exerciseList.data[i].exercise.exerciseType,
                      options: [],
                      score: exerciseList.data[i].exercise.exercisePoint,
                      answer: [],
                      detail: exerciseList.data[i].exercise.exerciseAnalysis,
                      order: exerciseList.data[i].exercise.exerciseNumber,
                      edit: false,
                      new: false,
                      edited: false,
                      delete: false,
                      confirmDelete: false,
                      oldOptions: [],
                      longer: false,
                      shorter: false
                    });
                    this.totalObject += Number(
                      exerciseList.data[i].exercise.exercisePoint
                    );
                    for (
                      let m = 0;
                      m < exerciseList.data[i].exercise.exerciseAnswer.length;
                      m++
                    ) {
                      this.exercisesObj[i].answer.push(
                        exerciseList.data[i].exercise.exerciseAnswer.charCodeAt(
                          m
                        ) - 65
                      );
                    }
                    for (
                      let k = 0;
                      k < exerciseList.data[i].exerciseChoiceList.length;
                      k++
                    ) {
                      this.exercisesObj[i].options.push({
                        id: exerciseList.data[i].exerciseChoiceList[k].id,
                        content:
                          exerciseList.data[i].exerciseChoiceList[k].choice
                      });
                      this.exercisesObj[i].oldOptions.push({
                        id: exerciseList.data[i].exerciseChoiceList[k].id,
                        content:
                          exerciseList.data[i].exerciseChoiceList[k].choice
                      });
                    }
                    this.exercisesObj.sort(this.compare("order"));
                  } else if (exerciseList.data[i].exercise.exerciseType === 6) {
                    this.exercisesSub.push({
                      exerciseID: exerciseList.data[i].exercise.exerciseId,
                      question: exerciseList.data[i].exercise.exerciseContent,
                      type: exerciseList.data[i].exercise.exerciseType,
                      score: exerciseList.data[i].exercise.exercisePoint,
                      answer: exerciseList.data[i].exercise.exerciseAnswer,
                      detail: exerciseList.data[i].exercise.exerciseAnalysis,
                      order: exerciseList.data[i].exercise.exerciseNumber,
                      edit: false,
                      new: false,
                      edited: false,
                      delete: false,
                      cancelDelete: false
                    });
                    this.totalSubject += Number(
                      exerciseList.data[i].exercise.exercisePoint
                    );
                  }
                  i++;
                }
                this.exercisesSub.sort(this.compare("order"));
                if (exerciseList.state === 2) {
                  this.saveButton = false;
                  this.publishButton = true;
                } else {
                  this.saveButton = false;
                  this.publishButton = false;
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
    getCourses() {
      this.importData = [];
      this.$http
        .get(
          // 传值课程号
          "http://10.60.38.173:8765/question/sameCoursesById?courseId=" +
            this.courseID +
            "&teacherId=" +
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
                let index = 0;
                while (i < courseList.data.length) {
                  if (
                    Number(courseList.data[i].courseID) !==
                    Number(this.courseID)
                  ) {
                    this.importData.push({
                      value: index,
                      label:
                        courseList.data[i].courseYear +
                        courseList.data[i].courseSemester,
                      id: courseList.data[i].courseID
                    });
                    index++;
                  }
                  i++;
                }
              }
              if (this.importData.length > 0) {
                this.importSettings = 0;
                this.getChapterID();
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
    getChapterID() {
      this.chapterData = [];
      this.$http
        .get(
          // 传值课程号
          "http://10.60.38.173:8765/getCourseCatalog?courseID=" +
            this.importData[this.importSettings].id,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let chapterList = JSON.parse(response.bodyText);
              if (chapterList.state === 1) {
                let i = 0;
                this.chapterSettings = chapterList.data[i].id;
                while (i < chapterList.data.length) {
                  this.chapterData.push({
                    value: chapterList.data[i].id,
                    label: chapterList.data[i].contentName
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
    setDeadline() {
      if (this.totalObject + this.totalSubject === 0) {
        this.$message({
            type: "warning",
            message: "请添加习题!"
          });
        return;
      }
      this.dialogTableVisible = true;
    },
    handleType() {
      if (this.objectNew.type === 4) {
        for (let i = 1; i < this.objectNew.answer.length; i++) {
          this.objectNew.answer.splice(i, 1);
        }
      }
    },
    handleChapter() {
      this.getChapterID();
    },
    // 客观题
    addRevOptions() {
      this.objectNew.options.push({ id: "", content: "" });
    },
    deleteObjOption(index) {
      this.objectNew.options.splice(index, 1);
      let last = this.objectNew.answer.length - 1;
      if (this.objectNew.answer[last] >= this.objectNew.options.length) {
        this.objectNew.answer.splice(last, 1);
      }
    },
    deleteObject(index) {
      var that = this;
      this.$confirm("确认删除该题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.totalObject -= this.exercisesObj[index].score;
          this.exercisesObj[index].delete = true;
          if (this.exercisesObj[index].new) {
            this.exercisesObj[index].new = false;
            this.exercisesObj[index].cancelDelete = true;
          }
          for (let i = index + 1; i < that.exercisesObj.length; i++) {
            that.exercisesObj[i].order--;
            if (!that.exercisesObj[i].new) {
              that.exercisesObj[i].edited = true;
            }
          }
          this.saveButton = true;
          this.publishButton = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelDeleteObject(index) {
      this.totalObject += Number(this.exercisesObj[index].score);
      this.exercisesObj[index].delete = false;
      if (
        !this.exercisesObj[index].new &&
        this.exercisesObj[index].cancelDelete
      ) {
        this.exercisesObj[index].new = true;
        this.exercisesObj[index].cancelDelete = false;
      }
      for (let i = index + 1; i < this.exercisesObj.length; i++) {
        this.exercisesObj[i].order++;
      }
    },
    moveObjUp(index) {
      if (index === 0) {
        this.$message({ type: "warning", message: "此题无法上移" });
        return;
      }
      if (!this.exercisesObj[index].new) {
        this.exercisesObj[index].edited = true;
      }
      if (!this.exercisesObj[index - 1].new) {
        this.exercisesObj[index - 1].edited = true;
      }
      this.exercisesObj[index].order--;
      this.exercisesObj[index - 1].order++;
      this.exercisesObj.splice(index - 1, 0, this.exercisesObj[index]);
      this.exercisesObj.splice(index + 1, 1);
      this.saveButton = true;
      this.publishButton = false;
    },
    moveObjDown(index) {
      if (index === this.exercisesObj.length - 1) {
        this.$message({ type: "warning", message: "此题无法下移" });
        return;
      }
      if (!this.exercisesObj[index].new) {
        this.exercisesObj[index].edited = true;
      }
      if (!this.exercisesObj[index + 1].new) {
        this.exercisesObj[index + 1].edited = true;
      }
      this.exercisesObj[index].order++;
      this.exercisesObj[index + 1].order--;
      this.exercisesObj.splice(index + 2, 0, this.exercisesObj[index]);
      this.exercisesObj.splice(index, 1);
      this.saveButton = true;
      this.publishButton = false;
    },
    addReviewO() {
      this.exercisesObj.push({
        exerciseID: 0,
        question: "",
        type: 4,
        options: [{ id: "", content: "" }, { id: "", content: "" }],
        score: 0,
        answer: [],
        detail: "",
        order: this.exercisesObj.length + 1,
        edit: true,
        new: true,
        edited: false,
        delete: false,
        cancelDelete: false,
        oldOptions: [{ id: "", content: "" }, { id: "", content: "" }],
        longer: false,
        shorter: false
      });
      let last = this.exercisesObj.length - 1;
      this.objectNew = this.objDeepCopy(this.exercisesObj[last]);
      this.objectButton = false;
      this.funcButton = true;
      this.saveButton = true;
      this.publishButton = false;
    },
    editObject(index) {
      this.exercisesObj[index].edit = true;
      this.objectNew = this.objDeepCopy(this.exercisesObj[index]);
      this.objectButton = false;
      this.funcButton = true;
      this.saveButton = true;
      this.publishButton = false;
    },
    saveObject(index) {
      for (let i = 0; i < this.objectNew.options.length; i++) {
        if (this.objectNew.options[i].content === "") {
          this.$message({
            message: "请将习题内容填写完整！",
            type: "warning"
          });
          return;
        }
      }
      if (this.objectNew.answer.length === 0) {
        this.$message({
          message: "请设置答案！",
          type: "warning"
        });
        return;
      }
      if (this.objectNew.question === "" || this.objectNew.detail === "") {
        this.$message({
          message: "请将习题内容填写完整！",
          type: "warning"
        });
        return;
      } else if (
        Number(this.objectNew.score) <= 0 ||
        this.objectNew.score.toString().indexOf(".") !== -1
      ) {
        this.$message({
          message: "分数应为正整数！",
          type: "warning"
        });
        return;
      } else {
        let sum = this.totalObject;
        sum -= this.exercisesObj[index].score;
        sum += Number(this.objectNew.score);
      }
      this.totalObject -= Number(this.exercisesObj[index].score);
      this.exercisesObj[index] = this.objDeepCopy(this.objectNew);
      this.exercisesObj[index].edit = false;
      if (!this.exercisesObj[index].new) {
        this.exercisesObj[index].edited = true;
      }
      if (
        this.exercisesObj[index].options.length <=
        this.exercisesObj[index].oldOptions.length
      ) {
        this.exercisesObj[index].shorter = true;
        this.exercisesObj[index].longer = false;
      } else {
        this.exercisesObj[index].shorter = false;
        this.exercisesObj[index].longer = true;
      }
      this.objectNew = {};
      this.totalObject += Number(this.exercisesObj[index].score);
      this.objectButton = true;
      this.funcButton = false;
    },
    resetObject(index) {
      this.objectNew = this.objDeepCopy(this.exercisesObj[index]);
    },
    // 取消
    cancelObj(index) {
      this.exercisesObj[index].edit = false;
      this.objectNew = {};
      if (this.exercisesObj[index].new) {
        this.exercisesObj.splice(index, 1);
      }
      this.objectButton = true;
      this.funcButton = false;
    },
    // 主观题
    addReviewS() {
      this.exercisesSub.push({
        exerciseID: 0,
        question: "",
        type: 6,
        score: 0,
        answer: "",
        detail: "",
        order: this.exercisesSub.length + 1,
        edit: true,
        new: true,
        edited: false,
        delete: false,
        cancelDelete: false
      });
      let last = this.exercisesSub.length - 1;
      this.subjectNew = this.objDeepCopy(this.exercisesSub[last]);
      this.subjectButton = false;
      this.funcButton = true;
      this.saveButton = true;
      this.publishButton = false;
    },
    moveSubUp(index) {
      if (index === 0) {
        this.$message({ type: "warning", message: "此题无法上移" });
        return;
      }
      if (!this.exercisesSub[index].new) {
        this.exercisesSub[index].edited = true;
      }
      if (!this.exercisesSub[index - 1].new) {
        this.exercisesSub[index - 1].edited = true;
      }
      this.exercisesSub[index].order--;
      this.exercisesSub[index - 1].order++;
      this.exercisesSub.splice(index - 1, 0, this.exercisesSub[index]);
      this.exercisesSub.splice(index + 1, 1);
      this.saveButton = true;
      this.publishButton = false;
    },
    moveSubDown(index) {
      if (index === this.exercisesSub.length - 1) {
        this.$message({ type: "warning", message: "此题无法下移" });
        return;
      }
      if (!this.exercisesSub[index].new) {
        this.exercisesSub[index].edited = true;
      }
      if (!this.exercisesSub[index + 1].new) {
        this.exercisesSub[index + 1].edited = true;
      }
      this.exercisesSub[index].order++;
      this.exercisesSub[index + 1].order--;
      this.exercisesSub.splice(index + 2, 0, this.exercisesSub[index]);
      this.exercisesSub.splice(index, 1);
      this.saveButton = true;
      this.publishButton = false;
    },
    deleteSubject(index) {
      this.$confirm("确认删除该题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.totalSubject -= this.exercisesSub[index].score;
          this.exercisesSub[index].delete = true;
          if (this.exercisesSub[index].new) {
            this.exercisesSub[index].new = false;
            this.exercisesSub[index].cancelDelete = true;
          }
          for (let i = index + 1; i < that.exercisesSub.length; i++) {
            that.exercisesSub[i].order--;
            if (!that.exercisesSub[i].new) {
              that.exercisesSub[i].edited = true;
            }
          }
          this.saveButton = true;
          this.publishButton = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelDeleteSubject(index) {
      this.totalSubject += Number(this.exercisesSub[index].score);
      this.exercisesSub[index].delete = false;
      if (
        !this.exercisesSub[index].new &&
        this.exercisesSub[index].cancelDelete
      ) {
        this.exercisesSub[index].new = true;
        this.exercisesSub[index].cancelDelete = false;
      }
      for (let i = index + 1; i < this.exercisesSub.length; i++) {
        this.exercisesSub[i].order++;
      }
    },
    editSubject(index) {
      this.exercisesSub[index].edit = true;
      this.subjectNew = this.objDeepCopy(this.exercisesSub[index]);
      this.subjectButton = false;
      this.funcButton = true;
      this.saveButton = true;
      this.publishButton = false;
    },
    saveSubject(index) {
      if (
        this.subjectNew.question === "" ||
        this.subjectNew.answer === "" ||
        this.subjectNew.detail === ""
      ) {
        this.$message({
          message: "请将习题内容填写完整！",
          type: "warning"
        });
      } else if (
        Number(this.subjectNew.score) <= 0 ||
        this.subjectNew.score.toString().indexOf(".") !== -1
      ) {
        this.$message({
          message: "分数应为正整数！",
          type: "warning"
        });
        return;
      } else {
        let sum = this.totalSubject;
        sum -= this.exercisesSub[index].score;
        sum += Number(this.subjectNew.score);
        this.totalSubject -= Number(this.exercisesSub[index].score);
        this.exercisesSub[index] = this.objDeepCopy(this.subjectNew);
        this.exercisesSub[index].edit = false;
        if (!this.exercisesSub[index].new) {
          this.exercisesSub[index].edited = true;
        }
        this.subjectNew = {};
        this.totalSubject += Number(this.exercisesSub[index].score);
        this.subjectButton = true;
        this.funcButton = false;
      }
    },
    resetSubject(index) {
      this.subjectNew = this.objDeepCopy(this.exercisesSub[index]);
    },
    // 取消
    cancelSub(index) {
      this.exercisesSub[index].edit = false;
      this.subjectNew = {};
      if (this.exercisesSub[index].new) {
        this.exercisesSub.splice(index, 1);
      }
      this.subjectButton = true;
      this.funcButton = false;
    },
    // 写入后台
    // 添加选项
    saveAddOption(index, i) {
      let optionEntity = {
        exerciseId: this.exercisesObj[index].exerciseID,
        exerciceChoiceId: String.fromCharCode(i + 65),
        choice: this.exercisesObj[index].options[i].content
      };
      let promise = this.$http
        .post("http://10.60.38.173:8765/question/addChoice", optionEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              return response;
            } else {
              this.$message({
                type: "error",
                message: "选项添加失败!"
              });
              return null;
            }
          },
          response => {
            this.$message({
              type: "error",
              message: "选项添加失败!"
            });
            return null;
          }
        );
    },
    saveDeleteOption(index, i) {
      let promise = this.$http
        .put(
          "http://10.60.38.173:8765/question/deleteChoice",
          {
            exerciseChoiceId: this.exercisesObj[index].oldOptions[i].id
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              return response;
            } else {
              this.$message({
                type: "error",
                message: "选项删除失败!"
              });
              return null;
            }
          },
          response => {
            this.$message({
              type: "error",
              message: "选项删除失败!"
            });
            return null;
          }
        );
    },
    saveAlterOption(index, i) {
      let optionEntity = {
        id: this.exercisesObj[index].options[i].id,
        exerciseId: this.exercisesObj[index].exerciseID,
        exerciceChoiceId: String.fromCharCode(i + 65),
        choice: this.exercisesObj[index].options[i].content
      };
      this.$http
        .post("http://10.60.38.173:8765/question/alterChoice", optionEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
            } else {
              this.$message({
                type: "error",
                message: "选项修改失败!"
              });
            }
          },
          response => {
            this.$message({
              type: "error",
              message: "选项修改失败!"
            });
          }
        );
    },
    saveAddObjExercise(index) {
      let ans = "";
      for (let k = 0; k < this.exercisesObj[index].answer.length; k++) {
        ans += String.fromCharCode(this.exercisesObj[index].answer[k] + 65);
      }
      let exerciseEntity = {
        // 传值chapterid
        chapterId: this.id,
        exerciseType: this.exercisesObj[index].type,
        exerciseNumber: this.exercisesObj[index].order,
        exerciseContent: this.exercisesObj[index].question,
        exerciseAnswer: ans,
        exerciseAnalysis: this.exercisesObj[index].detail,
        exercisePoint: this.exercisesObj[index].score
      };
      this.$http
        .post("http://10.60.38.173:8765/question/addExercise", exerciseEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              this.exercisesObj[index].exerciseID = res.data.exerciseId;
              let j = 0;
              while (j < this.exercisesObj[index].options.length) {
                this.saveAddOption(index, j);
                j = j + 1;
              }
            } else {
              this.$message({ type: "error", message: "习题添加失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题添加失败!" });
          }
        );
    },
    saveAddSubExercise(index) {
      let exerciseEntity = {
        // 传值chapterid
        chapterId: this.id,
        exerciseType: 6,
        exerciseNumber: this.exercisesSub[index].order,
        exerciseContent: this.exercisesSub[index].question,
        exerciseAnswer: this.exercisesSub[index].answer,
        exerciseAnalysis: this.exercisesSub[index].detail,
        exercisePoint: this.exercisesSub[index].score
      };
      this.$http
        .post("http://10.60.38.173:8765/question/addExercise", exerciseEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
          }
        })
        .then(
          response => {
            if (response.status === 200) {
            } else {
              this.$message({ type: "error", message: "习题添加失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题添加失败!" });
          }
        );
    },
    saveDeleteObjExercise(index) {
      this.$http
        .put(
          "http://10.60.38.173:8765/question/deleteExercise",
          {
            exerciseId: this.exercisesObj[index].exerciseID
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              for (
                let i = 0;
                i < this.exercisesObj[index].options.length;
                i++
              ) {
                this.saveDeleteOption(index, i);
              }
            } else {
              this.$message({ type: "error", message: "习题删除失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题删除失败!" });
          }
        );
    },
    saveDeleteSubExercise(index) {
      this.$http
        .put(
          "http://10.60.38.173:8765/question/deleteExercise",
          {
            exerciseId: this.exercisesSub[index].exerciseID
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
            } else {
              this.$message({ type: "error", message: "习题删除失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题删除失败!" });
          }
        );
    },
    saveAlterObjExercise(index) {
      let ans = "";
      for (let k = 0; k < this.exercisesObj[index].answer.length; k++) {
        ans += String.fromCharCode(this.exercisesObj[index].answer[k] + 65);
      }
      let exerciseEntity = {
        exerciseId: this.exercisesObj[index].exerciseID,
        // 传值chapterid
        chapterId: this.id,
        exerciseType: this.exercisesObj[index].type,
        exerciseNumber: this.exercisesObj[index].order,
        exerciseContent: this.exercisesObj[index].question,
        exerciseAnswer: ans,
        exerciseAnalysis: this.exercisesObj[index].detail,
        exercisePoint: this.exercisesObj[index].score
      };
      this.$http
        .post(
          "http://10.60.38.173:8765/question/alterExercise",
          exerciseEntity,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
            } else {
              this.$message({ type: "error", message: "习题编辑失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题编辑失败!" });
          }
        );
    },
    saveAlterSubExercise(index) {
      let exerciseEntity = {
        exerciseId: this.exercisesSub[index].exerciseID,
        // 传值chapterid
        chapterId: this.id,
        exerciseType: 6,
        exerciseNumber: this.exercisesSub[index].order,
        exerciseContent: this.exercisesSub[index].question,
        exerciseAnswer: this.exercisesSub[index].answer,
        exerciseAnalysis: this.exercisesSub[index].detail,
        exercisePoint: this.exercisesSub[index].score
      };
      this.$http
        .post(
          "http://10.60.38.173:8765/question/alterExercise",
          exerciseEntity,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
            } else {
              this.$message({ type: "error", message: "习题编辑失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "习题编辑失败!" });
          }
        );
    },
    // 保存按钮
    submitReview() {
      this.submitLoading = true;
      // 客观题
      for (let i = 0; i < this.exercisesObj.length; i++) {
        if (this.exercisesObj[i].delete && !this.exercisesObj[i].cancelDelete) {
          // 删除
          this.saveDeleteObjExercise(i);
          continue;
        }
        if (this.exercisesObj[i].new) {
          // 添加
          this.saveAddObjExercise(i);
          continue;
        }
        if (this.exercisesObj[i].edited) {
          // 编辑
          this.saveAlterObjExercise(i);
          let j = 0;
          // 选项长度变大
          if (this.exercisesObj[i].longer) {
            while (j < this.exercisesObj[i].oldOptions.length) {
              this.saveAlterOption(i, j);
              j = j + 1;
            }
            while (j < this.exercisesObj[i].options.length) {
              this.saveAddOption(i, j);
              j = j + 1;
            }
          }
          // 选项长度变小
          else if (this.exercisesObj[i].shorter) {
            while (j < this.exercisesObj[i].options.length) {
              this.saveAlterOption(i, j);
              j = j + 1;
            }
            while (j < this.exercisesObj[i].oldOptions.length) {
              this.saveDeleteOption(i, j);
              j = j + 1;
            }
          }
          continue;
        }
      }
      // 主观题
      for (let m = 0; m < this.exercisesSub.length; m++) {
        if (this.exercisesSub[m].delete && !this.exercisesSub[m].cancelDelete) {
          // 删除
          this.saveDeleteSubExercise(m);
          continue;
        }
        if (this.exercisesSub[m].new) {
          // 添加
          this.saveAddSubExercise(m);
          continue;
        }
        if (this.exercisesSub[m].edited) {
          // 编辑
          this.saveAlterSubExercise(m);
          continue;
        }
      }
      let that = this;
      setTimeout(function() {
        that.getRevExercises();
        that.submitLoading = false;
        that.$message({
          type: "success",
          message: "习题编辑成功!"
        });
      }, 4000);
    },
    publish() {
      for (let i = 0; i < this.exercisesObj.length; i++) {
        if (
          this.exercisesObj[i].new ||
          this.exercisesObj[i].edited ||
          this.exercisesObj[i].edit ||
          this.exercisesObj[i].delete
        ) {
          this.$message({
            type: "warning",
            message: "请先保存习题!"
          });
          return;
        }
      }
      for (let j = 0; j < this.exercisesSub.length; j++) {
        if (
          this.exercisesSub[j].new ||
          this.exercisesSub[j].edited ||
          this.exercisesSub[j].edit ||
          this.exercisesSub[j].delete
        ) {
          this.$message({
            type: "warning",
            message: "请先保存习题!"
          });
          return;
        }
      }
      this.publishLoading = true;
      var deadline = "";
      if (typeof this.time !== "string") {
        deadline = this.time.Format("yyyy-MM-dd").toString();
      } else {
        deadline = this.time;
      }
      let entity = {};
      if (this.chapterInfo.exerciseVisible_1 === null) {
        entity = {
          id: this.chapterInfo.id,
          courseID: this.chapterInfo.courseID,
          contentName: this.chapterInfo.contentName,
          parentID: this.chapterInfo.parentID,
          siblingID: this.chapterInfo.siblingID,
          content:
            this.chapterInfo.content === null
              ? new String()
              : this.chapterInfo.content,
          exerciseTitle: this.chapterInfo.contentName + "[课后习题]",
          exerciseVisible_2: true,
          exerciseDeadline_2: deadline,
          exerciseTotal_2: Number(this.totalObject + this.totalSubject)
        };
      } else {
        entity = {
          id: this.chapterInfo.id,
          courseID: this.chapterInfo.courseID,
          contentName: this.chapterInfo.contentName,
          parentID: this.chapterInfo.parentID,
          siblingID: this.chapterInfo.siblingID,
          content:
            this.chapterInfo.content === null
              ? new String()
              : this.chapterInfo.content,
          exerciseTitle: this.chapterInfo.contentName + "[课后习题]",
          exerciseVisible_1: this.chapterInfo.exerciseVisible_1,
          exerciseVisible_2: true,
          exerciseDeadline_1: this.chapterInfo.exerciseDeadline_1,
          exerciseDeadline_2: deadline,
          exerciseTotal_1: this.chapterInfo.exerciseTotal_1,
          exerciseTotal_2: Number(this.totalObject + this.totalSubject)
        };
      }
      this.$http
        .post("http://10.60.38.173:8765/alertChapter", entity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let responseData = JSON.parse(response.bodyText);
              this.$message({
                type: "success",
                message: "习题发布成功!"
              });
              this.publishLoading = false;
              this.dialogTableVisible = false;
            } else {
              this.$message({ type: "error", message: "习题发布失败!" });
              this.publishLoading = false;
              this.dialogTableVisible = false;
              return;
            }
          },
          response => {
            this.$message({ type: "error", message: "习题发布失败!" });
            this.publishLoading = false;
            this.dialogTableVisible = false;
            return;
          }
        );
    },
    confirmImport() {
      if (
        this.importSettings === "暂无数据" ||
        this.chapterSettings === "暂无数据"
      ) {
        this.$message({ type: "warning", message: "无法导入习题信息!" });
        return;
      }
      this.$confirm("之前的习题信息将被覆盖，确认导入吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.importLoading = true;
          this.$http
            .post(
              "http://10.60.38.173:8765/question/copyExercise",
              {
                sourceChapterId: this.chapterSettings,
                aimChapterId: this.id,
                type: "review"
              },
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
              }
            )
            .then(
              response => {
                if (response.status === 200) {
                  this.$message({
                    type: "success",
                    message: "习题导入成功!"
                  });
                  this.getRevExercises();
                  this.importLoading = false;
                  this.selectHistoryVisible = false;
                } else {
                  this.$message({ type: "error", message: "习题导入失败!" });
                  this.importLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "习题导入失败!" });
                this.importLoading = false;
                return;
              }
            );
        })
        .catch(() => {});
    },
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
    // 比较器
    compare(propertyName) {
      return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
          return 1;
        } else if (value2 > value1) {
          return -1;
        } else {
          return 0;
        }
      };
    }
  },
  created() {
    this.getParams();
    this.getChapterInfo();
    this.getRevExercises();
    this.getCourses();
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
      if (e.key === "catalog") {
        this.$alert("章节已修改", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            bus.$emit("refresh", true);
            this.$router.push({
              path: "/teacher/exerciseEdit/exerciseHint",
              query: { id: this.courseID, classID: this.classID }
            });
          }
        });
      }
    };
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route(val) {
      this.getParams();
      this.getChapterInfo();
      this.getRevExercises();
    }
  },
  beforeRouteUpdate(to, from, next) {
    for (let i = 0; i < this.exercisesObj.length; i++) {
      if (
        this.exercisesObj[i].new ||
        this.exercisesObj[i].edited ||
        this.exercisesObj[i].edit ||
        this.exercisesObj[i].delete
      ) {
        const answer = window.confirm("更改尚未保存，确认离开吗？");
        if (answer) {
          next();
          return;
        } else {
          next(false);
          return;
        }
      }
    }
    for (let j = 0; j < this.exercisesSub.length; j++) {
      if (
        this.exercisesSub[j].new ||
        this.exercisesSub[j].edited ||
        this.exercisesSub[j].edit ||
        this.exercisesSub[j].delete
      ) {
        const answer = window.confirm("更改尚未保存，确认离开吗？");
        if (answer) {
          next();
          return;
        } else {
          next(false);
          return;
        }
      }
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    for (let i = 0; i < this.exercisesObj.length; i++) {
      if (
        this.exercisesObj[i].new ||
        this.exercisesObj[i].edited ||
        this.exercisesObj[i].edit ||
        this.exercisesObj[i].delete
      ) {
        const answer = window.confirm("更改尚未保存，确认离开吗？");
        if (answer) {
          next();
          return;
        } else {
          next(false);
          return;
        }
      }
    }
    for (let j = 0; j < this.exercisesSub.length; j++) {
      if (
        this.exercisesSub[j].new ||
        this.exercisesSub[j].edited ||
        this.exercisesSub[j].edit ||
        this.exercisesSub[j].delete
      ) {
        const answer = window.confirm("更改尚未保存，确认离开吗？");
        if (answer) {
          next();
          return;
        } else {
          next(false);
          return;
        }
      }
    }
    next();
  }
};
</script>

<style scoped>
.main {
  width: 700px;
  margin: 0 auto;
}

.exercises {
  font-size: 14px;
  padding: 10px 0 10px 0;
}

.exercises .title pre {
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.exercises .answer-text {
  border: 1px solid #dcdcdc;
  min-height: 80px;
  padding: 10px 15px 10px 15px;
  margin-top: 15px;
  font-size: 14px;
}

.exercises .answer-text pre {
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.exercises .detail {
  margin-top: 15px;
  background-color: #fcfcfc;
  min-height: 80px;
  padding: 15px 20px 15px 20px;
  font-size: 14px;
}

.exercises .detail pre {
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.is-deleted {
  color: #d8d8d8;
}

.answer {
  color: #dd9222;
}

.betweenspace {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.save-button {
  background-color: #7cc8fb;
  border-color: #7cc8fb;
}

.edit-button {
  background-color: #fff;
}

.edit-button:hover {
  color: #fff;
}

.confirm-button {
  background-color: #7cc8fb;
  border-color: #7cc8fb;
  margin-left: 10px;
  margin-bottom: 20px;
}
</style>