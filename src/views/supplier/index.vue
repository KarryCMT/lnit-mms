<template>
  <div>
    <!-- 条件查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button
          type="success"
          @click="handleAdd"
          icon="el-icon-circle-plus-outline"
          v-if="!isDialog"
        >新增</el-button>
        <el-button
          @click="resetForm('searchForm')"
          icon="el-icon-remove-outline"
          v-if="!isDialog"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table 
    :highlight-current-row="isDialog" @current-change="clickCurrentChange" :data="list" height="485" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" v-if="!isDialog" label="联系电话"></el-table-column>
      <el-table-column prop="remark" v-if="!isDialog" label="备注" width="500px"></el-table-column>
      <el-table-column prop label="操作" v-if="!isDialog" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <!-- 新增窗口 -->
    <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="450px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="80px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系号码" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" type="textarea"></el-input>
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
import supplierApi from "@/api/supplier";
export default {
  props: {
    //通过父组件传递数据，通过isDialog来判断 是否弹窗
    //如果为true则是弹窗，如果为false则是列表
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      dialogFormVisible: false, //控制对话框
      pojo: {
        id: null,
        name: "",
        mobile: "",
        remark: "",
        linkman: ""
      }, //提交的数据
      rules: {
        //校验规则
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
    },
  created() {
    this.fetchData();
    },
  methods: {
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const data = response.data.data;
          this.list = data.rows;
          this.total = data.total;
        });
    },
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
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
          supplierApi.delete(id).then(response => {
            const resp = response.data;
            console.log(resp);
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
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
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后，被触发，val是最新的每页显示条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleAdd() {
      console.log("重置了！");
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //弹出窗口打开之后需要加载Dom
        this.$refs["pojoForm"].resetFields();
      });
    },
    resetForm(formName) {
      // 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效
      this.$refs[formName].resetFields();
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          supplierApi.add(this.pojo).then(response => {
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
    updateData(formName) {
      supplierApi.update(this.pojo).then(response => {
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
    },
    clickCurrentChange(currentRow){
      this.$emit('option-supplier',currentRow)
    }
  }
};
</script>
<style scoped>
.demo-form-inline {
  margin-top: 10px;
}
</style>