<template>
  <div id="userCenter">
    <el-upload
      class="avatar-uploader"
      action="http://localhost:3000/auth/setAvatar"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="{ Authorization: 'Bearer ' + token }"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <img v-else class="avatar" :src="avatar" />
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters(['token', 'avatar'])
  },
  methods: {
    async handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      await this.$store.dispatch('user/getInfo')
    }
  }
}
</script>

<style lang="scss">
#userCenter {
  padding: 20px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
