import request from '@/utils/request'

export function getMonitorDataList(data) {
  return request({
    url: 'onu/monitorData/listMonitorDataVO',
    method: 'get',
    params: data
  })
}
