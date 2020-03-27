import { fetchListBase } from './base-requests'

const resource = 'program'

export function fetchList(query) {
  return fetchListBase(resource, query)
}
