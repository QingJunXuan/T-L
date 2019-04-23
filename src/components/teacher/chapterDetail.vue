<template>
  <el-container>
    <el-aside>
      <el-menu
        default-active="0-0"
        style="height: 720px"
        unique-opened
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
      <el-menu-item>
          <span>
            <el-button type="text" @click="goBack">
              <i class="el-icon-back" aria-setsize="100px" style="color:#fff"></i><span style="color:#fff">返 回</span>
            </el-button>
          </span>
        </el-menu-item>
        <el-submenu v-for="(item1,index1) in tree" :index="index1.toString()" :key="index1">
          <template slot="title">
            <span>{{item1.content+" "+item1.contentName}}</span>
          </template>
          <div>
            <div v-for="(item2, index2) in item1.subCatalog" :key="index1*10+index2">
              <el-row class="vertical-middle">
                <el-col :span="16">
                  <router-link
                    :to="{name: 'tpoint', query:{chapterIDt: item2.id, name: item2.contentName}}"
                    class="router-link-active"
                  >
                    <el-menu-item :index="index1.toString() + index2">{{item2.content+" "+item2.contentName}}</el-menu-item>
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
              :to="{name: 'trevExercise', query:{trevid: item1.id}}"
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
import axios from "axios";
export default {
  name: "tChapterDetail",
  data() {
    return {
      // 章节知识点列表
      catalog: [
        {
          chapterName: "章节一",
          type: "0",
          predecessor: [],
          points: [
            {
              name: "知识点1",
              edit: false
            },
            {
              name: "知识点2",
              edit: false
            },
            {
              name: "知识点3",
              edit: false
            }
          ]
        },
        {
          chapterName: "章节二",
          type: "0",
          predecessor: [0],
          points: [
            {
              name: "知识点1",
              edit: false
            },
            {
              name: "知识点2",
              edit: false
            },
            {
              name: "知识点3",
              edit: false
            }
          ]
        },
        {
          chapterName: "章节三",
          type: "0",
          predecessor: [0, 1],
          points: [
            {
              name: "知识点1",
              edit: false
            },
            {
              name: "知识点2",
              edit: false
            },
            {
              name: "知识点3",
              edit: false
            }
          ]
        }
      ],
      chapterData: [],
      courseID:0,
      updateChapterVisible: false,
     tree:[],
      typeOptions: [
        {
          value: "0",
          label: "一级章节"
        },
        {
          value: "1",
          label: "二级章节"
        }
      ]
    };
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.push({
          path:"/teacher/courseDetail",
          query:{
            courseID:this.courseID}
          });
      }
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
    },
     getCatalog(){
       const routerParams = this.$route.query.courseIDt;
     this.courseID = routerParams;
     axios
        .get("/api/getCourseCatalog", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6dGgiLCJleHAiOjE1NTY0NTI0MTEsImlhdCI6MTU1NTg0NzYxMX0.fv3xdxZ3z4nfVLBvFT3ruHFBCJJ5rLFSsdluahhTnekuy2VSDizqRdbstA1kgIDPJycPhi4OSD3O0fRpMQThNg"
          },
          params: {
            courseID: this.courseID
          }
        })
        .then(resp => {
          this.tree = resp.data.data;
          console.log(resp.data,"resp.data");
          console.log(this.courseID,"courseID");
        })
        .catch(err => {
          console.log(err);
        });
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
    this.getCatalog()
  }
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


