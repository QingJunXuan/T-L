<template>
  <div>
    <div class="banner">
      <div>
        <div class="banner-text">
          <div  id="top" class="callbacks_container">
            <div style="display: inline-block">
              <h6>中国领先的在线教育平台</h6>
              <h3>教与学平台</h3>
              <div v-if="!getUser()">
                <el-button @click="loginTableVisible = true">JOIN US!</el-button>
              </div>
              <div v-else>
                <el-button @click="$router.push('/student')">学生主页</el-button>
                <el-button @click="$router.push('/teacher')" style="margin-left: 10px">教师主页</el-button>
                <el-button @click="$router.push('/adminManage')" style="margin-left: 10px">管理员主页</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="loginTableVisible" width="500px" :center="true">
      <div style="padding: 10px 70px 10px 70px">
        <h2>LOGIN</h2>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" style="margin-top: 25px">
          <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <div style="width:100%;" align="center">
            <el-button type="primary" class="form-button" @click="handleLogin" :loading="logining">登录</el-button>
          </div>
          <div style="width:100%;" align="center">
            <el-button type="text" class="form-text-button" @click="showRegister">注册账号</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="registerTableVisible" width="900px" :center="true">
      <div style="padding: 10px 70px 10px 70px">
        <h2>REGISTER</h2>
        <el-form :model="ruleForm1" :rules="rules1" status-icon ref="ruleForm1" label-position="left" label-width="80px" style="margin: 50px auto;">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item prop="email" label="邮箱">
                <el-input type="text" v-model="ruleForm1.email">
                  <el-button slot="append">发送验证码</el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="validCode" label="验证码">
                <el-input type="text" v-model="ruleForm1.validCode"></el-input>
              </el-form-item>
              <el-form-item prop="name" label="姓名">
                <el-input type="text" v-model="ruleForm1.name"></el-input>
              </el-form-item>
              <el-form-item prop="number" label="学工号">
                <el-input type="text" v-model="ruleForm1.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="gender" label="性别">
                <el-select v-model="ruleForm1.gender" style='width: 100%'>
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="auth" label="身份">
                <el-select v-model="ruleForm1.auth" style='width: 100%'>
                  <el-option
                    v-for="item in authOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="ruleForm1.password"></el-input>
              </el-form-item>
              <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="ruleForm1.repassword"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div align="center">
            <el-button type="primary" class="form-button" style="width: 40%" @click="handleRegister" :loading="registering">注册</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import bus from '../bus.js'
    export default {
      name: "Home",
      data() {
        // 验证密码合法性
        let passwordValidity = (rule, value, callback) =>{
          // Evan: 这里设定密码的规则，value值是输入框中的值
          // 密码必须含有字母和数字，长度为6-18位
          let myReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
          if(!value){
            return callback(new Error('请输入密码'));
          }else if(!myReg.test(value)){
            return callback(new Error('包含字母和数字，且不小于6位'));
          }else{
            return callback();
          }
        };
        // 验证再次输入密码是否与原值相同
        let repasswordValidity = (rule, value, callback) =>{
          let myReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
          if(!value){
            return callback(new Error('请再次输入密码以确认'));
          }
          if(value !== this.ruleForm1.password){
            return callback(new Error('两次输入的密码不一致'));
          }else if(!myReg.test(value)){
            return callback(new Error('包含大写字母和数字，且不小于6位'));
          }else{
            callback();
          }
        };
        // 验证邮箱输入的合法性
        let emailValidity = (rule, value, callback) =>{
          var atPos=value.indexOf('@');
          var dotPos=value.indexOf('.');
          var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
          if(!value){
            return callback(new Error('请输入电子邮箱'));
          }else if(!myReg.test(value)){
            return callback(new Error('邮箱格式错误'));
          }else{
            return callback();
          }
        };
        return {
          logining: false,
          loginTableVisible: false,
          registerTableVisible: false,
          ruleForm: {
            account: '',
            password: ''
          },
          rules: {
            account: [
              {required: true, message: '请输入账号', trigger: 'blur'},
            ],
            password: [
              {required: true, message: '请输入密码', trigger: 'blur'},
            ]
          },
          registering: false,
          ruleForm1: {
            email: '',
            name: '',
            gender: '男',
            auth: '学生',
            number: '',
            password: '',
            repassword: '',
            validCode: '',
            imgUrl: '',
          },
          genderOptions:[
            {value:'男', label:'男'},
            {value:'女', label:'女'}
          ],
          authOptions:[{
            value:'学生',
            label:'学生'
          },{
            value:'老师',
            label:'老师'
          }],
          rules1: {
            email:[
              { required: true, validator: emailValidity, trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            number:[
              { required: true, message: '请输入学号', trigger:'blur'}
            ],
            gender: [
              { required: true, message: '请选择性别', trigger:'blur'}
            ],
            auth: [
              { required: true, message: '请选择身份', trigger:'blur'}
            ],
            password:[
              { required: true, validator: passwordValidity, trigger: 'blur' }
            ],
            repassword:[
              { required: true, validator: repasswordValidity, trigger: 'blur' }
            ],
            validCode: [
              { required: false, message: '请输入验证码', trigger:'blur'}
            ]
          },
          validity:{
            email: false,
            name: false,
            gender: false,
            auth: false,
            number: false,
            password: false,
            repassword: false,
            imgUrl: false,
          }
        };
      },
      methods: {
        getUser() {
          return localStorage.getItem('username');
        },
        handleLogin(ev) {
          this.$refs.ruleForm.validate((valid) => {
            let that = this;
            if (valid) {
              that.logining = true;
              that.$http.post('/api/auth', {
                username: this.ruleForm.account,
                password: this.ruleForm.password
              }, {emulateJSON:false}).then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', this.ruleForm.account);
                that.logining = false;
                that.$notify({
                  title: '登录成功',
                  message: '页面即将跳转',
                  type: 'success',
                  duration: 2000
                });
                this.loginTableVisible = false;
                setTimeout(function () {
                  location.reload();
                  //TODO: 根据身份跳转
                }, 2000)
              }, response => {
                console.log('登录失败：', response);
                that.logining = false;
                that.$notify.error({
                  title: '登录失败',
                  message: '用户名密码不匹配或网络错误',
                  duration: 2000
                });
              });
            }
          });
        },
        handleRegister(ev) {
          this.$refs.ruleForm1.validate((valid) => {
            let that = this;
            if (valid) {
              that.registering = true;
              that.$http.post('/api/register', {
                mail: this.ruleForm1.email,
                password: this.ruleForm1.password,
                name: this.ruleForm1.name,
                workID: this.ruleForm1.number,
                role: this.ruleForm1.auth,
                gender: this.ruleForm1.gender
              }).then(response => {
                that.registering = false;
                that.$notify({
                  title: '注册成功',
                  message: '进入登录页面',
                  type: 'success',
                  duration: 2000
                });
                this.showLogin();
              }, response => {
                console.log('注册失败：', response);
                that.registering = false;
                that.$notify.error({
                  title: '注册失败',
                  message: '网络错误',
                  duration: 2000
                });
              });
            }
          });
        },
        showRegister() {
          this.loginTableVisible = false;
          this.registerTableVisible = true;
        },
        showLogin() {
          this.registerTableVisible = false;
          this.loginTableVisible = true;
        },
        getData(val) {
          this.loginTableVisible = val;
        }
      },
      created () {
        bus.$on('loginVisible', (val) => this.getData(val));
      }
    }
