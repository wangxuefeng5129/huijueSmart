import request from '@/utils/request'
import qs from 'qs'

export function getRoleList(data) {
  return request({
    url: 'sysmanage/sysRole/listRoleByPage',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysRole/saveRole',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysRole/updateRole',
    method: 'post',
    data
  })
}

export function delSubmitRoleApi(dataForm) {
  const delData = { Roleids: dataForm }
  return request({
    url: 'sysmanage/sysRole/removeRole',
    method: 'get',
    params: delData
  })
}

export function getRolePermissionTree(data) {
  const resource = { roleId: data }
  return request({
    url: 'sysmanage/sysRole/listRolePermissionTree',
    method: 'get',
    params: resource
  })
}

export function setResourceSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'sysmanage/sysRole/saveRolePermission',
    method: 'post',
    data
  })
}
