<template>
  <div style="margin-top；-40px">
    <h3>{{point.contentName}}</h3>
    <div v-html="point.content"></div>
    <!-- <div>{{point.content}}</div> -->
  </div>
</template>
<script>
import bus from "../../bus.js";
export default {
  data() {
    return {
      courseID: 0,
      chapterID: 0,
      point: {
        contentName: "",
        content: ""
      }
    };
  },
  created() {
    //获取知识内容
    this.getContent();
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
  },
  methods: {
    getContent() {
      const routerParams = this.$route.query.chapterID;

      this.chapterID = routerParams;
      this.$axios
        .get("http://10.60.38.173:8765/getChapterByID", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            chapterID: this.chapterID
          }
        })
        .then(resp => {
          console.log(this.chapterID, "chapterid");
          console.log(resp.data, "chapter content");
          if(resp.data.state==1){
          this.point = resp.data.data;}
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to, from) {
      this.getContent();
    }
  }
};
</script>

