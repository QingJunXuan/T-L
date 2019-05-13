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
              <i class="el-icon-back" style="margin-right: 6px;color:#fff"></i><span style="color:#fff">返 回</span>
            </el-button>
          </span>
        </el-menu-item>
        <el-submenu v-for="(item1,index1) in tree" :index="index1.toString()" :key="index1">
          <template slot="title">
            <span style="color:#ddd">{{item1.contentName}}</span>
          </template>
          <div>
            <div v-for="(item2, index2) in item1.subCatalog" :key="index1*10+index2">
              <el-row class="vertical-middle">
                <el-col>
                  <router-link
                    :to="{name: 'point', query:{chapterID: item2.id, name: item2.contentName}}"
                    class="router-link-active"
                  >
                    <el-menu-item :index="index1.toString() + index2"><span>{{item2.contentName}}</span></el-menu-item>
                  </router-link>
                </el-col>
              </el-row>
            </div>
            <!-- 初始化页面状态 -->
              <el-menu-item :index="index1.toString() + 'pre'" @click="pre(item1.id,index1)">课前摸底</el-menu-item>
              <el-menu-item :index="index1.toString() + 'rev'" @click="rev(item1.id,index1)">课后作业</el-menu-item>
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
import axios from 'axios'
import store from '../../store/store.js';
export default {
  name: "sChapterDetail",
  data() {
    return {
      // 章节知识点列表
      catalog: [],
      chapterData: [],
      courseID:0,
      updateChapterVisible: false,
      tree: [ ],
      typeOptions: [],
      menuLoading: false
    };
  },
  methods: {
    goBack() {
      this.$router.push({
          path:"/student/courseDetail",
          query:{
            courseID:this.courseID
          }
        });
      /* if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.push({
          path:"/student/courseDetail",
          query:{
            courseID:this.courseID
          }
        });
      } */
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
    },
    getCatalog(){
      this.menuLoading = true;
       const routerParams = this.$route.query.courseIDs;
     this.courseID = routerParams;
     axios
        .get("/api/getCourseCatalog", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          this.tree = resp.data.data;
          this.menuLoading = false;
          console.log(resp.data,"resp.data");
          console.log(this.courseID,"courseID");
        })
        .catch(err => {
          console.log(err);
        });
    },
    pre(id,num) {
      var length = store.state.score.length
      if(num>length){
      this.$router.push({
        path: "preExercise",
        query: {
          spreid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
      }else{
        this.$router.push({
        path: "scoredPre",
        query: {
          spreid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
      }
    },
    rev(id,num) {
     var length = store.state.score.length
      if(num>length){
      this.$router.push({
        path: "revExercise",
        query: {
          srevid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
      }else{
        this.$router.push({
        path: "scoredRev",
        query: {
          srevid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
      }
    },
  },
  watch: {
  '$route' (to,from) {
      //对路由变化做出响应
      console.log('有变化了') //测试点击路由的反应
      //页面需要重新加载的地方
  }
},
  created() {
    /* for (let i = 0; i < this.catalog.length; i++) {
      this.chapterData.push({
        key: i,
        label: this.catalog[i].chapterName,
        disabled: false
      });
    } */
    this.getCatalog();
    //this.link()
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.exit {
  position: absolute;
  left: 100px;
}

.vertical-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.router-view {
  width: 700px;
  margin: 0 auto;
  padding-top: 20px;
}
</style>