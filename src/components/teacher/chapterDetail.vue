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
        <el-submenu v-for="(item1,index1) in catalog" :index="index1.toString()" :key="index1">
          <template slot="title">
            <span>{{item1.chapterName}}</span>
          </template>
          <div>
            <div v-for="(item2, index2) in item1.points" :key="index1*10+index2">
              <el-row class="vertical-middle">
                <el-col :span="16">
                  <router-link
                    :to="{name: 'tpoint', query:{id: index1.toString() + index2, name: item2.name}}"
                    class="router-link-active"
                  >
                    <el-menu-item :index="index1.toString() + index2">{{item2.name}}</el-menu-item>
                  </router-link>
                </el-col>
              </el-row>
            </div>
            <!-- 初始化页面状态 -->
            <router-link
              :to="{name: 'tpreExercise', query:{sid: index1 + 'pre'}}"
              class="router-link-active"
            >
              <el-menu-item :index="index1.toString() + 'pre'">课前摸底习题</el-menu-item>
            </router-link>
            <router-link
              :to="{name: 'trevExercise', query:{sid: index1 + 'rev'}}"
              class="router-link-active"
            >
              <el-menu-item :index="index1.toString() + 'rev'">课后习题</el-menu-item>
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
      updateChapterVisible: false,
      chapterForm: {
        name: "",
        type: "0",
        predecessor: []
      },
      chapterRules: {
        name: [{ required: true, message: "请输入章节名", trigger: "blur" }]
      },
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
        this.$router.push("/teacher/courseDetail");
      }
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
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


