<template>
  <router-view v-if="$route.meta.isLogin" />
  <router-view v-else-if="$route.meta.isError" />
  <el-container v-else>
    <el-header style="background: #de4436; padding: 0">
      <Header/>
    </el-header>
    <el-container>
      <el-aside style="height: calc( 100vh - 60px ); border-right: solid 1px #e6e6e6; background-color: #f9fbfd">
        <el-menu
            style="border-right: solid 0px #e6e6e6;"
            default-active="2"
            class="el-menu-vertical-demo"
            active-text-color="#de4436"
            background-color="#f9fbfd">
          <el-menu-item index="/home" @click="addTab({name: '首页'})">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <template v-for="(item, index) in this.menu">
            <template v-if="hasChildren(item)">
              <el-submenu :index="String(index)" :key="item.id" @click="addTab(item)">
                <template slot="title">
                  <i :class="item.icon"></i>
                  {{ item.name }}
                </template>
                <div class="child-menu" v-for="child in item.childs" :key="child.id">
                  <el-menu-item v-if="child.isShow == 1" :index="child.name" @click="addTab(child)">
                    <i :class="child.icon"></i>
                    {{ child.name }}
                  </el-menu-item>
                </div>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.name" :key="item.id" @click="addTab(item)">
                <i :class="item.icon"></i>
                {{ item.name }}
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-tabs v-model="editableTabsValue" closable type="border-card" @tab-remove="removeTab">
          <el-tab-pane
              :key="item.name"
              v-for="(item, index) in editableTabs"
              :label="item.title"
              :name="item.name"
          >
            <el-main style="height: calc( 100vh - 142px );">
              <keep-alive v-if="item.update">
                <component v-bind:is="item.component"></component>
              </keep-alive>
            </el-main>
          </el-tab-pane>
        </el-tabs>
        <div>
          <Footer/>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Login from "@/views/Login";
import {Message} from "element-ui";
export default {
  components: {
    Header: Header,
    Footer: Footer,
    Login: Login
  },
  computed: {
    menu() {
      return this.$store.state.menu;
    }
  },
  data() {
    return {
      editableTabsValue: '首页',
      editableTabs: [{
        title: '首页',
        name: '首页',
        update: true,
        component: function () {
          return import('@/views/Home')
        },
      }],
    }
  },
  methods: {
    hasChildren(menu) {
      let b = false;
      if (menu.childs && menu.childs instanceof Array) {
        menu.childs.forEach(child => {
          if (child.isShow == 1) {
            b = true;
          }
        });
      }
      return b;
    },
    addTab(targetName) {
      let b = false;
      this.editableTabs.forEach((item) => {
        if(item.name === targetName.name){
          b = true;
          item.update = false
          this.$nextTick(() => {
            item.update = true
          })
          return
        }
      })
      if(!b){
        if(targetName.name === '首页'){
          this.editableTabs.push({
            title: '首页',
            name: '首页',
            update: true,
            component: function () {
              return import('@/views/Home')
            },
          });
        }else{
          this.editableTabs.push({
            title: targetName.name,
            name: targetName.name,
            update: true,
            component: function () {
              return import('@/views' + targetName.component )
            },
          });
        }
      }
      this.editableTabsValue = targetName.name;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      if (tabs.length == 1){
        Message.info({ message: "只剩一个标签页了", showClose: true })
        return
      }
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
};
</script>
