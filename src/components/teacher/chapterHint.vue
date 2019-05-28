<template>
  <el-container>
    <el-main>
      <div>展开左侧目录选择你要编辑的知识点</div>
    </el-main>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "exerciseHint",
  data() {
    return {
      courseID: 0,
      classID: 0
    };
  },
  created() {
    this.courseID = this.$route.query.id;
    this.classID = this.$route.query.classID;
    window.onstorage = e => {
      if (e.key === "username") {
        if (e.newValue === null) {
          this.$alert("你已退出登录", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              bus.$emit("reload", false);
            }
          });
        }
      }
    };
  }
};
</script>

<style scoped>
</style>