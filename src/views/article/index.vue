<template>
  <div id="article">
    <h2>文章列表</h2>
    <el-table :data="articles">
      <el-table-column label="ID" prop="_id"></el-table-column>
      <el-table-column label="封面">
        <template slot-scope="scope">
          <img :src="scope.row.preview" alt="" class="preview" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="摘要" prop="content"></el-table-column>
      <el-table-column label="其他操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editArticle(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeArticle(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { removeArticle } from '@/api/article'
export default {
  computed: {
    ...mapGetters(['articles'])
  },
  methods: {
    async removeArticle(id) {
      this.$confirm('确认后会永久删除该文章！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeArticle(id)
        await this.$store.dispatch('user/getInfo')
      })
    },
    editArticle(id) {
      this.$router.push(`editArticle/${id}`)
    }
  }
}
</script>

<style lang="scss">
#article {
  padding: 20px;
  .preview {
    width: 160px;
    height: 50px;
  }
}
</style>
