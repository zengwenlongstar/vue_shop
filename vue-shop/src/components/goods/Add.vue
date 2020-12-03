<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps
        :active="activeindex - 0"
        finish-status="success"
        :space="200"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="图片"></el-step>
      </el-steps>

      <!-- table栏 -->
      <el-form
        :model="addFrom"
        label-width="100px"
        label-position="top"
        :rules="addFromRules"
        ref="addFromRef"
      >
        <el-tabs
          v-model="activeindex"
          :tab-position="tabPosition"
          style="height: 200px"
        >
          <el-tab-pane label="商品信息" name="0">
            <el-form label="商品名称" name="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">用户管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">配置管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">角色管理</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeindex: "0",
      tabPosition: "left",
      cateList: [],
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      addFrom: {
        goods_name: "",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      }
      console.log(res.data);
      this.cateList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>

