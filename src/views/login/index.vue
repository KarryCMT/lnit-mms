<template>
  <div id="Login">
    <div class="login-container">
      <el-form
        :model="form"
        :rules="rules"
        status-icon
        label-position="left"
        label-width="0px"
        ref="form"
        class="demo-ruleForm login-page"
      >
        <h1>
          <a href="#" class="Logo">
            <img src="../../assets/Logo.png" alt />
          </a>
        </h1>
        <!-- <h3 class="title">冷暖IT会员管理系统</h3> -->
        <el-form-item prop="username">
          <el-input type="text" v-model="form.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="submitForm('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login,getUserInfo} from '@/api/login'
export default {
  data() {
    return {
      form: {
          username:'',
          password:''
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
    }
  },
  methods: {
          submitForm(formName){
            this.$refs[formName].validate(valid => {
              if (valid) {
                login(this.form.username,this.form.password).then(response =>{
                  const resp = response.data
                  if (resp.flag) {
                      getUserInfo(resp.data.token).then(response =>{
                        const respUser = response.data
                        if (respUser.flag) {
                          localStorage.setItem('lengnuanit-msm-user',JSON.stringify(respUser.data))
                          localStorage.setItem('lengnuanit-msm-token',resp.data.token)
                          this.$router.push('/')
                        }else{
                           this.$message({
                            message:respUser.message,
                            type:'warning'
                            });
                        }
                      })
                  }else{
                    this.$message({
                      message:resp.message,
                      type:'warning'
                    })
                  }
                })
              }else{
                return false
              }
            })
          }
        }
   }
</script>
<style scoped>
.Logo img {
  display: block;
  margin: 0 auto;
  width: 150px;
}
#Login {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/background.jpg");
  background-size: cover;
}
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.login-page {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  width: 350px;
  height: 310px;
  padding: 35px 35px 15px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
.title {
  text-align: center;
}
</style>  