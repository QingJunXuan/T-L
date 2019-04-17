<template>
  <el-container>
    <el-aside>
      <el-menu
        default-active="0-0"
        style="height: 100%; min-height: 700px"
        unique-opened
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="101">
          <span>
            <el-button type="text" @click="handleAddChapter" style="color: #fff">添加章节</el-button>
          </span>
        </el-menu-item>
        <el-submenu v-for="(item1,index1) in catalog" :index="index1.toString()" :key="index1">
          <template slot="title">
            <span>{{item1.chapterName}}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                circle
                icon="el-icon-edit"
                style="color: #fff;"
                @click="handleEditChapter(index1)"
              ></el-button>
            </span>
          </template>
          <div>
            <el-menu-item :index="index1.toString() + '001'">
              <span>
                <el-button type="text" @click="handleAddPoint(index1)" style="color: #fff">添加知识点</el-button>
              </span>
            </el-menu-item>
            <div v-for="(item2, index2) in item1.points" :key="index1*10+index2">
              <el-row v-if="item2.edit === false" class="vertical-middle">
                <el-col :span="4">
                  <el-button
                    type="text"
                    size="mini"
                    circle
                    icon="el-icon-remove-outline"
                    style="color: #fff;"
                    @click="item1.points.splice(index2, 1)"
                  ></el-button>
                </el-col>
                <el-col :span="16">
                  <router-link
                    :to="{name: 'pointEdit', query:{id: item2.id, name: item2.name}}"
                    class="router-link-active"
                  >
                    <el-menu-item :index="index1.toString() + index2">{{item2.name}}</el-menu-item>
                  </router-link>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="text"
                    size="mini"
                    circle
                    icon="el-icon-edit"
                    style="color: #fff;"
                    @click="item2.edit = true"
                  ></el-button>
                </el-col>
              </el-row>
              <el-row v-else class="vertical-middle" style="height: 50px">
                <el-col :span="4">
                  <el-button
                    type="text"
                    size="mini"
                    circle
                    icon="el-icon-circle-close-outline"
                    style="color: #fff;"
                    @click="item2.edit = false"
                  ></el-button>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="item2.name" size="small" style="width: 75%">{{item2.name}}</el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #fff;"
                    icon="el-icon-circle-check"
                    @click="item2.edit = false"
                  ></el-button>
                </el-col>
              </el-row>
            </div>
            <router-link
              :to="{name: 'preExerciseEdit', query:{id: item1.id}}"
              class="router-link-active"
            >
              <el-menu-item :index="'pre' + index1.toString()">课前摸底习题</el-menu-item>
            </router-link>
            <router-link
              :to="{name: 'revExerciseEdit', query:{id: item1.id}}"
              class="router-link-active"
            >
              <el-menu-item :index="'rev' + index1.toString()">课后习题</el-menu-item>
            </router-link>
          </div>
        </el-submenu>
        <div class="exit">
          <span>
            <el-button type="text" style="color: #fff" @click="goBack">
              <i class="el-icon-arrow-left" style="margin-right: 6px"></i>退出编辑
            </el-button>
          </span>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view class="router-view"></router-view>
      <el-dialog
        :visible.sync="updateChapterVisible"
        width="700px"
        :center="true"
        @close="handleChapterClose"
      >
        <el-form
          style="padding: 15px 50px 15px 50px"
          :model="chapterForm"
          status-icon
          :rules="chapterRules"
          ref="chapterForm"
          label-width="100px"
          label-position="top"
          align="start"
        >
          <el-form-item label="章节名" prop="name">
            <el-input style="width: 200px" v-model="chapterForm.name"></el-input>
          </el-form-item>
          <el-form-item label="前继章节" prop="predecessor">
            <el-transfer
              v-model="chapterForm.predecessor"
              :data="chapterData"
              :titles="['无关章节', '前继章节']"
            ></el-transfer>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary">提交</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "chapterCatalog",
  data() {
    return {
      // 章节知识点列表
      catalog: [
        {
          chapterName: "章节一",
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
        predecessor: []
      },
      chapterRules: {
        name: [{ required: true, message: "请输入章节名", trigger: "blur" }]
      }
    };
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/"});
        return false;
      } else {
        this.$router.push({ path: "/teacher/courseDetail", query:{
          courseID: this.$route.query.id
        }});
      }
    },
    getCatalog() {
      this.catalog = [];
      this.$http
        .get(
          // 传值课程号
          "http://localhost:8080/getCourseCatalog?courseID=" + this.$route.query.id,
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
                    predecessor: [],
                    points: []
                  });
                  for(let k = 0;k < catalogList.data[i].subCatalog.length;k++) {
                    this.catalog[i].points.push({
                      id: catalogList.data[i].subCatalog[k].id,
                      name: catalogList.data[i].subCatalog[k].contentName,
                      edit: false
                    })
                  }
                  i++;
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
    handleAddChapter() {
      this.updateChapterVisible = true;
      this.chapterForm = {
        name: "",
        predecessor: []
      };
    },
    handleAddPoint(index1) {
      this.catalog[index1].points.push({
        name: "",
        edit: true
      });
    },
    handleEditChapter(index) {
      this.updateChapterVisible = true;
      this.chapterForm = {
        name: this.catalog[index].chapterName,
        predecessor: this.catalog[index].predecessor
      };
      this.chapterData[index].disabled = true;
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
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
    }
  },
  created() {
    for (let i = 0; i < this.catalog.length; i++) {
      this.chapterData.push({
        key: i,
        label: this.catalog[i].chapterName,
        disabled: false
      });
    }
    this.getCatalog();
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
  bottom: 10px;
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
