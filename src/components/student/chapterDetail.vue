<template>
  <el-container>
    <el-aside style="width:25%">
      <el-menu
        default-active="1-1"
        style="height: 778px"
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
            <p class="contentName">{{item1.contentName}}</p>
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
import bus from "../../bus.js";
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
     this.$axios
        .get("http://10.60.38.173:8765/getCourseCatalog", {
          headers: {
            Authorization:
              "Bearer "+localStorage.getItem("token")
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          
        console.log("TCL: getCatalog -> resp", resp)
          this.tree = resp.data.data;
          this.menuLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    pre(id,num) {
       this.$router.push({
        path: "preExercise",
        query: {
          spreid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
    /*  var tempScore = store.state.score
     var length =tempScore.length
     var name = tempScore[num].chapterName
     var isExist = false
      for(var i=0;i<length;i++){
        if(name==tempScore[i].chapterName) {
          isExist = true
          break
        }
      }
      if(isExist && tempScore[num].studentChapter.totalScore_1 != null){
        this.$router.push({
        path: "chapterDetail/scoredPre",
        query: {
          spreid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
      }else{ 
        this.$router.push({
        path: "chapterDetail/preExercise",
        query: {
          spreid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
        
      } */
    },
    rev(id,num) {
       this.$router.push({
        path: "revExercise",
        query: {
          srevid: id,
          courseIDs: this.courseID,
          index:num
        }
      });
    /*  var length = store.state.score.length
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
      } */
    },
  },
  watch: {
  '$route' (to,from) {
      
      console.log('有变化了') 
      
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
  },
};
</script>

<style>
a {
  text-decoration: none;
}
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