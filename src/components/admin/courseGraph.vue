<template>
  <el-container>
    <el-main>
      <div>
        <el-col :span="12" :offset="2">
          <div style="height:540px;margin-top:-20px;padding-right:10px" ref="graph"></div>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-card
            id="edit"
            style="width:100%;height:480px;left:10%;"
            body-style="{padding:'0px'}"
          >
            <el-row style="padding-bottom:10px" v-show="isAdd">
              <p style="text-align:center;font-size:13px">填写下面的表单新建课程</p>
              <p style="text-align:center;font-size:12px">删除或编辑课程，请点击左侧课程关系图中对应的节点</p>
            </el-row>
            <el-row style="padding-bottom:10px" v-show="isEdit">
              <p style="text-align:center;font-size:13px;margin-bottom:-3px">修改下面的表单编辑课程</p>
              <el-button @click="addVisible" size="mini" type="text">返回添加课程</el-button>
            </el-row>
            <el-form
              v-show="isAdd"
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="ruleForm.courseName"></el-input>
              </el-form-item>
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="ruleForm.teacherName"></el-input>
              </el-form-item>
              <el-form-item label="教师工号" prop="teacherID">
                <el-input v-model="ruleForm.teacherID"></el-input>
              </el-form-item>
              <el-form-item label="学年学期" required>
                <el-col :span="11">
                  <el-form-item prop="courseYear">
                    <el-date-picker
                      v-model="ruleForm.courseYear"
                      type="year"
                      placeholder="选择学年"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="courseSemester">
                    <el-select
                      v-model="ruleForm.courseSemester"
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
                      v-model="ruleForm.startTime"
                      style="width: 100%;"
                      :picker-options="pickerOptions0"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="ruleForm.endTime"
                      style="width: 100%;"
                      :picker-options="pickerOptions1"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item prop="successor" label="前继课程" style="text-align:left">
                <el-select v-model="ruleForm.successor" multiple collapse-tags placeholder="前继课程">
                  <el-option
                    v-for="(item,index) in allCourse"
                    :key="index"
                    :label="item.courseName"
                    :value="item.courseName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:10px">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
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
              v-show="isEdit"
              :model="ruleForm2"
              :rules="rules"
              ref="ruleForm2"
              label-width="100px"
              class="demo-ruleForm"
              size="mini"
            >
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="ruleForm2.courseName"></el-input>
              </el-form-item>
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="ruleForm2.teacherName"></el-input>
              </el-form-item>
              <el-form-item label="教师工号" prop="teacherID">
                <el-input v-model="ruleForm2.teacherID"></el-input>
              </el-form-item>
              <el-form-item label="学年学期" required>
                <el-col :span="11">
                  <el-form-item prop="courseYear">
                    <el-date-picker
                      v-model="ruleForm2.courseYear"
                      type="year"
                      placeholder="选择学年"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="courseSemester">
                    <el-select
                      v-model="ruleForm2.courseSemester"
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
                      v-model="ruleForm2.startTime"
                      style="width: 100%;"
                      :picker-options="pickerOptions0"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="ruleForm2.endTime"
                      style="width: 100%;"
                      :picker-options="pickerOptions1"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item prop="successor" label="前继课程" style="text-align:left">
                <el-select v-model="ruleForm2.successor" multiple collapse-tags placeholder="前继课程">
                  <el-option
                    v-for="(item,index) in allCourse"
                    :key="index"
                    :label="item.courseName"
                    :value="item.courseName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:-100px;padding-top:30px">
                <el-button type="primary" @click="submitForm2('ruleForm2')">提交修改</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-dialog title="请选择对该课程进行的操作" :visible.sync="dialog" width="30%" center>
          <p style="text-align:center">
            <el-button @click="editVisible" size="small" type="primary">编 辑</el-button>
            <el-button @click="delCourse" size="small" type="danger">删 除</el-button>
          </p>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import store from "../../store/store.js";
