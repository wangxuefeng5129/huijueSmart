import request from '@/utils/request'

export function getPageTraceLogList(data) {
  return request({
    url: 'trace/historylog/listHistoryByPageAndCondition',
    method: 'get',
    params: data
  })
}

export function getTraceLogList(data) {
  return request({
    url: 'trace/historylog/listHistoryByCondition',
    method: 'get',
    params: data
  })
}

export function handleDownload(dataList) {
  var nowTime = new Date().toLocaleString()
  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = ['设备名称', '设备编号', '设备地址', '电量', '温度', '信号值', '湿度', '经度', '纬度', '更新时间']
    const filterVal = ['sensorNumber', 'sensorName', 'sensorAddress', 'voltage', 'temperature', 'sign', 'humi', 'longitude', 'latitude', 'uploadTime']
    const data = formatJson(filterVal, dataList)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: '地埋柜历史日志信息' + nowTime
    })
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}

