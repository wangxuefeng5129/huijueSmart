import request from '@/utils/request'
import qs from 'qs'

export function getMenuList() {
  return request({
    url: 'sysmanage/sysPermission/listPermissionTree',
    method: 'get'
  })
}

export function editSubmitApi(formData) {
  const data = qs.stringify(formData)
  return request({
    url: 'sysmanage/sysPermission/updatePermission',
    method: 'post',
    data
  })
}

export function addSubmitApi(formData) {
  const data = qs.stringify(formData)
  return request({
    url: 'sysmanage/sysPermission/savePermission',
    method: 'post',
    data
  })
}
export function delSubmitApi(delData) {
  const data = {
    permissionIds: delData
  }
  console.log(data)
  return request({
    url: 'sysmanage/sysPermission/removePermission',
    method: 'get',
    params: data
  })
}

