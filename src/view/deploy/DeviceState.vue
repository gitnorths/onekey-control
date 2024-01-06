<template>
  <div class="oc-box device-state">
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
        <el-form-item label="电压等级">
          <el-select
            v-model="formInline.voltage"
            placeholder="请选择"
            clearable
          >
            <el-option label="电压等级1" value="1" />
            <el-option label="电压等级2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="formInline.classification"
            placeholder="请选择"
            clearable
          >
            <el-option label="分类1" value="1" />
            <el-option label="分类2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onSubmit">批量确认</el-button>
          <el-button type="primary" @click="onSubmit">一键确认</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <div class="device-state__text">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">龙湖变-梧220-设备态解析结果</el-text>
        </dv-decoration-11>
      </div>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        style="width: 100%"
      >
        <el-table-column prop="index" label="序号" width="70" />
        <el-table-column prop="state" label="状态" />
        <el-table-column prop="condition" label="条件" />
        <el-table-column prop="parseResults" label="解析结果" />
        <el-table-column prop="Signal" label="修正/确认">
          <template #default="scope">
            <el-link
              @click="handleEdit(scope.$index, scope.row)"
              type="success"
            >
              修正
            </el-link>
            <el-link
              @click="handleEdit(scope.$index, scope.row)"
              type="success"
            >
              确认
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";

const formInline = reactive({
  station: "",
  voltage: "",
  classification: "",
});

const onSubmit = () => {
  console.log("submit!");
};

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
    if (rowIndex % tableData.length === 0) {
      return {
        rowspan: tableData.length,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

const tableData = [
  {
    index: "1",
    state: "运行状态",
    condition: "220kV梧220开关在“合位”",
    parseResults: "220kV/梧220/开关/在/“/合位/”",
  },
  {
    index: "1",
    state: "运行状态",
    condition: "220kV梧220东刀闸在“合位”",
    parseResults: "220kV/梧220/开关/在/“/合位/”",
  },
  {
    index: "1",
    state: "运行状态",
    condition: "220kV梧220开关在“合位”",
    parseResults: "220kV/梧220/开关/在/“/合位/”",
  },
  {
    index: "1",
    state: "运行状态",
    condition: "220kV梧220开关在“合位”",
    parseResults: "220kV/梧220/开关/在/“/合位/”",
  },
];
</script>

<style lang="scss" scoped>
.device-state {
  &__text {
    display: flex;
    justify-content: center;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    .el-text {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>