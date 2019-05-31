<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.strategyName" placeholder="请输入策略名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="strategyName" align="center" label="策略名称" sortable />
      <el-table-column property="activeTime" align="center" label="有效时间" sortable />
      <el-table-column property="loseTime" align="center" label="失效时间" sortable />
      <el-table-column label="是否启用" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enableStatus===1" style="color:#337ab7;">{{ scope.row.enableStatus | statusFilter }}</span>
          <span v-else style="color:#ff4949;">{{ scope.row.enableStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column property="executeTime" align="center" label="执行时间" sortable />
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
        <el-form-item label="策略名称" prop="strategyName">
          <el-input v-model="form.strategyName" placeholder="请输入策略名称" />
        </el-form-item>
        <el-form-item label="有效时间" prop="activeTime">
          <el-date-picker v-model="form.activeTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请输入有效时间" />
        </el-form-item>
        <el-form-item label="失效时间" prop="loseTime">
          <el-date-picker v-model="form.loseTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请输入失效时间" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enableStatus">
          <el-select v-model="form.enableStatus" placeholder="请选择">
            <el-option v-for="item in enableStatusBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="executeTime">
          <el-date-picker v-model="form.executeTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请输入执行时间" />
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
import { fetchList, addSubmitApi, editSubmitApi, delSubmitApi } from '@/api/strategy'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      if (status === 0) {
        return '禁用'
      } else {
        return '启用'
      }
    }
  },
  data() {
    return {
      enableStatusBox: [
        { value: 0, label: '禁用' },
        { value: 1, label: '启用' }
      ],

      textMap: {
        update: '编辑',
        create: '新增'
      },
      addDialog: false,
      dialogStatus: '',
      form: {
        strategyId: '',
        strategyName: '',
        activeTime: '',
        loseTime: '',
        enableStatus: '',
        executeTime: ''
      },
      rules: {
        strategyName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
        activeTime: [{ required: true, message: '请输入有效时间', trigger: 'change' }],
        loseTime: [{ required: true, message: '请输入失效时间', trigger: 'change' }],
        enableStatus: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
        executeTime: [{ required: true, message: '请输入执行时间', trigger: 'change' }]
      },

      total: 0,
      listQuery: {
        strategyName: '',
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
    getList() { // 获取表单列表
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
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
    resetForm() { // 重置表单
      this.form = {
        strategyName: '',
        strategyId: '',
        activeTime: '',
        loseTime: '',
        enableStatus: 1,
        executeTime: ''
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

    handleDelete(scope) { // 删除
      this.$confirm('此操作将永久删除该策略信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitApi(scope.row.strategyId).then(res => {
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

    handleFilter() { // 搜索
      this.listQuery.current = 1
      this.getList()
    },

    handleDownload() { // 导出excel
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['策略名称', '有效时间', '失效时间', '是否启用', '执行时间']
        const filterVal = ['strategyName', 'activeTime', 'loseTime', 'enableStatus', 'executeTime']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '智慧路灯场景策略信息列表'
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
