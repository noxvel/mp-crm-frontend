import request from '@/utils/request'

export function fetchListBase(resource, query) {
  return request({
    url: `/${resource}/list`,
    method: 'get',
    params: query
  })
}

export function findByIdBase(resource, id) {
  return request({
    url: `/${resource}/detail/${id}`,
    method: 'get'
  })
}

export function createBase(resource, data) {
  return request({
    url: `/${resource}/create`,
    method: 'post',
    data
  })
}

export function updateBase(resource, id, data) {
  return request({
    url: `/${resource}/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteByIdBase(resource, id) {
  return request({
    url: `/${resource}/delete/${id}`,
    method: 'delete'
  })
}

export function fetchPaymentsBase(resource, id) {
  return request({
    url: `/${resource}/${id}/payments`,
    method: 'get'
  })
}
