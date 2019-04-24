<template>
  <el-container :style="screenWidth">
    <el-main>
      <div>
        <el-col :span="12" :offset="2">
          <div
            style="height:650px;margin-top:0px;padding-right:10px;border:1px solid #ddd"
            ref="graph"
          ></div>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-card id="edit" style="width:100%;height:650px;left:10%;" body-style="{padding:'0px'}">
            <el-row style="padding-bottom:10px" v-show="isAddCourse">
              <p style="text-align:center;font-size:13px">新建课程</p>
              <p style="text-align:center;font-size:12px">其他操作，请点击左侧课程关系图中对应的节点</p>
            </el-row>
            <el-row style="padding-bottom:10px" v-show="isEditCourse">
              <p style="text-align:center;font-size:13px;margin-bottom:-3px">编辑课程</p>
              <el-button @click="addCourseVisible" size="mini" type="text">返回添加课程</el-button>
            </el-row>
            <el-row style="padding-bottom:10px" v-show="isAddClass">
              <p style="text-align:center;font-size:13px">为课程添加班级</p>
              <el-button @click="addCourseVisible" size="mini" type="text">返回添加课程</el-button>
            </el-row>
            <el-row style="padding-bottom:10px" v-show="isEditClass">
              <p style="text-align:center;font-size:13px;margin-bottom:-3px">编辑班级信息</p>
              <el-button @click="addCourseVisible" size="mini" type="text">返回添加课程</el-button>
            </el-row>

            <el-row style="padding-bottom:10px" v-show="editClassNum">
              <p style="text-align:center;font-size:13px;margin-bottom:-3px">编辑班级数量</p>
              <el-button @click="addCourseVisible" size="mini" type="text">返回添加课程</el-button>
            </el-row>
            <el-form
              v-show="isAddCourse"
              :model="ruleForm1"
              :rules="rules12"
              ref="ruleForm1"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="ruleForm1.courseName"></el-input>
              </el-form-item>
              <el-form-item prop="successor" label="前继课程" style="text-align:left">
                <el-select v-model="ruleForm1.successor" multiple collapse-tags placeholder="前继课程">
                  <el-option
                    v-for="(item,index) in allCourse"
                    :key="index"
                    :label="item.courseName.courseName"
                    :value="item.courseName.courseName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:30px">
                <el-button type="primary" @click="submitForm1('ruleForm1')">新 建</el-button>
              </el-form-item>
            </el-form>
            <el-form
              v-show="isEditCourse"
              :model="ruleForm2"
              :rules="rules12"
              ref="ruleForm2"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="ruleForm2.courseName"></el-input>
              </el-form-item>
              <el-form-item prop="successor" label="前继课程" style="text-align:left">
                <el-select v-model="ruleForm2.successor" multiple collapse-tags placeholder="前继课程">
                  <el-option
                    v-for="(item,index) in filterAllCourse"
                    :key="index"
                    :label="item.courseName.courseName"
                    :value="item.courseName.courseName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:30px">
                <el-button type="primary" @click="submitForm2('ruleForm2')">提交修改</el-button>
                <el-button type="text" @click="addCourseVisible">取消</el-button>
              </el-form-item>
            </el-form>
            <el-form
              v-show="isAddClass"
              :model="ruleForm3"
              :rules="rules34"
              ref="ruleForm3"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="ruleForm3.teacherName"></el-input>
              </el-form-item>
              <el-form-item label="教师工号" prop="teacherID">
                <el-input v-model="ruleForm3.teacherID"></el-input>
              </el-form-item>
              <el-form-item label="学年学期" required>
                <el-col :span="11">
                  <el-form-item prop="courseYear">
                    <el-date-picker
                      v-model="ruleForm3.courseYear"
                      type="year"
                      placeholder="选择学年"
                      style="width: 100%;"
                      :picker-options="pickerOptions2"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="courseSemester">
                    <el-select
                      v-model="ruleForm3.courseSemester"
                      placeholder="学期"
                      style="width: 100%;"
                    >
                      <el-option label="春季" value="春季"></el-option>
                      <el-option label="秋季" value="秋季"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="授课时间" required>
                <el-col :span="11">
                  <el-form-item prop="startTime">
                    <el-date-picker
                      type="date"
                      placeholder="开始日期"
                      v-model="ruleForm3.startTime"
                      style="width: 100%;"
                      :picker-options="startTime(ruleForm3)"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="ruleForm3.endTime"
                      style="width: 100%;"
                      :picker-options="endTime(ruleForm3)"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="班级个数" prop="classNum" style="width:80%">
                <el-input type="num" v-model.number="ruleForm3.classNum" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:10px">
                <el-button type="primary" @click="submitForm3('ruleForm3')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm3')">重置</el-button>
              </el-form-item>
            </el-form>
            <!--  <el-row v-show="isDel">
              <el-table :data="allCourse" highlight-current-row @selection-change="selsChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" label="序号" width="70"></el-table-column>
                <el-table-column prop="courseName" label="课程名" width="180" sortable></el-table-column>
                <el-table-column prop="teacherName" label="教师姓名" width="120" sortable></el-table-column>
                <el-table-column prop="teacherID" label="教师编号" width="120" sortable></el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button @click="delCourse()">删除选中</el-button>
              </div>
            </el-row>-->
            <el-form
              v-show="isEditClass"
              :model="ruleForm4"
              :rules="rules34"
              ref="ruleForm4"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="ruleForm4.teacherName"></el-input>
              </el-form-item>
              <el-form-item label="教师工号" prop="teacherID">
                <el-input v-model="ruleForm4.teacherID"></el-input>
              </el-form-item>
              <el-form-item label="学年学期" required>
                <el-col :span="11">
                  <el-form-item prop="courseYear">
                    <el-date-picker
                      v-model="ruleForm4.courseYear"
                      type="year"
                      placeholder="选择学年"
                      style="width: 100%;"
                      :picker-options="pickerOptions2"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="courseSemester">
                    <el-select
                      v-model="ruleForm4.courseSemester"
                      placeholder="学期"
                      style="width: 100%;"
                    >
                      <el-option label="春季" value="春季"></el-option>
                      <el-option label="秋季" value="秋季"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="授课时间" required>
                <el-col :span="11">
                  <el-form-item prop="startTime">
                    <el-date-picker
                      type="date"
                      placeholder="开始日期"
                      v-model="ruleForm4.startTime"
                      style="width: 100%;"
                      :picker-options="startTime(ruleForm4)"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="ruleForm4.endTime"
                      style="width: 100%;"
                      :picker-options="endTime(ruleForm4)"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:30px">
                <el-button type="primary" @click="submitForm4('ruleForm4')">提交修改</el-button>
                <el-button type="text" @click="addCourseVisible">取消</el-button>
              </el-form-item>
            </el-form>
            <el-row v-show="editClassNum">
              <el-table :data="rowIndex.courseClasses" border style="width: 100%">
                <el-table-column prop="classNum" label="班级" width="100"></el-table-column>
                <el-table-column prop="classCode" label="邀请码" width="150"></el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button @click="delClassNum(scope)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="classNum" label="班级数"></el-table-column> -->
              </el-table>
              <div style="padding-top:20px">
                <el-button @click="isAddClassNum=true" size="small">新增班级</el-button>
              </div>
              <el-dialog :visible.sync="isAddClassNum" title="提示" center width="30%">
                <p style="text-align:center">是否确认添加班级？</p>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addClassNum" size="small">确 认</el-button>
                  <el-button @click="isAddClassNum=false" size="small">取 消</el-button>
                </span>
              </el-dialog>
            </el-row>
          </el-card>
        </el-col>
        <el-dialog title="请选择要进行的操作" :visible.sync="dialog1" width="30%">
          <div style="margin-top:-20px">
            对课程进行操作：
            <el-button type="text" @click="editCourseVisible">
              <span style="font-size:12px">编辑</span>
            </el-button>
            <!--  <el-button type="text" @click="isDelCourse=true">
              <span style="font-size:12px">删除</span>
            </el-button>-->
            <el-button type="text" @click="addClassVisible">
              <span style="font-size:12px">开课</span>
            </el-button>
          </div>
          <el-table :data="dupCourse" border  @row-click="rowClick">
            <el-table-column label="点击下表对应行，对班级进行操作">
              
              <el-table-column prop="courseInfo.courseName" label="name" width="100"></el-table-column>
              <el-table-column prop="courseInfo.teacherName" label="教师" width="100"></el-table-column>
              <el-table-column prop="courseInfo.startTime" label="开课时间" width="180"></el-table-column>
              <el-table-column prop="courseInfo.endTime" label="结束时间"></el-table-column>
              <!-- <el-table-column prop="courseClasses" label="班级数"></el-table-column> -->

            </el-table-column>
            <!-- <el-table-column prop="classNum" label="班级数"></el-table-column> -->
          </el-table>
        </el-dialog>
        <el-dialog title="请选择要进行的操作" :visible.sync="isDelCourse" width="30%" center>
          <p style="text-align:center">确定要删除该课程吗？</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="delCourse" size="small">确 认</el-button>
            <el-button @click="isDelCourse=false" size="small">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="请选择要进行的操作" :visible.sync="dialog2" width="30%" center>
          <p style="text-align:center">
            <el-button @click="editClassVisible" size="small" type="primary">编辑信息</el-button>
            <el-button @click="editClassNumVisible" size="small" type="primary">编辑班级</el-button>
            <el-button @click="delClass" size="small" type="danger">删 除</el-button>
          </p>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import store from "../../store/store.js";
