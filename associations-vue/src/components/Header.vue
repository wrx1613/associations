<template>
  <el-row>
    <el-col style="width: 300px"><el-image style="height: 40px; margin-top: 10px" fit="scale-down" :src="img" /></el-col>
    <el-col style="width: calc( 100% - 300px )">
      <div style="height: 60px">
        <el-dropdown style="float: right;margin-top: 20px; margin-right: 20px" @command="handleCommand">
          <div style="color: #fff">
            {{ user.num }} -- {{ user.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">修改头像</el-dropdown-item>
            <el-dropdown-item command="b">修改资料</el-dropdown-item>
            <el-dropdown-item command="c">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="d">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :src="user.photo" style="margin-top: 10px; margin-right: 15px; float: right"></el-avatar>
      </div>
    </el-col>
    <el-dialog :close-on-click-modal="false" :visible.sync="avatar.dialogVisible" v-loading="avatar.loading" append-to-body width="300px" style="text-align: center">
      <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">提示：修改头像后需要刷新才可生效</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="avatar.dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="info.dialogVisible" v-loading="info.loading" append-to-body>
      <el-form label-position="right" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="info.user.email"/>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="info.user.phone"/>
        </el-form-item>
        <el-form-item>
          <span style="color: #8492a6; font-size: 13px">提示：修改后需重新登陆才可生效</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="pwd.dialogVisible" v-loading="pwd.loading" append-to-body>
      <el-form label-position="right" label-width="120px">
        <el-form-item label="请输入旧密码">
          <el-input v-model="pwd.user.oldPassword" show-password />
        </el-form-item>
        <el-form-item label="请输入新密码">
          <el-input v-model="pwd.user.newPassword" show-password />
        </el-form-item>
        <el-form-item label="请确认新密码">
          <el-input v-model="pwd.user.newPassword1" show-password />
        </el-form-item>
        <el-form-item>
          <span style="color: #8492a6; font-size: 13px">提示：修改后需重新登陆才可生效</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwd.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPwd()">确 定</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
import {getRequest} from "@/utils/http";
import {getToken, removeToken} from "@/utils/auth";
import {initUser, updateUserInfo} from "@/utils/system";
import store from "@/store";
import Home from "@/views/Home";

export default {
  name: "Header",
  components: {
    Home: Home,
  },
  data(){
    return {
      img: require('../assets/logo.png'),
      avatar: {
        dialogVisible: false,
        loading: false,
      },
      info: {
        dialogVisible: false,
        loading: false,
        user: {
          email: '',
          phone: ''
        }
      },
      pwd: {
        dialogVisible: false,
        loading: false,
        user: {
          id: '',
          oldPassword: '',
          newPassword: '',
          newPassword1: ''
        }
      },
      imageUrl: '',
      headers: {Authorization: getToken()}
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false;
      }
      let fd = new FormData();
      fd.append("file", file);
      this.uploadFileRequest(this.$api.sys.user.imageUpload, fd).then(res => {
        this.imageUrl = res.fileUrl;
        this.message.success({ message: "修改成功", showClose: true })
        updateUserInfo();
      });
      return false;

      //return isJPG && isLt2M;
    },

    handleCommand(command) {
      if(command == 'a'){
        this.editAvatar();
      }
      if (command == 'b'){
        this.editInfo();
      }
      if (command == 'c'){
        this.editPwd();
      }
      if(command == 'd'){
        this.logout();
      }
    },
    editAvatar(){
      this.avatar.dialogVisible = true;
      this.avatar.loading = false;
    },
    editInfo(){
      this.info.dialogVisible = true;
      this.info.loading = true;
      this.info.user = JSON.parse(JSON.stringify(this.user));
      this.info.loading = false;
    },
    editPwd(){
      this.pwd.dialogVisible = true;
      this.pwd.loading = true;
      this.pwd.user = {
        id: '',
        oldPassword: '',
        newPassword: '',
        newPassword1: ''
      };
      this.pwd.user.id = this.user.id;
      this.pwd.loading = false;
    }, submitInfo(){
      this.info.loading = true;
      this.jsonRequest(this.$api.sys.user.updateInfo, this.info.user).then(()=> {
        this.info.dialogVisible = false;
        this.message.success({ message: "修改信息成功", showClose: true })
        updateUserInfo();
      }).finally(()=> {
        this.info.loading = false;
      })
    },
    submitPwd(){
      this.pwd.loading = true;
      if (this.pwd.user.newPassword != this.pwd.user.newPassword1){
        this.pwd.loading = false;
        this.message.error({ message: "两段密码不一致", showClose: true })
        return;
      }
      this.jsonRequest(this.$api.sys.user.updatePwd, this.pwd.user).then((res)=> {
        if (res == 'error'){
          return ;
        }
        this.pwd.dialogVisible = false;
        this.message.success({ message: "修改密码成功", showClose: true })
        updateUserInfo();
      }).finally(()=> {
        this.pwd.loading = false;
      })
    },
    logout(){
      getRequest(this.$api.logout).then(resp => {
        /* 将菜单储存在store中 */
        removeToken();
        store.commit("initMenu", []);
        store.commit("initUser", '');
        store.commit("initDict", []);
        location.reload();
        this.$router.push('/');
      });
    },
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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

.avatar-uploader i{
  line-height: 178px;
}
</style>
