<template>
  <div class="navbar">
    <el-menu
      :router="ture"
      default-active="/"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-s-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data: {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
};
</script>
<style scoped>
.navbar{
    position: absolute;
    width: 230px;
    top: 50px;
    left: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: #53c;
}
.Logo{
      width: 190px;
      height: 150px;
}
.Logo img{
      display: block;
      width: 150px;
      padding-left: 20px;
      padding-top: 30px;
}
.el-menu-vertical-demo{
      position: absolute;
      top: 0;
      width: 229px;
      height: 671px;
}
.el-menu{
  border-right: none;
}
</style>
      