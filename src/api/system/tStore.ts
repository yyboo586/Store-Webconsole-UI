import request from '/@/utils/request'

// 查询门店信息表列表
export function listTStore(query:object) {
  return request({
    url: '/api/v1/store_payment/stores',
    method: 'get',
    params: query
  })
}

// 查询门店信息表详细
export function getTStore(id:any) {
  return request({
    url: '/api/v1/store_payment/stores/'+id+'?type=internal',
    method: 'get',
  })
}

// 新增门店信息表
export function addTStore(data:object) {
  return request({
    url: '/api/v1/store_payment/stores',
    method: 'post',
    data: data
  })
}

// 修改门店信息表
export function updateTStore(id:string,data:object) {
  return request({
    url: '/api/v1/store_payment/stores/'+ id,
    method: 'patch',
    data: data
  })
}

export function listThirdStore() { 
  return request({
    url: 'https://smapi.test.7games.store/general/get/store/list',
    method: 'get',
  })
}