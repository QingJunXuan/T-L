<template>
  <el-container>
    <el-aside style="width:340px">
      <el-menu
        default-active="0-0"
        style="height: 778px"
        unique-opened
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        v-loading="menuLoading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-menu-item>
          <span>
            <el-button type="text" @click="goBack">
              <i class="el-icon-back" aria-setsize="100px" style="color:#fff"></i>
              <span style="color:#fff">返 回</span>
            </el-button>
          </span>
        </el-menu-item>
        <el-submenu v-for="(item1,index1) in tree" :index="index1.toString()" :key="index1">
          <template slot="title">
            <p class="contentName">{{item1.contentName}}</p>
          </template>
          <div>
            <div v-for="(item2, index2) in item1.subCatalog" :key="index1*10+index2">
              <el-row class="vertical-middle">
                <el-col>
                  <router-link
                    :to="{name: 'tpoint', query:{chapterIDt: item2.id, name: item2.contentName}}"
                    class="router-link-active"
                  >
                    <el-menu-item :index="index1.toString() + index2">
                      <span style="color:#ddd">{{(index1+1)+'.'+(index2+1)}}</span>&nbsp;
                      <span>{{item2.contentName}}</span>
                    </el-menu-item>
                  </router-link>
                </el-col>
              </el-row>
            </div>
            <!-- 初始化页面状态 -->
            <router-link
              :to="{name: 'tpreExercise', query:{tpreid: item1.id}}"
              class="router-link-active"
            >
              <el-menu-item :index="index1.toString() + 'pre'">课前摸底</el-menu-item>
            </router-link>
            <router-link
              :to="{name: 'trevExercise', query:{trevid: item1.id,index:index1}}"
              class="router-link-active"
            >
              <el-menu-item :index="index1.toString() + 'rev'">课后作业</el-menu-item>
            </router-link>
          </div>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view class="router-view"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "tChapterDetail",
  data() {
    return {
      // 章节知识点列表
      catalog: [],
      chapterData: [],
      courseID: 0,
      updateChapterVisible: false,
      tree: [],
      typeOptions: [],
      menuLoading: false
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "/teacher/courseDetail",
        query: {
          courseID: this.courseID
        }
      });
      /*  if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.push({
          path:"/teacher/courseDetail",
          query:{
            courseID:this.courseID}
          });
      } */
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
    },
    getCatalog() {
      this.menuLoading = true;
      const routerParams = this.$route.query.courseIDt;
      this.courseID = routerParams;
      this.$axios
        .get("http://10.60.38.173:8765/getCourseCatalog", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          this.tree = resp.data.data;
          this.menuLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to, from) {
      //对路由变化做出响应
      console.log("有变化了"); 
      //页面需要重新加载的地方
    }
  },
  created() {
    this.getCatalog();
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

<style>
.contentName{
  color: #ddd;
  width: 100%; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  padding:0;
  margin:0;
}
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
.router-view {
  width: 700px;
  margin: 0 auto;
  padding-top: 20px;
}
</style>


