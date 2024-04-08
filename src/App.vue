<template>
  <div class="oc-layout">
    <div class="oc-container">
      <!-- <LayoutHeader></LayoutHeader> -->
      <div class="oc-container__body">
        <el-aside width="auto"><LayoutAside></LayoutAside></el-aside>
        <div class="oc-main">
          <dv-border-box6 :color="['#155093', '#235fa7']">
            <router-view></router-view>
          </dv-border-box6>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="AppLayout">
import LayoutHeader from "./layout/Header.vue";
import LayoutAside from "./layout/Aside.vue";
</script>
<style lang="scss" scoped>
.oc-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__body {
    flex: 1;
    display: flex;

    .el-container {
      max-height: 100%;
    }
  }

  .oc-main {
    flex: 1;
  }
}
</style>
