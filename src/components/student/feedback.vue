<template>
  <el-row>
    <el-row class="head">
      <el-col :span="2" style="padding-top:20px">
        <i class="el-icon-back" @click="feedbackBack"></i>
        <span style="cursor: pointer" @click="feedbackBack">返回</span>
      </el-col>
    </el-row>
    <el-row style="padding-top:50px">
      <el-col :span="14" :offset="5">
        <el-row>
          <p>本学期已经结束啦，对课程进行一下评分和评价吧~</p>
          <el-row style="padding-bottom:20px">
            <el-col :span="2" :offset="9">
              <span style="font-size:13px">评分：</span>
            </el-col>
            <el-col :span="4">
              <el-rate
                v-model="rate"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :allow-half="half"
              ></el-rate>
            </el-col>
          </el-row>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入"
            :autosize="{ minRows: 6, maxRows: 10}"
            v-model="textarea"
          ></el-input>
        </el-row>
        <el-row style="padding-top:20px">
          <el-col :span="2" :offset="22">
            <el-button size="mini" @click="submit">提交</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import bus from "../../bus.js";
export default {
  name: "feedback",
  data() {
    return {
      courseClassID: 0,
      rate: null,
      textarea: "",
      half: false
    };
  },
  methods: {
    feedbackBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    submit() {
      const routerParams = this.$route.query.courseClassID;
      this.courseClassID = routerParams;
      var params = new URLSearchParams();
      params.append("courseClassID", this.courseClassID);
      params.append("studentID", localStorage.getItem("userID"));
      params.append("comment", this.textarea);
      params.append("rate", this.rate);
      this.$axios
        .post("http://10.60.38.173:8765/addClassComment", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(resp => {
          if (resp.data.state == 1) {
            this.$message("提交成功");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
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
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>

<style>
.head {
  height: 60px;
  background-color: #292929;
  color: #fff;
  font-size: 17px;
  font-weight: 700px;
  font-family: "Courier New", Courier, monospace;
}
</style>

