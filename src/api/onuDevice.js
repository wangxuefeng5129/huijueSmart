import request from '@/utils/request'
import qs from 'qs'

export function getOnuList(data) {
  return request({
    url: 'onu/onu/listOnuVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'onu/onu/saveOnu',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'onu/onu/updateOnu',
    method: 'post',
    data
  })
}

export function delSubmitOnuApi(dataForm) {
  const delData = { onuIds: dataForm }
  return request({
    url: 'onu/onu/removeOnu',
    method: 'get',
    params: delData
  })
}
