import http from '@/utils/request'

export function login(loginForm) {
  return http.post('/auth/login', loginForm)
}

export function getInfo() {
  return http.get('/auth/userInfo')
}
