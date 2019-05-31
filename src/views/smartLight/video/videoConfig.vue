<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.videoName" placeholder="请输入监控名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="videoName" align="center" label="监控名称" sortable />
      <el-table-column property="url" align="center" label="监控地址" sortable />
      <el-table-column property="videoSerial" align="center" label="设备编号" sortable />
      <el-table-column property="appKey" align="center" label="appKey" sortable />
      <el-table-column property="secret" align="center" label="secret" sortable />
      <el-table-column property="lampPostName" align="center" label="所属灯杆" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :rules="rules" status-icon :model="form" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="监控名称" prop="videoName">
          <el-input v-model="form.videoName" placeholder="请输入监控名称" />
        </el-form-item>
        <el-form-item label="监控地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入监控地址" />
        </el-form-item>
        <el-form-item label="所属灯杆" prop="lampPostId">
          <el-select v-model="form.lampPostId" placeholder="请选择">
            <el-option v-for="item in lampPostList" :key="item.lampPostId" :label="item.lampPostName" :value="item.lampPostId" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="videoSerial">
          <el-input v-model="form.videoSerial" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="appKey" prop="appKey">
          <el-input v-model="form.appKey" placeholder="请输入appKey" />
        </el-form-item>
        <el-form-item label="secret" prop="secret">
          <el-input v-model="form.secret" placeholder="请输入secret" />
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
import { fetchList, fetchControlList, fetchLampPostList, addSubmitApi, editSubmitApi, delSubmitApi } from '@/api/videoConfig'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
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
        appKey: '',
        lampPostId: '',
        lampPostName: '',
        secret: '',
        url: '',
        videoId: '',
        videoName: '',
        videoSerial: ''
      },
      rules: {
        videoName: [{ required: true, message: '请输入监控名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入监控地址', trigger: 'blur' }],
        lampPostId: [{ required: true, message: '请选择灯杆', trigger: 'change' }],
        videoSerial: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        appKey: [{ required: true, message: '请输入appKey', trigger: 'blur' }],
        secret: [{ required: true, message: '请输入secret', trigger: 'blur' }]
      },

      total: 0,
      listQuery: {
        videoName: '',
        current: 1,
        size: 20
      },

      list: null,
      lampPostList: null,
      lampControlList: null,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getLampPostList() // 获取下拉列表
  },
  methods: {
    getControlList() {
      this.lampControlList = null
      fetchControlList().then(res => {
        this.lampControlList = res.data
      })
    },
    getLampPostList() {
      this.lampPostList = null
      fetchLampPostList().then(res => {
        this.lampPostList = res.data
        this.getControlList()
      })
    },
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
        appKey: '',
        lampPostId: '',
        lampPostName: '',
        secret: '',
        url: '',
        videoId: '',
        videoName: '',
        videoSerial: ''
      }
    },
    handleCreate() {
      // this.getLampPostList()// 获取下拉列表

      this.resetForm()
      this.addDialog = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(scope) {
      // this.getLampPostList()// 获取下拉列表

      this.form = Object.assign({}, scope.row) // 复制对象
      this.dialogStatus = 'update'
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },

    handleDelete(scope) { // 删除
      this.$confirm('此操作将永久删除该灯具信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSubmitApi(scope.row.videoId).then(res => {
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
        const tHeader = ['监控名称', '监控地址', '设备编号', 'appKey', 'secret', '所属灯杆']
        const filterVal = ['videoName', 'url', 'videoSerial', 'appKey', 'secret', 'lampPostId']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '视频监控信息列表'
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
