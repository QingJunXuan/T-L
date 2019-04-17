<template>
  <el-container>
    <div style="width: 700px; margin: 0 auto;" align="start">
      <h4>客观题({{totalScore}}分)</h4>
      <div v-for="(item1, i) in exercises" :key="i" align="start" style="font-size: 14px">
        <!-- 正常显示 -->
        <div v-if="item1.edit === false">
          <div style="margin-top: 8px">
            <span style="margin-left: 5px">{{i+1}}. {{item1.question}}（{{item1.score}}分）</span>
            <span>
              <el-button
                size="mini"
                circle
                icon="el-icon-edit"
                style="border-color: #fff"
                @click="editMode(i)"
              ></el-button>
            </span>
            <span>
              <el-button
                size="mini"
                circle
                icon="el-icon-circle-close-outline"
                style="border-color: #fff"
                @click="deletePreview(i)"
              ></el-button>
            </span>
          </div>
          <div class="betweenspace" style="margin-top: 10px; padding: 0 10px 0 10px">
            <div v-for="(item2, j) in item1.options" :key="j">
              <div :class="item1.answer === j? 'answer': ''">{{String.fromCharCode(j+65)}}.{{item2.content}}</div>
            </div>
          </div>
          <div
            style="margin-top: 10px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px"
          >{{item1.detail}}</div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{i+1}}.</p>
            <p>
              <el-input
                v-model="exerciseNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容"
              ></el-input>
            </p>
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <div align="end">
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
                <el-input v-model="exerciseNew.options[j].content" size="mini" style="width: 280px"></el-input>
              </span>
              <span>
                <el-button type="text" @click="deleteOption(j)">
                  <i class="el-icon-circle-close"></i>
                </el-button>
              </span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <el-button size="small" round @click="addPreOptions()">
              <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项
            </el-button>
          </div>
          <div style="margin-top: 15px">
            <p>答案</p>
            <p style="margin-top: 10px">
              <el-radio-group v-model="exerciseNew.answer">
                <el-radio
                  v-for="j in exerciseNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-radio>
              </el-radio-group>
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
            <el-button size="mini" @click="saveEdit(i)">确认</el-button>
            <el-button size="mini" style="margin-left: 10px" @click="resetEdit(i)">重置</el-button>
            <el-button size="mini" style="margin-left: 10px" @click="deletePreview(i)">移除</el-button>
          </div>
        </div>
      </div>
      <div v-show="addButton">
        <el-button size="small" round style="margin-top: 20px" @click="addPreview">
          <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题
        </el-button>
      </div>
      <div align="center" style="margin-top: 20px">
        <el-button type="primary">保存</el-button>
        <el-button>重置</el-button>
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
      // 课前习题
      exercises: [
        {
          exerciseID: 100,
          question: "这里是题目内容",
          options: [],
          score: 30,
          answer: 0,
          detail: "这里是题目解析",
          edit: false,
          new: false
        }
      ],
      exerciseNew: {},
      totalScore: 0,
      addButton: true
    };
  },
  methods: {
    getParams() {
      this.id = this.$route.query.id;
    },
    getPreExercises() {
      this.exercises = [];
      this.$http
        .get(
          // 传值chapterid
          'http://localhost:8080/question/view?chapterId=' + this.id + '&type=preview',
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
                    options: [],
                    score: exerciseList.data[i].exercise.exercisePoint,
                    answer:
                      exerciseList.data[i].exercise.exerciseAnswer.charCodeAt(
                        0
                      ) - 65,
                    detail: exerciseList.data[i].exercise.exerciseAnalysis,
                    edit: false,
                    new: false
                  });
                  for (
                    let k = 0;
                    k < exerciseList.data[i].exerciseChoiceList.length;
                    k++
                  ) {
                    this.exercises[i].options.push(
                      {
                        id: exerciseList.data[i].exerciseChoiceList[k].id,
                        content: exerciseList.data[i].exerciseChoiceList[k].choice
                      }
                    );
                  }
                  i++;
                }
                for (let i = 0; i < this.exercises.length; i++) {
                  this.totalScore += Number(this.exercises[i].score);
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
    addPreOptions() {
      this.exerciseNew.options.push({id: '', content: '请填写选项'});
    },
    addPreview() {
      this.exercises.push({
        exerciseID: 0,
        question: "",
        options: [{id: '', content: '请填写选项'}, {id: '', content: '请填写选项'}],
        score: 0,
        answer: 0,
        detail: "",
        edit: true,
        new: true
      });
      let last = this.exercises.length - 1;
      this.exerciseNew = this.objDeepCopy(this.exercises[last]);
      this.addButton = false;
    },
    deletePreview(index) {
      this.$confirm("确认删除该题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /*
          this.$http
              .post(
                "http://localhost:8080/question/deleteExercise?exerciseId=" + this.exercises[index].exerciseID,
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
                      message: "习题删除成功!"
                    });
                  } else {
                    this.$message({ type: "error", message: "习题删除失败!" });
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "习题删除失败!" });
                  return;
                }
              );*/
          this.totalScore -= this.exercises[index].score;
          this.exercises.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editMode(index) {
      this.exercises[index].edit = true;
      this.exerciseNew = this.objDeepCopy(this.exercises[index]);
      this.addButton = false;
    },
    deleteOption(index) {
      this.exerciseNew.options.splice(index, 1)
    },
    addOptions(eID) {
      for (let i = 0; i < this.exerciseNew.options.length; i++) {
              let optionEntity = {
                exerciseId: eID,
                exerciceChoiceId: String.fromCharCode(i + 65),
                choice: this.exerciseNew.options[i].content
              };
              this.$http
                .post(
                  "http://localhost:8080/question/addChoice",
                  optionEntity,
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token")
                    }
                  }
                )
                .then(
                  response => {
                    if (response.status === 200) {} else {
                      this.$message({
                        type: "error",
                        message: "选项添加失败!"
                      });
                      return;
                    }
                  },
                  response => {
                    this.$message({ type: "error", message: "选项添加失败!" });
                    return;
                  }
                );
            }
    },
    saveEdit(index) {
      if (
        this.exerciseNew.question === "" ||
        Number(this.exerciseNew.score) === 0 ||
        this.exerciseNew.detail === ""
      ) {
        this.$message({
          message: "请将习题内容填写完整！",
          type: "warning"
        });
      } else {
        let sum = this.totalScore;
        sum -= this.exercises[index].score;
        sum += Number(this.exerciseNew.score);
        if (sum > 100) {
          this.$message({
            message: "总分超出最大值，请调整分数！",
            type: "warning"
          });
        } else {
          /*
          if (this.exerciseNew.new) {
            let exerciseEntity = {
            // 传值chapterid
            chapterId: 1,
            exerciseType: 1,
            exerciseNumber: index + 1,
            exerciseContent: this.exerciseNew.question,
            exerciseAnswer: this.exerciseNew.answer,
            exerciseAnalysis: this.exerciseNew.detail,
            exercisePoint: this.exerciseNew.score
          };
            let eID = 0;
            this.$http
              .post(
                "http://localhost:8080/question/addExercise",
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
                    this.$message({
                      type: "success",
                      message: "习题添加成功!"
                    });
                    this.addOptions(JSON.parse(response.bodyText).data.exerciseId);
                  } else {
                    this.$message({ type: "error", message: "习题添加失败!" });
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "习题添加失败!" });
                  return;
                }
              );
          }
          else {
            let exerciseEntity = {
              exerciseId: this.exercises[index].exerciseID,
            // 传值chapterid
            chapterId: 1,
            exerciseType: 1,
            exerciseNumber: index + 1,
            exerciseContent: this.exerciseNew.question,
            exerciseAnswer: this.exerciseNew.answer,
            exerciseAnalysis: this.exerciseNew.detail,
            exercisePoint: this.exerciseNew.score
          };
            let i = 0;
            alert(this.exercises[index].exerciseID);
            // 选项长度变大
            if (this.exercises[index].options.length <= this.exerciseNew.options.length) {
              while (i < this.exercises[index].options.length) {
              if (
                this.exercises[index].options[i].content !== this.exerciseNew.options[i].content
              ) {
                let optionEntity = {
                  exerciseId: this.exercises[index].exerciseID,
                  exerciceChoiceId: String.fromCharCode(i + 65),
                  choice: this.exerciseNew.options[i].content
                };
                this.$http
                  .put(
                    "http://localhost:8080/question/alterChoice",
                    optionEntity,
                    {
                      headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                      }
                    }
                  )
                  .then(
                    response => {
                      if (response.status === 200) {
                        alert(
                          "option " + String.fromCharCode(i + 65) + " success"
                        );
                      } else {
                        this.$message({
                          type: "error",
                          message: "选项修改失败!"
                        });
                        return;
                      }
                    },
                    response => {
                      this.$message({
                        type: "error",
                        message: "选项修改失败!"
                      });
                      return;
                    }
                  );
              }
              i = i + 1;
            }
            alert(i);
            while (i < this.exerciseNew.options.length) {
              let optionEntity = {
                exerciseId: this.exercises[index].exerciseID,
                exerciceChoiceId: String.fromCharCode(i + 65),
                choice: this.exerciseNew.options[i].content
              };
              this.$http
                .post(
                  "http://localhost:8080/question/addChoice",
                  optionEntity,
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token")
                    }
                  }
                )
                .then(
                  response => {
                    if (response.status === 200) {
                      alert(
                        "option " + String.fromCharCode(i + 65) + " success"
                      );
                    } else {
                      this.$message({
                        type: "error",
                        message: "选项添加失败!"
                      });
                      return;
                    }
                  },
                  response => {
                    this.$message({ type: "error", message: "选项添加失败!" });
                    return;
                  }
                );
              i = i + 1;
            }
            }
            // 选项长度变小
            else {
            while (i < this.exerciseNew.options.length) {
              let optionEntity = {
                exerciseId: this.exerciseNew.exerciseID,
                exerciceChoiceId: String.fromCharCode(i + 65),
                choice: this.exerciseNew.options[i].content
              };
              if (
                this.exercises[index].options[i].content !== this.exerciseNew.options[i].content
              ) {this.$http
                .put(
                  "http://localhost:8080/question/alterChoice",
                  optionEntity,
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token")
                    }
                  }
                )
                .then(
                  response => {
                    if (response.status === 200) {
                      alert(
                        "option " + String.fromCharCode(i + 65) + " success"
                      );
                    } else {
                      this.$message({
                        type: "error",
                        message: "选项修改失败!"
                      });
                      return;
                    }
                  },
                  response => {
                    this.$message({ type: "error", message: "选项修改失败!" });
                    return;
                  }
                );
              i = i + 1;
            }
            }
            while (i < this.exercises[index].options.length) {
              {
                this.$http
                  .put(
                    "http://localhost:8080/question/deleteChoice?exerciseChoiceId=" + this.exercises[index].options[i].id,
                    {
                      headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                      }
                    }
                  )
                  .then(
                    response => {
                      if (response.status === 200) {
                        alert(
                          "option " + String.fromCharCode(i + 65) + " success"
                        );
                      } else {
                        this.$message({
                          type: "error",
                          message: "选项删除失败!"
                        });
                        return;
                      }
                    },
                    response => {
                      this.$message({
                        type: "error",
                        message: "选项删除失败!"
                      });
                      return;
                    }
                  );
              }
              i = i + 1;
            }
            }
            // 修改习题信息
            this.$http
              .put(
                "http://localhost:8080/question/alterExercise",
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
                    this.$message({
                      type: "success",
                      message: "习题编辑成功!"
                    });
                  } else {
                    this.$message({ type: "error", message: "习题编辑失败!" });
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "习题编辑失败!" });
                  return;
                }
              );
          }*/
          this.totalScore = sum;
          this.exerciseNew.edit = false;
          this.exerciseNew.new = false;
          this.exercises.splice(index, 1, this.exerciseNew);
          //this.getPreExercises();
          this.addButton = true;
        }
      }
    },
    resetEdit(index) {
      this.exerciseNew = this.objDeepCopy(this.exercises[index]);
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
    }
  },
  created() {
    this.getParams();
    this.getPreExercises();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  }
};
</script>

<style scoped>
.answer {
  color: #f00;
}

.betweenspace {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
