<template>
  <div class="oc-box">
    <div class="oc-box__header">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select
            v-model="station"
            placeholder="请选择"
            clearable
            filterable
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
            filterable
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
            filterable
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
        <!-- <el-form-item label="设备">
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
        </el-form-item> -->
      </el-form>
    </div>
    <div class="oc-box__main">
      <el-table
        :data="tableData"
        v-loading="loading"
        height="75vh"
        style="width: 100%"
      >
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column
            v-if="item.prop == 'operator'"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
          >
            <template #default="scope">
              <el-link type="warning" @click="handleOperator(scope.row, 1)">
                绑定
              </el-link>
              &nbsp;
              <el-link
                v-if="scope.row.digitals.length > 0"
                type="danger"
                @click="handleOperator(scope.row, 2)"
              >
                解绑
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
          />
        </template>
      </el-table>
    </div>
    <!-- SCD导入模型关联 START -->
    <ConditionModal
      v-model="conditionVisible"
      :title="conditionTitle"
      :width="conditionWidth"
      :data="conditionData"
      :station="conditionStation"
      @confirm="onConditionConfirm"
      @cancel="onConditionCancel"
    ></ConditionModal>
    <!-- SCD导入模型关联 END -->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet, mokePost } from "@/api";
import { baseUrl } from "@/config";
import { map } from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
import ConditionModal from "./components/condition.vue";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);
const voltage = ref(null);
const voltageName = ref(null);
const voltageOptions = ref([]);
const bay = ref(null);
const bayName = ref(null);
const bayOptions = ref([]);
const device = ref(null);
const deviceName = ref(null);
const deviceOptions = ref([]);

const loading = ref(true);
const tableData = ref([]);
const tableColumns = ref([
  { prop: "index", label: "序号", width: "80px", align: "center" },
  { prop: "path", label: "路径" },
  { prop: "name", label: "名称", width: "150px" },
  { prop: "oid", label: "OID", width: "120px" },
  { prop: "digitalsName", label: "关联信号", align: "center" },
  { prop: "operator", label: "操作", width: "200px", align: "center" },
]);

// 绑定信息
const conditionVisible = ref(false);
const conditionTitle = ref(null);
const conditionWidth = ref(null);
const conditionData = ref(null);
const conditionStation = ref(null);

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

      const resData = res.data[1];
      station.value = resData.oid;
      stationName.value = resData.name;
      // getDigtal(resData.name, resData.oid); // 查询信号
      getVoltage(station.value); // 查询电压等级
      getSwitchByCondition(0, "/" + stationName.value, station.value); // 查询刀闸列表
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
        voltageOptions.value = [];
        bayOptions.value = [];
        deviceOptions.value = [];

        if (value) {
          getVoltage(value); // 查询电压等级
          const obj = stationOptions.value.find((item) => {
            return item.oid === value;
          });
          stationName.value = obj.name;
          getSwitchByCondition(0, "/" + stationName.value, value); // 查询刀闸列表
        } else {
          getSwitchByCondition(0); // 查询刀闸列表
        }
      }

      break;
    case "voltage":
      {
        bay.value = null;
        device.value = null;
        bayOptions.value = [];
        deviceOptions.value = [];
        tableData.value = [];

        if (value) {
          getBays(value); // 查询间隔
          const obj = voltageOptions.value.find((item) => {
            return item.oid === value;
          });
          voltageName.value = obj.name;
          getSwitchByCondition(
            1,
            "/" + stationName.value + "/" + voltageName.value,
            value
          ); // 查询刀闸列表
        } else {
          getSwitchByCondition(0, "/" + stationName.value, station.value); // 查询刀闸列表
        }
      }

      break;
    case "bay":
      {
        device.value = null;
        deviceOptions.value = [];
        tableData.value = [];

        if (value) {
          getDevice(value); // 查询设备

          const obj = bayOptions.value.find((item) => {
            return item.oid === value;
          });

          bayName.value = obj.name;
          getSwitchByCondition(
            2,
            "/" +
              stationName.value +
              "/" +
              voltageName.value +
              "/" +
              bayName.value,
            value
          ); // 查询刀闸列表
        } else {
          getSwitchByCondition(
            1,
            "/" + stationName.value + "/" + voltageName.value,
            voltage.value
          ); // 查询刀闸列表
        }
      }

      break;
    case "device":
      {
        if (value) {
          getDevice(value); // 查询设备

          const obj = deviceOptions.value.find((item) => {
            return item.oid === value;
          });

          deviceName.value = obj.name;
          getSwitchByCondition(
            2,
            "/" +
              stationName.value +
              "/" +
              voltageName.value +
              "/" +
              bayName.value +
              "/" +
              deviceName.value,
            value
          ); // 查询刀闸列表
        }
      }

      break;

    default:
      break;
  }
};

// 查询刀闸信息列表
const getSwitchByCondition = async (type, path, oid) => {
  loading.value = true;
  const { data } = await mokeGet("getSwitchByCondition", {
    type,
    path,
    oid,
  });

  tableData.value = [];
  if (!data?.length) return (loading.value = false);
  let arrs = [];
  data.forEach((item, i) => {
    arrs.push({
      ...item,
      index: i + 1,
      // isDigitals: item.digitals.length > 0 ? "是" : "否",
      digitalsName: !item?.digitals?.length
        ? "-"
        : map(item.digitals, "name").join(", "),
    });
  });
  tableData.value = arrs;

  loading.value = false;
};

// 绑定操作
const handleOperator = async (row, type) => {
  if (row.digitals.length > 0 && type == 2) {
    ElMessageBox.confirm(`确定取消 ${row.oid} 的当前关联?`, "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      title: "",
      type: "warning",
    })
      .then(async () => {
        const res = await mokePost("ClearDigtalRelation", {
          switchOid: row.oid,
          digitalOids: row.digitals[0].oid,
        });
        if (res.code == 0) {
          ElMessage({
            message: res.desc ? res.desc : "关联取消成功！",
            type: "success",
          });
        } else {
          ElMessage.error(res.desc ? res.desc : "关联失败，请联系管理员！");
        }
      })
      .catch(() => {});
  }
  if (type == 1) {
    conditionVisible.value = !conditionVisible.value;
    conditionTitle.value = "绑定信息";
    conditionWidth.value = "600px";
    conditionData.value = row;
    conditionStation.value = station.value;
  }
};

// 绑定确认
const onConditionConfirm = (oid) => {
  conditionVisible.value = false;
  console.log("oid", oid);
};

// 绑定取消
const onConditionCancel = () => {
  conditionVisible.value = false;
};

onMounted(() => {
  getStation();
});
</script>
