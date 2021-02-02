<template>
  <div id="EditArticle">
    <h2>文章封面</h2>
    <el-upload class="cover"
               action
               :show-file-list="false"
               :auto-upload="true"
               :on-success="setPreview"
               :http-request="getFile"
               :headers="{ Authorization: 'Bearer ' + token }">
      <img v-if="articleForm.preview"
           :src="articleForm.preview"
           class="avatar" />
      <i v-else
         class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <h2>文章标题</h2>
    <div class="title">
      <el-input v-model="articleForm.title"
                placeholder="请输入标题"></el-input>
    </div>
    <h2>文章内容</h2>
    <Tinymce v-model="articleForm.content" />

    <el-button type="primary"
               class="release"
               @click="releaseArticle">{{ articleId ? '编辑' : '发布' }}文章</el-button>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import { setArticle, getArticleDetail, editArticle } from '@/api/article'
export default {
  components: { Tinymce },
  async mounted() {
    console.log(this.$store.state)
    const { id } = this.$route.params
    this.articleId = id
    if (id) {
      const data = await getArticleDetail(id)
      this.articleForm = data
    }
  },
  data() {
    return {
      articleForm: { title: '', content: '', preview: '' },
      file: {},
      articleId: ''
    }
  },
  methods: {
    async setPreview(res, file) {
      this.articleForm.preview = URL.createObjectURL(file.raw)
    },
    async getFile(options) {
      this.file = options.file
    },
    async releaseArticle() {
      try {
        const articleForm = new FormData()
        articleForm.append('title', this.articleForm.title)
        articleForm.append('content', this.articleForm.content)
        if (!this.articleId) {
          articleForm.append('preview', this.file)
          await setArticle(articleForm)
        } else {
          articleForm.append('preview', this.articleForm.preview)
          await editArticle(this.articleId, articleForm)
        }
        await this.$store.dispatch('user/getInfo')
        this.$message.success('编辑文章成功')
        this.$router.push('/article/myArticle')
      } catch {
        this.$message.error('编辑文章失败')
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  }
}
</script>

<style lang="scss">
#EditArticle {
  padding: 20px;
  .title {
    margin: 20px 0;
  }
  .cover .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .release {
    margin-top: 20px;
  }
}
</style>
