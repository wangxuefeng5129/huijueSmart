import request from '@/utils/request'
import qs from 'qs'

export function fetchList(data) {
  return request({
    url: 'lamppost/strategy/listStrategyVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/strategy/saveStrategy',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/strategy/updateStrategy',
    method: 'post',
    data
  })
}

export function delSubmitApi(data) {
  const delData = { strategyIds: data }
  return request({
    url: 'lamppost/strategy/removeStrategy',
    method: 'get',
    params: delData
  })
}

