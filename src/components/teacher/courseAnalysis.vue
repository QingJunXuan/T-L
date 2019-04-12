<template>
  <el-container>
    <el-main>
      <div style="padding-top: 10px; margin: 0 auto; width: 900px; min-height: 650px" align="start">
        <div>
          <el-button @click="goBack"><i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回</el-button>
        </div>
        <div>
          <h4>课程评分</h4>
          <el-rate
            v-model="courseGrade"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </div>
        <el-row :gutter="10" style="margin-top: 40px">
          <el-col :span="6">
            <template>
              <el-select v-model="xy" @change="handleComparison">
                <el-option
                v-for="item in xyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="6">
            <template>
              <el-select v-model="comparison" @change="handleDetail">
                <el-option
                :disabled="item.disabled"
                v-for="item in cOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="6" v-if="comparison === 0">
            <template>
              <el-select v-model="aclass">
                <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="6">
            <template>
              <el-select multiple v-model="detail" :multiple-limit="cOptions[comparison].limit">
                <el-option
                v-for="item in detailOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <div id="myChart" style="width: 100%;height: 500px;margin-top: 40px"></div>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts';
    export default {
      name: "courseAnalysis",
      data() {
        return {
          courseGrade: 4.5,
          xyOptions: [
            {
              value: 0,
              label: '章节-平均成绩'
            },
            {
              value: 1,
              label: '分数段-人数'
            },
            {
              value: 2,
              label: '章节-评分'
            },
            {
              value: 3,
              label: '评分-人数'
            },
            {
              value: 4,
              label: '年份-总成绩'
            },
            {
              value: 5,
              label: '学期-总成绩'
            },
            {
              value: 6,
              label: '班级-总成绩'
            }
          ],
          cOptions: [
            {
              value: 0,
              label: '学生',
              disabled: false,
              limit: 4,
            },
            {
              value: 1,
              label: '性别',
              disabled: false,
              limit: 1,
            },
            {
              value: 2,
              label: '班级',
              disabled: false,
              limit: 4,
            },
            {
              value: 3,
              label: '教师',
              disabled: false,
              limit: 4,
            },
            {
              value: 4,
              label: '学期',
              disabled: false,
              limit: 4,
            },
            {
              value: 5,
              label: '年份',
              disabled: false,
              limit: 4,
            },
            {
              value: 6,
              label: '章节',
              disabled: true,
              limit: 4,
            },
          ],
          gradeOptions: [
            {
              value: 0,
              label: '课前平均成绩'
            },
            {
              value: 1,
              label: '课后平均成绩'
            },
            {
              value: 2,
              label: '总平均成绩'
            }
          ],
          genderOptions: [
            {
              value: 0,
              label: '全部'
            },
            {
              value: 1,
              label: '只看男生'
            },
            {
              value: 2,
              label: '只看女生'
            }
          ],
          detail: [],
          xy: 0,
          comparison: 0,
          xData: [],
          yData: [],
          cData: [],
          studentOptions: [
            {
              value: 0,
              label: '学生1'
            },
            {
              value: 1,
              label: '学生2'
            }
          ],
          students: [],
          teacherOptions: [
            {
              value: 0,
              label: '老师1'
            },
            {
              value: 1,
              label: '老师2'
            }
          ],
          teachers: [],
          classOptions: [
            {
              value: 0,
              label: '班级1'
            },
            {
              value: 1,
              label: '班级2'
            }
          ],
          aclass: 0,
          classes: [],
          semesterOptions: [
            {
              value: 0,
              label: '学期1'
            },
            {
              value: 1,
              label: '学期2'
            }
          ],
          semesters: [],
          yearOptions: [
            {
              value: 0,
              label: '2018'
            },
            {
              value: 1,
              label: '2019'
            }
          ],
          years: [],
          chapterOptions: [
            {
              value: 0,
              label: '章节1'
            },
            {
              value: 1,
              label: '章节2'
            }
          ],
          chapters: [],
        }
      },
      methods: {
        goBack() {
          if (window.history.length <= 1) {
            this.$router.push({path:'/'})
            return false
          } else {
            this.$router.go(-1)
          }
        },
        handleComparison() {
          switch(this.xy) {
            case 0: {
              this.comparison = 0;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 6) this.cOptions[i].disabled = true;
                else this.cOptions[i].disabled = false;
              }
              break;
            }
            case 1: {
              this.comparison = 1;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 0 || i === 6) this.cOptions[i].disabled = true;
                else this.cOptions[i].disabled = false;
              }
              break;
            }
            case 2: {
              this.comparison = 3;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i < 3 || i === 6) this.cOptions[i].disabled = true;
                else this.cOptions[i].disabled = false;
              }
              break;
            }
            case 3: {
              this.comparison = 6;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 6) this.cOptions[i].disabled = false;
                else this.cOptions[i].disabled = true;
              }
              break;
            }
            case 4: {
              this.comparison = 2;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 2 || i === 3) this.cOptions[i].disabled = false;
                else this.cOptions[i].disabled = true;
              }
              break;
            }
            case 5: {
              this.comparison = 2;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 2 || i === 3) this.cOptions[i].disabled = false;
                else this.cOptions[i].disabled = true;
              }
              break;
            }
            case 6: {
              this.comparison = 4;
              this.detail = [];
              for (let i = 0;i < this.cOptions.length;i++) {
                if (i === 4 || i === 5) this.cOptions[i].disabled = false;
                else this.cOptions[i].disabled = true;
              }
              break;
            }
            default: break;
          }
        },
        handleDetail() {
          this.detail = [];
        },
        drawChart(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          color: ['#003366', '#006699', '#4cabce', '#e5323e'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            //dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            name: '章节',
            axisTick: {show: false},
            data: ['2012', '2013', '2014', '2015', '2016']
        }
    ],
    yAxis: [
        {
          name: '分数',
          
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Forest',
            type: 'bar',
            barGap: 0,
            data: [320, 332, 301, 334, 390]
        },
        {
            name: 'Steppe',
            type: 'bar',
            barGap: 0,
            data: [220, 182, 191, 234, 290]
        },
        {
            name: 'Desert',
            type: 'bar',
            barGap: 0,
            data: [150, 232, 201, 154, 190]
        },
        {
            name: 'Wetland',
            type: 'bar',
            barGap: 0,
            data: [98, 77, 101, 99, 40]
        }
    ]
        });
      }
    },
    mounted() {
      this.drawChart();
    },
    computed: {
      detailOptions() {
        let result = [];
        switch(this.comparison) {
            case 0: {
              result = this.studentOptions;
              break;
            }
            case 1: {
              result = this.genderOptions;
              break;
            }
            case 2: {
              result = this.classOptions;
              break;
            }
            case 3: {
              result = this.teacherOptions;
              break;
            }
            case 4: {
              result = this.semesterOptions;
              break;
            }
            case 5: {
              result = this.yearOptions;
              break;
            }
            case 6: {
              result = this.chapterOptions;
              break;
            }
          }
          return result;
      }
    }
  }
</script>

<style scoped>

</style>
