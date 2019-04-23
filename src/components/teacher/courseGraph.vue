<template>
  <el-container>
        <el-col :span="20" :offset="2">
          <div
            style="height:280px"
            ref="graph"
          ></div>
        </el-col>
  </el-container>
</template>
<script>
import axios from 'axios'
export default {
  name: "tCourseGraph",
  data() {
    return {
      screenWidth: {
        width: window.screen.width
      },
      dataIndex: 0,
      list:[],
      data:[{
        name:"start",
        x:200,
        y:0
      }],
      links:[]
     /*  data: [
        {
          name: "start",
          x: 200,
          y: 0
        },
        {
          name: "软件工程",
          x: 100,
          y: 100
        },
        {
          name: "web",
          x: 300,
          y: 100
        },
        {
          name: "软件项目与过程管理",
          x: 220,
          y: 270
        }
      ],  *///node：name+坐标信息
    
    /* links: [
        {
          source: "start",
          target: "软件工程",
          label: {
            normal: {
              show: false
            }
          }
          
        },
        {
          source: "start",
          target: "web",
          label: {
            normal: {
              show: false
            }
          }
        },
        {
          source: "软件工程",
          target: "软件项目与过程管理",
          label: {
            normal: {
              show: false
            }
          },
          lineStyle: {
            normal: { curveness: 0 }
          }
        }
      ], //连线信息

      allCourse: [],
      loading: true
    */ };
  },
  created() {
    //获取课程之间的关系，data[]，links[],设置参数
    axios
      .get("/api/getAllCoursesRelation",{
         headers: {
          Authorization:
            "Bearer "+localStorage.getItem("token")
        }
      })
      .then(resp => {
        console.log(resp.data);
        this.list=resp.data.data
        this.set()
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
            var length = this.list.length
            for (var i = 0; i < length; i++) {
                var addData = {
                    name: this.list[i].courseName.courseName,
                    //category: "test",
                    x: Math.round(Math.random() * 200),
                    y: Math.round(Math.random() * 200)+50
                };
                this.data.push(addData)
                var num = this.list[i].preCoursesName.length;
                var name = this.list[i].courseName.courseName
                if (num == 0) {//无前继节点的，连接start
                    var addLink = {
                        target: name,
                        source: 'start',
                        label: {
                            normal: {
                                show: false
                            }
                        },
                       /*  lineStyle: {
                            normal: { curveness: 0.2 }
                        } */
                    };
                    this.links.push(addLink)
                }
                else {
                    //所有前继节点
                    for (var j = 0; j < num; j++) {
                        var addLink = {
                            target: name,
                            source: this.list[i].preCoursesName[j].courseName,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            /* lineStyle: {
                                normal: { curveness: 0.2 }
                            } */
                        };
                        this.links.push(addLink)
                    }
                }
            }
            console.log(this.data,"this.data")
            console.log(this.links,"this.links")
            this.draw()
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
      //this.initGraph().setOption(option);
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