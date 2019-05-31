<template>
  <div class="app-container">

    <div class="filter-container">

      <el-row>
        <el-button class="filter-item" icon="el-icon-search" type="primary" @click="opensearch">{{ $t('table.filtrate') }}</el-button>
        <el-button class="filter-item" icon="el-icon-refresh" type="primary" @click="ref">{{ $t('table.refresh') }}</el-button>
        <el-button v-loading="exportloading" class="filter-item" icon="el-icon-download" type="primary" @click="traceExport">{{ $t('table.export') }}</el-button>

        <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="addTrace">{{ $t('table.add') }}</el-button>
        <el-button class="filter-item" icon="el-icon-delete" type="primary" @click="deletops">{{ $t('table.delete') }}</el-button>

      </el-row>
      <div v-show="searchCondition">
        <el-row style=" margin-top:20px;">
          <el-input v-model="listCondition.sensorName" style="width: 150px;" class="filter-item" placeholder="请输入设备编号" />
          <el-input v-model="listCondition.sensorNumber" style="width: 150px;" class="filter-item" placeholder="请输入设备名称" />
          <el-input v-model="listCondition.sensorAddress" style="width: 150px;" class="filter-item" placeholder="请输入设备地址" />
          <el-input v-model="listCondition.deptName" style="width: 150px;" class="filter-item" placeholder="请输入设备所属部门" />
          <el-input v-model="listCondition.areaName" style="width: 150px;" class="filter-item" placeholder="请输入设备所属区域" />

          <el-button class="filter-item" icon="el-icon-search" type="primary" @click="search">{{ $t('table.search') }}</el-button>
          <el-button class="filter-item" icon="el-icon-remove-outline" type="primary" @click="wipeCondition">{{ $t('table.wipe') }}</el-button>

        </el-row>
      </div>

    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @select="multipleChoice" @select-all="allChoice">
      <el-table-column type="selection" align="center" label="序号" width="80" />
      <el-table-column property="sensorName" align="center" label="设备名称" sortable />
      <el-table-column property="sensorNumber" align="center" label="设备编号" sortable />
      <el-table-column property="sensorAddress" align="center" label="设备地址" sortable />
      <el-table-column property="latitude" align="center" label="纬度" sortable />
      <el-table-column property="longitude" align="center" label="经度" sortable />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editTrace(scope)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="delTrace(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total" :total="total" :page.sync="listCondition.current" :limit.sync="listCondition.size" @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="addDialog">
      <el-form ref="form" :model="form">
        <el-form-item label="设备名称">
          <el-input v-model="form.sensorName" />
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="form.sensorNumber" />
        </el-form-item>
        <el-form-item label="设备地址">
          <el-input v-model="form.sensorAddress" />
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.longitude" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.latitude" />
        </el-form-item>
        <!-- <el-form-item label="区域">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="props"
            @active-item-change="handleItemChange"
            @change="cascaderChange"
          />

        </el-form-item>-->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addTrace, editTrace, getPageTraceList, getTraceList, getSingleAreaList, delTrace, handleDownload, getAreaTree, filterAsyncArea } from '@/api/trace'
import Pagination from '@/components/Pagination'

