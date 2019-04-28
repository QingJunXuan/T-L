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
      tree: [],
      data:[{
        name:'start',
        x:500,
        y:0
      }],
      links:[]
    /*   data: [
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
          },
          lineStyle: {
            normal: { curveness: 0 }
          }
        }
      ] //连线信息 */

      //loading: true,
    };
  },
   created() {
    //获得章节目录，data[]，links[],设置参数
    axios
      .get("/api/getChapterRelationByCourseID",{
        params:{courseID:id}
      })
      .then(resp => {
        console.log(resp.data,"tree");
        this.tree=resp.data.data
      })
      .catch(err => {
        console.log(err);
      });
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
      this.initGraph().setOption(option);
    },
    handleClick(params) {},
    init() {
      var length = this.tree.length;
      for (var i = 0; i < length; i++) {
        
        //var num = this.tree[i].subCatalog.length;
        var name = this.tree[i].contentName;
        if (this.tree[i].parentID == 0) {
          var addData = {
          name: name,
          //category: "test",
          x: Math.round(Math.random() * 100)*10,
          y: Math.round(Math.random() * 100)*5 + 50
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
          //所有前继节点
          var addData = {
          name: name,
          //category: "test",
          x: Math.round(Math.random() * 100)*10,
          y: Math.round(Math.random() * 100)*5 + 50
        };
        this.data.push(addData);
          for (var j = 0; j < num; j++) {
            var addLink = {
              target: name,
              source: this.tree[i].subCatalog[j].courseName,
              label: {
                normal: {
                  show: false
                }
              }
              /* lineStyle: {
                                normal: { curveness: 0.2 }
                            } */
            };
            state.links.push(addLink);
          }
        }
      }
      console.log(state.data, "state.data");
      console.log(state.links, "state.links");
    },
    draw() {
      var init = this.$refs.graph;
      var myChart = this.$echarts.init(init);
      //this.init();
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
            data: this.data,
            links: this.links,
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
          if (params.data.label.show == false) {
            that.links[that.dataIndex].label.normal.show = true;
          } else {
            that.links[that.dataIndex].label.normal.show = false;
          }
          //显示边
          myChart.setOption(option);
        } else if (params.dataType == "node") {
          that.dataIndex = params.dataIndex;
          //var id = that.tree[that.dataIndex-1].id
          that.$router.push({
            path: "chapterDetail",
            query: {
              id: that.dataIndex
              //id:id
            }
          });
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