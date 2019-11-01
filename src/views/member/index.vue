<template>
  <div>
    <!-- 条件查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <!-- 不要忘记payTypeOptions绑定到data中 -->
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-col :span="14">
          <!-- value-format是指定绑定值的格式 -->
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="searchMap.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item style="margin-left:-100px;">
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus-outline">新增</el-button>
        <el-button @click="resetForm('searchForm')" icon="el-icon-remove-outline">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="500" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="170"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="140"></el-table-column>
      <el-table-column prop="phone" label="电话号码" width="130"></el-table-column>
      <el-table-column prop="integral" label="可用积分" width="80"></el-table-column>
      <el-table-column prop="money" label="余额" width="90"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="210"></el-table-column>
      <el-table-column prop label="操作" width="256">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹出新增窗口 -->
    <el-dialog title="新增会员" :visible.sync="dialogFormVisible" width="450px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="80px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="pojo.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <!-- 不要忘记payTypeOptions绑定到data中 -->
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import memberApi from "@/api/member";
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, //条件查询绑定的条件值
      payTypeOptions,
      dialogFormVisible: false, //控制对话框
      pojo: {
        id: null,
        cardNum: "",
        payType: "",
        birthday: "",
        phone: "",
        money: 0,
        integral: 0,
        address: ""
      }, //提交的数据
      rules: {
        //校验规则
        cardNum: [
          { required: true, message: "会员卡号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "会员姓名不能为空", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change " }
        ]
      }
    };
  },
  created() {
    // 初始化获取列表数据
    this.fetchData();
  },
  methods: {
    // 当每页显示条数改变后，被触发，val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后，被触发，val是最新的每页显示条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //重置
    resetForm(formName) {
      // 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效
      this.$refs[formName].resetFields();
    },
    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    fetchData() {
      // memberApi.getList().then(response => {
      // 调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          // this.list = resp.data
          // this.total = resp.data.total
          // console.log(resp.data.rows)
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    //提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              //失败 提示
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //弹出新增窗口
    handleAdd() {
      console.log("重置了！");
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //弹出窗口打开之后需要加载Dom
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd();
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("是否删除此条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          console.log("确认");
          memberApi.delete(id).then(response => {
            const resp = response.data
            console.log(resp);
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            });
            if (resp.flag) {
              //删除成功，刷新列表数据
              this.fetchData();
            }
          });
        })
        .catch(() => {
          console.log("取消");
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  },

  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>
<style scoped>
.el-form {
  margin-top: 9px;
}
.el-table {
  margin-top: -13px;
}
.el-button {
  width: 100px;
}
.dialog-footer {
  margin: -40px 95px 0 0;
}
.el-dialog__body {
  padding: 15px 20px;
}
</style>