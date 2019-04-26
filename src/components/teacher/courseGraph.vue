<template>
  <el-container>
    <el-col :span="20" :offset="2">
      <div style="height:480px" ref="graph"></div>
    </el-col>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
  name: "tCourseGraph",
  data() {
    return {
      screenWidth: {
        width: window.screen.width
      },
      dataIndex: 0,
      list: [],
      data: [
        {
          name: "start",
          x: 200,
          y: 0
        }
      ],
      links: []
    };
  },
  created() {
    //获取课程之间的关系，data[]，links[],设置参数
    axios
      .get("/api/getAllCoursesRelation", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      .then(resp => {
        console.log(resp.data);
        this.list = resp.data.data;
        this.set();
      })
      .catch(err => {
        console.log(err);
      });
    //console.log(this.screenWidth.width);
  },
  mounted() {
    //console.log(this.data);
    this.draw();
  },
  methods: {
    set() {
      // 计算data
      let nodes = this.list.map(i => [i.courseName.courseName, {level: 0, preCourses: i.preCoursesName.map(k => k.courseName)}]);
      for (let j = nodes.length - 1; j >= 0 ; j-- ) {
        let curr = nodes[j][1]
        if (curr.preCourses.length) {
          curr.preCourses.forEach((p) => {
            let findIndex = nodes.findIndex(node => node[0] === p)
            nodes[findIndex] = [nodes[findIndex][0], Object.assign({}, nodes[findIndex][1], {level: nodes[findIndex][1].level > curr.level ? nodes[findIndex][1].level : curr.level + 1})]
          })
        }
      }


      let tempData = new Map()
      nodes.forEach((n) => {
        tempData.set(n[1].level, [])
      })
      nodes.forEach((n) => {
        tempData.set(n[1].level, tempData.get(n[1].level).concat([n[0]]))
      })

      let data = []
      for (let item of tempData.entries()) {
				console.log("TCL: set -> item", item[0])
        item[1].forEach((value, index) => {
          let addData = {
            name: value,
            x: Math.round((1000 / item[1].length) * index ),
            y: (parseInt(item[0]) + 1) * -300
          };
          data.push(addData)
        })
      }
      this.data = data
			console.log("TCL: set -> data", data)

      var length = this.list.length;
      for (var i = 0; i < length; i++) {
        var num = this.list[i].preCoursesName.length;
        var name = this.list[i].courseName.courseName;
        if (num == 0) {
          //无前继节点的，连接start
          // var addData = {
          //   name: name,
          //   //category: "test",
          //   x: Math.round(Math.random() * 1000),
          //   y: Math.round(Math.random() * 500) + 100
          // };
          // this.data.push(addData);
          var addLink = {
            target: name,
            source: "start",
            label: {
              normal: {
                show: false
              }
            }
          };
          this.links.push(addLink);
        } else {
          //所有前继节点
          // var addData = {
          //   name: name,
          //   x: Math.round(Math.random() * 1000),
          //   y: Math.round(Math.random() * 500) + 700
          // };
          // this.data.push(addData);
          for (var j = 0; j < num; j++) {
            var addLink = {
              target: name,
              source: this.list[i].preCoursesName[j].courseName,
              label: {
                normal: {
                  show: false
                }
              }
            };
            this.links.push(addLink);
          }
        }
      }
      console.log(this.data, "this.data");
      console.log(this.links, "this.links");
      this.draw();
    },
    initGraph() {
      var init = this.$refs.graph;
      var graph = this.$echarts.init(init);
      return graph;
    },
    test() {
      var option = {
        series: [
          {
            data: this.data,
            links: this.links
          }
        ]
      };
      console.log("test");
      // this.initGraph().setOption(option);
      console.log("test2");
    },
    draw() {
      var init = this.$refs.graph;
      var graph = this.$echarts.init(init);
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
          }
        },
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 40,
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
      graph.setOption(option);
      var that = this;
      graph.on("click", function(params) {
        console.log(params);
        //点击高亮

        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          store.commit("edgeStyle", that.dataIndex);
          graph.setOption(option);
        } else if (params.dataType == "node") {
          /*  that.graph.dispatchAction({
          type: "focusNodeAdjacency",
          // 使用 dataIndex 来定位节点。
          dataIndex: params.dataIndex
        }); */
          that.dataIndex = params.dataIndex;
          if (that.dataIndex == 0) {
            alert("不可对该节点进行操作");
          } else {
            //点击节点获取同名列表
            /*  this.$axios
      .get("/api/getDupCourse")
      .then(resp => {
        console.log(resp);
        that.dupCourse=resp.data
      })
      .catch(err => {
        console.log(err);
      }); */

            that.dialog1 = true;
          }
        }
      });
      //取消右键的弹出菜单
      document.oncontextmenu = function() {
        return false;
      };
      //右键取消高亮
      graph.on("contextmenu", function(params) {
        that.graph.dispatchAction({
          type: "unfocusNodeAdjacency",
          // 使用 seriesId 或 seriesIndex 或 seriesName 来定位 series.
          seriesIndex: params.seriesIndex
        });
      });
      that.graph = graph;
    }
  }
};
</script>
<style scoped>
</style>