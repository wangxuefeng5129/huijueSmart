import request from '@/utils/request'

export function getOnuListHistory(data) {
  return request({
    url: 'onu/operateLog/listOperateLogVO',
    method: 'get',
    params: data
  })
}

export function handleDownload(dataList) {
  var nowTime = new Date().toLocaleString()
  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = ['设备名称', '设备编号', '设备地址', '经度', '纬度', '操作用户', '手机号', '更新时间']
    const filterVal = ['onuName', 'onuNumber', 'address', 'longitude', 'latitude', 'sysUserName', 'phone', 'updateTime']
    const data = formatJson(filterVal, dataList)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: '智能光交箱历史数据' + nowTime
    })
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}