//import dataTool from '../../dataTool.js'
export default {
  name: "courseGraph",
  data() {
    return {
      isAdd: true,
      isDel: false,
      isEdit: false,
      dialog: false,
      dataIndex: 0,
      data: store.state.data,
      links: store.state.links,
      allCourse: store.state.courseList,
      loading: true,
      pickerOptions0: this.startTime(),
      pickerOptions1: this.endTime(),
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
      ruleForm: {
        courseName: "",
        teacherName: "",
        teacherID: null,
        courseYear: "",
        courseSemester: "",
        startTime: null,
        endTime: null,
        successor: []
      },
      ruleForm2: {
        courseName: "",
        teacherName: "",
        teacherID: null,
        courseYear: "",
        courseSemester: "",
        startTime: null,
        endTime: null,
        successor: []
      },
      rules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        teacherName: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
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
        successor: [
          {
            required: false,
            message: "请选择前继课程",
            trigger: "blur"
          }
        ]
      },
      multipleSelection: []
    };
  },
  created() {
    //获取课程之间的关系，data[]，links[],设置参数
    /*  this.$axios
      .get("/api/getAllCourse")
      .then(resp => {
        console.log(resp);
        store.commit("set", resp.data);
      })
      .catch(err => {
        console.log(err);
      }); */
  },
  mounted() {
    //console.log(this.data);
    this.draw();
  },
  methods: {
    initGraph() {
      var init = this.$refs.graph;
      var graph = this.$echarts.init(init);
      return graph;
    },
    startTime() {
      return {
        disabledDate: time => {
          if (this.ruleForm.endTime != null) {
            return (
              time.getTime() >= this.ruleForm.endTime ||
              time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now();
          }
        }
      };
    },
    endTime() {
      return {
        disabledDate: time => {
          if (this.ruleForm.startTime != null) {
            return (
              time.getTime() <= this.ruleForm.startTime ||
              time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now();
          }
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
    /* handleClick(params){
      alert("a")
    }, */
    edgeFunc(){
      store.commit('edgeStyle',this.dataIndex)
          this.test()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var length = this.data.length;
          for (var i = 0; i < length; i++) {
            if (this.ruleForm.courseName == this.data[i].name) {
              if (this.ruleForm.courseName == "satrt") {
                alert("不可添加名为“start”的课程");
              } else {
                alert("该课程已存在");
              }
              return 1;
            }
          }
          this.addCourse();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.resetForm(formName);
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var length = this.data.length;
          for (var i = 0; i < length; i++) {
            if (
              this.ruleForm2.courseName == this.data[i].name &&
              this.ruleForm2.courseName != this.data[this.dataIndex].name
            ) {
              if (this.ruleForm2.courseName == "satrt") {
                alert("不可更改课程名为“start”");
              } else {
                alert("该课程已存在");
              }
              return 1;
            }
          }
          this.editCourse();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addCourse() {
      //data
      //计算坐标
      var addData = {
        name: this.ruleForm.courseName,
        category: "test",
        x: Math.round(Math.random() * 500),
        y: Math.round(Math.random() * 500)
      };
      store.commit("addData", addData);

      //links
      var num = this.ruleForm.successor.length;
      //所有前继节点
      if (num == 0) {
        //无前继节点的，连接start
        var addLink = {
          target: this.ruleForm.courseName,
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
        for (var i = 0; i < num; i++) {
          var addLink = {
            target: this.ruleForm.courseName,
            source: this.ruleForm.successor[i],
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
      var addCourse=Object.assign({},this.ruleForm)
      store.commit("addCourse", addCourse);
      console.log(addCourse)
      this.test();

      //==================向后端提交=========================
      //alert添加成功
    },
    addVisible() {
      if (this.isAdd == false) {
        this.isDel = false;
        this.isEdit = false;
        this.isAdd = true;
      }
    },
    editVisible() {
      this.dialog = false;
      this.isAdd = false;
      this.isEdit = true;

      var a = store.state.courseList[this.dataIndex - 1];
      console.log(a);
      if (a.length == 11) {
        delete a["courseID"];
        delete a["createTime"];
        delete a["updateTime"];
      }
      a["startTime"] = new Date(a["startTime"]);
      a["endTime"] = new Date(a["endTime"]);
      this.ruleForm2 = a;
    },
    editCourse() {
      var oldName = store.state.data[this.dataIndex].name;
      var newName = this.ruleForm2.courseName;
      var length = this.allCourse.length;
      var oldLinks; //该节点原来的前继节点们
      var newLinks = this.ruleForm2.successor; //该节点修改后的前继节点们

      //如果名字被更改，更新courseList、data和links里的名称
      if (newName != oldName) {
        store.commit("editName", { name: newName, index: this.dataIndex });
        console.log(this.data)
      }
      //可用filter
      for (var i = 0; i < length; i++) {
        if (this.allCourse[i].courseName == oldName) {
          oldLinks = this.allCourse[i].successor;
          //return 0
        }
      }
      //links
      var isEqual = oldLinks.sort().toString() === newLinks.sort().toString();
      if (isEqual == false) {
        /*    //更改links
        //去重
        //获得需删除的link
        //临时数组存放
        var tempArray1 = [];
        var del = []; //del
        for (var i = 0; i < newLinks.length; i++) {
          tempArray1[newLinks[i]] = true; //将newLinks中的元素值作为tempArray1 中的键，值为true；
        }
        for (var i = 0; i < oldLinks.length; i++) {
          if (!tempArray1[oldLinks[i]]) {
            del.push(oldLinks[i]); //过滤相同的元素；
          }
        }

        //获得需增加的link
        //临时数组存放
        var tempArray2 = [];
        var add = []; //add
        for (var i = 0; i < oldLinks.length; i++) {
          tempArray2[oldLinks[i]] = true; //将oldLinks中的元素值作为tempArray1 中的键，值为true；
        }
        for (var i = 0; i < newLinks.length; i++) {
          if (!tempArray2[newLinks[i]]) {
            add.push(newLinks[i]); //过滤相同的元素；
          }
        } */

        store.commit("editLinks", { new: newLinks, index: dataIndex });
        console.log(this.links)
        //修改courseList

         var editCourse=Object.assign({},this.ruleForm)
        store.commit("editCourseList", {
          form: editCourse,
          index: this.dataIndex
        });
        console.log(this.allCourse)
      }
      //================向后端提交==========================
      //提交之后返回成功后，alert修改成功
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
    delCourse() {
      this.dialog = false;
      this.resetForm('ruleForm2')
      store.commit("delNode2", this.dataIndex);
      this.test();
      //====================向后端提交====================
    },
    test() {
      var option = {
        series: [
          {
            data: store.state.data,
            links:store.state.links
          }
        ]
      };
      console.log("test")
      this.initGraph().setOption(option);
      console.log("test2")
    },
    draw() {
      var myChart = this.initGraph();
      //myChart.showLoading();
      /* var graph = this.$echarts.dataTool.gexf.parse(xml)
      graph.nodes.forEach( function(node) {
        //node.itemStyle.color = "#ddd"
        node.symbolSize = 10
      }); */
      var option = {
        title: {
          text: "课程关系图"
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        toolbox:{
          feature:{
            //保存为图片
            saveAsImage:{show:true},
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
            symbolSize: 40,
            color:'#ec7814',
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
                  fontColor:"#000"
                }
              }
            },
            data: store.state.data,
            links: store.state.links,

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
        console.log(params)
        //点击高亮
        
        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          store.commit('edgeStyle',that.dataIndex)
          myChart.setOption(option)
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
            that.dialog = true;
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