<template>
  <div class="app-container">

    <div class="filter-container">

      <!-- <el-row>
        <el-button class="filter-item" icon="el-icon-refresh" type="primary" @click="ref">{{ $t('table.refresh') }}</el-button>

      </el-row> -->
      <div>
        <el-row style=" margin-top:5px;">
          <el-input v-model="listCondition.sensorName" style="width: 150px;" class="filter-item" placeholder="请输入设备编号" />
          <el-input v-model="listCondition.sensorNumber" style="width: 150px;" class="filter-item" placeholder="请输入设备名称" />
          <el-input v-model="listCondition.sensorAddress" style="width: 150px;" class="filter-item" placeholder="请输入设备地址" />
          <el-date-picker
            v-model="listCondition.startTime"
            class="filter-item"
            type="datetime"
            placeholder="请输入开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <el-date-picker
            v-model="listCondition.endTime"
            class="filter-item"
            type="datetime"
            placeholder="请输入结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <!-- <el-input v-model="listCondition.startTime" style="width: 150px;" class="filter-item" placeholder="请输入开始时间" />
          <el-input v-model="listCondition.endTime" style="width: 150px;" class="filter-item" placeholder="请输入结束时间" /> -->

          <el-button class="filter-item" icon="el-icon-search" type="primary" @click="search">{{ $t('table.search') }}</el-button>
          <el-button class="filter-item" icon="el-icon-remove-outline" type="primary" @click="wipeCondition">{{ $t('table.wipe') }}</el-button>
          <el-button v-loading="exportloading" class="filter-item" icon="el-icon-download" type="primary" @click="traceLogExport">{{ $t('table.export') }}</el-button>

        </el-row>
      </div>

    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="sensorName" align="center" label="设备名称" sortable />
      <el-table-column property="sensorNumber" align="center" label="设备编号" sortable />
      <el-table-column property="sensorAddress" align="center" label="设备地址" sortable />
      <el-table-column property="alarmMessage" align="center" label="告警类型" sortable />
      <el-table-column property="uploadTime" align="center" label="更新时间" sortable />
    </el-table>
    <pagination v-show="total" :total="total" :page.sync="listCondition.current" :limit.sync="listCondition.size" @pagination="getList" />

  </div>
</template>

<script>
import { getPageAlarmLogList, getAlarmLogList, handleDownload } from '@/api/traceAlarm'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    return {
      searchCondition: false,

      form: {
        sensorName: '',
        sensorNumber: '',
        sensorAddress: '',
        uploadTime: '',
        voltage: '',
        temperature: '',
        sign: '',
        humi: '',
        longitude: '',
        latitude: ''
      },

      total: 0,
      listCondition: {
        sensorName: '',
        sensorNumber: '',
        sensorAddress: '',
        startTime: '',
        endTime: '',
        current: 1,
        size: 10
      },
      list: null,
      exportList: null,
      listLoading: false,
      exportloading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页获取列表
    getList() {
      this.listLoading = true

      getPageAlarmLogList(this.listCondition).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.data.total
        console.log(res)
      })
    },
    // 导出条件列表
    traceLogExport() {
      this.exportloading = true
      getAlarmLogList(this.listCondition).then(res => {
        this.exportloading = false
        var datalist = res.data
        handleDownload(datalist)
      })
    },
    // 清空搜索条件
    wipeCondition() {
      for (var key in this.listCondition) {
        if (key !== 'current' && key !== 'size') { this.listCondition[key] = '' }
      //  console.log(this.listCondition[key])
      }
    },
    // 重新刷新页面
    ref() {
      this.wipeCondition()
      console.log(this.listCondition)
      this.getList()
    },
    // 搜索
    search() {
      this.listLoading = true
      this.listCondition.current = 1
      this.listCondition.size = 10
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
