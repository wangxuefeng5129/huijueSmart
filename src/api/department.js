import request from '@/utils/request'
import qs from 'qs'

export function getDepartmentList() {
  return request({
    url: 'sysmanage/sysDept/listDeptTree',
    method: 'get'
  })
}

export function editSubmitApi(formData) {
  const data = qs.stringify(formData)
  return request({
    url: 'sysmanage/sysDept/updateDept',
    method: 'post',
    data
  })
}

export function addSubmitApi(formData) {
  const data = qs.stringify(formData)
  return request({
    url: 'sysmanage/sysDept/saveDept',
    method: 'post',
    data
  })
}
export function delSubmitApi(delData) {
  const data = {
    deptIds: delData
  }
  console.log(data)
  return request({
    url: 'sysmanage/sysDept/removeDept',
    method: 'get',
    params: data
  })
}

