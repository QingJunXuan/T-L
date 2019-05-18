<template>
  <el-container>
    <div>
      <el-form
        :model="pointForm"
        status-icon
        label-width="0"
        align="start"
        style="width: 100%; padding-left: 20%; padding-top: 40px"
      >
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item>
              <span>{{chapterOrder}}</span>
              <el-input v-model="pointForm.order" style="width: 70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-form-item>
                <el-input v-model="pointForm.title"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-form-item>
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
      item: {},
      chapterOrder: 0,
      pointOrder: 0,
      pointName: "",
      pointContent: "",
      editor: new WangEditor("#editor"),
      // 知识点
      pointForm: {
        order: '0',
        title: "",
        content: ""
      },
      loading: false
    };
  },
  methods: {
    getParams() {
      this.item = this.$route.query.item;
      this.getContents();
    },
    getContents() {
      this.pointContent = "";
      this.pointForm = {
        order: "0",
        title: "",
        content: ""
      };
      this.$http
        .get(
          "http://10.60.38.173:8765/getChapterByID?chapterID=" + this.item.id,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let content = JSON.parse(response.bodyText);
              let dot = this.item.name.indexOf(".") + 1;
              let index = this.item.name.indexOf(" ");
              if (content.state === 1) {
                this.chapterOrder = content.data.contentName.substring(0, dot);
                this.pointOrder = content.data.contentName.substring(dot, index);
                this.pointName = content.data.contentName;
                this.pointContent = content.data.content;
                this.pointForm.order = this.pointOrder;
                this.pointForm.title = this.pointName.substring(index + 1);
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
      this.pointForm.order = this.pointOrder;
      let index = this.item.name.indexOf(" ");
      this.pointForm.title = this.pointName.substring(index + 1);
      if (this.pointContent === null) {
        this.editor.txt.html("");
      } else {
        this.pointForm.content = this.pointContent;
        this.editor.txt.html(this.pointForm.content);
      }
    },
    save() {
      let reg = /^([1-9][0-9]*)+(\.[0-9]*)*(\*)?$/;
      if (!reg.test(this.pointForm.order)) {
        this.$message({type: 'warning', message: '请输入正确的知识点序号!'});
        return;
      }
      this.loading = true;
      this.$http
        .post(
          "http://10.60.38.173:8765/alertChapter",
          {
            id: this.item.id,
            courseID: this.item.courseID,
            contentName:
              this.chapterOrder +
              this.pointForm.order +
              " " +
              this.pointForm.title,
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
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (
      this.pointName !==
        this.chapterOrder + this.pointForm.order + " " + this.pointForm.title ||
      this.pointContent !== this.pointForm.content
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
      this.pointName !==
        this.chapterOrder + this.pointForm.order + " " + this.pointForm.title ||
      this.pointContent !== this.pointForm.content
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
