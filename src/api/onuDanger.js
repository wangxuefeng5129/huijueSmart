import request from '@/utils/request'

export function getOnuListDanger(data) {
  return request({
    url: 'onu/onuAlarm/listOnuAlarmVO',
    method: 'get',
    params: data
  })
}

export function handleDownload(dataList) {
  var nowTime = new Date().toLocaleString()
  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = ['设备名称', '设备编号', '经度', '维度', '设备地址', '告警类型', '更新时间']
    const filterVal = ['onuName', 'onuNumber', 'longitude', 'latitude', 'address', 'statusType', 'updateTime']
    const data = formatJson(filterVal, dataList)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: '智能光交箱告警记录' + nowTime
    })
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}
