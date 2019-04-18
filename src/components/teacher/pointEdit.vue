<template>
  <el-container>
    <div>
      <h4>{{pointName}}</h4>
      <el-form
        :model="pointForm"
        status-icon
        :rules="pointRules"
        ref="pointForm"
        label-width="100px"
        label-position="top"
        align="start"
        style="width: 700px; margin: 0 auto"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="pointForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!----- 编辑器 ----->
          <div id="editor"></div>
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
import WangEditor from "wangeditor";
export default {
  name: "chapterEdit",
  data() {
    return {
      id: "",
      pointName: "",
      editor: new WangEditor("#editor"),
      // 知识点
      pointForm: {
        title: "",
        content: ""
      },
      pointRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入知识点内容", trigger: "blur" }
        ]
      }
    };
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
  mounted() {
    this.editor.customConfig.menus = [
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "foreColor", // 文字颜色
      "link", // 插入链接
      "quote", // 引用
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "image", // 插入图片
      "code", // 插入代码
      "table", // 表格
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.customConfig.onchange = () => {
      this.pointForm.content = this.editor.txt.html();
    };
    this.editor.customConfig.debug =
      location.href.indexOf("wangeditor_debug_mode=1") > 0; // 开启debug模式
    this.editor.create();;
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  }
};
</script>

<style scoped>
</style>
