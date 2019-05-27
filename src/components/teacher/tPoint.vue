<template>
  <div style="margin-top；-40px">
    <h3>{{point.contentName}}</h3>
    <div v-html="point.content"></div>
   <!--  <div>{{point.content}}</div> -->
  </div>
</template>
<script>
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
      const routerParams = this.$route.query.chapterIDt;

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
          this.point = resp.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to, from) {
      //页面需要重新加载的地方
      this.getContent();
    }
  }
};
</script>


