<template>
  <el-container>
    <div>
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
          <el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
import WangEditor from "wangeditor";
export default {
  name: "chapterEdit",
  data() {
    return {
      item: 0,
      pointName: "",
      pointContent: "",
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
      },
      loading: false
    };
  },
  methods: {
    getParams() {
      this.item = this.$route.query.item;
    },
    getContents() {
      this.pointName = "";
      this.pointContent = "";
      this.pointForm = {
        title: "",
        content: ""
      };
      this.$http
        .get("/api/getChapterByID?chapterID=" + this.item.id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let content = JSON.parse(response.bodyText);
              if (content.state === 1) {
                this.pointName = content.data.contentName;
                this.pointContent = content.data.content;
                this.pointForm.title = this.pointName;
                this.pointForm.content = this.pointContent;
                if (content.data.content !== null) {
                  this.editor.txt.html(content.data.content);
                } else {
                  this.editor.txt.html("");
                }
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    reset() {
      this.pointForm.title = this.pointName;
      this.pointForm.content = this.pointContent;
    },
    save() {
      this.loading = true;
      this.$http
        .post(
          "/api/alertChapter",
          {
            id: this.item.id,
            courseID: this.item.courseID,
            contentName: this.pointForm.title,
            parentID: this.item.parentID,
            siblingID: this.item.siblingID,
            content: this.pointForm.content
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              this.editor.txt.html("");
              this.getContents();
              bus.$emit("reloadCatalog", true);
              this.loading = false;
              this.$message({ type: "success", message: "更新成功!" });
            } else {
              this.loading = false;
              this.$message({ type: "error", message: "更新失败!" });
            }
          },
          response => {
            this.loading = false;
            this.$message({ type: "error", message: "更新失败!" });
          }
        );
    }
  },
  created() {
    this.getParams();
    this.getContents();
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
      this.editor.customConfig.zIndex = 10;
    this.editor.create();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route(val) {
      this.getParams();
      this.getContents();
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (
      this.item.name !== this.pointForm.title ||
      this.item.content !== this.pointForm.content
    ) {
      const answer = window.confirm("更改尚未保存，确认离开吗？");
      if (answer) {
        next();
        return;
      } else {
        next(false);
        return;
      }
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.item.name !== this.pointForm.title ||
      this.item.content !== this.pointForm.content
    ) {
      const answer = window.confirm("更改尚未保存，确认离开吗？");
      if (answer) {
        next();
        return;
      } else {
        next(false);
        return;
      }
    }
    next();
  }
};
</script>

<style scoped>
</style>
