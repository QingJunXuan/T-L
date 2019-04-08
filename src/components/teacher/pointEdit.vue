<template>
    <el-container>
      <div>
        <h4>{{pointName}}</h4>
        <el-form :model="pointForm" status-icon :rules="pointRules" ref="pointForm" label-width="100px" label-position="top" align="start" style="width: 700px; margin: 0 auto">
          <el-form-item label="标题" prop="title">
            <el-input v-model="pointForm.title">
            </el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input
              v-model="pointForm.content"
              type="textarea"
              :autosize="{ minRows: 16, maxRows: 16}"
              placeholder="请输入内容">
            </el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary">保存</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-container>
</template>

<script>
    export default {
      name: "chapterEdit",
      data() {
        return {
          id: '',
          pointName: '',
          // 知识点
          pointForm: {
            title: '',
            content: ''
          },
          pointRules: {
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            content: [
              { required: true, message: '请输入知识点内容', trigger: 'blur' }
            ],
          },
        }
      },
      methods: {
        getParams() {
          this.id = this.$route.query.id;
          this.pointName = this.$route.query.name;
        }
      },
      created() {
        this.getParams();
      },
      watch: {
        // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
        '$route': 'getParams'
      }
    }
</script>

<style scoped>


</style>
