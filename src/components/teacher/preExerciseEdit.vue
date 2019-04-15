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
              <div
                v-if="item1.type === 0"
                :class="item1.answer[0] === j? 'answer': ''"
              >{{String.fromCharCode(j+65)}}.{{item2}}</div>
              <div
                v-else
                :class="item1.answer.indexOf(j) !== -1? 'answer': ''"
              >{{String.fromCharCode(j+65)}}.{{item2}}</div>
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
              <el-col :span="12">
                <div style="margin-top: 7px">
                  <el-radio-group v-model="exerciseNew.type">
                    <el-radio :label="0">单选题</el-radio>
                    <el-radio :label="1">多选题</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="12">
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
                <el-input v-model="exerciseNew.options[j]" size="mini" style="width: 280px"></el-input>
              </span>
              <span>
                <el-button type="text" @click="exerciseNew.options.splice(j, 1)">
                  <i class="el-icon-circle-close"></i>
                </el-button>
              </span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <el-button size="small" round @click="addPreOptions(i)">
              <i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项
            </el-button>
          </div>
          <div style="margin-top: 15px">
            <p>答案</p>
            <p style="margin-top: 10px" v-if="exerciseNew.type === 0">
              <el-radio-group v-model="exerciseNew.answer[0]">
                <el-radio
                  v-for="j in exerciseNew.options.length"
                  :key="j"
                  :value="j - 1"
                  :label="j - 1"
                >{{String.fromCharCode(j+64)}}</el-radio>
              </el-radio-group>
            </p>
            <p style="margin-left: 10px" v-else>
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
            <el-button size="mini" @click="saveEdit(i)">确认</el-button>
            <el-button size="mini" style="margin-left: 10px" @click="cancelEdit(i)">重置</el-button>
          </div>
        </div>
      </div>
      <div>
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
      id: "",
      // 课前习题
      exercises: [
        {
          question: "这里是题目内容",
          type: 0,
          options: ["选项A", "选项B", "选项C", "选项D"],
          score: 30,
          answer: [0],
          detail: "这里是题目解析",
          edit: false
        },
        {
          question: "这里是题目内容",
          type: 0,
          options: ["选项A", "选项B", "选项C", "选项D"],
          score: 30,
          answer: [0],
          detail: "这里是题目解析",
          edit: false
        },
        {
          question: "这里是题目内容",
          type: 1,
          options: ["选项A", "选项B", "选项C", "选项D"],
          score: 40,
          answer: [0, 1],
          detail: "这里是题目解析",
          edit: false
        }
      ],
      exerciseNew: {},
      totalScore: 0
    };
  },
  methods: {
    getParams() {
      this.id = this.$route.query.id;
    },
    addPreOptions(index) {
      this.exercises[index].options.push("请填写选项");
    },
    addPreview() {
      this.exercises.push({
        question: "",
        type: 0,
        options: ["请填写选项", "请填写选项"],
        score: 0,
        answer: [0],
        detail: "",
        edit: true
      });
      let last = this.exercises.length - 1;
      this.exerciseNew = this.objDeepCopy(this.exercises[last]);
    },
    deletePreview(index) {
      this.totalScore -= this.exercises[index].score;
      this.exercises.splice(index, 1);
    },
    editMode(index) {
      this.exercises[index].edit = true;
      this.exerciseNew = this.objDeepCopy(this.exercises[index]);
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
          this.totalScore = sum;
          this.exerciseNew.edit = false;
          this.exercises.splice(index, 1, this.exerciseNew);
        }
      }
    },
    cancelEdit(index) {
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
    for (let i = 0; i < this.exercises.length; i++) {
      this.totalScore += this.exercises[i].score;
    }
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
