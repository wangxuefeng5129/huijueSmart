import request from '@/utils/request'
import qs from 'qs'

export function getFocusControlList(data) {
  return request({
    url: 'lamppost/focusControl/listFocusControlVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/focusControl/saveFocusControl',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/focusControl/updateFocusControl',
    method: 'post',
    data
  })
}

export function delSubmitFocusControlApi(dataForm) {
  const delData = { focusControlIds: dataForm }
  return request({
    url: 'lamppost/focusControl/removeFocusControl',
    method: 'get',
    params: delData
  })
}
