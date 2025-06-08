import request from '/@/utils/request'

// 查询listTOrder列表
export function listTOrder(id:string,query:object) {
  return request({
    url: '/api/v1/store_payment/'+id+'/orders?type=internal',
    method: 'get',
    params: query
  })
}

// 查门店信息表详细
export function getTStoreOrder(id:any) {
  return request({
    url: '/api/v1/store_payment/orders/'+id+'?type=internal',
    method: 'get',
  })
}
