import request from '@/utils/request'

export function fetchList(kind, query) {
  return request({
    url: `/payment/${kind}/list`,
    method: 'get',
    params: query
  })
}

export function create(kind, data) {
  return request({
    url: `/payment/${kind}/create`,
    method: 'post',
    data
  })
}

export function update(kind, id, data) {
  return request({
    url: `/payment/${kind}/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteById(kind, id) {
  return request({
    url: `/payment/${kind}/delete/${id}`,
    method: 'delete'
  })
}
