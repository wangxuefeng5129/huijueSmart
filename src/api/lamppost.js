import request from '@/utils/request'
import qs from 'qs'

export function getLampPostList(data) {
  return request({
    url: 'lamppost/lampPost/listLampPostVO',
    method: 'get',
    params: data
  })
}

export function addSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/lampPost/saveLampPost',
    method: 'post',
    data
  })
}

export function editSubmitApi(dataForm) {
  const data = qs.stringify(dataForm)
  return request({
    url: 'lamppost/lampPost/updateLampPost',
    method: 'post',
    data
  })
}

export function delSubmitLampPostApi(dataForm) {
  const delData = { lampPostIds: dataForm }
  return request({
    url: 'lamppost/lampPost/removeLampPost',
    method: 'get',
    params: delData
  })
}

export function getComboxStreet(areaId) {
  const delData = { areaId: areaId }
  return request({
    url: 'lamppost/street/comboxStreet',
    method: 'get',
    params: delData
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

