<template>
  <div>
    <!-- 条件查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus-outline">新增</el-button>
        <el-button @click="resetForm('searchForm')" icon="el-icon-remove-outline">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="500" border style="width: 100%">
      <el-table-column type="index" label="序号" ></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryData" label="入职时间"></el-table-column>
      <el-table-column prop label="操作">
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
    <el-dialog title="新增员工" :visible.sync="dialogFormVisible" width="450px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="80px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryData">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="pojo.entryData"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
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
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: 0,
        entryData: "",
      }, //条件查询绑定的条件值
      dialogFormVisible: false, //控制对话框
      pojo: {
        id: null,
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: 0,
        entryData: "",
      }, //提交的数据
      rules: {
        //校验规则
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        age: [
          { required: true, message: "年龄不能为空", trigger: "change " }
        ]
      }
    };
  },
   created() {
      // 初始化获取列表数据
      this.fetchData();
    },
  methods: {
    fetchData() {
      // memberApi.getList().then(response => {
      // 调用分页查询数据
      staffApi
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
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(formName) {
      // 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效
      this.$refs[formName].resetFields();
    },
    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.update(this.pojo).then(response => {
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
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          staffApi.add(this.pojo).then(response => {
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
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("是否删除此条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          console.log("确认");
          staffApi.delete(id).then(response => {
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
  }
};
</script>