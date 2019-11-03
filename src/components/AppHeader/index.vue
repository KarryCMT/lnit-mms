<template>
  <div class="header">
    <a href="#/">
      <img src="../../assets/Logo.png" class="logo" alt width="90" />
      <span class="company">冷暖IT会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit-outline" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 弹出修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="350px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item label="原密码" prop="oldPass" style="width:300px">
          <el-input type="password" v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" style="width:300px">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" style="width:300px">
          <el-input v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "@/api/login";
import passwordApi from "@/api/password";
export default {
    mounted(){
  console.log(this.user)
  },
  data() {
    const validateOldPass = (rule, value, callback) => {
        passwordApi.checkPwd(this.user.id,value).then(response =>{
          const resp =response.data
          if (resp.flag) {
            callback()
          }else{
            callback(new Error(resp.message))
          }
        })
    }
    //校验确认密码是否一致
    const validatePass = (rule, value, callback) => {
      if (value!== this.ruleForm.pass) {
        callback(new Error('两次输入的密码不一致'))
      }else{
        //通过
        callback()
      }
    }
    return {
      user:JSON.parse(localStorage.getItem('lengnuanit-msm-user')),
      dialogFormVisible: false,
      ruleForm: {
        oldPass:'',
        pass:'',
        checkPass:'',
      },
      rules: {
        oldPass: [
          { required: true, message: "请输入原密码", trigger: "blur" },
           { validator: validateOldPass, trigger: 'blur' }
          ],
        pass: [
          { required: true, message: "请输入新密码", trigger: "blur" }
          ],
        checkPass: [
          { required: true, message: "请再次输入新密码", trigger: "blur " },
          { validator: validatePass, trigger: 'change' }
        ]
      }
    };
  },

  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //修改密码
          this.handlePwd();
          break;
        case "b":
          //退出系统
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    //退出系统
    handleLogout() {
      logout(localStorage.getItem("lengnuanit-msm-token")).then(response => {
        const resp = response.data;
        if (resp.flag) {
          //退出成功
          //清除本地数据
          localStorage.removeItem("lengnuanit-msm-token"),
            localStorage.removeItem("lengnuanit-msm-user");
          this.$router.push("/login");
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
            duration: 500 //弹出停留时间
          });
        }
      });
    },
    //打开修改密码窗口
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs['ruleForm'].resetFields()
      })
    },
    //修改密码
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('校验成功！')
          passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response => {
            const resp = response.data
            this.$message({
              message:resp.message,
              type:resp.flag ? 'success' : 'warning'
            })
            if (resp.flag) {
              //更新成功 退出系统
              this.handleLogout()
              //关闭窗口
              this.dialogFormVisible = false
            }
          })
        }else{
          return false
        }
      })

    }
  }
};
</script>
<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(43, 58, 75);
}
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: white;
}
</style>
    