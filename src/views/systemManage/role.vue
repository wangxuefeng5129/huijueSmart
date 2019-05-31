<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="roleName" align="center" label="角色名称" sortable />
      <el-table-column property="roleDescript" align="center" label="角色描述" sortable />
      <el-table-column property="roleCode" align="center" label="角色标识" sortable />
      <el-table-column property="roleId" align="center" label="角色ID" sortable />
      <el-table-column label="操作" width="340" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
          <el-button type="success" size="mini" icon="el-icon-setting" @click="setResource2Role(scope)">设置资源</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" status-icon :model="form" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDescript" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="form.roleCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置资源" :visible.sync="setResourceDialog">
      <el-tree ref="tree" style="max-height: 400px;overflow: auto" check-strictly :indent="20" :data="resourceList" show-checkbox default-expand-all node-key="permissionId" :default-checked-keys="resourceChecked" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="setResourceDialog=false">取 消</el-button>
        <el-button type="primary" @click="setResourceSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addSubmitApi, editSubmitApi, delSubmitRoleApi, getRolePermissionTree, setResourceSubmitApi } from '@/api/roleManage'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    return {
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      resourceChecked: [],
      setResourceDialog: false,
      addDialog: false,
      dialogStatus: '',
      form: {
        roleCode: '',
        roleId: '',
        roleDescript: '',
        roleName: ''
      },

      total: 0,
      listQuery: {
        roleName: '',
        current: 1,
        size: 20
      },

      currentRoleId: '',
      resourceList: null,
      list: null,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.data.total
        console.log(res)
      })
    },
    createData() { // 新增
      this.$refs.form.validate(valid => {
        if (valid) {
          addSubmitApi(this.form).then(res => {
            this.addDialog = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
            console.log(res)
          })
        }
      })
    },
    updateData() { // 编辑
      this.$refs.form.validate(valid => {
        if (valid) {
          editSubmitApi(this.form).then(res => {
            this.addDialog = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
            console.log(res)
          })
        }
      })
    },
    resetForm() { // 重置
      this.form = {
        roleCode: '',
        roleId: '',
        roleDescript: '',
        roleName: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.addDialog = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(scope) {
      this.form = Object.assign({}, scope.row) // 复制对象
      this.dialogStatus = 'update'
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 删除
    handleDelete(scope) {
      console.log(scope)
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitRoleApi(scope.row.roleId).then(res => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
        })
      })
    },
    // 设置资源
    setResource2Role(scope) {
      this.currentRoleId = scope.row.roleId
      getRolePermissionTree(scope.row.roleId).then(res => {
        console.log(res)
        this.resourceList = res.data.permissionList
        this.resourceChecked = res.data.selectList
        console.log(this.resourceChecked)
      })
      this.setResourceDialog = true
    },
    // 处理为tree树形结构
    // filterResourceList(data) {
    //   const treeResourceList = []
    //   data.forEach(e => {
    //     const treeResource = {
    //       id: e.permissionId,
    //       label: e.titleCh,
    //       children: this.validatenull(e.children) ? [] : this.filterResourceList(e.children, true)
    //     }
    //     treeResourceList.push(treeResource)
    //   })
    //   return treeResourceList
    // },
    // validatenull(children) {
    //   if (children && children.length > 0) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    setResourceSubmit() {
      const halfCheck = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      checkedKeys.push(...halfCheck)
      console.log(halfCheck)
      console.log(checkedKeys.join(','))
      const submitData = {
        permissionIds: checkedKeys.join(','),
        roleId: this.currentRoleId
      }
      setResourceSubmitApi(submitData).then(res => {
        this.setResourceDialog = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '设置成功',
          type: 'success',
          duration: 3000
        })
      })
    },

    handleDownload() { // 导出excel
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['角色名称', '角色描述', '角色标识', '角色ID']
        const filterVal = ['roleName', 'roleDescript', 'roleCode', 'roleId']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏智能设备管理平台角色信息'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
