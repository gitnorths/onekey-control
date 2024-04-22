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
    @opened="handleOpened"
  >
    <vxe-table
      border
      show-overflow
      keep-source
      ref="tableRef"
      :loading="loading"
      :data="tableData"
      :edit-rules="tableRules"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      :valid-config="{ msgMode: 'full' }"
    >
      >
      <vxe-column field="stationOid" title="站所" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatData("station", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.stationOid"
            transfer
            @change="handleSelectChange('station', row)"
          >
            <vxe-option
              v-for="item in row.stationData"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="voltageOid" title="电压等级" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatData("voltage", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.voltageOid"
            transfer
            @change="handleSelectChange('voltage', row)"
          >
            <vxe-option
              v-for="item in row.voltageData"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="bayOid" title="间隔" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatData("bay", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.bayOid"
            transfer
            @change="handleSelectChange('bay', row)"
          >
            <vxe-option
              v-for="item in row.bayData"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="devOid" title="设备" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatData("dev", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.devOid"
            transfer
            @change="handleSelectChange('dev', row)"
          >
            <vxe-option
              v-for="item in row.devData"
              :key="item.oid"
              :value="item.oid"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="pTypeOid" title="类型" :edit-render="{}" width="120">
        <template #default="{ row }">
          <span>{{ formatData("pType", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.pTypeOid"
            transfer
            @change="handleSelectChange('pType', row)"
          >
            <vxe-option
              v-for="item in row.pTypeData"
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
          <span>{{ formatData("operate", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.operateOid"
            transfer
            @change="handleSelectChange('operate', row)"
          >
            <vxe-option
              v-for="item in row.operateData"
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
          <span>{{ formatData("devStatus", row) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select
            v-model="row.devStatusOid"
            transfer
            @change="handleSelectChange('devStatus', row)"
          >
            <vxe-option
              v-for="item in row.devStatusData"
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
        <el-button type="primary" :loading="loading" @click="handleSubmit">
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
import { filter, findIndex } from "lodash";
import { v, VXETable } from "vxe-table";

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

const loading = ref(true);
const tableRef = ref(null);
const tableData = ref([]);
const tableRules = ref({
  stationOid: [{ required: true, message: "站所不能为空！" }],
  voltageOid: [{ required: true, message: "电压等级不能为空！" }],
  bayOid: [{ required: true, message: "间隔不能为空！" }],
  devOid: [{ required: true, message: "设备不能为空！" }],
  pTypeOid: [{ required: true, message: "类型不能为空！" }],
  operateOid: [{ required: true, message: "操作符不能为空！" }],
  devStatusOid: [{ required: true, message: "刀闸状态不能为空！" }],
});

// 监听打开事件
const handleOpened = async () => {
  const { data: modelMap } = await mokeGet("getModelMap"); // 获取模型映射信息
  const { data: devStatusMap } = await mokeGet("getDevStatusMap"); // 获取设备态配置映射信息
  // 站所
  const stationData = findMapKey("station", modelMap.station);
  // 电压等级
  const voltageData = findMapKey(
    "voltage",
    modelMap.volLevel,
    props.data.station
  );
  // 间隔
  const bayData = findMapKey(
    "bay",
    modelMap.bay,
    props.data.station + "/" + props.data.voltage
  );
  // 设备
  const devData = findMapKey(
    "dev",
    modelMap.switchMap,
    props.data.station + "/" + props.data.voltage + "/" + props.data.bay
  );

  let pTypeData = []; // 类型
  let operateData = []; // 操作符
  let devStatusData = []; // 设备态

  devStatusMap.forEach((item) => {
    if (item.name === "operate") {
      operateData = findMapKey("operate", item.info);
    } else if (item.name === "pType") {
      pTypeData = findMapKey("pType", item.info);
    } else if (item.name === "devStatus") {
      devStatusData = findMapKey("devStatus", item.info);
    }
  });

  const station = props.data.station;
  const { data } = await mokeGet("getDevstatus", { station }); // 获取设备态信息
  if (!data?.length) return;
  const statusData = data[0].status;
  const stateObj = statusData.find((item) => {
    return item.status === props.data.state;
  });

  tableData.value = stateObj.parseMap.map((item) => {
    return {
      ...item,
      station,
      stationOid: stationData.find((obj) => {
        return obj.name === station;
      })?.oid,
      stationData,
      voltageOid: voltageData.find((obj) => {
        return obj.name === station + "/" + item.voltage;
      })?.oid,
      voltageData,
      bayOid: bayData.find((obj) => {
        return obj.name === station + "/" + item.voltage + "/" + item.bay;
      })?.oid,
      bayData,
      devOid: devData.find((obj) => {
        return (
          obj.name ===
          station + "/" + item.voltage + "/" + item.bay + "/" + item.dev
        );
      })?.oid,
      devData,
      pTypeOid: pTypeData.find((obj) => {
        return obj.name === item.pType;
      })?.oid,
      pTypeData,
      operateOid: operateData.find((obj) => {
        return obj.name === item.operate;
      })?.oid,
      operateData,
      devStatusOid: devStatusData.find((obj) => {
        return obj.name === item.yxValue;
      })?.oid,
      devStatusData,
    };
  });
  console.log("tableData", tableData.value);

  loading.value = false;
};

// 监听关闭事件
const handleCancel = () => {
  emits("cancel", false);
};

// 监听select变化
const handleSelectChange = async (action, row) => {
  if (!row) return;
  const { data: dataMap } = await mokeGet("getModelMap");
  switch (action) {
    case "station":
      {
        // 电压等级
        row.voltage = "";
        row.voltageOid = "";
        row.voltageData = [];
        // 间隔
        row.bay = "";
        row.bayOid = "";
        row.bayData = [];
        // 设备
        row.dev = "";
        row.devOid = "";
        row.devData = [];

        const obj = row.stationData.find((item) => {
          return item.oid === row.stationOid;
        });
        row.station = obj.name;
        row.voltageData = findMapKey("voltage", dataMap.volLevel, obj.name);
      }
      break;
    case "voltage":
      {
        // 间隔
        row.bay = "";
        row.bayOid = "";
        row.bayData = [];
        // 设备
        row.dev = "";
        row.devOid = "";
        row.devData = [];

        const obj = row.voltageData.find((item) => {
          return item.oid === row.voltageOid;
        });
        row.voltage = obj.name.replace(row.station + "/", "");
        row.bayData = findMapKey("bay", dataMap.bay, obj.name);
      }
      break;
    case "bay":
      {
        // 设备
        row.dev = "";
        row.devOid = "";
        row.devData = [];

        const obj = row.bayData.find((item) => {
          return item.oid === row.bayOid;
        });
        row.bay = obj.name.replace(row.station + "/" + row.voltage + "/", "");
        row.devData = findMapKey("dev", dataMap.switchMap, obj.name);
      }
      break;
    case "dev":
      {
        const obj = row.devData.find((item) => {
          return item.oid === row.devOid;
        });
        row.dev = obj.name.replace(
          row.station + "/" + row.voltage + "/" + row.bay + "/",
          ""
        );
        row.pTypeData = findMapKey("pType", dataMap.pTypeMap, obj.name);
        row.operateData = findMapKey("operate", dataMap.operateMap, obj.name);
      }
      break;
    case "pType":
      {
        const obj = row.pTypeData.find((item) => {
          return item.oid === row.pTypeOid;
        });
        row.pType = obj.name;
      }
      break;
    case "operate":
      {
        const obj = row.operateData.find((item) => {
          return item.oid === row.operateOid;
        });
        row.operate = obj.name;
      }
      break;
    case "devStatus":
      {
        const obj = row.devStatusData.find((item) => {
          return item.oid === row.devStatusOid;
        });
        row.devStatus = obj.name;
      }
      break;

    default:
      break;
  }
};

// 监听提交事件
const handleSubmit = async () => {
  const $table = tableRef.value;
  if ($table) {
    const errMap = await $table.validate();
    if (!errMap) {
      const updateRecords = $table.getUpdateRecords();
      const tabledatas = $table.getTableData().tableData;
      const isInterval = findIndex(tabledatas, (o) => {
        return o.bay !== props.data.intetval;
      });
      console.log("getTableData", isInterval);
      if (isInterval !== -1) {
        const type = await VXETable.modal.confirm(
          `当前第 ${isInterval + 1} 行间隔与原有不一致，是否确认继续提交？`
        );
        if (type === "cancel") return;
      }

      if (updateRecords?.length) {
        confirmDevStatus($table.getTableData().tableData);
      } else {
        VXETable.modal.message({
          status: "info",
          message: "无修改内容可提交！",
        });
      }
    } else {
      const errFullMap = await $table.fullValidate(true);
      if (errFullMap) {
        const msgList = [];
        Object.values(errMap).forEach((errList) => {
          errList.forEach((params) => {
            const { rowIndex, column, rules } = params;
            rules.forEach((rule) => {
              msgList.push(
                `第 ${rowIndex + 1} 行 ${column.title} 校验错误：${
                  rule.message
                }`
              );
            });
          });
        });
      }
    }
  }
};

// 设备态确认入库
const confirmDevStatus = async (data) => {
  visible.value = true;
  const devStatusInfos = data.map((item) => {
    return {
      devOid: item.devOid,
      operate: item.operateOid,
      pType: item.pTypeOid,
      ycValue: 0.0,
      yxValue: item.devStatusOid,
    };
  });
  const res = await mokePost("confirmDevStatus", {
    station: props.data.station,
    bay: props.data.intetval,
    statusname: props.data.state,
    isreplace: 1,
    devStatusInfos,
  });
  const errMsg = "确认入库不成功，请联系管理员！";
  visible.value = false;
  if (res.code == 0) {
    ElMessage({
      message: res.desc ? res.desc : errMsg,
      type: "success",
    });
    tableData.value = [];
    emits("confirm");
  } else {
    ElMessage.error(res.desc ? res.desc : errMsg);
    // handleCancel();
  }
};

/**
 * 键值转换
 * @param {*} action 类型 如：station、voltage、bay、dev、pType、operate、devStatus
 * @param {*} row 当前行数据
 */
const formatData = (action, row) => {
  if (!row) return "";
  if (action === "station") {
    const obj = row.stationData.find((item) => {
      return item.oid === row.stationOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "voltage") {
    const obj = row.voltageData.find((item) => {
      return item.oid === row.voltageOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "bay") {
    const obj = row.bayData.find((item) => {
      return item.oid === row.bayOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "dev") {
    const obj = row.devData.find((item) => {
      return item.oid === row.devOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "pType") {
    const obj = row.pTypeData.find((item) => {
      return item.oid === row.pTypeOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "operate") {
    const obj = row.operateData.find((item) => {
      return item.oid === row.operateOid;
    });
    return obj?.name ? obj.name : "";
  } else if (action === "devStatus") {
    const obj = row.devStatusData.find((item) => {
      return item.oid === row.devStatusOid;
    });
    return obj?.name ? obj.name : "";
  }
  return "";
};

/**
 * 转换键值对为数组格式
 * @param {*} type 层级类型
 * @param {*} object 层级值集合
 * @param {*} name 全路径名称
 * @param {*} curName 当前层级名称
 */
const findMapKey = (type, object, name) => {
  let arr = [];
  arr = Object.keys(object).map((key) => {
    return {
      name: key,
      oid: object[key],
    };
  });
  if (name) {
    arr = filter(arr, (item) => {
      return item.name.includes(name);
    });
  }
  return arr;
};
</script>
<style lang="scss" scoped>
</style>
