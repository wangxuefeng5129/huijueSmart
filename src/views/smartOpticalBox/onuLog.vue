<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.onuName" placeholder="请输入光交箱名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.onuNumber" placeholder="请输入光交箱编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.deviceId" placeholder="请输入设备ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="onuName" align="center" label="光交箱名称" sortable />
      <el-table-column property="onuNumber" align="center" label="光交箱地址" sortable />
      <el-table-column property="deviceId" align="center" label="设备ID" sortable />
      <el-table-column property="address" align="center" label="详细地址" sortable />
      <el-table-column property="temperature" align="center" label="温度" sortable />
      <el-table-column property="humidness" align="center" label="湿度" sortable />
      <el-table-column property="batteryvol" align="center" label="电池电压" sortable />
      <el-table-column property="battvalue" align="center" label="电池电量" sortable />
      <el-table-column property="updateTime" align="center" label="更新时间" sortable />
      <el-table-column property="doorStatus" align="center" label="门状态" sortable />
      <el-table-column property="lockStatus" align="center" label="锁状态" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { getMonitorDataList } from '@/api/monitorData'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    return {
      form: {
        monitorDataId: '',
        onuName: '',
        onuNumber: '',
        deviceId: '',
        address: '',
        temperature: '',
        humidness: '',
        battvalue: '',
        batteryvol: '',
        currentNet: '',
        signData: '',
        doorStatus: '',
        lockStatus: '',
        updateTime: '',
        door1: '',
        door2: '',
        door3: '',
        door4: '',
        lock1: '',
        lock2: '',
        lock3: '',
        lock4: ''
      },

      total: 0,
      listQuery: {
        deviceId: '',
        onuName: '',
        onuNumber: '',
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
      getMonitorDataList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['光交箱名称', '光交箱编号', '设备ID', '详细地址', '经度', '纬度']
        const filterVal = ['onuName', 'onuNumber', 'deviceId', 'address', 'longitude', 'latitude']
        const data = this.formatJson(filterVal, this.list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '汇珏管理平台光交箱信息'
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
