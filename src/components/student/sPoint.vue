<template>
  <div style="margin-top；-40px">
    <h3>{{point.contentName}}</h3>
    <div>{{point.content}}</div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      courseID: 0,
      chapterID: 0,
      point: {
        contentName: "标题",
        content: "内容"
      }
    };
  },
  created() {
    //获取知识内容
    this.getContent();
  },
  methods: {
    getContent() {
      const routerParams = this.$route.query.chapterID;

      this.chapterID = routerParams;
      axios
        .get("/api/getChapterByID", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterID: this.chapterID
          }
        })
        .then(resp => {
          //this.tree = resp.data.data;
          console.log(this.chapterID, "chapterid");
          console.log(resp.data, "chapter content");
          this.point = resp.data.data;
          //console.log(this.courseID,"courseID");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to, from) {
      //对路由变化做出响应
      console.log("有变化了"); //测试点击路由的反应
      //页面需要重新加载的地方
      this.getContent();
    }
  }
};
</script>
<style>
</style>


