<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.deptName" placeholder="部门名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="用户电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-setting" @click="handleRole">设置角色</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-setting" @click="handleDepartment">设置部门</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="userName" align="center" label="用户名" sortable />
      <el-table-column property="phone" align="center" label="电话" sortable />
      <el-table-column property="deptName" align="center" label="所在部门" sortable />
      <el-table-column property="roleName" align="center" label="角色" sortable />
      <el-table-column property="remark" align="center" label="备注" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" status-icon :model="form" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="用户密码" prop="password">
          <el-input v-model="form.password" type="password" :disabled="pswDisabled" :placeholder="pswPlaceholder">
            <el-button slot="append" type="primary" class="choseBtn" icon="el-icon-edit-outline" @click="pswDisabled=!pswDisabled">更改</el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="用户密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'update'" v-show="!pswDisabled" label="确认密码" prop="pswAgain">
          <el-input v-model="form.pswAgain" type="password" />
        </el-form-item>
        <el-form-item v-else label="确认密码" prop="pswAgain">
          <el-input v-model="form.pswAgain" type="password" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="用户备注">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog=false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="roleDialog">
      <el-table :data="roleList" border fit highlight-current-row style="width: 100%" @current-change="handleCurrentRoleChange">
        <el-table-column type="index" align="center" label="序号" width="80" />
        <el-table-column property="roleName" align="center" label="角色名称" sortable />
        <el-table-column property="roleCode" align="center" label="角色码" sortable />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="roleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置部门" :visible.sync="departmentDialog">
      <el-tree ref="tree" style="max-height: 400px;overflow: auto" check-strictly :indent="20" :data="resourceList" show-checkbox default-expand-all node-key="deptId" :default-checked-keys="resourceChecked" @check-change="checkedChange" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="departmentDialog = false">取 消</el-button>
        <el-button type="primary" @click="departmentSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addSubmitApi, editSubmitApi, delSubmitUserApi, getRoleList, roleSubmitApi, getDepartmentTree, setDepartmentSubmitApi } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名称'))
      } else {
        callback()
      }
    }
    var validatePswFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.pswAgain !== '') {
          this.$refs.form.validateField('pswAgain')
        }
        callback()
      }
    }
    var validatePsw = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        validatePswFun(rule, value, callback)
      } else {
        if (!this.pswDisabled) {
          validatePswFun(rule, value, callback)
        } else {
          this.form.password = ''
          callback()
        }
      }
    }
    var validatePswAgainFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePswAgain = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        validatePswAgainFun(rule, value, callback)
      } else {
        if (!this.pswDisabled) {
          validatePswAgainFun(rule, value, callback)
        } else {
          callback()
        }
      }
    }
    return {
      pswPlaceholder: '******',
      pswDisabled: true,

      roleDialog: false,
      departmentDialog: false,
      resourceList: null,
      resourceChecked: [],
      currentRowUserId: null,
      currentRowRoleId: null,
      addDialog: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      form: {
        userName: '',
        password: '',
        pswAgain: '',
        phone: '',
        remark: '',
        userId: ''
      },
      rules: {
        userName: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        password: [{ required: true, validator: validatePsw, trigger: 'blur' }],
        pswAgain: [{ required: true, validator: validatePswAgain, trigger: 'blur' }]
      },

      total: 0,
      listQuery: {
        userName: '',
        deptName: '',
        phone: '',
        roleName: '',
        current: 1,
        size: 20
      },

      roleList: null,
      list: null,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkedChange(e) {
      const onlyOne = this.$refs.tree.getCheckedKeys()
      if (onlyOne.length > 1) {
        onlyOne.shift()
        this.$refs.tree.setCheckedKeys([e.deptId])
      }
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.data.total
        console.log(res)
      })
    },
    validateSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
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
    resetForm() { // 重置表单
      this.form = {
        userName: '',
        password: '',
        pswAgain: '',
        phone: '',
        remark: '',
        userId: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.addDialog = true
      this.dialogStatus = 'create'
      this.$nextTick(() => { // 清除表单验证
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(scope) {
      this.pswDisabled = true
      this.form = {
        userName: scope.row.userName,
        password: '',
        pswAgain: '',
        phone: scope.row.phone,
        remark: scope.row.remark,
        userId: scope.row.userId
      }
      this.dialogStatus = 'update'
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 删除
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitUserApi(scope.row.userId).then(res => {
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
    // 搜索
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '电话', '所在部门', '角色', '备注']
        const filterVal = ['userName', 'phone', 'deptName', 'roleName', 'remark']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏管理平台用户信息'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 设置角色
    handleRole() {
      if (this.currentRowUserId) {
        getRoleList().then(res => {
          console.log(res)
          this.roleList = res.data.roleList
        })
        this.roleDialog = true
      } else {
        this.$notify({
          title: '提示',
          message: '请选择一条数据',
          type: 'warning',
          duration: 3000
        })
      }
    },
    roleSubmit() {
      if (this.currentRowRoleId) {
        roleSubmitApi({ roleId: this.currentRowRoleId, userId: this.currentRowUserId }).then(res => {
          this.roleDialog = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 3000
          })
        })
      } else {
        this.$notify({
          title: '提示',
          message: '请选择一条数据',
          type: 'warning',
          duration: 3000
        })
      }
    },
    handleCurrentRoleChange(val) {
      console.log(val)
      if (val) {
        this.currentRowRoleId = val.roleId
      } else {
        this.currentRowRoleId = null
      }
      console.log(this.currentRowRoleId)
    },
    // 设置部门
    handleDepartment() {
      console.log(this.currentRowUserId)
      if (this.currentRowUserId) {
        getDepartmentTree(this.currentRowUserId).then(res => {
          console.log(res)
          this.resourceList = res.data.deptList
          this.resourceChecked = res.data.UserDeptOpt
          console.log(this.resourceChecked)
        })
        this.departmentDialog = true
      } else {
        this.$notify({
          title: '提示',
          message: '请选择一条数据',
          type: 'warning',
          duration: 3000
        })
      }
    },
    departmentSubmit() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      if (checkedKeys && checkedKeys.length > 0) {
        const submitData = {
          deptId: checkedKeys[0],
          userId: this.currentRowUserId
        }
        setDepartmentSubmitApi(submitData).then(res => {
          this.departmentDialog = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 3000
          })
        })
      } else {
        this.$notify({
          title: '提示',
          message: '请选择一条数据',
          type: 'warning',
          duration: 3000
        })
      }
    },
    // 用户表格选择事件
    handleCurrentChange(val) {
      console.log(val)
      if (val) {
        this.currentRowUserId = val.userId
      } else {
        this.currentRowUserId = null
      }
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
