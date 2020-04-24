import Cookies from 'js-cookie'

const TOKEN_KEY = 'mp_crm_token'

export function getToken() {
  return Cookies.get(TOKEN_KEY)
  // return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
  // window.localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
  // window.localStorage.removeItem(TOKEN_KEY)
}
