import request from '/@/utils/request'

// 查询tProduct列表
export function listTProduct(id:string,query:object) {
  return request({
    url: '/api/v1/store_payment/'+id+'/products?type=internal',
    method: 'get',
    params: query
  })
}

// 查询tProduct详细
export function getTProduct(id:string) {
  return request({
    url: '/api/v1/store_payment/products/'+id+'?type=internal',
    method: 'get',
  })
}

// 新增tProduct
export function addTProduct(data:object) {
  return request({
    url: '/api/v1/store_payment/products',
    method: 'post',
    data: data
  })
}

// 修改tProduct
export function updateTProduct(id:string,data:object) {
  return request({
    url: '/api/v1/store_payment/products/'+id,
    method: 'patch',
    data: data
  })
}

export function uploadImage(data: object): Promise<{
  code: number;
  data: {
    url: string
  };
  message: string;
  success: boolean;
}> {
  return request.post('https://smapi.test.7games.store/merchant/image/upload',data,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }    
  })
}
