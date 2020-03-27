import { fetchListBase, findByIdBase, createBase, updateBase, deleteByIdBase, fetchPvBase } from './base-requests'

const resource = 'contract'

export function fetchList(query) {
  return fetchListBase(resource, query)
}

export function findById(id) {
  return findByIdBase(resource, id)
}

export function create(data) {
  return createBase(resource, data)
}

export function update(id, data) {
  return updateBase(resource, id, data)
}

export function deleteById(id) {
  return deleteByIdBase(resource, id)
}

export function fetchPv(pv) {
  return fetchPvBase(resource, pv)
}
