<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <router-link to="/">
        <div v-if="isCollapse" class="littleLogo" />
        <div v-else class="logo" />
      </router-link>
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
.logo{
  width: 100%;
  height: 50px;
  background: url('./logo.png') #2A394B no-repeat 20px;
  background-size: auto 26px;
}
.littleLogo{
  width: 100%;
  height: 50px;
  background: url('./littleLogo.png') #2A394B no-repeat center;
  background-size: auto 18px;
}
</style>
