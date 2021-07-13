<template>
  <div>
    <h1>系统繁忙</h1>
    <div v-html=massage></div>
    <router-link to="/">
      <el-button>返回首页</el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return{
      massage: ''
    }
  },
  mounted() {
    this.massage = this.$route.params.data;
    this.massage = this.massage.replaceAll(/\r\n/g, '</p><p>');
    this.massage = '<p>' + this.massage + '</p>';
  }
}
</script>

<style scoped>

</style>
