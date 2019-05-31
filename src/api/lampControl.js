import request from '@/utils/request'
import qs from 'qs'

export function getLampControlList(data) {
  return request({
    url: 'lamppost/lampControl/listLampControlVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/lampControl/saveLampControl',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/lampControl/updateLampControl',
    method: 'post',
    data
  })
}

export function delSubmitLampControlApi(dataForm) {
  const delData = { lampControlIds: dataForm }
  return request({
    url: 'lamppost/lampControl/removeLampControl',
    method: 'get',
    params: delData
  })
}

export function getComboxFocusControl() {
  return request({
    url: 'lamppost/focusControl/comboxFocusControl',
    method: 'get'
  })
}
