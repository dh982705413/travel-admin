<template>
  <div id="Banner">
    <el-carousel :interval="bannerOptions.interval"
                 type="card"
                 height="300px"
                 class="carousel">
      <el-carousel-item v-for="item in enableBanners"
                        :key="item._id">
        <img :src="item.image"
             class="carousel-item">
      </el-carousel-item>
    </el-carousel>

    <el-card class="banner-edit">
      <el-tabs v-model="activeName">
        <el-tab-pane label="轮播图列表"
                     name="banner-list">
          <div class="banner-list">
            <div class="banner-list-img"
                 v-for="item in banners"
                 :key="item._id"
                 :style="{width:sidebar.opened ? '268px':'300px'}">
              <img :src="item.image"
                   @click="openEditBannerDialog(item)">
              <div class="btn-delete animated fadeIn"
                   @click="deleteBanner(item._id)"
                   v-show="isDelete">
                <div class="line-hr"></div>
              </div>
              <el-checkbox class="btn-enable animated fadeIn"
                           v-model="item.isCheck"
                           v-show="isEdit"
                           @change="changeBannerState(item._id,$event)"></el-checkbox>
              <div class="check-point animated fadeIn"
                   v-show="item.isCheck && !isEdit && !isDelete">
                <i class="el-icon-success"></i>
              </div>
            </div>
          </div>
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currenPage"
                         background
                         :page-sizes="[5, 10, 20, 30]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>

        </el-tab-pane>
        <el-tab-pane label="轮播图管理"
                     name="banner-edit">
          <el-form ref="form"
                   label-width="100px">
            <el-form-item label="轮播图速度">
              <el-select v-model="bannerOptions.interval"
                         placeholder="请选择轮播图播放速度"
                         @change="changeInterval">
                <el-option v-for="item in intervalOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>

            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="banner-list-options">
        <i class="el-icon-circle-plus-outline"
           @click="changeOption('add')"></i>
        <i class="el-icon-delete"
           :style="{color:isDelete?'red':''}"
           @click="changeOption('isDelete')"></i>
        <i class="el-icon-edit"
           :style="{color:isEdit?'green':''}"
           @click="changeOption('isEdit')"></i>
      </div>
    </el-card>

    <el-dialog title="添加轮播图"
               top="15vh"
               :visible.sync="addBannerDialog">
      <div class="banner-container">
        <el-upload action
                   :show-file-list="false"
                   :auto-upload="true"
                   :on-success="setPreview"
                   :http-request="getFile"
                   :headers="{ Authorization: 'Bearer ' + token }"
                   class="preview-banner">
          <img v-if="bannerForm.image"
               :src="bannerForm.image"
               class="banner-list-img" />
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form ref="form"
                 label-width="80px"
                 class="add-banner-option">
          <el-form-item label="标题">
            <el-input placeholder="请输入标题"
                      v-model="bannerForm.title"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="bannerForm.time"
                            type="date"
                            placeholder="请输入日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="bannerForm.isCheck"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       :disabled="isFull">
            </el-switch>
          </el-form-item>
          <div class="sizebox"></div>
        </el-form>
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="addBanner">添 加</el-button>
        <el-button @click="addBannerDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑轮播图"
               :visible.sync="editBannerDialog"
               class="flex">
      <img :src="bannerForm.image"
           class="banner-list-img">
      <el-form ref="form"
               label-width="80px"
               class="add-banner-option">
        <el-form-item label="标题">
          <el-input placeholder="请输入标题"
                    v-model="bannerForm.title"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="bannerForm.time"
                          type="date"
                          placeholder="请输入日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <span :style="{color:bannerForm.isCheck?'#13ce66':'#ff4949'}">{{bannerForm.isCheck?'已启用':'未启用'}}</span>

        </el-form-item>
        <div class="sizebox"></div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editBannerDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setBanner, getAllBanners, deleteBanner, enableBanner, getEnableBanners, setInterval } from '@/api/banner'
