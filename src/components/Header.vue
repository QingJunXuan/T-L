<template>
  <el-row class="container" style="background-color: #292929">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo logo-width">
        <div>
          <div style="display: inline-block;">
            <i class="fa fa-leanpub" aria-hidden="true" style="margin-right: 10px;"></i>
            <span style="letter-spacing:3px; font-weight: bold;">教与学</span>
          </div>
          <div style="color: #fff; display: inline-block;">
            <div class="subhead" style="top: -6px">专业在线教育平台</div>
            <div class="subhead" style="top: 8px;">TEACH AND LEARN</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <div v-show="!isLogin">
          <el-button type="text" style="color: #fff;" @click="showLogin">LOGIN</el-button>
        </div>
        <el-dropdown trigger="hover" v-show="isLogin">
          <span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view :key="activeDate"></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import bus from "../bus.js";
export default {
  data() {
    return {
      sysName: "教与学",
      sysUserName: "",
      reload: false,
      isLogin: false,
      loginVisible: false,
      activeDate: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    //退出登录
    logout: function() {
      this.$confirm("确认退出登录吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          localStorage.removeItem("userID");
          localStorage.removeItem("name");
          localStorage.removeItem("workID");
          localStorage.removeItem("role");
          this.isLogin = false;
          let date = new Date();
          this.activeDate = date.getTime().toString();
          this.$router.push("/");
        })
        .catch(() => {});
    },
    showLogin: function() {
      this.loginVisible = true;
      bus.$emit("loginVisible", this.loginVisible);
    },
    getData(val) {
      this.reload = val;
    }
  },
  mounted() {
    let date = new Date();
    this.activeDate = date.getTime().toString();
    bus.$on("reload", val => this.getData(val));
    let user = localStorage.getItem("name");
    if (user) {
      this.isLogin = true;
      this.sysUserName = user;
    }
  },
  watch: {
    reload(val) {
      if (val === true) {
        let user = localStorage.getItem("name");
        if (user) {
          this.isLogin = true;
          this.sysUserName = user;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
    background-color: #292929;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 30px;
      padding-left: 20px;
      padding-right: 20px;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 200px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
    .subhead {
      font-size: 12px;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC",
        "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-weight: bold;
      position: absolute;
      letter-spacing: 3px;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
