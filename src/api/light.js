import request from '@/utils/request'
import qs from 'qs'

export function fetchList(data) {
  return request({
    url: 'lamppost/light/listLightVO',
    method: 'get',
    params: data
  })
}

export function fetchControlList(data) {
  return request({
    url: 'lamppost/lampControl/comboxLampControl',
    method: 'get',
    params: data
  })
}

export function fetchLampPostList(data) {
  return request({
    url: 'lamppost/lampPost/comboxLampPost',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/light/saveLight',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/light/updateLight',
    method: 'post',
    data
  })
}

export function delSubmitApi(data) {
  const delData = { lightIds: data }
  return request({
    url: 'lamppost/light/removeLight',
    method: 'get',
    params: delData
  })
}

