<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate(0)">新增顶级</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate(1)">新增子级</el-button>
    </div>

    <tree-table :default-expand-all="true" :data="data" :columns="columns" border highlight-current-row @current-change="handleCurrentChange">
      <template slot="type" slot-scope="{scope}">
        <el-button v-if="scope.row.permissionType===0" disabled type="primary" size="mini" icon="el-icon-menu">列表</el-button>
        <el-button v-if="scope.row.permissionType===1" disabled type="success" size="mini" icon="el-icon-tickets">菜单</el-button>
        <el-button v-if="scope.row.permissionType===2" disabled size="mini" icon="el-icon-edit-outline">按钮</el-button>
      </template>
      <template slot="alwaysShow" slot-scope="{scope}">
        <span v-if="scope.row.alwaysShow===1" style="color:#337ab7;">{{ scope.row.alwaysShow | showStatusFilter }}</span>
        <span v-else style="color:#ff4949;">{{ scope.row.alwaysShow | showStatusFilter }}</span>
      </template>
      <template slot="noCache" slot-scope="{scope}">
        <span v-if="scope.row.noCache===1" style="color:#337ab7;">{{ scope.row.noCache | cacheStatusFilter }}</span>
        <span v-else style="color:#ff4949;">{{ scope.row.noCache | cacheStatusFilter }}</span>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope)">编辑</el-button>
        <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="handleCreate(scope)">新增</el-button> -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope)">删除</el-button>
      </template>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='create'" label="路由等级">
          <el-select v-model="form.permissionPid" disabled placeholder="请选择">
            <el-option v-for="item in permissionPidBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="始终显示">
          <el-select v-model="form.alwaysShow" placeholder="请选择">
            <el-option v-for="item in alwaysShowBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限码">
          <el-input v-model="form.buttonCode" />
        </el-form-item>
        <el-form-item label="component">
          <el-input v-model="form.component" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="页面缓存">
          <el-select v-model="form.noCache" placeholder="请选择">
            <el-option v-for="item in noCacheBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="form.permissionType" placeholder="请选择">
            <el-option v-for="item in permissionTypeBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="titleKey" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="permissionName">
          <el-input v-model="form.permissionName" />
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
import { getMenuList, editSubmitApi, addSubmitApi, delSubmitApi } from '@/api/menu'

export default {
  // name: 'ComplexTable',
  components: { treeTable },
  filters: {
    showStatusFilter(status) {
      if (status === 0) {
        return '否'
      } else {
        return '是'
      }
    },
    cacheStatusFilter(status) {
      if (status === 0) {
        return '不缓存'
      } else {
        return '缓存'
      }
    }
  },
  data() {
    return {
      permissionPidBox: [
        { value: 1, label: '父级' },
        { value: 0, label: '子级' }
      ],
      alwaysShowBox: [
        { value: 1, label: '是' },
        { value: 0, label: '否' }
      ],
      noCacheBox: [
        { value: 1, label: '缓存' },
        { value: 0, label: '不缓存' }
      ],
      permissionTypeBox: [
        { value: 0, label: '列表' },
        { value: 1, label: '菜单' },
        { value: 2, label: '按钮' }
      ],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      rules: {
        title: [{ required: true, message: '请输入名称KEY值', trigger: 'blur' }],
        permissionName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      form: {
        alwaysShow: '',
        buttonCode: '',
        component: '',
        icon: '',
        noCache: '',
        path: '',
        permissionType: '',
        title: '',
        titleCh: '',
        permissionId: '',
        permissionName: '',
        permissionPid: ''
      },
      addDialog: false,
      currentRow: null,
      data: [],
      columns: [
        {
          label: '',
          key: 'index',
          expand: true,
          width: 130
        },
        {
          label: '类型',
          key: 'type',
          expand: true,
          width: 100
        },
        {
          label: '菜单名称',
          key: 'permissionName'
          // width: 200
        },
        {
          label: 'titleKey',
          key: 'title'
          // width: 200
        },
        {
          label: 'path',
          key: 'path',
          // width: 200,
          align: 'left'
        },
        {
          label: 'component',
          key: 'component',
          // width: 200,
          align: 'left'
        },
        {
          label: '图标',
          key: 'icon',
          // width: 150,
          align: 'left'
        },
        {
          label: '按钮权限码',
          key: 'buttonCode',
          width: 100,
          align: 'left'
        },
        {
          label: '始终显示',
          key: 'alwaysShow',
          width: 80
        },
        {
          label: '页面缓存',
          key: 'noCache',
          width: 80
        },
        {
          label: '操作',
          key: 'operation',
          width: 240
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMenuList().then(response => {
        this.data = response.data
        console.log(response)
      })
    },
    handleUpdate(scope) {
      // this.form = Object.assign({}, scope.row) // 复制对象
      this.form = {
        alwaysShow: scope.row.alwaysShow,
        buttonCode: scope.row.buttonCode,
        component: scope.row.component,
        icon: scope.row.icon,
        noCache: scope.row.noCache,
        path: scope.row.path,
        permissionType: scope.row.permissionType,
        title: scope.row.title,
        titleCh: scope.row.titleCh,
        permissionId: scope.row.permissionId,
        permissionName: scope.row.permissionName,
        permissionPid: scope.row.permissionPid
      }
      this.dialogStatus = 'update'
      this.addDialog = true
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
              message: '更新成功',
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
        alwaysShow: 0,
        buttonCode: '',
        component: '',
        icon: '',
        noCache: 1,
        path: '',
        permissionType: 0,
        title: '',
        titleCh: '',
        permissionId: '',
        permissionName: '',
        permissionPid: 0
      }
    },
    handleCreate(type) {
      if (type === 0) { // 新增顶级
        this.resetForm()
        this.addDialog = true
        this.dialogStatus = 'create'
        this.form.permissionPid = 1
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      } else { // 新增子级
        if (this.currentRow) {
          this.resetForm()
          this.addDialog = true
          this.dialogStatus = 'create'
          this.form.permissionPid = 0
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
          if (this.form.permissionPid === 1) {
            this.form.permissionPid = ''
          } else {
            this.form.permissionPid = this.currentRow.permissionId
          }
          addSubmitApi(this.form).then(res => {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 3000
            })
            this.currentRow = null
            this.getList()
            this.addDialog = false
          })
        }
      })
    },
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该路由, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitApi(scope.row.permissionId).then(res => {
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
