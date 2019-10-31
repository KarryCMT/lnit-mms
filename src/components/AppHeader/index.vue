<template>
  <div class="header">
    <a href="#/">
      <img src="../../assets/Logo.png" class="logo" alt width="90" />
      <span class="company">冷暖IT会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand"> 
      <span class="el-dropdown-link">
        admin<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit-outline" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {logout} from '@/api/login'
export default {
    methods:{
         handleCommand(command){
             switch (command) {
               case 'a':
                 //修改密码
                 this.$message(`点击修改密码`)
                 break;
               case 'b':
                 //退出系统
                
                 logout(localStorage.getItem('lengnuanit-msm-token')).then(response =>{
                   const resp = response.data
                   if(resp.flag){
                     //退出成功
                     //清除本地数据
                     localStorage.removeItem('lengnuanit-msm-token'),
                     localStorage.removeItem('lengnuanit-msm-user')
                     this.$router.push('/login')
                   }else{
                     this.$message({
                       message:resp.message,
                       type:'warning',
                       duration:500 //弹出停留时间
                     })
                   }
                 })
                  break;
               default:
                  break;
             }
         }
    }
}
</script>
<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(43,58,75);
}
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown{
    float: right;
    margin-right: 40px;
}
.el-dropdown-link{
    color: white;
}
</style>
    