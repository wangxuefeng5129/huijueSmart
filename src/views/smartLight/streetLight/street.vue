<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.streetName" placeholder="灯杆名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="streetName" align="center" label="街道名称" sortable />
      <el-table-column property="areaName" align="center" label="所属地区" sortable />
      <el-table-column property="strategyName" align="center" label="执行策略" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog">
      <el-form ref="form" :model="form" label-width="80px" style="width: 500px; margin-left:50px;">
        <el-form-item label="街道名称">
          <el-input v-model="form.streetName" />
        </el-form-item>
        <el-form-item label="所属地区">
          <el-select v-model="form.pareaId" filterable placeholder="请选择" style="width:135px;" @change="getCityAreaBox(form.pareaId)">
            <el-option v-for="item in provinceAreaBox" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
          </el-select>
          <el-select v-model="form.careaId" filterable placeholder="请选择" style="width:135px;" @change="getDistrictAreaBox(form.careaId)">
            <el-option v-for="item in cityAreaBox" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
          </el-select>
          <el-select v-model="form.areaId" filterable placeholder="请选择" style="width:135px;">
            <el-option v-for="item in districtAreaBox" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行策略">
          <el-select v-model="form.strategyId" placeholder="请选择">
            <el-option v-for="item in strategyBox" :key="item.strategyId" :label="item.strategyName" :value="item.strategyId" />
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
import { getStreetList, addSubmitApi, editSubmitApi, delSubmitStreettApi, getcomboxStrategy, getListSingleAreaList } from '@/api/street'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    return {
      provinceAreaBox: null,
      cityAreaBox: null,
      districtAreaBox: null,
      strategyBox: null,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      addDialog: false,
      dialogStatus: '',
      form: {
        streetName: '',
        strategyId: '',
        areaId: ''
      },

      total: 0,
      listQuery: {
        streetName: '',
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
    this.getComboxStrategy()
    this.getProvinceAreaBox()
  },
  methods: {
    getComboxStrategy() {
      getcomboxStrategy().then(res => {
        this.strategyBox = res.data
        console.log(res.data)
      })
    },
    getProvinceAreaBox() {
      getListSingleAreaList(1, -1, null).then(res => {
        this.provinceAreaBox = res.data
        console.log(res)
      })
    },
    getCityAreaBox(pareaId) {
      getListSingleAreaList(0, pareaId, null).then(res => {
        this.cityAreaBox = res.data
        console.log(res)
      })
    },
    getDistrictAreaBox(careaId) {
      getListSingleAreaList(0, careaId, null).then(res => {
        this.districtAreaBox = res.data
        console.log(res)
      })
    },
    getList() {
      this.listLoading = true
      getStreetList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    resetForm() {
      this.form = {
        streetName: '',
        strategyId: '',
        areaId: '',
        streetId: ''
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
        delSubmitStreettApi(scope.row.streetId).then(res => {
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
        const tHeader = ['街道名称', '所属区域', '执行策略']
        const filterVal = ['streetName', 'areaName', 'strategyName']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏管理平台街道信息'
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
