<template>
  <div>
    <el-table :data="list" height="550" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="170"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="140"></el-table-column>
      <el-table-column prop="phone" label="电话号码" width="130"></el-table-column>
      <el-table-column prop="integral" label="可用积分" width="80"></el-table-column>
      <el-table-column prop="money" label="余额" width="90"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="80"></el-table-column>
      <el-table-column prop="address" label="个人地址" width="210"></el-table-column>
      <el-table-column prop label="操作" width="256">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>
<script>
import memberApi from "@/api/member";
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    // 初始化获取列表数据
    this.fetchData();
  },
  methods: {
    fetchData() {
      memberApi.getList().then(response => {
        const resp = response.data;
        this.list = resp.data;
        console.log(resp);
      });
    }
  }
};
</script>
<style scoped>
.el-table {
  margin-top: 5px;
}
.el-button {
  width: 100px;
}
</style>