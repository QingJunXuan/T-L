<template>
    <el-container>
        <el-main>
            <div>
                展开左侧目录选择你要编辑的章节习题
            </div>
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
      classID: 0,
        }
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
      if (e.key === "catalog") {
        this.$alert("章节已修改", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            bus.$emit("refresh", true);
          }
        });
      }
    };
    }
}
</script>

<style scoped>
</style>
