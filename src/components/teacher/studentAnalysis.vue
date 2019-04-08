<template>
    <el-container>
      <el-main>
        <div style="padding-top: 10px; margin: 0 auto; width: 900px; min-height: 650px" align="start">
          <el-button @click="goBack"><i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回</el-button>
        </div>
      </el-main>
    </el-container>
</template>

<script>
    export default {
      name: "studentAnalysis",
      data() {
        return {

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
