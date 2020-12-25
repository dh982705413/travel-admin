const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  token: state => state.user.token,
  articles: state => state.user.articles
}
export default getters
