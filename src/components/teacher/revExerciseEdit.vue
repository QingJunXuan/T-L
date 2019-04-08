<template>
  <el-container>
    <div style="width: 700px; margin: 0 auto;" align="start">
      <el-dialog title="请选择答题时间" :visible.sync="dialogTableVisible">
        <div align="center">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['18:00:00', '00:00:00']">
          </el-date-picker>
          <el-button @click="submit">确认</el-button>
        </div>
      </el-dialog>
      <!-- 客观题 -->
      <h4>客观题({{totalObject}}分)</h4>
      <div v-for="(item1, i) in exercisesObj" :key="i" align="start" style="font-size: 14px">
        <!-- 正常显示 -->
        <div v-if="item1.edit === false">
          <div style="margin-top: 8px">
            <span style="margin-left: 5px">{{i+1}}. {{item1.question}}（{{item1.score}}分）</span>
            <span><el-button size="mini" circle icon="el-icon-edit" style="border-color: #fff" @click="editObject(i)"></el-button></span>
            <span><el-button size="mini" circle icon="el-icon-circle-close-outline" style="border-color: #fff" @click="deleteObject(i)"></el-button></span>
          </div>
          <div class="betweenspace" style="margin-top: 10px; padding: 0 10px 0 10px">
            <div v-for="(item2, j) in item1.options" :key="i*10+j">
              <div v-if="item1.type === 0" :class="item1.answer[0] === j? 'answer': ''">
                {{String.fromCharCode(j+65)}}.{{item2}}
              </div>
              <div v-else :class="item1.answer.indexOf(j) !== -1? 'answer': ''">
                {{String.fromCharCode(j+65)}}.{{item2}}
              </div>
            </div>
          </div>
          <div style="margin-top: 10px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px">
            {{item1.detail}}
          </div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{i+1}}. </p>
            <p>
              <el-input
                v-model="objectNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容">
              </el-input>
            </p>
            <el-row style="margin-top: 20px">
              <el-col :span="12">
                <div style="margin-top: 7px">
                  <el-radio-group v-model="objectNew.type" >
                    <el-radio :label="0">单选题</el-radio>
                    <el-radio :label="1">多选题</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="12">
                <div align="end">
                  <span>分值</span>
                  <span style="margin-left: 5px"><el-input size="mini" type="number" v-model="objectNew.score" style="width: 80px"></el-input></span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 15px" class="betweenspace">
            <div v-for="j in objectNew.options.length" :key="i*10+j" style="margin-top: 10px" >
              <span>{{String.fromCharCode(j+64)}}.</span>
              <span style="margin-left: 7px"><el-input v-model="objectNew.options[j-1]" size="mini" style="width: 240px"></el-input></span>
              <span><el-button type="text" @click="objectNew.options.splice(j-1, 1)"><i class="el-icon-circle-close"></i></el-button></span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <el-button size="small" round @click="addRevOptions(i)"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项</el-button>
          </div>
          <div style="margin-top: 15px">
            <div v-if="objectNew.type === 0">
              <p>答案</p>
              <p style="margin-top: 10px">
                <el-radio-group v-model="objectNew.answer[0]">
                  <el-radio v-for="j in objectNew.options.length" :key="i*10+j" :value="j - 1" :label="j - 1">{{String.fromCharCode(j+64)}}</el-radio>
                </el-radio-group>
              </p>
            </div>
            <div v-else>
              <p>答案</p>
              <p style="margin-top: 10px">
                <el-checkbox-group v-model="objectNew.answer">
                  <el-checkbox v-for="j in objectNew.options.length" :key="i*10+j" :value="j - 1" :label="j - 1">{{String.fromCharCode(j+64)}}</el-checkbox>
                </el-checkbox-group>
              </p>
            </div>
          </div>
          <div style="margin-top: 15px">
            <p>解析</p>
            <el-input
              v-model="objectNew.detail"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析">
            </el-input>
          </div>
          <div style="margin-top: 20px">
            <el-button size="mini" @click="saveObject(i)">确认</el-button>
            <el-button size="mini" style="margin-left: 10px" @click="cancelObject(i)">重置</el-button>
          </div>
        </div>
      </div>
      <div>
        <el-button size="small" round style="margin-top: 20px" @click="addReviewO"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题</el-button>
      </div>
      <!-- 主观题 -->
      <h4>主观题({{totalSubject}}分)</h4>
      <!-- 正常显示 -->
      <div v-for="(item, i) in exercisesSub" :key="i" align="start" style="font-size: 14px">
        <div v-if="item.edit === false">
          <div style="margin-top: 8px">
            <span style="margin-left: 5px">{{i+1}}.{{item.question}}（{{item.score}}分）</span>
            <span><el-button size="mini" circle icon="el-icon-edit" style="border-color: #fff" @click="editSubject(i)"></el-button></span>
            <span><el-button size="mini" circle icon="el-icon-circle-close-outline" style="border-color: #fff" @click="deleteSubject(i)"></el-button></span>
          </div>
          <div style="border: 1px solid #dcdcdc; min-height: 80px; padding: 10px 10px 10px 10px; margin-top: 15px;">
            {{item.answer}}
          </div>
          <div style="margin-top: 20px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px">
            {{item.detail}}
          </div>
        </div>
        <!-- 编辑模式 -->
        <div v-else style="margin-bottom: 20px">
          <div style="margin-top: 8px">
            <p style="margin-left: 5px">{{i+1}}. </p>
            <p>
              <el-input
                v-model="subjectNew.question"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                placeholder="题目内容">
              </el-input>
            </p>
          </div>
          <div align="end">
            <span>分值</span>
            <span style="margin-left: 5px"><el-input size="mini" type="number" v-model="subjectNew.score" style="width: 80px"></el-input></span>
          </div>
          <div style="margin-top: 15px">
            <p>答案</p>
            <el-input
              v-model="subjectNew.answer"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析">
            </el-input>
          </div>
          <div style="margin-top: 15px">
            <p>解析</p>
            <el-input
              v-model="subjectNew.detail"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入题目解析">
            </el-input>
          </div>
          <div style="margin-top: 20px">
            <el-button size="mini" @click="saveSubject(i)">确认</el-button>
            <el-button size="mini" style="margin-left: 10px" @click="cancelSubject(i)">重置</el-button>
          </div>
        </div>
      </div>
      <div>
        <el-button round size="small" style="margin-top: 20px" @click="addReviewS"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加主观题</el-button>
      </div>
      <div align="center" style="margin-top: 20px">
        <el-button type="primary" @click="dialogTableVisible = true">保存</el-button>
        <el-button>重置</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
    export default {
        name: "revExerciseEdit",
      data () {
          return {
            id: '',
            // 课后习题
            exercisesObj : [
              {
                question: '这里是题目内容',
                type: 0,
                options: ['选项A', '选项B', '选项C', '选项D'],
                score: 20,
                answer: [0],
                detail: '这里是题目解析',
                edit: false,
              },
              {
                question: '这里是题目内容',
                type: 0,
                options: ['选项A', '选项B', '选项C', '选项D'],
                score: 20,
                answer: [0],
                detail: '这里是题目解析',
                edit: false,
              },
              {
                question: '这里是题目内容',
                type: 0,
                options: ['选项A', '选项B', '选项C'],
                score: 20,
                answer: [0],
                detail: '这里是题目解析',
                edit: false,
              }
            ],
            exercisesSub: [
              {
                question: '这里是题目内容',
                type: '0',
                score: 40,
                answer: '这里是题目答案',
                detail: '这里是题目解析',
                edit: false
              }
            ],
            subjectNew: {},
            objectNew: {},
            totalObject: 0,
            totalSubject: 0,
            time: '',
            dialogTableVisible:false
          }
      },
      methods: {
        getParams() {
          this.id = this.$route.query.id;
        },
        // 客观题
        addRevOptions(index) {
          this.exercisesObj[index].options.push('请填写选项');
        },
        deleteObject(index) {
          this.$confirm('确认删除该题吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.totalObject -= this.exercisesObj[index].score;
            this.exercisesObj.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        addReviewO() {
          this.exercisesObj.push({
            question: '',
            type: 0,
            options: ['请填写选项', '请填写选项'],
            score: 0,
            answer: [0],
            detail: '',
            edit: true,
          });
          let last = this.exercisesObj.length - 1;
          this.objectNew = this.objDeepCopy(this.exercisesObj[last]);
        },
        editObject(index) {
          this.exercisesObj[index].edit = true;
          this.objectNew = this.objDeepCopy(this.exercisesObj[index]);
        },
        saveObject(index) {
          if (this.objectNew.question === '' || Number(this.objectNew.score) === 0 || this.objectNew.detail === '') {
            this.$message({
              message: '请将习题内容填写完整！',
              type: 'warning'
            });
          }
          else {
            let sum = this.totalObject;
            sum -= this.exercisesObj[index].score;
            sum += Number(this.objectNew.score);
            if (sum + this.totalSubject > 100) {
              this.$message({
                message: '总分超出最大值，请调整分数！',
                type: 'warning'
              });
            }
            else {
              this.totalObject = sum;
              this.objectNew.edit = false;
              this.exercisesObj.splice(index, 1, this.objectNew);
            }
          }
        },
        cancelObject(index) {
          this.objectNew = this.objDeepCopy(this.exercisesObj[index]);
        },
        // 主观题
        addReviewS() {
          this.exercisesSub.push({
            question: '',
            type: '0',
            score: 0,
            answer: '',
            detail: '',
            edit: true
          });
          let last = this.exercisesSub.length - 1;
          this.subjectNew = this.objDeepCopy(this.exercisesSub[last]);
        },
        deleteSubject(index) {
          this.$confirm('确认删除该题吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.totalSubject -= this.exercisesSub[index].score;
            this.exercisesSub.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        editSubject(index) {
          this.exercisesSub[index].edit = true;
          this.subjectNew = this.objDeepCopy(this.exercisesSub[index]);
        },
        saveSubject(index) {
          if (this.subjectNew.question === '' || Number(this.subjectNew.score) === 0 || this.subjectNew.answer === '' || this.subjectNew.detail === '') {
            this.$message({
              message: '请将习题内容填写完整！',
              type: 'warning'
            });
          }
          else {
            let sum = this.totalSubject;
            sum -= this.exercisesSub[index].score;
            sum += Number(this.subjectNew.score);
            if (this.totalObject + sum > 100) {
              this.$message({
                message: '总分超出最大值，请调整分数！',
                type: 'warning'
              });
            }
            else {
              this.totalSubject = sum;
              this.subjectNew.edit = false;
              this.exercisesSub.splice(index, 1, this.subjectNew);
            }
          }
        },
        cancelSubject(index) {
          this.subjectNew = this.objDeepCopy(this.exercisesSub[index]);
        },
        submit() {

        },
        objDeepCopy(source) {
          let sourceCopy = source instanceof Array ? [] : {};
          for (let item in source) {
            if (source.hasOwnProperty(item)) {
              sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
            }
          }
          return sourceCopy;
        }
      },
      created() {
        this.getParams();
        for (let i = 0;i < this.exercisesObj.length;i++) {
          this.totalObject += this.exercisesObj[i].score;
        }
        for (let i = 0;i < this.exercisesSub.length;i++) {
          this.totalSubject += this.exercisesSub[i].score;
        }
      },
      watch: {
        // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
        '$route': 'getParams'
      }
    }
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
