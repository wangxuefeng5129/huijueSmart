import request from '@/utils/request'

export function getPageAlarmLogList(data) {
  return request({
    url: 'trace/alarmslog/listAlarmsByPageAndCondition',
    method: 'get',
    params: data
  })
}

export function getAlarmLogList(data) {
  return request({
    url: 'trace/alarmslog/listAlarmsByCondition',
    method: 'get',
    params: data
  })
}

export function handleDownload(dataList) {
  var nowTime = new Date().toLocaleString()
  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = ['设备名称', '设备编号', '设备地址', '更新时间', '告警类型']
    const filterVal = ['sensorNumber', 'sensorName', 'sensorAddress', 'uploadTime', 'alarmMessage']
    const data = formatJson(filterVal, dataList)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: '地埋柜告警日志信息' + nowTime
    })
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}

