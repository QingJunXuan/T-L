<template>
  <el-container>
    <el-aside style="width:20%">
      <el-menu
        :default-active="activeIndex"
        style="height: calc(90vh)"
        background-color="#545c64"
        unique-opened
        text-color="#fff"
        active-text-color="#C2FF66"
        v-loading="menuLoading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="menu"
      >
        <el-scrollbar wrap-style="height: calc(83vh);" :native="false">
          <el-submenu v-for="(item1,index1) in catalog" :index="index1.toString()" :key="index1">
            <template slot="title">
              <div align="start" class="chapter-name">{{item1.chapterName}}</div>
            </template>
            <div>
              <router-link
                :to="{name: 'preExerciseEdit', query:{id: item1.id, courseID: courseID}}"
                class="router-link-active"
              >
                <el-menu-item :index="'pre' + index1.toString()">课前摸底习题</el-menu-item>
              </router-link>
              <router-link
                :to="{name: 'revExerciseEdit', query:{id: item1.id, courseID: courseID}}"
                class="router-link-active"
              >
                <el-menu-item :index="'rev' + index1.toString()">课后习题</el-menu-item>
              </router-link>
            </div>
          </el-submenu>
        </el-scrollbar>
        <el-menu-item index="888">
          <div>
            <el-button type="text" style="color: #fff" @click="goBack">
              <i class="el-icon-arrow-left" style="margin-right: 6px"></i>
              <span style="margin-top: 2px">退出编辑</span>
            </el-button>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <el-scrollbar wrap-style="height: calc(83vh);overflow-x: hidden;" :native="false">
        <router-view class="router-view" :key="activeDate"></router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import bus from "../../bus.js";
export default {
  name: "chapterCatalog",
  data() {
    return {
      courseID: 0,
      teacherID: localStorage.getItem('userID'),
      classID: 0,
      // 章节知识点列表
      catalog: [
        {
          chapterName: "章节一",
        }
      ],
      menuLoading: false,
      activeDate: "",
      activeIndex: "0-0"
    };
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.push({
          path: "/teacher/courseDetail",
          query: {
            courseID: this.courseID,
            classID: this.classID
          }
        });
      }
    },
    getCatalog() {
      this.catalog = [];
      this.menuLoading = true;
      this.$http
        .get(
          // 传值课程号
          "http://10.60.38.173:8765/getCourseCatalog?courseID=" + this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let catalogList = JSON.parse(response.bodyText);
              if (catalogList.state === 1) {
                let i = 0;
                while (i < catalogList.data.length) {
                  this.catalog.push({
                    id: catalogList.data[i].id,
                    chapterName: catalogList.data[i].contentName,
                  });
                  i++;
                }
              }
              this.activeIndex = "0-0";
              let date = new Date();
              this.activeDate = date.getTime().toString();
              this.menuLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.menuLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.menuLoading = false;
          }
        );
    },
    objDeepCopy(source) {
      let sourceCopy = source instanceof Array ? [] : {};
      for (let item in source) {
        if (source.hasOwnProperty(item)) {
          sourceCopy[item] =
            typeof source[item] === "object"
              ? this.objDeepCopy(source[item])
              : source[item];
        }
      }
      return sourceCopy;
    },
  },
  created() {
    this.courseID = this.$route.query.id;
    this.classID = this.$route.query.classID;
    let date = new Date();
    this.activeDate = date.getTime().toString();
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

<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.exit {
  width: 100%;
}

.vertical-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.router-view {
  padding-top: 20px;
}

.chapter-name {
  margin-left: 20px;
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: start;
}

@media screen and (max-width: 960px) {
  .menu {
    display: none;
  }
}
</style>
