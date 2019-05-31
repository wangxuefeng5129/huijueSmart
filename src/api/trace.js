import request from '@/utils/request'
import qs from 'qs'

export function getPageTraceList(data) {
  return request({
    url: 'trace/device/listTraceVOByPageCondition',
    method: 'get',
    params: data
  })
}

export function getTraceList(data) {
  return request({
    url: 'trace/device/listTraceVOByCondition',
    method: 'get',
    params: data
  })
}

export function addTrace(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'trace/device/saveTraceControl',
    method: 'post',
    data
  })
}

export function editTrace(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'trace/device/updateTraceControl',
    method: 'post',
    data
  })
}

export function delTrace(data) {
  const delData = { traceIds: data }
  return request({
    url: 'trace/device/removeTraceControl',
    method: 'get',
    params: delData
  })
}

export function getSingleAreaList(areaPid) {
  const AreaInfo = areaPid === -1 ? { areaPid: areaPid, isProvince: 1 } : { areaPid: areaPid, isProvince: 0 }
  return request({
    url: 'sysmanage/sysArea/listSingleAreaList',
    method: 'get',
    params: AreaInfo
  })
}

export function getAreaTree(areaPid) {
  const AreaInfo = { areaPid: areaPid }
  return request({
    url: 'sysmanage/sysArea/listAreaTree',
    method: 'get',
    params: AreaInfo
  })
}

export function filterAsyncArea(areaList) {
  areaList.forEach(a => {
    // console.log(JSON.stringify(a.children) === '[]')
    if (JSON.stringify(a.children) !== '[]') {
      filterAsyncArea(a.children)
    } else {
      delete a.children
    }
  })
}
export function filterGetAreaId(rootlist, chiocelist, s) {
  // console.log(rootlist.length)
  for (var i = 0; i < rootlist.length; i++) {
    if (rootlist[i].label === chiocelist[0]) {
      if (rootlist[i].children === undefined) {
        console.log(rootlist[i])
        s = rootlist[i]
      } else {
        chiocelist.splice(0, 1)
        // console.log(rootlist[i])
        filterGetAreaId(rootlist[i].children, chiocelist)
      }
    }
  }
  return s
}
export function getOneArea(areaName) {
  const AreaInfo = { areaName: areaName }
  return request({
    url: 'sysmanage/sysArea/listAreaOne',
    method: 'get',
    params: AreaInfo
  })
}

export function getDeptTree() {
  return request({
    url: 'sysmanage/sysRole/listRole',
    method: 'get'
  })
}

export function SetDeviceDeptApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/setUserRole',
    method: 'post',
    data
  })
}

export function setDeviceArea(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/setUserDept',
    method: 'post',
    data
  })
}

export function handleDownload(dataList) {
  var nowTime = new Date().toLocaleString()
  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = ['设备名称', '设备编号', '设备地址', '经度', '纬度', '更新时间', '所属区域', '所属机构']
    const filterVal = ['sensorNumber', 'sensorName', 'sensorAddress', 'longitude', 'latitude', 'uploadtime', 'areaName', 'deptName']
    const data = formatJson(filterVal, dataList)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: '地埋柜设备基础信息' + nowTime
    })
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}
