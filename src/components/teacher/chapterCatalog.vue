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
                    @click="deletePoint(item2)"
                  ></el-button>
                </el-col>
                <el-col :span="16">
                  <router-link
                    :to="{name: 'pointEdit', query:{item: item2}}"
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
                    @click="handleEditPoint(item2)"
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
                    @click="cancelEdit(item1, index2, item2)"
                  ></el-button>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="newPoint.name" size="small" style="width: 75%"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #fff;"
                    icon="el-icon-circle-check"
                    @click="submitEdit(item1, item2, index2)"
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
            <el-menu-item :index="index1.toString() + '100'">
              <span>
                <el-button type="text" @click="deleteChapter(item1.id)" style="color: #fff">删除本章</el-button>
              </span>
            </el-menu-item>
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
            <el-input style="width: 200px" v-model="chapterForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="前继章节" prop="predecessor">
            <el-transfer
              v-model="chapterForm.predecessor"
              :data="chapterData"
              :titles="['无关章节', '前继章节']"
            ></el-transfer>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" size="small" @click="confirmEdit()">提交</el-button>
            <el-button size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import bus from '../../bus.js'
export default {
  name: "chapterCatalog",
  data() {
    return {
      courseID: 0,
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
        }
      ],
      chapterData: [],
      updateChapterVisible: false,
      chapterForm: {},
      chapterRules: {
        name: [{ required: true, message: "请输入章节名", trigger: "blur" }]
      },
      newPoint: {},
      reloadCatalog: false,
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
            courseID: this.courseID
          }
        });
      }
    },
    getCatalog() {
      this.catalog = [];
      this.chapterData = [];
      this.$http
        .get(
          // 传值课程号
          "/api/getCourseCatalog?courseID=" + this.courseID,
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
                  for (
                    let k = 0;
                    k < catalogList.data[i].subCatalog.length;
                    k++
                  ) {
                    this.catalog[i].points.push({
                      id: catalogList.data[i].subCatalog[k].id,
                      name: catalogList.data[i].subCatalog[k].contentName,
                      courseID: catalogList.data[i].subCatalog[k].courseID,
                      parentID: catalogList.data[i].subCatalog[k].parentID,
                      siblingID: catalogList.data[i].subCatalog[k].siblingID,
                      edit: false,
                      new: false
                    });
                  }
                  this.chapterData.push({
                    key: catalogList.data[i].id,
                    label: catalogList.data[i].contentName,
                    disabled: false
                  });
                  i++;
                }
                this.reloadCatalog = false;
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
      this.$http
        .get(
          // 传值课程号
          "/api/getChapterRelationByCourseID?courseID=" +
            this.courseID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let relationList = JSON.parse(response.bodyText);
              if (relationList.state === 1) {
                let i = 0;
                while (i < relationList.data.length) {
                  let j = 0;
                  while (j < this.catalog.length) {
                    if (
                      this.catalog[j].id === relationList.data[i].chapterNode.id
                    ) {
                      for (
                        var k = 0;
                        k < relationList.data[i].preChapterNodes.length;
                        k++
                      ) {
                        this.catalog[j].predecessor.push(
                          relationList.data[i].preChapterNodes[k].id
                        );
                      }
                    }
                    j++;
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
        index: this.catalog.length,
        name: "",
        predecessor: [],
        new: true
      };
    },
    handleAddPoint(index) {
      this.catalog[index].points.push({
        name: "",
        edit: true,
        new: true
      });
    },
    handleEditPoint(item) {
      item.edit = true;
      this.newPoint = this.objDeepCopy(item);
    },
    handleEditChapter(index) {
      this.updateChapterVisible = true;
      this.chapterForm = {
        index: index,
        name: this.catalog[index].chapterName,
        predecessor: this.catalog[index].predecessor,
        new: false
      };
      this.chapterData[index].disabled = true;
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
    },
    // chapter
    confirmEdit() {
      let sibID = 0;
      if (this.chapterForm.new) {
        if (this.catalog.length > 0) {
          let last = this.catalog.length - 1;
          sibID = this.catalog[last].id;
        }
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName: this.chapterForm.name,
              parentID: 0,
              siblingID: sibID,
              content: ""
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let responseData = JSON.parse(response.bodyText);
                this.editPredecessor(this.chapterForm.index);
              } else {
                this.$message({ type: "error", message: "章节添加失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节添加失败!" });
              return;
            }
          );
      } else {
        sibID = this.catalog[this.chapterForm.index - 1].id;
        this.$http
          .post(
            "/api/alertChapter",
            {
              id: this.catalog[this.chapterForm.index].id,
              courseID: this.courseID,
              contentName: this.chapterForm.name,
              parentID: 0,
              siblingID: sibID,
              content: ""
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let responseData = JSON.parse(response.bodyText);
                this.editPredecessor(this.chapterForm.index);
              } else {
                this.$message({ type: "error", message: "章节编辑失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节编辑失败!" });
              return;
            }
          );
      }
    },
    editPredecessor(index) {
      for (let i = 0; i < this.catalog[index].predecessor.length; i++) {
        if (
          this.chapterForm.predecessor.indexOf(
            this.catalog[index].predecessor[i]
          ) < 0
        ) {
          // 删除
          this.$http
            .get("/api/deleteChapterRelation", {
              params: {
                chapterID: this.catalog[index].id,
                preChapterID: this.catalog[index].predecessor[i]
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.getCatalog();
                } else {
                  this.$message({ type: "error", message: "章节更新失败!" });
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "章节更新失败!" });
                return;
              }
            );
        }
      }
      for (let i = 0; i < this.chapterForm.predecessor.length; i++) {
        if (
          this.catalog[index].predecessor.indexOf(
            this.chapterForm.predecessor[i]
          ) < 0
        ) {
          // 添加
          this.$http
            .get("/api/addChapterRelation", {
              params: {
                chapterID: this.catalog[index].id,
                preChapterID: this.chapterForm.predecessor[i]
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.getCatalog();
                } else {
                  this.$message({ type: "error", message: "章节更新失败!" });
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "章节更新失败!" });
                return;
              }
            );
        }
      }
      this.updateChapterVisible = false;
      this.chapterForm = {};
      this.$message({
        type: "success",
        message: "章节更新成功!"
      });
    },
    deleteChapter(id) {
      this.$confirm("确认删除此章节吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("/api/deleteChapter", {
              params: {
                chapterID: id
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.$message({
                    type: "success",
                    message: "已删除章节!"
                  });
                  this.getCatalog();
                } else {
                  this.$message({ type: "error", message: "删除失败!" });
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "删除失败!" });
                return;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // point
    deletePoint(item) {
      this.$confirm("确认删除此知识点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("/api/deleteChapter", {
              params: {
                chapterID: item.id
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.$message({
                    type: "success",
                    message: "已删除知识点!"
                  });
                  this.getCatalog();
                } else {
                  this.$message({ type: "error", message: "删除失败!" });
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "删除失败!" });
                return;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelEdit(item1, index2, item2) {
      if (item2.new) {
        item1.points.splice(index2, 1);
      } else {
        item2.edit = false;
      }
      this.newPoint = {};
    },
    submitEdit(item1, item2, index) {
      if (this.newPoint.name == undefined || this.newPoint.name === '') {
        this.$message({ type: "warning", message: "请填写知识点名称!" });
        return;
      }
      let sibID = 0;
      if (index > 0) {
        sibID = item1.points[index - 1].id;
      }
      if (item2.new) {
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName: this.newPoint.name,
              parentID: item1.id,
              siblingID: sibID,
              content: ""
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let responseData = JSON.parse(response.bodyText);
                this.$message({
                  type: "success",
                  message: "知识点添加成功!"
                });
                this.getCatalog();
                this.newPoint = {};
              } else {
                this.$message({ type: "error", message: "知识点添加失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "知识点添加失败!" });
              return;
            }
          );
      } else {
        this.$http
          .post(
            "/api/alertChapter",
            {
              id: item2.id,
              courseID: this.courseID,
              contentName: this.newPoint.name,
              parentID: item1.id,
              siblingID: sibID,
              content: ""
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let responseData = JSON.parse(response.bodyText);
                this.$message({
                  type: "success",
                  message: "知识点编辑成功!"
                });
                this.getCatalog();
                this.newPoint = {};
              } else {
                this.$message({ type: "error", message: "知识点编辑失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "知识点编辑失败!" });
              return;
            }
          );
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
    },
    getData(val) {
          this.reloadCatalog = val;
        }
  },
  created() {
    this.courseID = this.$route.query.id;
    this.getCatalog();
    bus.$on('reloadCatalog', (val) => this.getData(val));
  },
  watch: {
    reloadCatalog(val) {
      if (val === true) {
        this.getCatalog();
      }
    }
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
