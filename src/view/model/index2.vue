<template>
  <div class="oc-box">
    <div class="oc-box__header oc-view">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select
            v-model="station"
            placeholder="请选择"
            clearable
            @change="handleSelectChange('station', $event)"
          >
            <el-option
              v-for="item in stationOptions"
              :key="item.oid"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级">
          <el-select
            v-model="voltage"
            placeholder="请选择"
            clearable
            @change="handleSelectChange('voltage', $event)"
          >
            <el-option
              v-for="item in voltageOptions"
              :key="item.oid"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔">
          <el-select
            v-model="bay"
            placeholder="请选择"
            clearable
            @change="handleSelectChange('bay', $event)"
          >
            <el-option
              v-for="item in bayOptions"
              :key="item.oid"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select
            v-model="device"
            placeholder="请选择"
            clearable
            @change="handleSelectChange('device', $event)"
          >
            <el-option
              v-for="item in deviceOptions"
              :key="item.oid"
              :label="item.name"
              :value="item.oid"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onModalImport">模型导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main oc-view">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, i) in tableColumns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : null"
          :key="i"
        />
      </el-table>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
    <!-- 模型导入 START-->
    <UploadModal
      v-model="uploadVisible"
      :title="uploadTitle"
      :width="uploadWidth"
      :url="uploadUrl"
      @cancel="uploadCancel"
    ></UploadModal>
    <!-- 模型导入 END-->
    <!-- SCD导入模型关联 START -->

    <!-- SCD导入模型关联 END -->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";
import UploadModal from "@/components/UploadModal.vue";

const station = ref(null);
const stationOptions = ref([]);
const voltage = ref(null);
const voltageOptions = ref([]);
const bay = ref(null);
const bayOptions = ref([]);
const device = ref(null);
const deviceOptions = ref([]);
const tableData = ref([]);
const tableColumns = ref([
  // { prop: "index", label: "序号", width: "70px" },
  // { prop: "appName", label: "app名称" },
  // { prop: "name", label: "名称" },
  // { prop: "oid", label: "OID" },
]);

// 导入信息
const uploadVisible = ref(false);
const uploadTitle = ref(null);
const uploadWidth = ref(null);
const uploadUrl = ref(null);

//查询场站
const getStation = () => {
  mokeGet("getStation").then((res) => {
    if (res.data.length > 0) {
      stationOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });

      const resData = res.data[0];
      station.value = resData.oid;
      // getDigtal(resData.name, resData.oid); // 查询信号
      // getVoltage(resData.oid); // 查询电压等级
      getModelInfo(resData.name); // 查询模型解析结果
    }
  });
};

// 查询电压等级
const getVoltage = (oid) => {
  mokeGet("getVoltage", { oid }).then((res) => {
    if (res.data.length > 0) {
      voltageOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });
    }
  });
};

// 查询间隔
const getBays = (oid) => {
  mokeGet("getBay", { oid }).then((res) => {
    if (res.data.length > 0) {
      bayOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });
    }
  });
};

// 查询设备
const getDevice = (oid) => {
  mokeGet("getSwitch", { oid }).then((res) => {
    if (res.data.length > 0) {
      deviceOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });
    }
  });
};

// 查询信号
const getDigtal = (name, oid) => {
  mokeGet("getDigtal", {
    appName: name,
    breakOid: oid,
  })
    .then((res) => {
      if (!res?.data) return;
      tableData.value = [];
      if (res.data.length > 0) {
        tableData.value = res.data.map((item, i) => {
          return {
            ...item,
            index: i + 1,
          };
        });
      }
    })
    .catch((error) => {
      console.error("获取信息出错：", error);
    });
};

// 查询模型解析结果
const getModelInfo = (value) => {
  mokeGet("getModelInfo", {
    station: value,
  }).then((res) => {
    tableColumns.value = [];
    tableData.value = [];
    if (!res?.data) return;
    const resData = res.data[0][value];
    const column = resData[0]; // 表头
    for (const key in column) {
      if (Object.hasOwnProperty.call(column, key)) {
        const name = column[key];
        tableColumns.value.push({ prop: key, label: name });
      }
    }
    resData.shift(); // 删除数组第一项
    tableData.value = resData;
  });
};

// 监听select变化
const handleSelectChange = (action, value) => {
  switch (action) {
    case "station":
      {
        voltage.value = null;
        bay.value = null;
        device.value = null;

        if (value) {
          // getVoltage(value); // 查询电压等级
          const obj = stationOptions.value.find((item) => {
            return item.oid === value;
          });
          // getDigtal(obj.appName, value); // 查询信号
          getModelInfo(obj.name);
        } else {
          voltageOptions.value = [];
          bayOptions.value = [];
          deviceOptions.value = [];

          tableColumns.value = [];
          tableData.value = [];

          // getDigtal(); // 查询信号
        }
      }

      break;
    case "voltage":
      {
        bay.value = null;
        device.value = null;

        if (value) {
          getBays(value); // 查询间隔
          // const obj = voltageOptions.value.find((item) => {
          //   return item.oid === value;
          // });
          // getDigtal(obj.appName, value); // 查询信号
        } else {
          bayOptions.value = [];
          deviceOptions.value = [];

          // const obj = stationOptions.value.find((item) => {
          //   return item.oid === station.value;
          // });
          // getDigtal(obj.appName, station.value); // 查询信号
        }
      }

      break;
    case "bay":
      {
        device.value = null;

        if (value) {
          getDevice(value); // 查询设备

          // const obj = bayOptions.value.find((item) => {
          //   return item.oid === value;
          // });
          // getDigtal(obj.appName, value); // 查询信号
        } else {
          deviceOptions.value = [];

          // const obj = voltageOptions.value.find((item) => {
          //   return item.oid === voltage.value;
          // });
          // getDigtal(obj.appName, voltage.value); // 查询信号
        }
      }

      break;
    case "device":
      {
        if (value) {
          getDevice(value); // 查询设备

          // const obj = deviceOptions.value.find((item) => {
          //   return item.oid === value;
          // });
          // getDigtal(obj.appName, value); // 查询信号
        } else {
          // const obj = bayOptions.value.find((item) => {
          //   return item.oid === bay.value;
          // });
          // getDigtal(obj.appName, bay.value); // 查询信号
        }
      }

      break;

    default:
      break;
  }
};

const onModalImport = () => {
  if (!uploadVisible.value) {
    uploadVisible.value = !uploadVisible.value;
    uploadTitle.value = "一次模型导入";
    uploadWidth.value = "600px";
    uploadUrl.value = baseUrl + "/uploadModel";
  }
};

const uploadCancel = () => {
  uploadVisible.value = false;
};

onMounted(() => {
  getStation();
});
</script>
