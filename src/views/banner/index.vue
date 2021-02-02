<template>
  <div id="Banner">
    <el-carousel :interval="4000"
                 type="card"
                 height="300px"
                 class="carousel ">
      <el-carousel-item v-for="item in 6"
                        :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-card class="banner-edit">
      <el-tabs v-model="activeName">
        <el-tab-pane label="轮播图列表"
                     name="banner-list">

          <el-button type="text"
                     @click="addBannerDialog=true">添加<i class="el-icon-plus"></i></el-button>

        </el-tab-pane>
        <el-tab-pane label="轮播图管理"
                     name="banner-edit">
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog title="添加轮播图"
               top="15vh"
               :visible.sync="addBannerDialog">
      <el-upload action
                 :show-file-list="false"
                 :auto-upload="true"
                 :on-success="setPreview"
                 :http-request="getFile"
                 :headers="{ Authorization: 'Bearer ' + token }">
        <img v-if="bannerForm.image"
             :src="bannerForm.image"
             class="cover" />
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="addBanner">添 加</el-button>
        <el-button @click="addBannerDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setBanner, getAllBanners } from '@/api/banner'
export default {
  name: 'banner',
  data() {
    return {
      banners: [],
      activeName: 'banner-list',
      addBannerDialog: false,
      bannerForm: { image: "" },
      file: {}
    }
  },
  async created() {
    const banners = await getAllBanners()
    this.banners = banners
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    async setPreview(res, file) {
      this.bannerForm.image = URL.createObjectURL(file.raw)
    },
    async getFile(options) {
      this.file = options.file
    },
    async addBanner() {
      const bannerForm = new FormData()
      bannerForm.append('image', this.bannerForm.image)
      bannerForm.append('banner', this.file)
      try {
        await setBanner(bannerForm)
        this.$message.success('添加成功')
      } catch {
        this.$message.error('添加失败')
      }
      this.addBannerDialog = false
    }
  }
}
</script>

<style lang="scss" >
#Banner {
  width: 100%;
  height: 100%;
  .carousel {
    width: 1200px;
    margin: 20px auto;
  }
  .banner-edit {
    margin: 0 20px;
    padding: 20px;
  }
  .cover {
    width: 500px;
    height: 250px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
.el-dialog__footer {
  text-align: left;
}
</style>