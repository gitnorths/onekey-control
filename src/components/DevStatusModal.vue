<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    :width="props.width"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    modal-class="dialog-import"
    @open="handleOpen"
    @opened="handleOpened"
  >
    <vxe-table
      border
      show-overflow
      :column-config="{ resizable: true }"
      :loading="loading"
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'row' }"
    >
      <vxe-column field="stationName" title="站所" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ row.stationName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.stationOid" transfer>
            <vxe-option
              v-for="item in stationOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="voltageName" title="电压等级" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ row.voltageName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.voltageOid" transfer>
            <vxe-option
              v-for="item in voltageOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="bayName" title="间隔" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ row.bayName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.bayOid" transfer>
            <vxe-option
              v-for="item in bayOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="devName" title="设备" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ row.devName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.devOid" transfer>
            <vxe-option
              v-for="item in devOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="pTypeName" title="类型" :edit-render="{}" width="120">
        <template #default="{ row }">
          <span>{{ row.pTypeName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.pTypeOid" transfer>
            <vxe-option
              v-for="item in pTypeOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column
        field="operateName"
        title="操作符"
        :edit-render="{}"
        width="120"
      >
        <template #default="{ row }">
          <span>{{ row.operateName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.operateOid" transfer>
            <vxe-option
              v-for="item in operateOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column
        field="devStatusName"
        title="刀闸状态"
        :edit-render="{}"
        width="120"
      >
        <template #default="{ row }">
          <span>{{ row.devStatusName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.devStatusOid" transfer>
            <vxe-option
              v-for="item in devStatusOptions"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
    </vxe-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit(modalFormRef)"
        >
          保存<span v-if="loading">中</span>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { mokeGet, mokePost } from "@/api";
import { ElMessage } from "element-plus";
import { filter } from "lodash";

const emits = defineEmits(["cancel", "confirm"]);
let visible = ref();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "确认信息",
  },
  width: {
    type: String,
    default: "50%",
  },
  url: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: {},
  },
});

const loading = ref(false);
const stationOptions = ref([]);
const voltageOptions = ref([]);
const bayOptions = ref([]);
const devOptions = ref([]);
const pTypeOptions = ref([]);
const operateOptions = ref([]);
const devStatusOptions = ref([]);
const tableData = ref([]);

const handleOpen = async () => {
  loading.value = true;
};

const handleOpened = async () => {
  const { data: modelMap } = await mokeGet("getModelMap"); // 获取模型映射信息
  const { data: devStatusMap } = await mokeGet("getDevStatusMap"); // 获取设备态配置映射信息
  // 站所
  const stationData = mapKey("station", modelMap.station);
  stationOptions.value = stationData;
  // 电压等级
  const voltageData = findMapKey(
    "voltage",
    modelMap.volLevel,
    props.data.station,
    props.data.voltage
  );
  voltageOptions.value = voltageData;
  // 间隔
  const bayData = findMapKey(
    "bay",
    modelMap.bay,
    props.data.station + "/" + props.data.voltage,
    props.data.bay
  );
  bayOptions.value = bayData;
  // 设备
  const devData = findMapKey(
    "dev",
    modelMap.switchMap,
    props.data.station + "/" + props.data.voltage + "/" + props.data.bay,
    props.data.dev
  );
  devOptions.value = devData;

  let pTypeData = []; // 类型
  let operateData = []; // 操作符
  let devStatusData = []; // 设备态

  devStatusMap.forEach((item) => {
    if (item.name === "operate") {
      operateData = mapKey("operate", item.info, props.data.operate);
      operateOptions.value = operateData;
    } else if (item.name === "pType") {
      pTypeData = mapKey("pType", item.info, props.data.pType);
      pTypeOptions.value = pTypeData;
    } else if (item.name === "devStatus") {
      devStatusData = mapKey("devStatus", item.info, props.data.yxValue);
      devStatusOptions.value = devStatusData;
    }
  });

  const { data } = await mokeGet("getDevstatus", {
    station: props.data.station,
  });
  if (!data?.length) return;
  const statusData = data[0].status;
  const stateObj = statusData.find((item) => {
    return item.status === props.data.state;
  });

  const stationName = props.data.station;
  tableData.value = stateObj.parseMap.map((item) => {
    return {
      ...item,
      stationName,
      stationOid: stationData.find((obj) => {
        return obj.name === props.data.station;
      }).oid,
      voltageName: stationName + "/" + item.voltage,
      voltageOid: voltageData.find((obj) => {
        return obj.name === props.data.station + "/" + item.voltage;
      }).oid,
      bayName: stationName + "/" + item.voltage + "/" + item.bay,
      bayOid: bayData.find((obj) => {
        return (
          obj.name === props.data.station + "/" + item.voltage + "/" + item.bay
        );
      }).oid,
      devName:
        stationName + "/" + item.voltage + "/" + item.bay + "/" + item.dev,
      devOid: devData.find((obj) => {
        return (
          obj.name ===
          props.data.station +
            "/" +
            item.voltage +
            "/" +
            item.bay +
            "/" +
            item.dev
        );
      }).oid,
      pTypeName: item.pType,
      pTypeOid: pTypeData.find((obj) => {
        return obj.name === item.pType;
      }).oid,
      operateName: item.operate,
      operateOid: operateData.find((obj) => {
        return obj.name === item.operate;
      }).oid,
      devStatusName: item.yxValue,
      devStatusOid: devStatusData.find((obj) => {
        return obj.name === item.yxValue;
      }).oid,
    };
  });
  console.log("tableData", tableData.value);

  loading.value = false;
};

const handleCancel = () => {
  emits("cancel", false);
};

// 设备态确认入库
const confirmDevStatus = async () => {
  // const res = await mokePost("confirmDevStatus", {
  //   station: station,
  //   bay: bay,
  //   statusname: props.data.state,
  //   isreplace: 1,
  //   devStatusInfos: [
  //     {
  //       devOid: dev,
  //       operate: operate,
  //       pType: pType,
  //       ycValue: null,
  //       yxValue: devStatus,
  //     },
  //   ],
  // });
  // if (res.code == 0) {
  //   ElMessage({
  //     message: res.desc ? res.desc : "新增成功！",
  //     type: "success",
  //   });
  // } else {
  //   ElMessage.error(res.desc ? res.desc : "新增失败，请联系管理员！");
  //   handleCancel();
  // }
};

/**
 * 模型键值对数据转换
 * type 层级类型
 * object 层级值集合
 * name 当前层级全路径名称
 * curName 当前层级名称
 **/
const findMapKey = (type, object, name, curName) => {
  let arr = [];
  for (const key in object) {
    if (key.includes(name)) {
      arr.push({
        name: key,
        oid: object[key],
      });
    }
  }
  return arr;
};

/**
 * 键值对转换
 * type 层级类型
 * object 层级值集合
 * names 当前层级名称
 *  */
const mapKey = (type, object, names) => {
  let arr = [];
  for (const key in object) {
    arr.push({
      name: key,
      oid: object[key],
    });
  }
  return arr;
};

// 监听select变化
const handleSelectChange = async (action, value) => {
  const { data: dataMap } = await mokeGet("getModelMap");
  switch (action) {
    case "station":
      {
        voltageOptions.value = [];
        bayOptions.value = [];
        devOptions.value = [];

        if (value) {
          // 电压等级
          const obj = stationOptions.value.find((item) => {
            return item.oid === value;
          });
          voltageOptions.value = findMapKey(
            "voltage",
            dataMap.volLevel,
            obj.name,
            props.data.voltage
          );
        }
      }
      break;
    case "voltage":
      {
        bayOptions.value = [];
        devOptions.value = [];

        if (value) {
          // 查询间隔
          const obj = voltageOptions.value.find((item) => {
            return item.oid === value;
          });
          bayOptions.value = findMapKey(
            "bay",
            dataMap.bay,
            obj.name,
            props.data.bay
          );
        }
      }

      break;
    case "bay":
      {
        devOptions.value = [];

        if (value) {
          const obj = bayOptions.value.find((item) => {
            return item.oid === value;
          });

          devOptions.value = findMapKey(
            "dev",
            dataMap.switchMap,
            obj.name,
            props.data.dev
          );
        }
      }

      break;

    default:
      break;
  }
};

//查询场站
const getStation = async () => {
  await mokeGet("getStation").then((res) => {
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
      stationName.value = resData.name;
      handleDevStatusByCondition(0, "/" + stationName.value, station.value); // 查询设备态信息
    }
  });
};

// 查询电压等级
const getVoltage = async (oid) => {
  await mokeGet("getVoltage", { oid }).then((res) => {
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
const getBays = async (oid) => {
  await mokeGet("getBay", { oid }).then((res) => {
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

// 查询设备态信息
const handleDevStatusByCondition = async (type, path, oid) => {
  tableLoad.value = true;
  const { data } = await mokeGet("getDevStatusByCondition", {
    type,
    path,
    oid,
  });

  tableData.value = [];
  if (!data?.length) return (tableLoad.value = false);
  tableData.value = data;
  tableLoad.value = false;
};
</script>
<style lang="scss" scoped>
</style>
