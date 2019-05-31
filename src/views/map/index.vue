<template>
  <div class="dashboard-container">
    <el-amap :zoom="zoom" :amap-manager="amapManager" :events="events" vid="amap" class="amap-demo" />
  </div>
</template>
<script>
import VueAMap from 'vue-amap'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'Dashboard',
  data() {
    return {
      zoom: 12,
      amapManager,
      events: {
        init(o) {}
      }
    }
  },
  created() {

  },
  methods: {

  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.amap-demo {
  height: calc(100vh - 84px);
}

</style>
