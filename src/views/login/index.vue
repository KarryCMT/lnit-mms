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
        <h3 class="title">冷暖IT会员管理系统</h3>
        <el-form-item prop="username">
          <el-input type="text" v-model="form.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="submitForm('form')" >登录</el-button>
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            //提交表单给后台进行验证是否正确
            login(this.form.username,this.form.password).then(response => {
                const resp = response.data
                console.log(resp,resp.flag)
                if(resp.flag){
                    //验证成功，通过token去获取用户信息
                    getUserInfo(resp.data.token)
                    const respUser = response.data
                    if(respUser.flag){
                        //获取到了用户的数据
                        console.log('userInfo',respUser.data)
                        // 1.保存token，用户信息
                        localStorage.setItem('lengnuanit-msm-user',JSON.stringify(respUser.data))
                        localStorage.setItem('lengnuanit-msm-token',resp.data.token)
                        // 2.前往首页
                        this.$router.push('/')
                    }else{
                        // 未通过,弹出警告
                        this.$message({
                        message: respUser.message,
                        type: 'warning'
                    });
                    }
                } 
            })
          }else{
           
            // alert(resp.message)
             
          } 
        })
        } 
      }
   }
</script>
<style scoped>
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
  background: #fff;
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
    