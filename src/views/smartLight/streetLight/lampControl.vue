<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.lampControlName" placeholder="请输入灯控器名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="lampControlName" align="center" label="灯控器名称" sortable />
      <el-table-column property="url" align="center" label="灯控器地址" sortable />
      <el-table-column label="类型" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lampControlType===1" style="color:#337ab7;">{{ scope.row.lampControlType | statusFilter }}</span>
          <span v-else style="color:#ff4949;">{{ scope.row.lampControlType | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column property="focusControlName" align="center" label="集中控器名称" sortable />
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
        <el-form-item label="灯控器名称" prop="lampControlName">
          <el-input v-model="form.lampControlName" />
        </el-form-item>
        <el-form-item label="灯控器地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.lampControlType" placeholder="请选择">
            <el-option v-for="item in lampControlTypeBox" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="集中控器">
          <el-select v-model="form.focusControlId" placeholder="请选择">
            <el-option v-for="item in focusControlBox" :key="item.focusControlId" :label="item.focusControlName" :value="item.focusControlId" />
          </el-select>
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
import { getLampControlList, addSubmitApi, editSubmitApi, delSubmitLampControlApi, getComboxFocusControl } from '@/api/lampControl'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      if (status === 1) {
        return '集中控制器'
      } else {
        return '单灯控制器'
      }
    }
  },
  data() {
    var validateLampControlName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入灯控制器名称'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入灯控制器地址'))
      } else {
        callback()
      }
    }
    return {
      lampControlTypeBox: [
        { value: 1, label: '集中控制器' },
        { value: 2, label: '单灯控制器' }
      ],
      focusControlBox: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      addDialog: false,
      dialogStatus: '',
      form: {
        lampControlId: '',
        lampControlName: '',
        lampControlType: '',
        url: '',
        focusControlId: '',
        focusControlName: ''
      },
      rules: {
        lampControlName: [{ required: true, validator: validateLampControlName, trigger: 'blur' }],
        url: [{ required: true, validator: validateUrl, trigger: 'blur' }]
      },

      total: 0,
      listQuery: {
        lampControlName: '',
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
    this.getComboxFocusControl()
  },
  methods: {
    getComboxFocusControl() {
      getComboxFocusControl().then(res => {
        this.focusControlBox = res.data
        console.log(res.data)
      })
    },
    getList() {
      this.listLoading = true
      getLampControlList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    resetForm() {
      this.form = {
        lampControlId: '',
        lampControlName: '',
        lampControlType: '',
        url: '',
        focusControlId: '',
        focusControlName: ''
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
    handleUpdate(scope) {
      this.form = Object.assign({}, scope.row) // 复制对象
      this.dialogStatus = 'update'
      this.addDialog = true
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
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitLampControlApi(scope.row.lampControlId).then(res => {
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
        const tHeader = ['灯控器名称', '灯控器地址', '类型', '集中控器名称']
        const filterVal = ['lampControlName', 'url', 'lampControlType', 'focusControlName']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏管理平台灯控制器信息'
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
