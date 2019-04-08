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
      </div>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "courseAnalysis",
      data() {
        return {
          courseGrade: 4.5,
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
        }
      }
    }
</script>

<style scoped>

</style>
