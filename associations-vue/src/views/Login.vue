<template>
  <div class="lowin">
    <div class="lowin-brand">
      <img src="../assets/logo.jpg" alt="logo" />
    </div>
    <div class="lowin-wrapper login" style="min-height: 456px;">
      <div class="lowin-box lowin-login">
        <div class="lowin-box-inner">
          <el-form ref="form" :model="form" :rules="rules">
            <h2 style="text-align: center"><strong>欢迎使用<br/>山西大学商务学院社团管理系统</strong></h2>
            <el-form-item prop="username">
              <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="form.username" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="form.password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="submitForm('form')">
                <span v-if="!loading">登录</span>
                <span v-else>登录中</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <p>
          <!--&copy; -->
          Copyright 2021 by Rui.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      type: 1,
      verifyCode: true,
      rules: {
        username: [{
          required: true,
          message: "请输入账号",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }]
      },
      bodyBgImage: "url(" + require("../assets/login_bg.png") + ")",
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.formRequest(this.$api.login, this.form)
              .then(result => {
                if(result == 'error'){
                  return;
                }
                if(result != undefined && result != ''){
                  setToken(result);
                  this.getRequest(this.$api.userInfo).then(res=>{

                  });
                  this.$router.push('/index');
                }
                /*let path = this.$route.query.redirect;
                this.$router.replace({
                  path: path == "/" || path == undefined ? "/home" : path
                });*/
              })
              .catch(() => {
                this.loading = false;
              }).finally(() => {
                this.loading = false;
              });
        } else {
          //// ""("参数验证不合法");
          this.loading = false;
          return false;
        }
      });
    },

    // 添加body图片
    setBodyBackGround() {
      document.body.style.backgroundImage = this.bodyBgImage;
    },
    // 清除背景图
    clearBodyBackGround() {
      document.body.style.backgroundImage = "";
    }
  },
  mounted() {
    this.setBodyBackGround();
  },
  beforeDestroy() {
    this.clearBodyBackGround();
  }
};
</script>

<style scoped>
.lowin {
  margin: 120px 0 0 0;
  font-family: "Segoe UI";
  font-size: 14px;
}

.lowin-brand {
  overflow: hidden;
  width: 100px;
  height: 100px;
  margin: 0 auto -50px auto;
  border-radius: 50%;
  -webkit-box-shadow: 0 4px 40px rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.07);
  padding: 10px;
  background-color: #fff;
  z-index: 1;
  position: relative;
}

img {
  width: 100%;
}

h2 {
  margin-bottom: 22px;
}

.lowin-wrapper {
  transition: all 1s;
  perspective: 1000px;
  position: relative;
  height: 100%;
  width: 360px;
  margin: 0 auto;
}

.lowin-box {
  width: 100%;
  position: absolute;
  left: 0;
}

.lowin-box-inner {
  background-color: #fff;
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  padding: 60px 25px 25px 25px;
  text-align: left;
  border-radius: 3px;
}

.login .el-form {
  width: 300px;
  margin-top: 20px;
}

.login .el-checkbox {
  margin-bottom: 20px;
}

.login .el-button {
  width: 100%;
}

.login p {
  text-align: center;
  color: #606266;
}
</style>
