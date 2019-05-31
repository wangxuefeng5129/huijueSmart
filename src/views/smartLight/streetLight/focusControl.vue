<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.focusControlName" placeholder="请输入集中控制器名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="focusControlName" align="center" label="集中控制器名称" sortable />
      <el-table-column property="url" align="center" label="集中控制器地址" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" status-icon :model="form" label-width="120px" style="width: 450px; margin-left:50px;">
        <el-form-item label="集中控制器名称" prop="focusControlName">
          <el-input v-model="form.focusControlName" />
        </el-form-item>
        <el-form-item label="集中控制器地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog=false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFocusControlList, addSubmitApi, editSubmitApi, delSubmitFocusControlApi } from '@/api/focusControl'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    var validateFocusControlName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入集中控制器名称'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入集中控制器地址'))
      } else {
        callback()
      }
    }
    return {
      textMap: {
        update: '编辑',
        create: '新增'
      },
      addDialog: false,
      dialogStatus: '',
      form: {
        focusControlName: '',
        url: '',
        focusControlId: ''
      },
      rules: {
        focusControlName: [{ required: true, validator: validateFocusControlName, trigger: 'blur' }],
        url: [{ required: true, validator: validateUrl, trigger: 'blur' }]
      },

      total: 0,
      listQuery: {
        focusControlName: '',
        current: 1,
        size: 20
      },
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
      getFocusControlList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    resetForm() {
      this.form = {
        focusControlName: '',
        url: '',
        focusControlId: ''
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
    createData() {
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
    handleUpdate(scope) {
      this.form = Object.assign({}, scope.row) // 复制对象
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
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitFocusControlApi(scope.row.focusControlId).then(res => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['控制器名称', '控制器地址']
        const filterVal = ['focusControlName', 'url']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏管理平台集中控制器信息'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 搜索
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
