import request from '@/utils/request'
import qs from 'qs'

export function loginByUsername(username, password) {
  const data = qs.stringify({
    userName: username,
    password
  })
  return request({
    url: 'sysmanage/sysLogin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  const data = qs.stringify({
    Authorization: token
  })
  return request({
    url: 'sysmanage/sysLogin/getPermission',
    method: 'post',
    data
  })
}

