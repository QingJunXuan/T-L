<template>
    <el-container>
      <el-aside>
        <el-menu
          default-active="0-0"
          style="height: 720px"
          class="el-menu-vertical-demo"
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="100">
            <span><el-button type="text" @click="handleAddChapter"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加章节</el-button></span>
          </el-menu-item>
          <el-submenu v-for="(item1,index1) in catalog" :index="index1.toString()" :key="index1">
            <template slot="title">
              <span>{{item1.chapterName}}</span>
              <span><el-button size="mini" circle icon="el-icon-edit" style="color: #fff; background-color: #545c64; border-color: #545c64" @click="handleEditChapter(index1)"></el-button></span>
            </template>
            <el-menu-item-group v-for="(item2, index2) in item1.pointName" :key="index2">
              <el-menu-item :index="index1 + '-' + index2">{{item2}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName">

          <!-- 知识点 -->
          <el-tab-pane label="知识点" name="first">
            <el-form :model="pointForm" status-icon :rules="pointRules" ref="pointForm" label-width="100px" label-position="top" align="start" style="width: 700px; margin: 0 auto">
              <el-form-item label="标题" prop="title">
                <el-input>
                </el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 16, maxRows: 16}"
                  placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item align="center">
                <el-button type="primary">保存</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 课前习题 -->
          <el-tab-pane label="课前摸底习题" name="second">
            <div style="width: 700px; margin: 0 auto; padding-top: 20px" align="start">
              <h4>客观题({{totalPreview}}分)</h4>
              <div v-for="i in exercises1.length" :key="i" align="start" style="font-size: 14px">
                <div v-if="exercises1[i-1].edit === false">
                  <div style="margin-top: 8px">
                    <span style="margin-left: 5px">{{i}}. {{exercises1[i - 1].question}}（{{exercises1[i - 1].score}}分）</span>
                    <span><el-button size="mini" circle icon="el-icon-edit" style="border-color: #fff" @click="exercises1[i-1].edit = true"></el-button></span>
                  </div>
                  <div class="betweenspace" style="margin-top: 10px; padding: 0 10px 0 10px">
                    <div v-for="j in exercises1[i - 1].options.length" :key="j" :class="exercises1[i-1].answer === j - 1? 'answer': ''">{{String.fromCharCode(j+64)}}.{{exercises2[i - 1].options[j - 1]}}</div>
                  </div>
                  <div style="margin-top: 10px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px">
                    {{exercises1[i - 1].detail}}
                  </div>
                </div>
                <div v-else style="margin-bottom: 20px">
                  <div style="margin-top: 8px">
                    <p style="margin-left: 5px">{{i}}. </p>
                    <p>
                      <el-input
                        v-model="exercises1[i-1].question"
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 8}"
                        placeholder="题目内容">
                      </el-input>
                    </p>
                    <el-row style="margin-top: 20px">
                      <el-col :span="12">
                        <div style="margin-top: 7px">
                          <el-radio-group v-model="exercises1[i-1].type" >
                            <el-radio :label="0">单选题</el-radio>
                            <el-radio :label="1">多选题</el-radio>
                          </el-radio-group>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div align="end">
                          <span>分值</span>
                          <span style="margin-left: 5px"><el-input size="mini" type="number" v-model="exercises1[i-1].score" style="width: 80px"></el-input></span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div style="margin-top: 15px" class="betweenspace">
                    <div v-for="j in exercises1[i - 1].options.length" :key="j" style="margin-top: 10px" >
                      <span>{{String.fromCharCode(j+64)}}.</span>
                      <span><el-input v-model="exercises1[i-1].options[j-1]" size="mini" style="width: 280px"></el-input></span>
                    </div>
                  </div>
                  <div style="margin-top: 15px">
                    <el-button size="small" round @click="addPreOptions(i-1)"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项</el-button>
                  </div>
                  <div style="margin-top: 15px">
                    <span>答案</span>
                    <span style="margin-left: 8px" v-if="exercises1[i-1].type === 0">
                      <el-radio-group v-model="exercises1[i-1].answer">
                        <el-radio v-for="j in exercises1[i - 1].options.length" :key="j" :value="j - 1" :label="String.fromCharCode(j+64)"></el-radio>
                      </el-radio-group>
                    </span>
                    <span style="margin-left: 8px" v-else>
                      <el-checkbox-group v-model="exercises1[i-1].answer">
                        <el-checkbox v-for="j in exercises1[i - 1].options.length" :key="j" :value="j - 1" :label="String.fromCharCode(j+64)"></el-checkbox>
                      </el-checkbox-group>
                    </span>
                  </div>
                  <div style="margin-top: 15px">
                    <p>解析</p>
                    <el-input
                      v-model="exercises1[i-1].detail"
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 8}"
                      placeholder="请输入题目解析">
                    </el-input>
                  </div>
                  <div style="margin-top: 20px">
                    <el-button size="mini" @click="exercises1[i-1].edit = false">确认</el-button>
                    <el-button size="mini" style="margin-left: 10px">重置</el-button>
                  </div>
                </div>
              </div>
              <div>
                <el-button size="small" round style="margin-top: 20px" @click="addPreview"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题</el-button>
              </div>
            </div>
            <div align="center" style="margin-top: 20px">
              <el-button type="primary">保存</el-button>
              <el-button>重置</el-button>
            </div>
          </el-tab-pane>

          <!-- 课后习题 -->
          <el-tab-pane label="课后习题" name="third">
            <div style="width: 700px; margin: 0 auto; padding-top: 20px" align="start">
              <div style="font-size: 14px">
                <p>作答时间</p>
                <el-date-picker
                  v-model="time"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['18:00:00', '00:00:00']">
                </el-date-picker>
              </div>
              <h4>客观题({{totalObject}}分)</h4>
              <div v-for="i in exercises2.length" :key="i" align="start" style="font-size: 14px">
                <div v-if="exercises2[i-1].edit === false">
                  <div style="margin-top: 8px">
                    <span style="margin-left: 5px">{{i}}. {{exercises2[i - 1].question}}（{{exercises2[i - 1].score}}分）</span>
                    <span><el-button size="mini" circle icon="el-icon-edit" style="border-color: #fff" @click="exercises2[i-1].edit = true"></el-button></span>
                  </div>
                  <div class="betweenspace" style="margin-top: 10px; padding: 0 10px 0 10px">
                    <div v-for="j in exercises2[i - 1].options.length" :key="j" :class="exercises2[i-1].answer === j - 1? 'answer': ''">{{String.fromCharCode(j+64)}}.{{exercises2[i - 1].options[j - 1]}}</div>
                  </div>
                  <div style="margin-top: 10px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px">
                    {{exercises2[i - 1].detail}}
                  </div>
                </div>
                <div v-else style="margin-bottom: 20px">
                  <div style="margin-top: 8px">
                    <p style="margin-left: 5px">{{i}}. </p>
                    <p>
                      <el-input
                        v-model="exercises2[i-1].question"
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 8}"
                        placeholder="题目内容">
                    </el-input>
                    </p>
                    <el-row style="margin-top: 20px">
                      <el-col :span="12">
                        <div style="margin-top: 7px">
                          <el-radio-group v-model="exercises2[i-1].type" >
                            <el-radio :label="0">单选题</el-radio>
                            <el-radio :label="1">多选题</el-radio>
                          </el-radio-group>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div align="end">
                          <span>分值</span>
                          <span style="margin-left: 5px"><el-input size="mini" type="number" v-model="exercises2[i-1].score" style="width: 80px"></el-input></span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div style="margin-top: 15px" class="betweenspace">
                    <div v-for="j in exercises2[i - 1].options.length" :key="j" style="margin-top: 10px" >
                      <span>{{String.fromCharCode(j+64)}}.</span>
                      <span><el-input v-model="exercises2[i-1].options[j-1]" size="mini" style="width: 280px"></el-input></span>
                    </div>
                  </div>
                  <div style="margin-top: 15px">
                    <el-button size="small" round @click="addRevOptions(i-1)"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加选项</el-button>
                  </div>
                  <div style="margin-top: 15px">
                    <div v-if="exercises2[i-1].type === 0">
                      <span>答案</span>
                      <span style="margin-left: 8px">
                        <el-radio-group v-model="exercises2[i-1].answer">
                          <el-radio v-for="j in exercises2[i - 1].options.length" :key="j" :value="j - 1" :label="String.fromCharCode(j+64)"></el-radio>
                        </el-radio-group>
                      </span>
                    </div>
                    <div v-else>
                      <span>答案</span>
                      <span style="margin-left: 8px">
                      <el-checkbox-group v-model="exercises2[i-1].answer">
                        <el-checkbox v-for="j in exercises2[i - 1].options.length" :key="j" :value="j - 1" :label="String.fromCharCode(j+64)"></el-checkbox>
                      </el-checkbox-group>
                    </span>
                    </div>
                  </div>
                  <div style="margin-top: 15px">
                    <p>解析</p>
                    <el-input
                      v-model="exercises2[i-1].detail"
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 8}"
                      placeholder="请输入题目解析">
                    </el-input>
                  </div>
                  <div style="margin-top: 20px">
                    <el-button size="mini" @click="exercises2[i-1].edit = false">保存</el-button>
                    <el-button size="mini" style="margin-left: 10px">重置</el-button>
                  </div>
                </div>
              </div>
              <div>
                <el-button size="small" round style="margin-top: 20px" @click="addReviewO"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加客观题</el-button>
              </div>

              <h4>主观题({{totalSubject}}分)</h4>
              <div v-for="i in exercises3.length" :key="i" align="start" style="font-size: 14px">
                <div v-if="exercises3[i-1].edit === false">
                  <div style="margin-top: 8px">
                    <span style="margin-left: 5px">{{i}}.{{exercises3[i - 1].question}}（{{exercises3[i - 1].score}}分）</span>
                    <span><el-button size="mini" circle icon="el-icon-edit" style="border-color: #fff" @click="exercises3[i-1].edit = true"></el-button></span>
                  </div>
                  <div style="border: 1px solid #dcdcdc; min-height: 80px; padding: 10px 10px 10px 10px; margin-top: 15px;">
                    {{exercises3[i-1].answer}}
                  </div>
                  <div style="margin-top: 20px; background-color: #fcfcfc; min-height: 80px; padding: 10px 10px 10px 10px">
                    {{exercises3[i - 1].detail}}
                  </div>
                </div>
                <div v-else style="margin-bottom: 20px">
                  <div style="margin-top: 8px">
                    <p style="margin-left: 5px">{{i}}. </p>
                    <p>
                      <el-input
                        v-model="exercises3[i-1].question"
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 8}"
                        placeholder="题目内容">
                    </el-input>
                    </p>
                  </div>
                  <div align="end">
                    <span>分值</span>
                    <span style="margin-left: 5px"><el-input size="mini" type="number" v-model="exercises3[i-1].score" style="width: 80px"></el-input></span>
                  </div>
                  <div style="margin-top: 15px">
                    <p>答案</p>
                    <el-input
                      v-model="exercises3[i-1].answer"
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 8}"
                      placeholder="请输入题目解析">
                    </el-input>
                  </div>
                  <div style="margin-top: 15px">
                    <p>解析</p>
                    <el-input
                      v-model="exercises3[i-1].detail"
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 8}"
                      placeholder="请输入题目解析">
                    </el-input>
                  </div>
                  <div style="margin-top: 20px">
                    <el-button size="mini" @click="exercises3[i-1].edit = false">确认</el-button>
                    <el-button size="mini" style="margin-left: 10px">重置</el-button>
                  </div>
                </div>
              </div>
              <div>
                <el-button round size="small" style="margin-top: 20px" @click="addReviewS"><i class="el-icon-circle-plus-outline" style="margin-right: 6px"></i>添加主观题</el-button>
              </div>
              <div align="center" style="margin-top: 20px">
                <el-button type="primary">保存</el-button>
                <el-button>重置</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>




        <el-dialog :visible.sync="updateChapterVisible" width="700px" :center="true" @close="handleChapterClose">
          <el-form style="padding: 15px 50px 15px 50px" :model="chapterForm" status-icon :rules="chapterRules" ref="chapterForm" label-width="100px" label-position="top" align="start">
            <el-form-item label="章节名" prop="name">
              <el-input style="width: 200px" v-model="chapterForm.name"></el-input>
            </el-form-item>
            <el-form-item label="章节类型" prop="type">
              <template>
                <el-select v-model="chapterForm.type">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="前继章节" prop="predecessor">
              <el-transfer v-model="chapterForm.predecessor" :data="chapterData" :titles="['无关章节', '前继章节']"></el-transfer>
            </el-form-item>
            <el-form-item align="center">
              <el-button type="primary">提交</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
