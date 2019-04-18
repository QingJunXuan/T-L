<template>
  <el-container>
    <el-main>
      <div>
        <div style="height:300px;border:1px solid #ddd" ref="graph"></div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "sChapterGraph",
  data() {
    return {
      dataIndex: 0,
      data: [
        {
          name: "第一章",
          x: 200,
          y: 0
        },
        {
          name: "第二章",
          x: 100,
          y: 100
        },
        {
          name: "第三章",
          x: 300,
          y: 100
        },
        {
          name: "第四章",
          x: 220,
          y: 270
        }
      ], //node：name+坐标信息
      links: [
        {
          source: "第一章",
          target: "第二章",
          label: {
            normal: {
              show: false
            }
          }
          /* lineStyle: {
                    normal: { curveness: 0.1 }
                } */
        },
        {
          source: "第一章",
          target: "第三章",
          label: {
            normal: {
              show: false
            }
          }
          /* lineStyle: {
                    normal: { curveness: 0.1 }
                } */
        },
        {
          source: "第三章",
          target: "第四章",
          label: {
            normal: {
              show: false
            }
          },
          lineStyle: {
            normal: { curveness: 0 }
          }
        }
      ] //连线信息

      //loading: true,
    };
  },
  /* created() {
    //获得章节目录，data[]，links[],设置参数
     this.$axios
      .get("/api/getAllCourse")
      .then(resp => {
        console.log(resp);
        store.commit("set", resp.data);
      })
      .catch(err => {
        console.log(err);
      });
    //console.log(this.screenWidth.width);
  }, */
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
      var init = this.$refs.graph;
      var myChart = this.$echarts.init(init);
      var option = {
       /*  title: {
          text: "章节关系图"
        }, */
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
            symbolSize: 20,
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
            //data: this.data,
            //links: this.links,
            data: [
              {
                name: "第一章",
                x: 200,
                y: 0
              },
              {
                name: "第二章",
                x: 100,
                y: 100
              },
              {
                name: "第三章",
                x: 300,
                y: 100
              },
              {
                name: "第四章",
                x: 200,
                y: 200
              }
            ],
            links: [
              {
                source: "第一章",
                target: "第二章",
                label: {
                  normal: {
                    show: false
                  }
                }
              },
              {
                source: "第一章",
                target: "第三章",
                label: {
                  normal: {
                    show: false
                  }
                }
              },
              {
                source: "第三章",
                target: "第四章",
                label: {
                  normal: {
                    show: false
                  }
                }
              }
            ],
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      var that = this;
      myChart.on("click", function(params) {
        console.log(params);
        if (params.dataType == "edge") {
          //that.handleClick(params);
          that.dataIndex = params.dataIndex;
          //显示边
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          that.dataIndex = params.dataIndex;
        }
      });
      //取消右键的弹出菜单
      document.oncontextmenu = function() {
        return false;
      };
      that.myChart = myChart;
    }
  }
};
</script>