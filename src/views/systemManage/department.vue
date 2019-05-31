<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate(0)">新增顶级</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate(1)">新增子级</el-button>
    </div>

    <tree-table highlight-current-row :default-expand-all="true" :data="data" :columns="columns" border @current-change="handleCurrentChange">
      <template slot="operation" slot-scope="{scope}">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope)">删除</el-button>
      </template>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='create'" label="部门等级">
          <el-select v-model="form.deptPid" disabled placeholder="请选择">
            <el-option v-for="item in deptPidBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" />
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="form.deptDescribe" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='update'" label="父级部门">
          <el-input v-model="parentName" disabled />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import { getDepartmentList, editSubmitApi, addSubmitApi, delSubmitApi } from '@/api/department'

export default {
//   name: 'ComplexTable',
  components: { treeTable },
  data() {
    return {
      deptPidBox: [
        { value: 1, label: '顶级' },
        { value: 0, label: '子级' }
      ],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      dialogStatus: '',
      parentName: '',
      form: {
        deptName: '',
        deptId: '',
        deptPid: '',
        label: '',
        deptDescribe: ''
      },
      currentRow: null,
      addDialog: false,
      // currentRow: '',
      data: [],
      columns: [
        {
          label: '',
          key: 'index',
          expand: true,
          width: 130
        },
        {
          label: '部门名称',
          key: 'deptName'
        },
        {
          label: '部门描述',
          key: 'deptDescribe'
        },
        {
          label: '部门ID',
          key: 'deptId'
        },
        {
          label: '操作',
          key: 'operation',
          width: 280
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getDepartmentList().then(response => {
        this.data = response.data.deptList
        console.log(response)
      })
    },
    handleUpdate(scope) {
      // this.form = Object.assign({}, scope.row) // 复制对象
      this.form = {
        deptName: scope.row.deptName,
        deptId: scope.row.deptId,
        deptPid: scope.row.deptPid,
        label: scope.row.label,
        deptDescribe: scope.row.deptDescribe
      }
      this.dialogStatus = 'update'
      this.addDialog = true
      this.parentName = scope.row._parent ? scope.row._parent.deptName : '无'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          editSubmitApi(this.form).then(res => {
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
            this.addDialog = false
          })
        }
      })
    },
    resetForm() {
      this.form = {
        deptName: '',
        deptId: '',
        deptPid: 0,
        label: '',
        deptDescribe: ''
      }
    },
    handleCreate(type) {
      if (type === 0) { // 新增顶级
        this.resetForm()
        this.addDialog = true
        this.dialogStatus = 'create'
        this.form.deptPid = 1
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      } else { // 新增子级
        if (this.currentRow) {
          this.resetForm()
          this.addDialog = true
          this.dialogStatus = 'create'
          this.form.deptPid = 0
          this.$nextTick(() => {
            this.$refs['form'].clearValidate()
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请选择一条数据',
            type: 'warning',
            duration: 3000
          })
        }
      }
    },
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.deptPid === 1) {
            this.form.deptPid = ''
          } else {
            this.form.deptPid = this.currentRow.deptId
          }
          addSubmitApi(this.form).then(res => {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 3000
            })
            this.parentName = ''
            this.currentRow = null
            this.getList()
            this.addDialog = false
          })
        }
      })
    },
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该部门信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitApi(scope.row.deptId).then(res => {
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
    handleCurrentChange(val) {
      console.log(val)
      if (val) {
        this.currentRow = val
      } else {
        this.currentRow = null
      }
    }
  }
}
</script>