</template>

<script>
    export default {
      name: "chapterEdit",
      data() {
        return {
          // 章节知识点列表
          catalog: [
            {
              chapterName: '章节一',
              type: '0',
              predecessor: [],
              pointName: [
                '知识点1',
                '知识点2',
                '知识点3'
              ]
            },
            {
              chapterName: '章节二',
              type: '0',
              predecessor: [0],
              pointName: [
                '知识点1',
                '知识点2',
                '知识点3'
              ]
            },
            {
              chapterName: '章节三',
              type: '0',
              predecessor: [0,1],
              pointName: [
                '知识点1',
                '知识点2',
                '知识点3'
              ]
            }
          ],
          chapterData: [],
          activeName: 'first',
          updateChapterVisible: false,
          chapterForm: {
            name: '',
            type: '0',
            predecessor: []
          },
          chapterRules: {
            name: [
              { required: true, message: '请输入章节名', trigger: 'blur' }
            ]
          },
          typeOptions: [
            {
              value: '0',
              label: '一级章节'
            },
            {
              value: '1',
              label: '二级章节'
            }
          ],
          // 知识点
          pointForm: {
            title: '',
            content: ''
          },
          pointRules: {
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            content: [
              { required: true, message: '请输入知识点内容', trigger: 'blur' }
            ],
          },
          // 课前习题
          exercises1 : [
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C', '选项D'],
              score: 30,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            },
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C', '选项D'],
              score: 30,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            },
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C', '选项D'],
              score: 40,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            }
          ],
          totalPreview: 100,
          // 课后习题
          exercises2 : [
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C', '选项D'],
              score: 20,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            },
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C', '选项D'],
              score: 20,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            },
            {
              question: '这里是题目内容',
              type: 0,
              options: ['选项A', '选项B', '选项C'],
              score: 20,
              answer: 0,
              detail: '这里是题目解析',
              edit: false,
            }
          ],
          exercises3: [
            {
              question: '这里是题目内容',
              type: '0',
              score: 40,
              answer: '这里是题目答案',
              detail: '这里是题目解析',
              edit: false
            }
          ],
          totalObject: 60,
          totalSubject: 40,
          time: '',
        }
      },
      methods: {
        handleAddChapter() {
          this.updateChapterVisible = true;
          this.chapterForm = {
            name: '',
            type: '0',
            predecessor: []
          };
        },
        handleEditChapter(index) {
          this.updateChapterVisible = true;
          this.chapterForm = {
            name: this.catalog[index].chapterName,
            type: this.catalog[index].type,
            predecessor: this.catalog[index].predecessor
          };
          this.chapterData[index].disabled = true;
        },
        handleChapterClose() {
          for (let i = 0;i < this.chapterData.length;i++) {
            this.chapterData[i].disabled = false;
          }
        },
        addPreOptions(index) {
          this.exercises1[index].options.push('请填写选项');
        },
        addRevOptions(index) {
          this.exercises2[index].options.push('请填写选项');
        },
        deleteOptions1() {

        },
        addPreview() {
          this.exercises1.push({
            question: '',
            type: 0,
            options: ['请填写选项', '请填写选项'],
            score: 0,
            answer: 0,
            detail: '',
            edit: true,
          })
        },
        addReviewO() {
          this.exercises2.push({
            question: '',
            type: 0,
            options: ['请填写选项', '请填写选项'],
            score: 0,
            answer: 0,
            detail: '',
            edit: true,
          })
        },
        addReviewS() {
          this.exercises3.push({
            question: '',
            type: '0',
            score: 0,
            answer: '',
            detail: '',
            edit: true
          })
        }
      },
      created() {
        for (let i = 0;i < this.catalog.length;i++) {
          this.chapterData.push({
            key: i,
            label: this.catalog[i].chapterName,
            disabled: false
          });
        }
      },
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
