<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" :data="goodsList">
        <el-col :span="8" class="styLe">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="gitGoodList"
            v-model="querInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="gitGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="appCode">添加用户</el-button>
        </el-col>

        <!-- 商品列表 -->
        <el-table :data="goodsList" border stripe>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="95px">
          </el-table-column>
          <el-table-column
            label="商品重量"
            prop="goods_weight"
            width="95px"
          ></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="140px">
            <template slot-scope="scope">
              {{ scope.row.add_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 用户列表区域 -->

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
    };
  },
  created() {
    this.gitGoodList();
  },
  methods: {
    async gitGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }

      console.log(res.data);
      this.goodsList = res.data.goods;
      console.log(this.goodsList);
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.gitGoodList();
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.gitGoodList();
    },
    // 删除用户
    async removeUserById(id) {
      // 弹框询问用户是否删除数据

      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("goods/" + id);

      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }

      this.$message.success("删除用户成功！");

      this.gitGoodList();
    },

    // 路由跳转
    appCode() {
      this.$router.push("/goods/Add");
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 60px !important;
}
.styLe {
  padding-left: 0 !important;
}
</style>