<template>
  <el-container>
    <el-col>
      <div style="height:600px" ref="graph"></div>
    </el-col>
  </el-container>
</template>
<script>
export default {
  name: "tCourseGraph",
  data() {
    return {
      screenWidth: {
        width: window.screen.width
      },
      dataIndex: 0,
      list:[],
      data:[],
      links:[]
    };
  },
  created() {
    //获取课程之间的关系，data[]，links[],设置参数
    this.$axios
      .get("http://10.60.38.173:8765/getAllCoursesRelation", {
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
      // 计算节点位置
      let nodes = this.list.map(i => [i.courseName.courseName, {level: 0, subCourses: i.subCoursesName.map(k => k.courseName)}]);
      for (let j = 0; j < nodes.length ; j++ ) {
        let curr = nodes[j][1]
        if (curr.subCourses.length) {
          curr.subCourses.forEach((p) => {
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

      let data = [];
      var width=3400;
      var init=0;
      for (let item of tempData.entries()) {
        console.log("TCL: set -> item", item[0])
        var num=item[1].length
        init=1700/num
        item[1].forEach((value, index) => {
          let addData = {
            name: value,
            x: Math.round(init+(width / item[1].length) * index ),
            y: (parseInt(item[0]) + 1) * 340
          };
          data.push(addData)
        })
      }

      data.push({
        name: 'start',
        x: 1700,
        y: 0
      })

      this.data = data
      console.log("TCL: set -> data", data)
      
      // 计算结束

      var length = this.list.length;
      for (var i = 0; i < length; i++) {
        var num = this.list[i].preCoursesName.length;
        var name = this.list[i].courseName.courseName;
        if (num == 0) {
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
      this.draw();
    },
    initGraph() {
      var init = this.$refs.graph;
      var graph = this.$echarts.init(init);
      return graph;
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
            top:30,
            symbolSize: 30,
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
            itemStyle:{
              normal:{
                color: "#ec7814",
              }
            },
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
      let focusNum=0;
      graph.on("click", function(params) {
        //点击高亮
        focusNum++
        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          store.commit("edgeStyle", that.dataIndex);
          graph.setOption(option);
        } else if (params.dataType == "node") {
          if(focusNum%2==1){//点击高亮
            that.graph.dispatchAction({
              type: "focusNodeAdjacency",
              // 使用 dataIndex 来定位节点。
              dataIndex: params.dataIndex
              });
          }else if(focusNum%2==0){//再次点击取消高亮
            that.graph.dispatchAction({
            type: "unfocusNodeAdjacency",
            // 使用 seriesId 或 seriesIndex 或 seriesName 来定位 series.
            seriesIndex: params.seriesIndex
            });
          }
        }
      });
      //取消右键的弹出菜单
      document.oncontextmenu = function() {
        return false;
      };
      that.graph = graph;
    }
  }
};
</script>
<style scoped>
</style>