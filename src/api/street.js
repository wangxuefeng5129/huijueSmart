import request from '@/utils/request'
import qs from 'qs'

export function getStreetList(data) {
  return request({
    url: 'lamppost/street/listStreetVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/street/saveStreet',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/street/updateStreet',
    method: 'post',
    data
  })
}

export function delSubmitStreettApi(dataForm) {
  const delData = { streetIds: dataForm }
  return request({
    url: 'lamppost/street/removeStreet',
    method: 'get',
    params: delData
  })
}

export function getcomboxStrategy() {
  return request({
    url: 'lamppost/strategy/comboxStrategy',
    method: 'get'
  })
}

export function getListSingleAreaList(isProvince, areaPid, areaName) {
  const delData = { isProvince: isProvince, areaPid: areaPid, areaName: areaName }
  return request({
    url: 'sysmanage/sysArea/listSingleAreaList',
    method: 'get',
    params: delData
  })
}
