<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色列表区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">角色列表</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcener']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcener']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的代码框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形组件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightslist: [],

      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) this.$message.error("获取成功！");
      this.roleList = res.data;
    },
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        "请问是否要删除该权限",
        "删除提示",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色权限失败");
      }
      console.log(role.children);
      role.children = res.data;
    },

    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightslist = res.data;
      console.log(this.rightslist);
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
      console.log(this.defkeys);
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    setRightDialogClose() {
      this.defKeys = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const jion = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: jion }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getUserList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>