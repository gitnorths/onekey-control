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
        <el-form-item label="间隔">
          <el-select v-model="formInline.bay" placeholder="请选择" clearable>
            <el-option label="间隔1" value="1" />
            <el-option label="间隔2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="formInline.device" placeholder="请选择" clearable>
            <el-option label="设备1" value="1" />
            <el-option label="设备2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="序号" width="70" />
        <el-table-column prop="stationName" label="场站" />
        <el-table-column prop="voltageLevel" label="电压等级" />
        <el-table-column prop="bay" label="间隔" />
        <el-table-column prop="dz" label="刀闸" />
        <el-table-column prop="Signal" label="关联信号">
          <template #default="scope">
            <el-link
              @click="handleEdit(scope.$index, scope.row)"
              type="success"
            >
              信号关联
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
  bay: "",
  device: "",
});

const onSubmit = () => {
  console.log("submit!");
};

const tableData = [
  {
    index: "1",
    stationName: "220kV龙湖变",
    voltageLevel: "220kV",
    bay: "264间隔",
    dz: "264刀闸",
  },
  {
    index: "2",
    stationName: "220kV龙湖变",
    voltageLevel: "220kV",
    bay: "264间隔",
    dz: "264刀闸",
  },
  {
    index: "3",
    stationName: "220kV龙湖变",
    voltageLevel: "220kV",
    bay: "264间隔",
    dz: "264刀闸",
  },
  {
    index: "4",
    stationName: "220kV龙湖变",
    voltageLevel: "220kV",
    bay: "264间隔",
    dz: "264刀闸",
  },
];
</script>