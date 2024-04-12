<template>
  <div class="oc-box">
    <div class="oc-box__header oc-view">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="选择场站">
          <el-select
            v-model="formInline.station"
            placeholder="请选择"
            clearable
            @change="onStation"
          >
            <el-option
              v-for="(item, i) in stations"
              :key="i"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级">
          <el-select
            v-model="formInline.voltage"
            placeholder="请选择"
            clearable
            @change="onVoltage"
          >
            <el-option
              v-for="(item, i) in voltages"
              :key="i"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔">
          <el-select
            v-model="formInline.bay"
            placeholder="请选择"
            clearable
            @change="onBay"
          >
            <el-option
              v-for="(item, i) in bays"
              :key="i"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select
            v-model="formInline.device"
            placeholder="请选择"
            clearable
            @change="onDevice"
          >
            <el-option
              v-for="(item, i) in devices"
              :key="i"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main oc-view">
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
import { mokeGet } from "../../api/";

let stations = reactive([]);
let voltages = reactive([]);
let bays = reactive([]);
let devices = reactive([]);
let digtals = reactive([]);

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

// 监听站所变化
const onStation = (value) => {
  if (value) {
    mokeGetApi("voltage", value);
    formInline.voltage = "";
    formInline.bay = "";
    formInline.device = "";
  }
};

// 监听电压等级变化
const onVoltage = (value) => {
  if (value) {
    mokeGetApi("bay", value);
    formInline.bay = "";
    formInline.device = "";
  }
};

// 监听间隔变化
const onBay = (value) => {
  if (value) {
    mokeGetApi("device", value);
    formInline.device = "";
  }
};

// 监听设备变化
const onDevice = (value) => {};

const mokeGetApi = async (name, guid = null) => {
  let apiName = "";
  switch (name) {
    case "station":
      apiName = "getStation";
      break;
    case "voltage":
      apiName = "getVoltage";
      break;
    case "bay":
      apiName = "getBay";
      break;
    case "device":
      apiName = "getSwitch";
      break;
    case "digtal":
      apiName = "getDigtal";
      break;

    default:
      break;
  }

  await mokeGet(apiName, {
    oid: guid,
  })
    .then((res) => {
      if (name == "station") stations = res?.data || [];
      if (name == "voltage") voltages = res?.data || [];
      if (name == "bay") bays = res?.data || [];
      if (name == "device") devices = res?.data || [];
      if (name == "digtal") digtals = res?.data || [];
    })
    .catch((error) => {
      console.error("获取信息出错：", error);
    });
};

// 获取站所信息
mokeGetApi("station");
</script>