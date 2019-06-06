<template>
  <div class="app-container">

    <div class="filter-container">

      <div>
        <el-row style=" margin-top:5px;">
          <el-input v-model="listCondition.onuNumber" style="width: 150px;" class="filter-item" placeholder="请输入设备编号" />
          <el-input v-model="listCondition.onuName" style="width: 150px;" class="filter-item" placeholder="请输入设备名称" />
          <el-input v-model="listCondition.address" style="width: 150px;" class="filter-item" placeholder="请输入设备地址" />
          <!--<el-date-picker
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
          />-->
          <!-- <el-input v-model="listCondition.startTime" style="width: 150px;" class="filter-item" placeholder="请输入开始时间" />
          <el-input v-model="listCondition.endTime" style="width: 150px;" class="filter-item" placeholder="请输入结束时间" /> -->

          <el-button class="filter-item" icon="el-icon-search" type="primary" @click="searchBtn()">{{ $t('table.search') }}</el-button>
          <el-button class="filter-item" icon="el-icon-remove-outline" type="primary" @click="wipeCondition()">{{ $t('table.wipe') }}</el-button>
          <el-button v-loading="exportloading" class="filter-item" icon="el-icon-download" type="primary" @click="traceLogExport()">{{ $t('table.export') }}</el-button>

        </el-row>
      </div>

    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column property="onuName" align="center" label="设备名称" sortable />
      <el-table-column property="onuNumber" align="center" label="设备编号" sortable />
      <el-table-column property="longitude" align="center" label="经度" sortable />
      <el-table-column property="latitude" align="center" label="纬度" sortable />
      <el-table-column property="address" align="center" label="设备地址" sortable />
      <el-table-column property="statusType" align="center" label="告警类型" sortable />
      <el-table-column property="updateTime" align="center" label="更新时间" sortable />
    </el-table>
    <pagination v-show="total" :total="total" :page.sync="listCondition.current" :limit.sync="listCondition.size" @pagination="getList" />
  </div>
</template>

<script>
import { getOnuListDanger, handleDownload } from '@/api/onuDanger'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      listCondition: {
        onuName: '',
        onuNumber: '',
        address: '',
        current: 1,
        size: 10
      },
      list: null,
      total: 0,
      listLoading: false,
      exportloading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOnuListDanger(this.listCondition).then(res => {
        this.listLoading = false
        this.exportloading = false
        this.list = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },

    // 清空搜索条件
    wipeCondition() {
      for (var key in this.listCondition) {
        if (key !== 'current' && key !== 'size') {
          this.listCondition[key] = ''
        }
        //  console.log(this.listCondition[key])
      }
      this.getList()
    },

    searchBtn() {
      this.listLoading = true
      this.listCondition.current = 1
      this.listCondition.size = 10
      this.getList()
    },

    // 导出条件列表
    traceLogExport() {
      this.exportloading = true
      this.getList()
      handleDownload(this.list)
    }
  }
}
</script>

<style scoped>

</style>