</script>

<style scoped>

  .banner {
    background:url(../assets/banner.jpg)no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 720px;
  }
  .banner-text {
    text-align:left;
  }
  .banner-text h6 {
    font-size: 2.3em;
    color: #fff;
    margin: 6em 0 0.5em 5em;
    font-weight: 600;
    letter-spacing: 8px;
    display: inline-block;
    border-bottom:1px solid #01edc9;
  }
  .banner-text h3 {
    font-size: 5em;
    color: #fff;
    margin: 10px 0 0.5em 2.2em;
    font-weight: 600;
    letter-spacing: 10px;
    text-transform: uppercase;
  }
  .banner-text h3 span {
    display: block;
    font-size: 2em;
  }

  .banner-text button {
    position: relative;
    left: 180px;
    letter-spacing: 4px;
    width: 200px;
    background-color: #01edc9;
    border-color: #01edc9;
    color: #fff;
    font-weight: bold;
  }

  .callbacks_container {
    /*-- agileits --*/
    width: 100%;
  }

  .form-button {
    width:100%;
    margin-top: 20px;
    letter-spacing: 15px;
    text-indent: 15px;
    background-color: #01edc9;
    border-color: #01edc9;
    color: #fff;
    font-weight: 900;
    font-family: 黑体;
  }

  .form-text-button {
    width:100%;
    margin-top: 10px;
    color: #8A8A8A;
    font-weight: 900;
    font-family: 黑体;
  }
</style>
