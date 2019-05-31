import request from '@/utils/request'
import qs from 'qs'

export function getUserList(data) {
  return request({
    url: 'sysmanage/sysUser/listUserByUserCondition',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/saveSysuser',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/updateSysuser',
    method: 'post',
    data
  })
}

export function delSubmitUserApi(data) {
  const delData = { userIds: data }
  return request({
    url: 'sysmanage/sysUser/removeSysuser',
    method: 'get',
    params: delData
  })
}

export function getRoleList() {
  return request({
    url: 'sysmanage/sysRole/listRole',
    method: 'get'
  })
}

export function roleSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/setUserRole',
    method: 'post',
    data
  })
}

export function getDepartmentTree(data) {
  const resource = { userId: data }
  return request({
    url: 'sysmanage/sysDept/listDeptTree',
    method: 'get',
    params: resource
  })
}

export function setDepartmentSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysUser/setUserDept',
    method: 'post',
    data
  })
}
