<template>
  <div>
    <!-- 条件查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重置会看el-form-item组件元素prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          v-model="searchMap.supplierName"
          @click.native="dialogSupplierVisible = true"
          readonly
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus-outline">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()" icon="el-icon-remove-outline">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="485" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column prop label="操作" width="160px">
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
    <!-- 选择供应商对话框 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <!-- 引入supplier子组件 -->
      <Supplier @option-supplier="optionSupplier" :isDialog="true"></Supplier>
    </el-dialog>
    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="80px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            readonly
            @click.native="editOptionSupplier"
            v-model="pojo.supplierName"
            placeholder="选择供应商"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  //注册supplier为子组件
  components: { Supplier },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogSupplierVisible: false, //控制供应商对话框
      dialogFormVisible: false,
      pojo: {
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId: null
      }, //提交的数据
      isEdit: false,
      rules: {
        //校验规则
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
        spec: [
          { required: true, message: "商品规格不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const data = response.data.data;
          this.list = data.rows;
          this.total = data.total;
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
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.pojo.supplierName = currentRow.name;
        this.pojo.supplierId = currentRow.id;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.id = currentRow.id;
      }
      this.isEdit = false;
      this.dialogSupplierVisible = false;
    },
    handleAdd() {
      console.log("重置了！");
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //弹出窗口打开之后需要加载Dom
        this.$refs["pojoForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          goodsApi.add(this.pojo).then(response => {
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
    editOptionSupplier() {
      this.isEdit = true;
      this.dialogSupplierVisible = true;
    },
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd();
      goodsApi.getById(id).then(response => {
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
          goodsApi.delete(id).then(response => {
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
    updateData(formName) {
      goodsApi.update(this.pojo).then(response => {
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
  }
};
</script>
      