import http from '@/utils/request'
// 获取轮播图
export function getAllBanners(currentPage = 1, pageSize = 10) {
  return http.get(`/banner/${currentPage}/${pageSize}`)
}

// 添加轮播图
export function setBanner(bannerForm) {
  return http.post('/banner/setBanner', bannerForm)
}
