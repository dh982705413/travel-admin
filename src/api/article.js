import http from '@/utils/request'

// 添加文章
export function setArticle(ArticleForm) {
  return http.post('/article/setArticle', ArticleForm)
}

//删除文章
export function removeArticle(id) {
  return http.delete(`/article/remove/${id}`)
}

// 获取文章详情
export function getArticleDetail(id) {
  return http.get(`/article/${id}`)
}

// 编辑文章
export function editArticle(id, articleForm) {
  return http.patch(`/article/edit/${id}`, articleForm)
}

// 获取文章
export function getArticle(currentPage, pageSize) {
  return http.get(`/article/${currentPage}/${pageSize}`)
}
