<template>
  <div class="oc-box">
    <div class="oc-box__header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="选择场站">
          <el-select
            v-model="formInline.station"
            placeholder="请选择"
            clearable
          >
            <el-option label="场站1" value="1" />
            <el-option label="场站2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="false">
          <el-button type="primary" @click="onSubmit"
            >配置全局解析字典</el-button
          >
          <el-button type="primary" @click="onSubmit">导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <div class="deploy-import">
        <el-form v-if="false">
          <el-form-item>
            <dv-decoration-11 style="width: 260px; height: 60px">
              <el-text size="large">解析进度概览</el-text>
            </dv-decoration-11>
          </el-form-item>
          <el-form-item label="场站名称">
            <el-text>龙湖变</el-text>
          </el-form-item>
          <el-form-item label="间隔总数量">
            <el-text>18</el-text>
          </el-form-item>
          <el-form-item label="已解析间隔数量">
            <el-text>12</el-text>
          </el-form-item>
          <el-form-item label="已解析成功间隔数量">
            <el-text>11</el-text>
          </el-form-item>
          <el-form-item label="已解析失败间隔数量">
            <el-text>1</el-text>
            <el-link type="success">查看失败详情</el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">解析结果确认</el-button>
          </el-form-item>
        </el-form>
        <div v-else class="oc-empty">
          <el-empty description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";

const formInline = reactive({
  station: "",
  voltage: "",
  bay: "",
  device: "",
});

const onSubmit = () => {
  console.log("submit!");
};
</script>
<style lang="scss" scoped>
.deploy-import {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.el-form) {
    .el-form-item {
      &:first-child,
      &:last-child {
        .el-form-item__content {
          justify-content: center;
        }
      }
      &:first-child {
        margin-bottom: 50px;
        font-weight: bold;
      }
    }
    .el-form-item__label {
      width: 150px;
    }
  }

  .el-text {
    min-width: 100px;
    text-align: center;
  }

  .el-link {
    margin-left: 15px;
  }
}
</style>
