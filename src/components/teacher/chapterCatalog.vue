<template>
  <el-container>
    <el-aside>
      <el-menu
        default-active="0-0"
        style="height: 100%; min-height: 720px"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        v-loading="menuLoading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-menu-item index="101">
          <span>
            <el-button type="text" @click="handleImportChapter" style="color: #fff">导入章节</el-button>
          </span>
          <span style="margin-left: 40px">
            <el-button type="text" @click="handleAddChapter" style="color: #fff">添加章节</el-button>
          </span>
        </el-menu-item>
        <el-scrollbar wrap-style="height: calc(100vh - 150px)" :native="false">
          <el-submenu v-for="(item1,index1) in catalog" :index="index1.toString()" :key="index1">
            <template slot="title">
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
              <span>{{item1.chapterName}}</span>
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
                      @click="deletePoint(item1, index2)"
                    ></el-button>
                  </el-col>
                  <el-col :span="16">
                    <router-link
                      :to="{name: 'pointEdit', query:{item: item2}}"
                      class="router-link-active"
                    >
                      <el-menu-item :index="index1.toString() + index2">
                        <div class="point-name">{{item2.name}}</div>
                      </el-menu-item>
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
                  <el-col :span="3" align="start">
                    <el-button
                      type="text"
                      size="mini"
                      circle
                      icon="el-icon-circle-close-outline"
                      style="color: #fff; margin-left: 3px"
                      @click="cancelEdit(item1, index2, item2)"
                    ></el-button>
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-model="newPoint.order"
                      size="small"
                      style="width: 100%"
                      type="number"
                    ></el-input>
                  </el-col>
                  <el-col :span="13">
                    <el-input v-model="newPoint.name" size="small" style="width: 90%"></el-input>
                  </el-col>
                  <el-col :span="3" align="start">
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
              <el-menu-item :index="index1.toString() + '100'">
                <span>
                  <el-button type="text" @click="deleteChapter(index1)" style="color: #fff">删除本章</el-button>
                </span>
              </el-menu-item>
            </div>
          </el-submenu>
        </el-scrollbar>
        <div class="exit">
          <span>
            <el-button
              type="primary"
              style="background-color: #545c64;border-color: #545c64;width: 100%"
              @click="goBack"
            >
              <i class="el-icon-arrow-left" style="margin-right: 6px"></i>退出编辑
            </el-button>
          </span>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <el-scrollbar wrap-style="height: calc(100vh - 150px)" :native="false">
        <router-view class="router-view"></router-view>
      </el-scrollbar>
      <el-dialog
        :visible.sync="updateChapterVisible"
        width="700px"
        style="height: 750px;"
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
          <el-form-item label="章节号" prop="order">
            <el-input style="width: 100px" v-model="chapterForm.order" size="small" type="number"></el-input>
          </el-form-item>
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
            <el-button
              type="primary"
              size="small"
              @click="confirmEdit()"
              :loading="submitLoading"
            >提交</el-button>
            <el-button size="small" @click="resetEdit()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        :visible.sync="importChapterVisible"
        width="400px"
        :center="true"
        @close="handleImportChapterClose"
        title="历史记录"
      >
        <el-row type="flex" justify="center">
          <el-select size="small" v-model="importSettings">
            <el-option
              v-for="item in importData"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 15px">
          <el-button
            type="primary"
            size="small"
            @click="confirmImport()"
            :loading="importLoading"
          >提交</el-button>
        </el-row>
      </el-dialog>
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
      teacherID: 202,
      classID: 0,
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
      importChapterVisible: false,
      chapterForm: {},
      chapterRules: {
        order: [{ required: true, message: "请输入章节号", trigger: "blur" }],
        name: [{ required: true, message: "请输入章节名", trigger: "blur" }]
      },
      importData: [],
      importSettings: "暂无数据",
      newPoint: {},
      reloadCatalog: false,
      submitLoading: false,
      importLoading: false,
      menuLoading: false
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
    getCatalog(alter) {
      this.catalog = [];
      this.chapterData = [];
      this.menuLoading = true;
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
                  let end = catalogList.data[i].contentName.indexOf("章");
                  this.catalog.push({
                    id: catalogList.data[i].id,
                    chapterName: catalogList.data[i].contentName,
                    parentID: catalogList.data[i].parentID,
                    siblingID: catalogList.data[i].siblingID,
                    content: catalogList.data[i].content,
                    predecessor: [],
                    descendant: [],
                    points: [],
                    order: catalogList.data[i].contentName.substring(1, end)
                  });
                  for (
                    let k = 0;
                    k < catalogList.data[i].subCatalog.length;
                    k++
                  ) {
                    let start = catalogList.data[i].subCatalog[
                      k
                    ].contentName.indexOf(".");
                    let end = catalogList.data[i].subCatalog[
                      k
                    ].contentName.indexOf(" ");
                    this.catalog[i].points.push({
                      id: catalogList.data[i].subCatalog[k].id,
                      name: catalogList.data[i].subCatalog[k].contentName,
                      courseID: catalogList.data[i].subCatalog[k].courseID,
                      parentID: catalogList.data[i].subCatalog[k].parentID,
                      siblingID: catalogList.data[i].subCatalog[k].siblingID,
                      content: catalogList.data[i].subCatalog[k].content,
                      order: catalogList.data[i].subCatalog[
                        k
                      ].contentName.substring(start + 1, end),
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
              if (alter === true) {
                this.insertChapter();
              }
              this.getRelation();
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
    getRelation() {
      this.$http
        .get(
          // 传值课程号
          "/api/getChapterRelationByCourseID?courseID=" + this.courseID,
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
                        let k = 0;
                        k < relationList.data[i].preChapterNodes.length;
                        k++
                      ) {
                        this.catalog[j].predecessor.push(
                          relationList.data[i].preChapterNodes[k].id
                        );
                      }
                      for (
                        let k = 0;
                        k < relationList.data[i].subChapterNodes.length;
                        k++
                      ) {
                        this.catalog[j].descendant.push(
                          relationList.data[i].subChapterNodes[k].id
                        );
                      }
                    }
                    j++;
                  }
                  i++;
                }
              }
              this.menuLoading = false;
            } else {
              this.menuLoading = false;
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.menuLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getCourses() {
      this.importData = [];
      this.$http
        .get(
          // 传值课程号
          "/api/question/sameCoursesById?courseId=" +
            this.courseID +
            "&teacherId=" +
            this.teacherID,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let courseList = JSON.parse(response.bodyText);
              if (courseList.state === 1) {
                let i = 0;
                let index = 0;
                while (i < courseList.data.length) {
                  if (
                    Number(courseList.data[i].courseID) !==
                    Number(this.courseID)
                  ) {
                    this.importData.push({
                      value: index,
                      label:
                        courseList.data[i].courseYear +
                        courseList.data[i].courseSemester,
                      id: courseList.data[i].courseID
                    });
                    index++;
                  }
                  i++;
                }
              }
              if (this.importData.length > 0) {
                this.importSettings = 0;
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
    handleImportChapter() {
      this.importChapterVisible = true;
    },
    handleImportChapterClose() {},
    handleAddChapter() {
      this.updateChapterVisible = true;
      this.chapterForm = {
        index: this.catalog.length,
        order: 0,
        name: "",
        predecessor: [],
        descendant: [],
        new: true
      };
    },
    handleAddPoint(index) {
      this.catalog[index].points.push({
        name: "",
        order: 0,
        edit: true,
        new: true
      });
      this.newPoint = {
        name: "",
        order: 0,
        edit: true,
        new: true
      };
    },
    handleEditPoint(item) {
      item.edit = true;
      this.newPoint = this.objDeepCopy(item);
      let start = this.newPoint.name.indexOf(" ") + 1;
      this.newPoint.name = this.newPoint.name.substring(start);
    },
    handleEditChapter(index) {
      this.updateChapterVisible = true;
      let end = this.catalog[index].chapterName.indexOf("章");
      this.chapterForm = {
        index: index,
        order: this.catalog[index].chapterName.substring(1, end),
        name: this.catalog[index].chapterName.substring(end + 2),
        predecessor: this.catalog[index].predecessor,
        descendant: this.catalog[index].descendant,
        new: false
      };
      this.chapterData[index].disabled = true;
    },
    resetEdit() {
      let end = this.catalog[this.chapterForm.index].chapterName.indexOf("章");
      let temp = {
        index: this.chapterForm.index,
        order: this.catalog[this.chapterForm.index].chapterName.substring(
          1,
          end
        ),
        name: this.catalog[this.chapterForm.index].chapterName.substring(
          end + 2
        ),
        predecessor: this.catalog[this.chapterForm.index].predecessor,
        descendant: this.catalog[this.chapterForm.index].descendant,
        new: false
      };
      this.chapterForm = temp;
    },
    handleChapterClose() {
      for (let i = 0; i < this.chapterData.length; i++) {
        this.chapterData[i].disabled = false;
      }
    },
    alterChapterOrder(chapter, name) {
      this.$http
        .post(
          "/api/alertChapter",
          {
            id: chapter.id,
            courseID: this.courseID,
            contentName: name,
            parentID: chapter.parentID,
            siblingID: chapter.siblingID,
            content: chapter.content
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
            } else {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.submitLoading = false;
              return;
            }
          },
          response => {
            this.$message({ type: "error", message: "章节编辑失败!" });
            this.submitLoading = false;
            return;
          }
        );
    },
    alterChapterSib(chapter, id) {
      this.$http
        .post(
          "/api/alertChapter",
          {
            id: chapter.id,
            courseID: this.courseID,
            contentName: chapter.chapterName,
            parentID: chapter.parentID,
            siblingID: id,
            content: chapter.content
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
              this.getCatalog();
            } else {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.submitLoading = false;
              return;
            }
          },
          response => {
            this.$message({ type: "error", message: "章节编辑失败!" });
            this.submitLoading = false;
            return;
          }
        );
    },
    insertChapter() {
      if (this.catalog.length === 0) {
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName:
                "第" +
                this.chapterForm.order.toString() +
                "章 " +
                this.chapterForm.name,
              parentID: 0,
              siblingID: 0,
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
                this.updateChapterVisible = false;
                this.submitLoading = false;
                this.getCatalog();
              } else {
                this.$message({ type: "error", message: "章节添加失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节添加失败!" });
              this.submitLoading = false;
              return;
            }
          );
      } else if (
        Number(this.chapterForm.order) >=
        Number(this.catalog[this.catalog.length - 1].order)
      ) {
        let last = this.catalog.length - 1;
        let sibID = this.catalog[last].id;
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName:
                "第" +
                this.chapterForm.order.toString() +
                "章 " +
                this.chapterForm.name,
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
                let chapter = {
                  id: responseData.data.id,
                  predecessor: []
                };
                this.editPredecessor(chapter);
                this.getCatalog();
              } else {
                this.$message({ type: "error", message: "章节添加失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节添加失败!" });
              this.submitLoading = false;
              return;
            }
          );
      } else {
        let sibID = 0;
        let changeOrder = false;
        let index = 0;
        if (Number(this.chapterForm.order) !== 1) {
          for (let i = 0; i < this.catalog.length; i++) {
            if (
              Number(this.catalog[i].order) < Number(this.chapterForm.order) &&
              Number(this.catalog[i + 1].order) >=
                Number(this.chapterForm.order)
            ) {
              sibID = this.catalog[i].id;
              index = i + 1;
              if (
                Number(this.catalog[i + 1].order) ===
                Number(this.chapterForm.order)
              ) {
                changeOrder = true;
              }
              break;
            }
          }
        }
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName:
                "第" +
                this.chapterForm.order.toString() +
                "章 " +
                this.chapterForm.name,
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
                if (changeOrder) {
                  for (let i = index; i < this.catalog.length; i++) {
                    let start = this.catalog[i].chapterName.indexOf("章") + 1;
                    let newName =
                      "第" +
                      (Number(this.catalog[i].order) + 1) +
                      "章" +
                      this.catalog[i].chapterName.substr(start);
                    this.catalog[i].chapterName = newName;
                    this.alterChapterOrder(this.catalog[i], newName);
                  }
                }

                let responseData = JSON.parse(response.bodyText);
                let chapter = {
                  id: responseData.data.id,
                  predecessor: []
                };
                this.editPredecessor(chapter);
                this.alterChapterSib(this.catalog[index], responseData.data.id);
              } else {
                this.$message({ type: "error", message: "章节添加失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节添加失败!" });
              this.submitLoading = false;
              return;
            }
          );
      }
    },
    insertDelete(index) {
      if (index === 0 && index !== this.catalog.length - 1) {
        if (
          Number(this.catalog[index + 1].order) ===
          Number(Number(this.catalog[index].order) + 1)
        ) {
          for (let i = index + 1; i < this.catalog.length; i++) {
            let start = this.catalog[i].chapterName.indexOf("章") + 1;
            let newName =
              "第" +
              (Number(this.catalog[i].order) - 1) +
              "章" +
              this.catalog[i].chapterName.substr(start);
            this.catalog[i].chapterName = newName;
            this.alterChapterOrder(this.catalog[i], newName);
          }
        }
        this.$http
          .post(
            "/api/alertChapter",
            {
              id: this.catalog[index + 1].id,
              courseID: this.courseID,
              contentName: this.catalog[index + 1].chapterName,
              parentID: 0,
              siblingID: 0,
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
              } else {
                this.$message({ type: "error", message: "章节编辑失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.submitLoading = false;
              return;
            }
          );
      } else if (index < this.catalog.length - 1) {
        if (
          Number(this.catalog[index + 1].order) ===
          Number(Number(this.catalog[index].order) + 1)
        ) {
          for (let i = index + 1; i < this.catalog.length; i++) {
            let start = this.catalog[i].chapterName.indexOf("章") + 1;
            let newName =
              "第" +
              (Number(this.catalog[i].order) - 1) +
              "章" +
              this.catalog[i].chapterName.substr(start);
            this.catalog[i].chapterName = newName;
            this.alterChapterOrder(this.catalog[i], newName);
          }
        }
        this.$http
          .post(
            "/api/alertChapter",
            {
              id: this.catalog[index + 1].id,
              courseID: this.courseID,
              contentName: this.catalog[index + 1].chapterName,
              parentID: 0,
              siblingID: this.catalog[index - 1].id,
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
              } else {
                this.$message({ type: "error", message: "章节编辑失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.submitLoading = false;
              return;
            }
          );
      }
      this.deleteChapterRelation(this.catalog[index]);
      this.$http
        .get("/api/deleteChapter", {
          params: {
            chapterID: this.catalog[index].id
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              this.getCatalog(true);
            } else {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.menuLoading = false;
              return;
            }
          },
          response => {
            this.$message({ type: "error", message: "章节编辑失败!" });
            this.menuLoading = false;
            return;
          }
        );
    },
    updateChapter() {
      if (
        Number(this.chapterForm.order) ===
        Number(this.catalog[this.chapterForm.index].order)
      ) {
        let sibID = 0;
        if (this.chapterForm.index > 0) {
          sibID = this.catalog[this.chapterForm.index - 1].id;
        }
        this.$http
          .post(
            "/api/alertChapter",
            {
              id: this.catalog[this.chapterForm.index].id,
              courseID: this.courseID,
              contentName:
                "第" +
                this.chapterForm.order.toString() +
                "章 " +
                this.chapterForm.name,
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
                this.editPredecessor(this.catalog[this.chapterForm.index]);
                this.getCatalog();
              } else {
                this.$message({ type: "error", message: "章节编辑失败!" });
                this.submitLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节编辑失败!" });
              this.submitLoading = false;
              return;
            }
          );
      } else {
        this.insertDelete(this.chapterForm.index);
      }
    },
    // chapter
    confirmEdit() {
      if (Number(this.chapterForm.order) < 0) {
        this.$message({ type: "warning", message: "章节号不能为负数!" });
      }
      let sibID = 0;
      this.submitLoading = true;
      if (this.chapterForm.new) {
        this.insertChapter();
      } else {
        this.updateChapter();
      }
    },
    editPredecessor(chapter) {
      let notEdited = true;
      for (let i = 0; i < chapter.predecessor.length; i++) {
        if (this.chapterForm.predecessor.indexOf(chapter.predecessor[i]) < 0) {
          notEdited = false;
          // 删除
          this.$http
            .get("/api/deleteChapterRelation", {
              params: {
                chapterID: chapter.id,
                preChapterID: chapter.predecessor[i]
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.getRelation();
                  this.submitLoading = false;
                } else {
                  this.$message({ type: "error", message: "章节更新失败!" });
                  this.submitLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "章节更新失败!" });
                this.submitLoading = false;
                return;
              }
            );
        }
      }
      for (let i = 0; i < this.chapterForm.predecessor.length; i++) {
        if (chapter.predecessor.indexOf(this.chapterForm.predecessor[i]) < 0) {
          notEdited = false;
          // 添加
          this.$http
            .get("/api/addChapterRelation", {
              params: {
                chapterID: chapter.id,
                preChapterID: this.chapterForm.predecessor[i]
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            })
            .then(
              response => {
                if (response.status === 200) {
                  this.getRelation();
                  this.submitLoading = false;
                } else {
                  this.$message({ type: "error", message: "章节更新失败!" });
                  this.submitLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "章节更新失败!" });
                this.submitLoading = false;
                return;
              }
            );
        }
      }
      this.updateChapterVisible = false;
      //this.chapterForm = {};
      this.$message({
        type: "success",
        message: "章节更新成功!"
      });
      if (notEdited) {
        this.submitLoading = false;
        this.getRelation();
      }
    },
    deleteChapter(index) {
      this.$confirm("确认删除此章节吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.menuLoading = true;
          if (index === 0 && index !== this.catalog.length - 1) {
            if (
              Number(this.catalog[index + 1].order) ===
              Number(Number(this.catalog[index].order) + 1)
            ) {
              for (let i = index + 1; i < this.catalog.length; i++) {
                let start = this.catalog[i].chapterName.indexOf("章") + 1;
                let newName =
                  "第" +
                  (Number(this.catalog[i].order) - 1) +
                  "章" +
                  this.catalog[i].chapterName.substr(start);
                this.catalog[i].chapterName = newName;
                this.alterChapterOrder(this.catalog[i], newName);
              }
            }
            this.$http
              .post(
                "/api/alertChapter",
                {
                  id: this.catalog[index + 1].id,
                  courseID: this.courseID,
                  contentName: this.catalog[index + 1].chapterName,
                  parentID: 0,
                  siblingID: 0,
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
                  } else {
                    this.$message({ type: "error", message: "章节删除失败!" });
                    this.submitLoading = false;
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "章节删除失败!" });
                  this.submitLoading = false;
                  return;
                }
              );
          } else if (index < this.catalog.length - 1) {
            if (
              Number(this.catalog[index + 1].order) ===
              Number(Number(this.catalog[index].order) + 1)
            ) {
              for (let i = index + 1; i < this.catalog.length; i++) {
                let start = this.catalog[i].chapterName.indexOf("章") + 1;
                let newName =
                  "第" +
                  (Number(this.catalog[i].order) - 1) +
                  "章" +
                  this.catalog[i].chapterName.substr(start);
                this.catalog[i].chapterName = newName;
                this.alterChapterOrder(this.catalog[i], newName);
              }
            }
            this.$http
              .post(
                "/api/alertChapter",
                {
                  id: this.catalog[index + 1].id,
                  courseID: this.courseID,
                  contentName: this.catalog[index + 1].chapterName,
                  parentID: 0,
                  siblingID: this.catalog[index - 1].id,
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
                  } else {
                    this.$message({ type: "error", message: "章节删除失败!" });
                    this.submitLoading = false;
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "章节删除失败!" });
                  this.submitLoading = false;
                  return;
                }
              );
          }
          this.deleteChapterRelation(this.catalog[index]);
          this.$http
            .get("/api/deleteChapter", {
              params: {
                chapterID: this.catalog[index].id
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
                  this.menuLoading = false;
                  this.getCatalog();
                } else {
                  this.$message({ type: "error", message: "删除失败!" });
                  this.menuLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "删除失败!" });
                this.menuLoading = false;
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
    deleteChapterRelation(chapter) {
      for (let i = 0; i < chapter.predecessor.length; i++) {
        this.$http
          .get("/api/deleteChapterRelation", {
            params: {
              chapterID: chapter.id,
              preChapterID: chapter.predecessor[i]
            },
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })
          .then(
            response => {
              if (response.status === 200) {
                this.getRelation();
              } else {
                this.$message({ type: "error", message: "章节关系删除失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节关系删除失败!" });
              return;
            }
          );
      }
      for (let i = 0; i < chapter.descendant.length; i++) {
        this.$http
          .get("/api/deleteChapterRelation", {
            params: {
              chapterID: chapter.descendant[i],
              preChapterID: chapter.id
            },
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })
          .then(
            response => {
              if (response.status === 200) {
                this.getRelation();
              } else {
                this.$message({ type: "error", message: "章节关系删除失败!" });
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "章节关系删除失败!" });
              return;
            }
          );
      }
    },
    confirmImport() {
      if (typeof this.importSettings !== "number") {
        this.$message({
          type: "warning",
          message: "无法导入章节信息!"
        });
        return;
      }
      this.$confirm("之前的章节信息将被覆盖，确认导入吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.importLoading = true;
          this.$http
            .post(
              "/api/question/copyNodes",
              {
                sourceCourseId: this.importData[this.importSettings].id,
                aimCourseId: this.courseID
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
                  this.$message({
                    type: "success",
                    message: "章节导入成功!"
                  });
                  this.getCatalog();
                  this.importLoading = false;
                  this.importChapterVisible = false;
                } else {
                  this.$message({ type: "error", message: "章节导入失败!" });
                  this.importLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "章节导入失败!" });
                this.importLoading = false;
                return;
              }
            );
        })
        .catch(() => {});
    },
    // point
    deletePoint(item, index) {
      this.$confirm("确认删除此知识点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.menuLoading = true;
          if (index === 0 && index !== item.points.length - 1) {
            this.$http
              .post(
                "/api/alertChapter",
                {
                  id: item.points[index + 1].id,
                  courseID: this.courseID,
                  contentName: item.points[index + 1].name,
                  parentID: item.id,
                  siblingID: 0,
                  content: item.points[index + 1].content
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
                  } else {
                    this.$message({
                      type: "error",
                      message: "知识点删除失败!"
                    });
                    this.submitLoading = false;
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "知识点删除失败!" });
                  this.submitLoading = false;
                  return;
                }
              );
          } else if (index < item.points.length - 1) {
            this.$http
              .post(
                "/api/alertChapter",
                {
                  id: item.points[index + 1].id,
                  courseID: this.courseID,
                  contentName: item.points[index + 1].name,
                  parentID: item.id,
                  siblingID: item.points[index - 1].id,
                  content: item.points[index + 1].content
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
                  } else {
                    this.$message({
                      type: "error",
                      message: "知识点删除失败!"
                    });
                    this.submitLoading = false;
                    return;
                  }
                },
                response => {
                  this.$message({ type: "error", message: "知识点删除失败!" });
                  this.submitLoading = false;
                  return;
                }
              );
          }
          this.$http
            .get("/api/deleteChapter", {
              params: {
                chapterID: item.points[index].id
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
                  this.menuLoading = false;
                  return;
                }
              },
              response => {
                this.$message({ type: "error", message: "删除失败!" });
                this.menuLoading = false;
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
      if (this.newPoint.order <= 0 || this.newPoint.order === "") {
        this.$message({ type: "warning", message: "请正确知识点序号!" });
        return;
      }
      if (this.newPoint.name == undefined || this.newPoint.name === "") {
        this.$message({ type: "warning", message: "请填写知识点名称!" });
        return;
      }
      let sibID = 0;
      if (index > 0) {
        sibID = item1.points[index - 1].id;
      }
      this.menuLoading = true;
      if (item2.new) {
        this.$http
          .post(
            "/api/addChapter",
            {
              courseID: this.courseID,
              contentName:
                item1.order +
                "." +
                this.newPoint.order +
                " " +
                this.newPoint.name,
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
                this.menuLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "知识点添加失败!" });
              this.menuLoading = false;
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
              contentName:
                item1.order +
                "." +
                this.newPoint.order +
                " " +
                this.newPoint.name,
              parentID: item1.id,
              siblingID: sibID,
              content: item2.content
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
                this.menuLoading = false;
                return;
              }
            },
            response => {
              this.$message({ type: "error", message: "知识点编辑失败!" });
              this.menuLoading = false;
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
    this.classID = this.$route.query.classID;
    this.getCatalog();
    this.getCourses();
    bus.$on("reloadCatalog", val => this.getData(val));
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

<style>
.el-submenu > .el-submenu__title {
  width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: start;
}
</style>

<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.exit {
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
}

.vertical-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.router-view {
  width: 100%;
  margin: 0 auto;
  padding-top: 20px;
}

.point-name {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: start;
}
</style>
