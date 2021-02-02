import http from '@/utils/request'
// 获取轮播图
export function getAllBanners() {
  return http.get('/banner')
}

// 添加轮播图
export function setBanner(bannerForm) {
  return http.post('/banner/setBanner', bannerForm)
}