export default {
  name: 'banner',
  data() {
    return {
      banners: [],
      enableBanners: [],
      checkList: [],
      isCheck: true,
      activeName: 'banner-list',
      addBannerDialog: false,
      editBannerDialog: false,
      bannerForm: { image: "", title: '', time: '', isCheck: false },
      file: {},
      bannerOptions: {
        interval: null
      },
      intervalOptions: [{
        value: 1000,
        label: '1000ms'
      },
      {
        value: 2000,
        label: '2000ms'
      },
      {
        value: 3000,
        label: '3000ms'
      }, {
        value: 4000,
        label: '4000ms'
      }],
      currenPage: 1,
      pageSize: 10,
      total: 100,
      isDelete: false,
      isEdit: false,
      isFull: false
    }
  },
  async created() {
    await this.initBanners()
  },

  computed: {
    ...mapGetters(['token', 'sidebar'])
  },
  methods: {
    async setPreview(res, file) {
      this.bannerForm.image = URL.createObjectURL(file.raw)
    },
    async getFile(options) {
      this.file = options.file
    },
    async getEnableBanners() {
      const { enableBanners, interval, isFull } = await getEnableBanners()
      this.enableBanners = enableBanners
      this.bannerOptions.interval = interval
      this.isFull = isFull
    },
    async addBanner() {
      const bannerForm = new FormData()
      bannerForm.append('image', this.bannerForm.image)
      bannerForm.append('title', this.bannerForm.title)
      bannerForm.append('time', this.bannerForm.time)
      bannerForm.append('isCheck', this.bannerForm.isCheck)
      bannerForm.append('banner', this.file)
      if (!this.bannerForm.image) {
        this.$message.error('请先上传图片')
        return
      }
      try {
        await setBanner(bannerForm)
        this.$message.success('添加成功')
        await this.initBanners()
      } catch {
        this.$message.error('添加失败')
      }
      this.addBannerDialog = false
      this.bannerForm = {}
    },
    async getBanners() {
      const { banners, total, interval } = await getAllBanners(this.currenPage, this.pageSize)
      this.banners = banners
      this.total = total
      this.bannerOptions.interval = interval
    },
    async handleSizeChange(val) {
      this.pageSize = val
      await this.initBanners()
    },
    async handleCurrentChange(val) {
      this.currenPage = val
      await this.initBanners()
    },
    async changeInterval() {
      await setInterval(this.bannerOptions)
      await this.initBanners()
      this.$message.success('修改成功')
    },
    async changeBannerState(id, isCheck) {
      await enableBanner(id, isCheck)
      await this.initBanners()

    },
    changeOption(type) {
      if (type === 'add') {
        this.bannerForm = {}
        this.addBannerDialog = true
      } else if (type === 'isDelete') {
        this.isEdit = false
        this.isDelete = !this.isDelete
      } else {
        this.isDelete = false
        this.isEdit = !this.isEdit
      }
    },
    deleteBanner(id) {
      this.$confirm('确认后会删除该轮播图', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteBanner(id)
        await this.initBanners()
        this.$message.success('删除成功')
      })
    },
    openEditBannerDialog(banner) {
      this.bannerForm = banner
      this.editBannerDialog = true
    },
    async initBanners() {
      await this.getBanners()
      await this.getEnableBanners()
    }
  }
}
</script>

<style lang="scss" >
#Banner {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  .carousel {
    width: 1200px;
    margin: 20px auto;
    &-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .banner-edit {
    position: relative;
    margin: 0 20px;
    padding: 0 20px;
  }
  .cover {
    width: 500px;
    height: 250px;
  }
  .banner-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    &-img {
      position: relative;
      height: 200px;
      margin: 0 5px;
      margin-bottom: 10px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 1px 2px 3px rgba($color: #000000, $alpha: 0.5);
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }

      .btn-delete {
        position: absolute;
        background-color: rgb(233, 20, 20);
        top: 0;
        left: 0;
        width: 22px;
        height: 22px;
        border-radius: 0 0 20px 0;
        i {
          width: 100%;
          height: 100%;
          color: #fff;
        }
      }
      .btn-enable {
        position: absolute;
        top: 5px;
        right: 5px;
      }
      .check-point {
        position: absolute;
        top: 0;
        left: 5px;
        color: rgb(16, 247, 16);
        font-size: 14px;
      }
    }
    &-options {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      position: absolute;
      width: 200px;
      height: 40px;
      right: 45px;
      top: 15px;
      i {
        font-size: 22px;
        cursor: pointer;
        transition: 0.5s;
        &:nth-child(1):hover {
          color: #409eff;
        }
        &:nth-child(2):hover {
          color: red;
        }
        &:nth-child(3):hover {
          color: green;
        }
      }
    }
  }
  .line-hr {
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: #fff;
    bottom: 12px;
    right: 8px;
  }
  .banner-container {
    display: flex;
    .preview-banner {
      display: flex;
      align-items: center;
      width: 268px;
      height: 200px;
      font-size: 50px;
      i {
        transform: translateX(100px);
      }
    }
    .add-banner-option {
      width: 200px;
      margin-left: 80px;
    }
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
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: green;
  border-color: green;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: green;
}
.el-checkbox.is-bordered.is-checked {
  border-color: green;
}
.el-dialog__body {
  display: flex;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: green;
}
</style>