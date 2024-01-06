<template>
  <div class="oc-layout">
    <el-container>
      <el-header> <LayoutHeader></LayoutHeader> </el-header>
      <el-container>
        <el-aside width="auto"><LayoutAside></LayoutAside></el-aside>
        <el-main>
          <dv-border-box6 :color="['#155093', '#235fa7']">
            <router-view></router-view>
          </dv-border-box6>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup name="AppLayout">
import LayoutHeader from "./layout/Header.vue";
import LayoutAside from "./layout/Aside.vue";
</script>
