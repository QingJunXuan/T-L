<template>
    <el-container>
        <el-main>
            <div>
                展开左侧目录选择你要编辑的知识点
            </div>
        </el-main>
    </el-container>
</template>

<script>
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
    }
}
</script>

<style scoped>
</style>