export default {
  // name: 'InlineEditTable',
  components: { Pagination },
  data() {
    return {
      options: [],
      props: {
        value: 'label',
        children: 'children',
        label: 'label'
      },
      selectedOptions: [],

      searchCondition: false,

      resourceList: null,
      resourceChecked: [],
      currentRowLampPostId: null,
      addDialog: false,
      dialogTitle: '',
      form: {
        sensorName: '',
        sensorNumber: '',
        sensorAddress: '',
        latitude: '',
        longitude: ''
      },

      total: 0,
      listCondition: {
        sensorName: '',
        sensorNumber: '',
        sensorAddress: '',
        current: 1,
        size: 10
      },
      list: null,
      listLoading: false,
      downloadLoading: false,
      exportloading: false,
      ChoiceList: null,
      a: '',
      b: null,
      c: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleItemChange(val) { // 根据选择判断获取下级菜单
      // console.log('active item:', val)
      this.a = this.options.findIndex(function checkAdult(x) {
        return x.label === val[0]
      })
      // console.log('获取市', this.a)

      getAreaTree(this.options[this.a].areaId).then(res => {
        this.options[this.a].children = res.data
        filterAsyncArea(this.options[this.a].children)
        // console.log(this.options[this.a].children)
      })
      // 有一个bug，需要连点两下，以后解决。。。。

    //  this.options[this.a].children = this.b
      // if (val.length === 1) { // 获取市
      //   this.a[0] = this.options.findIndex(function checkAdult(x) {
      //     return x.label === val[0]
      //   })
      //   console.log('获取市', this.a)
      //   getAreaTree(this.options[this.a[0]].areaId).then(res => {
      //     this.b = res.data
      //   })
      //   this.options[this.a[0]].children = this.b
      //   this.b = []
      // } else if (val.length === 2) { // 获取区
      //   this.a[1] = this.options[this.a[0]].children.findIndex(function checkAdult(x) {
      //     return x.label === val[1]
      //   })
      //   console.log('获取市', this.a)
      //   getSingleAreaList(this.options[this.a[0]].children[this.a[1]].areaId).then(res => {
      //     this.b = res.data
      //     if (res.data[0].level !== 3) {
      //       this.b.forEach(function(item, index, arr) {
      //         arr[index].children = []
      //       })
      //     }
      //   })
      //   this.options[this.a[0]].children[this.a[1]].children = this.b
      //   this.b = []
      // }
    },
    cascaderChange(val) {
      // console.log(getOneArea(val[val.length - 1]))
      // getOneArea(val[val.length - 1]).then(res => {
      //   console.log(res.data)
      // })
      this.a = val
      // console.log(filterGetAreaId(this.options, this.a, this.b))
    },
    allChoice(row) {
      this.ChoiceList = row
    },
    multipleChoice(row) {
      this.ChoiceList = row
    },
    opensearch() {
      this.searchCondition = this.searchCondition === false
    },
    // 获取地埋柜列表
    getList() {
      this.listLoading = true
      getPageTraceList(this.listCondition).then(res => {
        this.listLoading = false
        this.list = res.data.list
        this.total = res.data.total
        console.log(res)
      })
    },
    // 新增地埋柜
    addTrace() {
      this.resetForm()
      this.addDialog = true
      this.dialogTitle = '新增'
      getSingleAreaList(-1).then(res => {
        this.options = res.data
        this.options.forEach(function(item, index, arr) {
          arr[index].children = []
        })
        console.log(this.options)
      })
    },
    addSubmit() {
      addTrace(this.form).then(res => {
        this.addDialog = false
        this.getList()
        if (res.message === '操作成功！') {
          this.$message({
            type: 'info',
            message: res.message
          })
        }
      })
    },
    // 清空搜索条件
    wipeCondition() {
      for (var key in this.listCondition) {
        if (key !== 'current' && key !== 'size') { this.listCondition[key] = '' }
      //  console.log(this.listCondition[key])
      }
    },
    // 重置表单
    resetForm() {
      for (var key in this.form) {
        this.form[key] = ''
      }
    },
    // 单条编辑
    editTrace(scope) {
      console.log(scope)
      this.form = scope.row
      this.addDialog = true
      this.dialogTitle = '编辑'
    },
    editSubmit() {
      editTrace(this.form).then(res => {
        this.addDialog = false
        this.getList()
        if (res.message === '操作成功！') {
          this.$message({
            type: 'info',
            message: res.message
          })
        }
      })
    },
    // 单条删除
    delTrace(scope) {
      console.log(scope)
      this.$confirm('此操作将永久删除该设备基础信息, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTrace(scope.row.traceId).then(res => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 搜索
    search() {
      this.listCondition.current = 1
      this.getList()
    },
    // 刷新
    ref() {
      this.wipeCondition()
      this.listCondition.current = 1
      this.getList()
    },
    // 设备导出
    traceExport() {
      this.exportloading = true
      getTraceList(this.listCondition).then(res => {
        this.exportloading = false
        var datalist = res.data
        handleDownload(datalist)
      })
    },
    // 多选删除
    deletops() {
      if (this.ChoiceList != null && this.ChoiceList.length !== 0) {
        this.$confirm('将永久删除所选' + this.ChoiceList.length + '条设备基础信息, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.ChoiceList.length; i++) {
            this.ChoiceList.splice(i, 1, this.ChoiceList[i].traceId)
          }
          delTrace(this.ChoiceList.join(',')).then(res => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请勾选至少一条设备信息',
          type: 'warning'
        })
      }
    }

  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
