<template>
  <el-container>
    <div class="main" align="start">
      <el-dialog title="请选择截止时间" :visible.sync="dialogTableVisible">
        <div align="center">
          <el-date-picker v-model="time" type="date" size="small"></el-date-picker>
          <el-button
            @click="publish"
            :loading="publishLoading"
            type="primary"
            size="small"
            class="confirm-button"
          >确认</el-button>
        </div>
      </el-dialog>
      <h4>客观题({{totalScore}}分)</h4>
      <div v-for="(item1, i) in exercises" :key="i" align="start" class="exercises">
        <!-- 正常显示 -->
        <div v-if="item1.edit === false" :class="item1.delete? 'is-deleted' : ''">
          <div style="margin-top: 8px">
            <span style="font-size: 15px">{{item1.order}}. {{item1.question}}（{{item1.score}}分）</span>
          </div>
          <div
            class="betweenspace"
            style="margin-top: 15px; padding: 0 10px 0 10px; font-size: 14px"
          >
            <div v-for="(item2, j) in item1.options" :key="j">
              <div :class="setAnswerClass(item1, j)">{{String.fromCharCode(j+65)}}.{{item2.content}}</div>
            </div>
          </div>
          <div class="detail">{{item1.detail}}</div>
          <div style="margin-top: 15px;" v-if="!item1.delete">
            <span>
              <!-- 进入编辑模式 -->
              <el-button
                size="mini"
                @click="editMode(i)"
                type="warning"
                round
                plain
                class="edit-button"
              >编辑</el-button>
            </span>
            <!-- 删除习题 -->
            <span>
              <el-button
                size="mini"
                @click="deletePreExercise(i)"
                type="warning"
                round
                plain
                class="edit-button"
              >删除</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveUp(i)"
                type="warning"
                round
                plain
                class="edit-button"
              >上移</el-button>
            </span>
            <span>
              <el-button
                size="mini"
                @click="moveDown(i)"
                type="warning"
                round
                plain
                class="edit-button"
              >下移</el-button>
            </span>
          </div>
          <div style="margin-top: 10px;" v-else>
            <span>
              <el-button size="mini" @click="cancelDelete(i)" type="success" round>恢复</el-button>
            </span>
          </div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{item1.order}}.</p>
            <p>
              <el-input
                v-model="exerciseNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容"
              ></el-input>
            </p>
            <el-row style="margin-top: 20px">
              <el-col :span="3" style="padding-top: 5px;">
                <el-radio v-model="exerciseNew.type" :label="1" @change="handleType">单选题</el-radio>
              </el-col>
              <el-col :span="3" style="padding-top: 5px;">
                <el-radio v-model="exerciseNew.type" :label="2" @change="handleType">多选题</el-radio>
              </el-col>
              <el-col :span="18" align="right">
                <div>
                  <span>分值</span>
                  <span style="margin-left: 5px">
                    <el-input
                      size="mini"
                      type="number"
                      v-model="exerciseNew.score"
                      style="width: 80px"
                    ></el-input>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 15px" class="betweenspace">
            <div v-for="(item2, j) in exerciseNew.options" :key="j" style="margin-top: 10px">
              <span>{{String.fromCharCode(j+65)}}.</span>
              <span>
                <el-input
                  v-model="exerciseNew.options[j].content"
                  size="mini"
                  style="width: 280px"
                  placeholder="请填写选项"
                ></el-input>
              </span>
              <span>
                <el-button type="text" @click="deleteOption(j)">
                  <i class="el-icon-circle-close"></i>
                </el-button>
              </span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <el-button size="small" round @click="addOption()">
              <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项
            </el-button>
          </div>
          <div style="margin-top: 15px">
            <p>答案</p>
            <p style="margin-top: 10px" v-if="exerciseNew.type === 1">
              <el-radio-group v-model="exerciseNew.answer[0]">
                <el-radio
                  v-for="j in exerciseNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-radio>
              </el-radio-group>
            </p>
            <p style="margin-top: 10px" v-else>
              <el-checkbox-group v-model="exerciseNew.answer">
                <el-checkbox
                  v-for="j in exerciseNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-checkbox>
              </el-checkbox-group>
            </p>
          </div>
          <div style="margin-top: 15px">
            <p>解析</p>
            <el-input
              v-model="exerciseNew.detail"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析"
            ></el-input>
          </div>
          <div style="margin-top: 20px">
            <el-button size="mini" @click="saveEdit(i)" type="primary" round plain>确认</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="resetEdit(i)"
              type="primary"
              round
              plain
            >重置</el-button>
            <el-button
              size="mini"
              style="margin-left: 10px"
              @click="cancelEdit(i)"
              type="primary"
              round
              plain
            >取消</el-button>
          </div>
        </div>
      </div>
      <div v-show="addButton">
        <el-button
          type="warning"
          plain
          size="small"
          round
          style="margin-top: 20px"
          @click="addPreExercise"
        >
          <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题
        </el-button>
      </div>
      <div align="center" style="margin-top: 20px">
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitPreview"
          :disabled="funcButton"
        >保存</el-button>
        <el-button type="success" @click="dialogTableVisible = true" :disabled="funcButton">发布</el-button>
        <el-button @click="getPreExercises" :disabled="funcButton" type="info">重置</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "preExerciseEdit",
  data() {
    return {
      id: 0,
      chapterInfo: {},
      // 课前习题
      exercises: [
        {
          exerciseID: 100,
          question: "这里是题目内容",
          options: [],
          score: 30,
          type: 1,
          answer: [0],
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
      exerciseNew: {},
      totalScore: 0,
      addButton: true,
      funcButton: false,
      submitLoading: false,
      publishLoading: false,
      dialogTableVisible: false,
      time: ""
    };
  },
  methods: {
    getParams() {
      this.id = this.$route.query.id;
    },
    getChapterInfo() {
      this.$http
        .get("/api/getChapterByID?chapterID=" + this.id, {
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
                  this.chapterInfo.exerciseDeadline_1 !== undefined ||
                  this.chapterInfo.exerciseDeadline_1 !== ""
                ) {
                  this.time = this.chapterInfo.exerciseDeadline_1;
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
    getPreExercises() {
      this.exercises = [];
      this.totalScore = 0;
      this.$http
        .get(
          // 传值chapterid
          "/api/question/view?chapterId=" + this.id + "&type=preview",
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
              if (exerciseList.state === 1) {
                let i = 0;
                while (i < exerciseList.data.length) {
                  this.exercises.push({
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
                  this.totalScore += Number(
                    exerciseList.data[i].exercise.exercisePoint
                  );
                  for (
                    let m = 0;
                    m < exerciseList.data[i].exercise.exerciseAnswer.length;
                    m++
                  ) {
                    this.exercises[i].answer.push(
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
                    this.exercises[i].options.push({
                      id: exerciseList.data[i].exerciseChoiceList[k].id,
                      content: exerciseList.data[i].exerciseChoiceList[k].choice
                    });
                    this.exercises[i].oldOptions.push({
                      id: exerciseList.data[i].exerciseChoiceList[k].id,
                      content: exerciseList.data[i].exerciseChoiceList[k].choice
                    });
                  }
                  i++;
                }
                this.exercises.sort(this.compare("order"));
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
    setAnswerClass(item, j) {
      if (item.answer.indexOf(j) >= 0 && !item.delete) return "answer";
      else return "";
    },
    handleType() {
      if (this.exerciseNew.type === 1) {
        for (let i = 1; i < this.exerciseNew.answer.length; i++) {
          this.exerciseNew.answer.splice(i, 1);
        }
      }
    },
    // 添加选项
    addOption() {
      this.exerciseNew.options.push({ id: "", content: "" });
    },
    // 添加习题
    addPreExercise() {
      this.exercises.push({
        exerciseID: 0,
        question: "",
        type: 1,
        options: [{ id: "", content: "" }, { id: "", content: "" }],
        score: 0,
        answer: [0],
        detail: "",
        order: this.exercises.length + 1,
        edit: true,
        new: true,
        edited: false,
        delete: false,
        cancelDelete: false,
        oldOptions: [{ id: "", content: "" }, { id: "", content: "" }],
        longer: false,
        shorter: false
      });
      let last = this.exercises.length - 1;
      this.exerciseNew = this.objDeepCopy(this.exercises[last]);
      this.addButton = false;
      this.funcButton = true;
    },
    // 删除习题
    deletePreExercise(index) {
      var that = this;
      this.$confirm("确认删除该题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.totalScore -= this.exercises[index].score;
          this.exercises[index].delete = true;
          if (this.exercises[index].new) {
            this.exercises[index].new = false;
            this.exercises[index].cancelDelete = true;
          }
          for (let i = index + 1; i < that.exercises.length; i++) {
            that.exercises[i].order--;
            if (!that.exercises[i].new) {
              that.exercises[i].edited = true;
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelDelete(index) {
      this.totalScore += Number(this.exercises[index].score);
      this.exercises[index].delete = false;
      if (!this.exercises[index].new && this.exercises[index].cancelDelete) {
        this.exercises[index].new = true;
        this.exercises[index].cancelDelete = false;
      }
      for (let i = index + 1; i < this.exercises.length; i++) {
        this.exercises[i].order++;
      }
    },
    // 编辑模式
    editMode(index) {
      this.exercises[index].edit = true;
      if (!this.exercises[index].new) {
        this.exercises[index].edited = true;
      }
      this.exerciseNew = this.objDeepCopy(this.exercises[index]);
      this.addButton = false;
      this.funcButton = true;
    },
    moveUp(index) {
      if (index === 0) {
        this.$message({ type: "error", message: "此题无法上移" });
        return;
      }
      if (!this.exercises[index].new) {
        this.exercises[index].edited = true;
      }
      if (!this.exercises[index - 1].new) {
        this.exercises[index - 1].edited = true;
      }
      this.exercises.splice(index - 1, 0, this.exercises[index]);
      this.exercises.splice(index + 1, 1);
      this.exercises[index].order++;
      this.exercises[index - 1].order--;
    },
    moveDown(index) {
      if (index === this.exercises.length - 1) {
        this.$message({ type: "error", message: "此题无法下移" });
        return;
      }
      if (!this.exercises[index].new) {
        this.exercises[index].edited = true;
      }
      if (!this.exercises[index + 1].new) {
        this.exercises[index + 1].edited = true;
      }
      this.exercises.splice(index + 2, 0, this.exercises[index]);
      this.exercises.splice(index, 1);
      this.exercises[index].order--;
      this.exercises[index + 1].order++;
    },
    // 删除选项
    deleteOption(index) {
      this.exerciseNew.options.splice(index, 1);
      let last = this.exerciseNew.answer.length - 1;
      if (this.exerciseNew.answer[last] >= this.exerciseNew.options.length) {
        this.exerciseNew.answer.splice(last, 1);
      }
    },
    // 保存
    saveEdit(index) {
      for (let i = 0; i < this.exerciseNew.options.length; i++) {
        if (this.exerciseNew.options[i].content === "") {
          this.$message({
            message: "请将习题内容填写完整！",
            type: "warning"
          });
          return;
        }
      }
      if (this.exerciseNew.answer.length === 0) {
        this.$message({
          message: "请设置答案！",
          type: "warning"
        });
        return;
      }
      if (this.exerciseNew.question === "" || this.exerciseNew.detail === "") {
        this.$message({
          message: "请将习题内容填写完整！",
          type: "warning"
        });
        return;
      } else if (
        Number(this.exerciseNew.score) <= 0 ||
        Number(this.exerciseNew.score) > 100
      ) {
        this.$message({
          message: "分数应在0-100之间！",
          type: "warning"
        });
        return;
      } else {
        let sum = this.totalScore;
        sum -= this.exercises[index].score;
        sum += Number(this.exerciseNew.score);
        if (sum > 100) {
          this.$message({
            message: "总分超出最大值，请调整分数！",
            type: "warning"
          });
          return;
        }
      }
      this.totalScore -= Number(this.exercises[index].score);
      this.exercises[index] = this.objDeepCopy(this.exerciseNew);
      this.exercises[index].edit = false;
      if (
        this.exercises[index].options.length <=
        this.exercises[index].oldOptions.length
      ) {
        this.exercises[index].shorter = true;
        this.exercises[index].longer = false;
      } else {
        this.exercises[index].shorter = false;
        this.exercises[index].longer = true;
      }
      this.exerciseNew = {};
      this.totalScore += Number(this.exercises[index].score);
      this.addButton = true;
      this.funcButton = false;
    },
    // 重置
    resetEdit(index) {
      this.exerciseNew = this.objDeepCopy(this.exercises[index]);
    },
    // 取消
    cancelEdit(index) {
      this.exercises[index].edit = false;
      this.exerciseNew = {};
      if (this.exercises[index].new) {
        this.exercises.splice(index, 1);
      }
      this.addButton = true;
      this.funcButton = false;
    },
    // 写入后台
    // 添加选项
    saveAddOption(index, i) {
      let optionEntity = {
        exerciseId: this.exercises[index].exerciseID,
        exerciceChoiceId: String.fromCharCode(i + 65),
        choice: this.exercises[index].options[i].content
      };
      let promise = this.$http
        .post("/api/question/addChoice", optionEntity, {
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
          "/api/question/deleteChoice",
          {
            exerciseChoiceId: this.exercises[index].oldOptions[i].id
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
        id: this.exercises[index].options[i].id,
        exerciseId: this.exercises[index].exerciseID,
        exerciceChoiceId: String.fromCharCode(i + 65),
        choice: this.exercises[index].options[i].content
      };
      this.$http
        .post("/api/question/alterChoice", optionEntity, {
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
    saveAddPreExercise(index) {
      let ans = "";
      for (let k = 0; k < this.exercises[index].answer.length; k++) {
        ans += String.fromCharCode(this.exercises[index].answer[k] + 65);
      }
      let exerciseEntity = {
        // 传值chapterid
        chapterId: this.id,
        exerciseType: this.exercises[index].type,
        exerciseNumber: this.exercises[index].order,
        exerciseContent: this.exercises[index].question,
        exerciseAnswer: ans,
        exerciseAnalysis: this.exercises[index].detail,
        exercisePoint: this.exercises[index].score
      };
      this.$http
        .post("/api/question/addExercise", exerciseEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              this.exercises[index].exerciseID = res.data.exerciseId;
              let j = 0;
              while (j < this.exercises[index].options.length) {
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
    saveDeletePreExercise(index) {
      this.$http
        .put(
          "/api/question/deleteExercise",
          {
            exerciseId: this.exercises[index].exerciseID
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
              for (let i = 0; i < this.exercises[index].options.length; i++) {
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
    saveAlterPreExercise(index) {
      let ans = "";
      for (let k = 0; k < this.exercises[index].answer.length; k++) {
        ans += String.fromCharCode(this.exercises[index].answer[k] + 65);
      }
      let exerciseEntity = {
        exerciseId: this.exercises[index].exerciseID,
        // 传值chapterid
        chapterId: this.id,
        exerciseType: this.exercises[index].type,
        exerciseNumber: this.exercises[index].order,
        exerciseContent: this.exercises[index].question,
        exerciseAnswer: ans,
        exerciseAnalysis: this.exercises[index].detail,
        exercisePoint: this.exercises[index].score
      };
      this.$http
        .post("/api/question/alterExercise", exerciseEntity, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
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
    submitPreview() {
      this.submitLoading = true;
      for (let i = 0; i < this.exercises.length; i++) {
        if (this.exercises[i].delete && !this.exercises[i].cancelDelete) {
          // 删除
          this.saveDeletePreExercise(i);
          continue;
        }
        if (this.exercises[i].new) {
          // 添加
          this.saveAddPreExercise(i);
          continue;
        }
        if (this.exercises[i].edited) {
          // 编辑
          this.saveAlterPreExercise(i);
          let j = 0;
          // 选项长度变大
          if (this.exercises[i].longer) {
            while (j < this.exercises[i].oldOptions.length) {
              this.saveAlterOption(i, j);
              j = j + 1;
            }
            while (j < this.exercises[i].options.length) {
              this.saveAddOption(i, j);
              j = j + 1;
            }
          }
          // 选项长度变小
          else if (this.exercises[i].shorter) {
            while (j < this.exercises[i].options.length) {
              this.saveAlterOption(i, j);
              j = j + 1;
            }
            while (j < this.exercises[i].oldOptions.length) {
              this.saveDeleteOption(i, j);
              j = j + 1;
            }
          }
          continue;
        }
      }
      let that = this;
      setTimeout(function() {
        that.getPreExercises();
        that.submitLoading = false;
        that.$message({
          type: "success",
          message: "习题编辑成功!"
        });
      }, 2000);
    },
    publish() {
      for (let i = 0; i < this.exercises.length; i++) {
        if (
          this.exercises[i].new ||
          this.exercises[i].edited ||
          this.exercises[i].edit ||
          this.exercises[i].delete
        ) {
          this.$message({
            type: "error",
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
      this.$http
        .post(
          "/api/alertChapter",
          {
            id: this.chapterInfo.id,
            courseID: this.chapterInfo.courseID,
            contentName: this.chapterInfo.contentName,
            parentID: this.chapterInfo.parentID,
            siblingID: this.chapterInfo.siblingID,
            content: this.chapterInfo.content === null? new String():this.chapterInfo.content,
            exerciseTitle: this.chapterInfo.contentName + "练习题",
            exerciseVisible_1: true,
            //exerciseVisible_2: this.chapterInfo.exerciseVisible_2,
            exerciseDeadline_1: deadline,
            //exerciseDeadline_2: this.chapterInfo.exerciseDeadline_2,
            exerciseTotal_1: Number(this.totalScore),
            //exerciseTotal_2: this.chapterInfo.exerciseTotal_2
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
              let responseData = JSON.parse(response.bodyText);
              this.$message({
                type: "success",
                message: "习题发布成功!"
              });
              this.dialogTableVisible = false;
              this.publishLoading = false;
            } else {
              this.$message({ type: "error", message: "习题发布失败!" });
              this.publishLoading = false;
              return;
            }
          },
          response => {
            this.$message({ type: "error", message: "习题发布失败!" });
            this.publishLoading = false;
            return;
          }
        );
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
    this.getPreExercises();
    this.getChapterInfo();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route(val) {
      this.getParams();
      this.getPreExercises();
      this.getChapterInfo();
    }
  },
  beforeRouteUpdate(to, from, next) {
    for (let i = 0; i < this.exercises.length; i++) {
      if (
        this.exercises[i].new ||
        this.exercises[i].edited ||
        this.exercises[i].edit ||
        this.exercises[i].delete
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
    for (let i = 0; i < this.exercises.length; i++) {
      if (
        this.exercises[i].new ||
        this.exercises[i].edited ||
        this.exercises[i].edit ||
        this.exercises[i].delete
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

.exercises .detail {
  margin-top: 15px;
  background-color: #fcfcfc;
  min-height: 80px;
  padding: 10px 15px 10px 15px;
  font-size: 14px;
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