import axios from "axios";
export default {
  name: "courseGraph",
  data() {
    return {
      screenWidth: {
        width: window.screen.width
      },
      isAddCourse: true,
      isAddClass: false,
      courseName: 0, //courseNameID
      isEditCourse: false,
      isEditClass: false,
      isDelCourse: false,
      isAddClassNum: false,
      dialog1: false,
      dialog2: false,
      editClassNum: false,
      dataIndex: 0,
      rowIndex: 0,
      data: [
        {
          name: "start",
          x: 1000,
          y: 0
        }
      ],
      links: [],
      allCourse: [], //不重名列表用于显示左侧
      dupCourse: [],

      loading: true,
      pickerOptions0: this.startTime(),
      pickerOptions1: this.endTime(),
      pickerOptions2: this.courseYear(),
      courses: [
        { courseName: "java" },
        { courseName: "软件测试" },
        { courseName: "软件工程" },
        { courseName: "计算机网络" },
        { courseName: "web技术" }
      ],
      //避免清除
      relayForm: {},
      //添加
      classNum: null,
      ruleForm1: {
        courseName: ""
        //successor:{}
      },
      ruleForm2: {
        courseName: ""
        //successor:{}
      },
      ruleForm3: {
        teacherName: "",
        teacherID: null,
        courseYear: "",
        courseSemester: "",
        startTime: null,
        endTime: null,
        classNum: null
      },
      ruleForm4: {
        teacherName: "",
        teacherID: null,
        courseYear: "",
        courseSemester: "",
        startTime: null,
        endTime: null
      },
      rules12: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        successor: [
          {
            required: false,
            message: "请选择前继课程",
            trigger: "blur"
          }
        ]
      },
      rules34: {
        teacherName: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        teacherID: [
          { required: true, message: "请输入教师工号", trigger: "blur" }
        ],
        courseYear: [
          {
            type: "date",
            required: true,
            message: "请选择年份",
            trigger: "change"
          }
        ],
        courseSemester: [
          { required: true, message: "请选择春/秋季", trigger: "change" }
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        endTime: [
          {
            type: "date",
            required: true,
            message: "请选择结束日期",
            trigger: "change"
          }
        ],
        classNum: [
          { required: true, message: "请输入班级个数" },
          { type: "number", message: "必须为数字值" }
        ]
      },
      multipleSelection: []
    };
  },
  created() {
    axios
      .get("/api/getAllCoursesRelation", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      .then(resp => {
        if (resp.data.state == 1) {
          this.allCourse = resp.data.data;
          var length = this.allCourse.length;
          if (length != 0) {
            this.set(length);
          } else {
            this.draw();
          }
        } else {
          this.$message(resp.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    filterAllCourse: function() {
      var filterForm = Object.assign({}, this.allCourse);
      var name = this.data[this.dataIndex];

      delete filterForm[this.dataIndex - 1];

      var length = this.links.length;
      for (var i = 0; i < length; i++) {
        if (this.links[i].source == name) {
          for (var j = 0; j < filterForm.length; j++) {
            if (filterForm[j].courseName.courseName == this.links[i].target) {
              delete filterForm[j];
              break;
            }
          }
        }
      }
      return filterForm;
    }
  },
  mounted() {
    //console.log(this.data);
    //this.draw();
  },
  methods: {
    set(length) {
      //var length = this.allCourse.length
      for (var i = 0; i < length; i++) {
        
        var num = this.allCourse[i].preCoursesName.length;
        var name = this.allCourse[i].courseName.courseName;

        /* var addData = {
          name: name,
          //category: "test",
          x: Math.round(Math.random() * 2000),
          y: Math.round(Math.random() * 2000) + Math.round(Math.random()* 100)+50
        };
        this.data.push(addData); */
        if (num == 0) {
          var nopre_x = Math.round(Math.random() * 2000)
          var nopre_y =Math.round(Math.random() * 500)+50
          var addData = {
          name: name,
          //category: "test",
          x: nopre_x,
          y: nopre_y,
        };
         this.data.push(addData);
          //无前继节点的，连接start
          var addLink = {
            target: name,
            source: "start",
            label: {
              normal: {
                show: false
              }
            }
            /*  lineStyle: {
                            normal: { curveness: 0.2 }
                        } */
          };
          this.links.push(addLink);
        } else {
          var nopre_x = Math.round(Math.random() * 2000)
          var nopre_y =Math.round(Math.random() * 500)+600  //50+500+50
          var addData = {
          name: name,
          //category: "test",
          x: nopre_x,
          y: nopre_y,
        };
         this.data.push(addData);

          //所有前继节点
          for (var j = 0; j < num; j++) {
            var addLink = {
              target: name,
              source: this.allCourse[i].preCoursesName[j].courseName,
              label: {
                normal: {
                  show: false
                }
              }
              /* lineStyle: {
                                normal: { curveness: 0.2 }
                            } */
            };
            this.links.push(addLink);
          }
        }
      }
      this.draw();
      store.commit("set", {
        list: this.allCourse,
        data: this.data,
        links: this.links
      });
    },
    setAllCourse() {
      axios
        .get("/api/getAllCoursesRelation", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            store.commit("setAllCourse", resp.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initGraph() {
      var init = this.$refs.graph;
      var graph = this.$echarts.init(init);
      return graph;
    },
    startTime(form) {
      return {
        disabledDate: time => {
          if (form.endTime != null) {
            return (
              time.getTime() >= form.endTime || time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now();
          }
        }
      };
    },
    endTime(form) {
      return {
        disabledDate: time => {
          if (form.startTime != null) {
            return (
              time.getTime() <= form.startTime || time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now();
          }
        }
      };
    },
    courseYear() {
      return {
        disabledDate: time => {
          return time.getTime() < Date.now();
        }
      };
    },
    setTime(val) {
      var result =
        val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate();
      return result;
    },
    getTime(val) {
      var result = val.getFullYear();
      return result;
    },
    edgeFunc() {
      store.commit("edgeStyle", this.dataIndex);
      this.test();
    },
    getDupCourse() {
      axios
        .get("/api/getAllCoursesByNameID", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseNameID: this.allCourse[this.dataIndex - 1].courseName
              .courseNameID
          }
        })
        .then(resp => {
          console.log(
            this.allCourse[this.dataIndex - 1].courseName.courseNameID,
            "nameid"
          );
          console.log(resp.data, "resp.data");
          if (resp.data.state == 1) {
            this.dupCourse = resp.data.data;
          }
          console.log(this.dupCourse, "dup");
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var length = this.data.length;
          for (var i = 0; i < length; i++) {
            if (this.ruleForm1.courseName == this.data[i].name) {
              if (this.ruleForm1.courseName == "start") {
                alert("不可添加名为“start”的课程");
              } else {
                alert("已添加该课程");
              }
              return 1;
            }
          }
          this.addCourse();
        } else {
          console.log("error submit!!");
          alert("信息不完整");
          return false;
        }
      });
      this.resetForm(formName);
    },
    submitForm2(formName) {
      //console.log(this.dataIndex)
      var length = this.data.length;
      for (var i = 0; i < length; i++) {
        if (
          this.ruleForm2.courseName == this.data[i].name &&
          this.ruleForm2.courseName != this.data[this.dataIndex].name
        ) {
          if (this.ruleForm2.courseName == "start") {
            alert("不可更改课程名为“start”");
          } else {
            alert("该课程已存在");
          }
          return 1;
        }
      }
      this.editCourse();
    },
    submitForm3(formName) {
      //addClass
      this.$refs[formName].validate(valid => {
        if (valid) {
          //=======================给后端
          var form = Object.assign({}, this.ruleForm3);
          console.log(this.ruleForm3, "ruleForm3");
          form.startTime=this.setTime(form.startTime)
          form.endTime=this.setTime(form.endTime)
          form.courseYear=this.getTime(form.courseYear)

          console.log(form);

          var params = new URLSearchParams();
          params.append("teacherID", form.teacherID),
            params.append("courseName", this.courseName),
            params.append("teacherName", form.teacherName),
            params.append("courseYear", form.courseYear),
            params.append("courseSemester", form.courseSemester),
            params.append("startTime", form.startTime),
            params.append("endTime", form.endTime),
            axios
              .post("/api/addCourse", params, {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
              })
              .then(resp => {
                console.log(resp.data,"need")
                if (resp.data.state == 1) {
                  console.log(resp.data, "addClass");
                  var id = resp.data.data.courseID;
                  for (var i = 0; i < form.classNum; i++) {
                    var params = new URLSearchParams()
                    params.append("courseID",id)
                    params.append("classNum",i+1)
                    axios
                      .post(
                        "/api/addClass",
                       params,
                        {
                          headers: {
                            Authorization:
                              "Bearer " + localStorage.getItem("token")
                          }
                        }
                      )
                      .then(resp => {
                        console.log(resp.data, "addClassNum");
                        if (resp.data.state == 1) {
                          this.$message("添加成功");
                        } else {
                          this.$message("添加失败");
                          return -1;
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
        } else {
          console.log("error submit!!");
          return false;
        }
        this.resetForm(formName);
      });
    },
    submitForm4(formName) {
      //editClass
      this.$refs[formName].validate(valid => {
        if (valid) {
          var form = Object.assign({}, this.ruleForm4);
          //==========================================后端
          form.startTime=this.setTime(form.startTime)
          form.endTime=this.setTime(form.endTime)
          form.courseYear=this.getTime(form.courseYear)

           var params = new URLSearchParams();
          params.append("courseID", form.courseID),
          params.append("teacherID", form.teacherID),
            params.append("courseName", this.courseName),
            params.append("teacherName", form.teacherName),
            params.append("courseYear", form.courseYear),
            params.append("courseSemester", form.courseSemester),
            params.append("startTime", form.startTime),
            params.append("endTime", form.endTime),
          axios
            .post(
              "/api/alterCourseInfo",
              params,
              {
                headers: {
                  'Content-Type':'application/x-www-form-urlencoded',
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
              }
            )
            .then(resp => {
              if (resp.data.state == 1) {
                console.log(resp.data, "editClass");
                if (resp.data.state == 1) {
                  this.$message("修改成功");
                } else {
                  this.$message("修改失败");
                  return -1;
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.resetForm(formName);
      this.isEditClass = false;
      this.isAddCourse = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addCourse() {
      //data
      //计算坐标
     /*  var addData = {
        name: this.ruleForm1.courseName,
        category: "test",
        x: Math.round(Math.random() * 1000),
        y: Math.round(Math.random() * 1000)
      };
      store.commit("addData", addData); */

      
      var name = this.ruleForm1.courseName
      var num = this.ruleForm1.successor.length;
      //所有前继节点
      if (num == 0) {

        var addData = {
        name: name,
        category: "test",
        x: Math.round(Math.random() * 2000),
        y: Math.round(Math.random() * 500)+50
      };
      store.commit("addData", addData);
        //无前继节点的，连接start
        var addLink = {
          target: name,
          source: "start",
          label: {
            normal: {
              show: false
            }
          },
          lineStyle: {
            normal: { curveness: 0.2 }
          }
        };
        store.commit("addLinks", addLink);
      } else {
         var addData = {
        name: name,
        category: "test",
        x: Math.round(Math.random() * 2000),
        y: Math.round(Math.random() * 500)+600 //50+500+50
      };
      store.commit("addData", addData);


        for (var i = 0; i < num; i++) {
          var addLink = {
            target: this.ruleForm1.courseName,
            source: this.ruleForm1.successor[i],
            label: {
              normal: {
                show: false
              }
            },
            lineStyle: {
              normal: { curveness: 0.2 }
            }
          };
          store.commit("addLinks", addLink);
        }
      }

      var addCourse = Object.assign({}, this.ruleForm1);
      console.log(addCourse);
      console.log(addCourse.successor, "successor");
      var params = new URLSearchParams();
      params.append("courseName", addCourse.courseName);
      axios
        .post("/api/addCourseName", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            var id = resp.data.data.courseNameID;

            for (var i = 0; i < addCourse.successor.length; i++) {
              for (var j = 0; j < this.allCourse.length; j++) {
                if (
                  addCourse.successor[i] ==
                  this.allCourse[j].courseName.courseName
                ) {
                  axios
                    .get("/api/addCourseRelation", {
                      params: {
                        courseNameID: id,
                        preCourseNameID: this.allCourse[j].courseName
                          .courseNameID
                      },
                      headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                      }
                    })
                    .then(resp => {
                      console.log("links,success");

                      if (resp.data.state == 0) {
                        alert("关系添加失败");
                      }
                    });
                  //break;
                }
              }
            }
            this.$message("课程添加成功");
          }
        })
        .catch(err => {
          console.log("err", err);
        });

      //addCourse
      //store.commit("addCourse", addCourse);
      //console.log(addCourse,"addCourse");
      this.allCourse = store.state.courseList;
      this.data = store.state.data;
      this.links = store.state.links;
      this.test();

      //==================向后端提交ruleForm1=========================
      //message添加成功
    },
    addCourseVisible() {
      if (this.isAddCourse == false) {
        this.isEditCourse = false;
        this.isEditClass = false;
        this.isAddCourse = true;
        this.isAddClass = false;
        this.editClassNum = false;
      }
    },
    editCourseVisible() {
      this.dialog1 = false;
      this.isAddCourse = false;
      this.isEditCourse = true; //编辑course
      this.isAddClass = false;
      this.isEditClass = false;
      this.editClassNum = false;

      var obj = Object.assign({}, this.allCourse[this.dataIndex - 1]);
      this.ruleForm2.courseName = obj.courseName.courseName;
      var length = obj.preCoursesName.length;
      this.ruleForm2.successor = new Array();
      for (var i = 0; i < length; i++) {
        this.ruleForm2.successor[i] = obj.preCoursesName[i].courseName;
      }
      console.log(this.ruleForm2, "form2");
    },
    editCourse() {
      var id = this.allCourse[this.dataIndex - 1].courseName.courseNameID;
      var oldName = this.data[this.dataIndex].name;
      var newName = this.ruleForm2.courseName;
      var length = this.allCourse[this.dataIndex - 1].preCoursesName.length;
      var oldLinks = new Array();
      var oldLinksID = new Array();
      for (var i = 0; i < length; i++) {
        oldLinks[i] = this.allCourse[this.dataIndex - 1].preCoursesName[
          i
        ].courseName;
        oldLinksID[i] = this.allCourse[this.dataIndex - 1].preCoursesName[
          i
        ].courseNameID;
      } //该节点原来的前继节点们
      var newLinks = this.ruleForm2.successor; //该节点修改后的前继节点
      console.log(oldLinks, newLinks);

      var editCourse = Object.assign({}, this.ruleForm2);
      //如果名字被更改，更新courseList、data和links里的名称
      if (newName != oldName) {
        store.commit("editName", { name: newName, index: this.dataIndex });
        console.log(this.data);
        var params = new URLSearchParams()
        params.append("courseNameID",id)
        params.append("courseName",newName)
        axios
          .post(
            "/api/alertCourseName",
            params,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(resp => {
            console.log(resp.data, "editCourseName");
            if (resp.message.state == 1) {
              this.$message("修改成功");
            } else {
              this.$message("修改失败");
              return -1;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      //links
      var isEqual = oldLinks.sort().toString() === newLinks.sort().toString();
      console.log(isEqual);
      if (isEqual == false) {
        //更改links
        store.commit("editLinks", { new: newLinks, index: this.dataIndex });
        console.log(this.links, "links");

        //去重-获得需删除的link
        var tempArray1 = []; //临时数组存放
        var del = [];
        for (var i = 0; i < newLinks.length; i++) {
          tempArray1[newLinks[i]] = true; //将newLinks中的元素值作为tempArray1 中的键，值为true；
        }
        for (var i = 0; i < oldLinks.length; i++) {
          if (!tempArray1[oldLinks[i]]) {
            del.push(oldLinks[i]); //过滤相同的元素；
          } else {
            oldLinksID.splice(i, 1);
          }
        }

        //获得需增加的link
        var tempArray2 = []; //临时数组存放
        var add = [];
        for (var i = 0; i < oldLinks.length; i++) {
          tempArray2[oldLinks[i]] = true; //将oldLinks中的元素值作为tempArray1 中的键，值为true；
        }
        for (var i = 0; i < newLinks.length; i++) {
          if (!tempArray2[newLinks[i]]) {
            add.push(newLinks[i]); //过滤相同的元素；
          }
        }

        //////////////////////////////后端改links
        var delLength = del.length;
        var addLength = add.length;
        var allLength = this.allCourse.length;
        for (var m = 0; m < addLength; m++) {
          for (var n = 0; n < allLength; n++) {
            if (add[m] == this.allCourse[n].courseName.courseName) {
              add[m] = this.allCourse[n].courseName.courseNameID;
              break;
            }
          }
        }
        for (var p = 0; p < delLength; p++) {
          axios
            .get("/api/deleteCourseRelation", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              },
              params: {
                courseNameID: id,
                preCourseNameID: oldLinksID[p]
              }
            })
            .then(resp => {
              console.log("links,del,success", p);
              if (resp.data.state == 0) {
                alert("关系删除失败");
              }
            });
        }
        for (var q = 0; q < addLength; q++) {
          axios
            .get("/api/addCourseRelation", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              },
              params: {
                courseNameID: id,
                preCourseNameID: add[q]
              }
            })
            .then(resp => {
              //console.log("links,add,success", q);
              if (resp.data.state == 0) {
                alert("关系添加失败");
              }
            });
        }
      }
      //查看是否修改了信息
      if (isEqual == false || newName != oldName) {
        console.log(this.allCourse);
        this.isEditCourse = false;
        this.isAddCourse = true;
        this.test();
        this.setAllCourse();
        this.$message("修改成功");
        //===============================
        //this.resetForm("ruleForm2");
        //===============================
      } else {
        alert("没有要修改的信息");
      }
    },
    rowClick(row) {
      this.dialog2 = true;
      console.log(row, "row");
      this.rowIndex = row;
      console.log(this.rowIndex, "rowIndex");
      //dubCourse
    },
    addClassVisible() {
      this.isAddCourse = false;
      this.isEditCourse = false;
      this.isAddClass = true;
      this.isEditClass = false;
      this.editClassNum = false;

      this.dialog1 = false;
    },
    editClassVisible() {
      this.dialog1 = false;
      this.dialog2 = false;
      this.isAddCourse = false;
      this.isEditCourse = false;
      this.isAddClass = false;
      this.isEditClass = true;
      this.editClassNum = false;

      var b = Object.assign({}, this.rowIndex);
      //var a = this.rowIndex;
      var a = b.courseInfo;
      console.log(a);
      a["courseYear"] = new Date(a["courseYear"]);
      a["startTime"] = new Date(a["startTime"]);
      a["endTime"] = new Date(a["endTime"]);
      this.ruleForm4 = a;
      /* 
      var num = this.rowIndex.courseClasses.length;
      this.ruleForm4.classNum = num; */
      console.log(this.ruleForm4);
    },
    editClass() {
      var length = this.dupCourse.length;

      var editClass = Object.assign({}, this.ruleForm4);
      //提交ruleForm2
      this.resetForm("ruleForm4");
      this.isEditClass = false;
      this.isAddCourse = true;
      this.$message("修改成功");

      //================向后端提交ruleForm2和classNum==========================
      //提交之后返回成功后，message修改成功
    },
    editClassNumVisible() {
      this.dialog1 = false;
      this.dialog2 = false;
      this.isAddCourse = false;
      this.isEditCourse = false;
      this.isAddClass = false;
      this.isEditClass = false;
      this.editClassNum = true;
      //this.editClassNum = false;
    },

    selsChange(arr) {
      this.multipleSelection = arr;
      console.log(arr);
      console.log(this.allCourse);
    },
    //表格多选删除
    /*  delCourse() {
      store.commit("delNode", this.multipleSelection);
      console.log(this.allCourse);
      //this.test();
      this.test();
    }, */
    //find
    addClassNum() {
      this.isAddClassNum = false;
      var params = new URLSearchParams()
        params.append("courseID",this.rowIndex.courseInfo.courseID)
        params.append("classNum",this.rowIndex.courseClasses.length + 1)
      axios
        .post(
          "/api/addClass",
         params,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(resp => {
          console.log("success");
          console.log(resp, "addClassNumresp");
          this.rowIndex.courseClasses.push(resp.data.data);
        });
    },
    delClassNum(data) {
      //splice
      //this.dupCourse.splice(this.rowIndex, 1);
      console.log(this.rowIndex, "rowindex1");
      this.rowIndex.courseClasses.splice(data.$index, 1);
      console.log(this.rowIndex, "rowindex2");
      console.log(data.$index);
      //=================================================================后端
      axios
        .get("/api/deleteClass", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseClassID: data.row.id
          }
        })
        .then(resp => {
          console.log("success");
          console.log(resp, "deleteClassNumresp");
          if (resp.data.state == 1) {
            this.$message(resp.data.message);
          }
        });
    },
    delClass() {
      //删除课程下的某一老师开的课程
      this.dialog2 = false;
      this.dupCourse.splice(this.rowIndex, 1);
      axios
        .get("/api/deleteCourse", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseID: this.rowIndex.courseInfo.courseID
          }
        })
        .then(resp => {
          console.log("success");
          console.log(resp, "deleteClassresp");
          if (resp.data.state == 0) {
            alert("删除失败");
          }
        });
    },
    delCourse() {
      //直接删除所有该名的课程
      this.dialog1 = false;
      this.isDelCourse = false;
      //this.resetForm("ruleForm2");
      store.commit("delNode2", this.dataIndex);
      this.test();
      //====================向后端提交====================
      /*  axios
        .get("/api/deleteCourse", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            courseID: this.allCourse[this.dataIndex - 1].courseID
          }
        })
        .then(resp => {
          console.log("success");
          if (resp.state == 0) {
            alert("删除失败");
          }
        });
     */
    },
    test() {
      var option = {
        series: [
          {
            data: store.state.data,
            links: store.state.links
          }
        ]
      };
      console.log("test");
      this.initGraph().setOption(option);
      console.log("test2");
    },
    draw() {
      var myChart = this.initGraph();
      var option = {
        title: {
          text: "课程关系图"
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        toolbox: {
          feature: {
            //保存为图片
            saveAsImage: { show: true }
            /* dataZoom:{
              show:true,
              title:{
                dataZoom:'区域缩放',
                dataZoomReset:'区域缩放后退'

              }
            } */
          }
        },
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 30,
            color: "#ec7814",
            roam: true,
            label: {
              normal: {
                show: true
              }
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            //edgeColor:"#000",
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 10,
                  fontColor: "#000"
                }
              }
            },
            data: this.data,
            links: this.links,

            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      var that = this;
      myChart.on("click", function(params) {
        console.log(params, "params");
        //点击高亮

        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          store.commit("edgeStyle", that.dataIndex);
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          /*  that.myChart.dispatchAction({
          type: "focusNodeAdjacency",
          // 使用 dataIndex 来定位节点。
          dataIndex: params.dataIndex
        }); */
          that.dataIndex = params.dataIndex;
          if (that.dataIndex == 0) {
            alert("不可对该节点进行操作");
          } else {
            //点击节点获取同名列表
            that.getDupCourse();
            that.courseName =
              that.allCourse[that.dataIndex - 1].courseName.courseNameID;
            that.dialog1 = true;
          }
        }
      });
      //取消右键的弹出菜单
      document.oncontextmenu = function() {
        return false;
      };
      //右键取消高亮
      myChart.on("contextmenu", function(params) {
        that.myChart.dispatchAction({
          type: "unfocusNodeAdjacency",
          // 使用 seriesId 或 seriesIndex 或 seriesName 来定位 series.
          seriesIndex: params.seriesIndex
        });
      });
      that.myChart = myChart;
    }
  }
};
</script>
<style scoped>
</style>