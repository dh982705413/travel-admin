import http from '@/utils/request'
// 获取轮播图
export function getAllBanners(currentPage = 1, pageSize = 10) {
  return http.get(`/banner/${currentPage}/${pageSize}`)
}

// 添加轮播图
export function setBanner(bannerForm) {
  return http.post('/banner/setBanner', bannerForm)
}

// 删除轮播图
export function deleteBanner(id) {
  return http.delete(`/banner/removeBanner/${id}`)
}

// 启用轮播图
export function enableBanner(id, isCheck) {
  return http.patch(`/banner/enableBanner/${id}`, { isCheck })
}

// 获取启用轮播图
export function getEnableBanners() {
  return http.get('/banner/getEnableBanner')
}

// 设置轮播图播放速度
export function setInterval(bannerOpt) {
  return http.post('/banner/setInterval',  bannerOpt )
}
