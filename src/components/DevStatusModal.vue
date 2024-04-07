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
      :column-config="{ resizable: true }"
      :loading="loading"
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="name" title="站所" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.name" type="text"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="role" title="电压等级" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.role" type="text"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="sex" title="间隔" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatSex(row.sex) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.sex" transfer>
            <vxe-option
              v-for="item in demo1.sexList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="age" title="设备" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.age" type="number"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="date13" title="类型" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.date13"
            type="date"
            placeholder="请选择日期"
            transfer
          ></vxe-input>
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

const formatSex = (value) => {
  if (value === "1") {
    return "男";
  }
  if (value === "0") {
    return "女";
  }
  return "";
};

const findList = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    tableData.value = [
      {
        id: 10001,
        name: "Test1",
        nickname: "T1",
        role: "Develop",
        sex: "0",
        sex2: ["0"],
        num1: 40,
        age: 28,
        address: "Shenzhen",
        date12: "",
        date13: "",
      },
    ];
  }, 300);
};

const handleOpened = () => {
  findList();
};

const handleCancel = () => {
  emits("cancel", false);
};

// 设备态确认入库
const confirmDevStatus = async () => {
  const res = await mokePost("confirmDevStatus", {
    station: modalForm.station,
    bay: modalForm.bay,
    statusname: props.data.state,
    isreplace: 1,
    devStatusInfos: [
      {
        devOid: modalForm.dev,
        operate: modalForm.operate,
        pType: modalForm.pType,
        ycValue: null,
        yxValue: modalForm.devStatus,
      },
    ],
  });

  if (res.code == 0) {
    ElMessage({
      message: res.desc ? res.desc : "新增成功！",
      type: "success",
    });
  } else {
    ElMessage.error(res.desc ? res.desc : "新增失败，请联系管理员！");
    handleCancel();
  }
};

// 查询模型映射信息
const getModelMap = async () => {
  const { data } = await mokeGet("getModelMap");

  // 站所
  stationOptions.value = mapKey("station", data.station);
  const stationArr = filter(stationOptions.value, {
    name: props.data.station,
  });
  modalForm.station = stationArr[0].oid;

  // 电压等级
  voltageOptions.value = findMapKey(
    "voltage",
    data.volLevel,
    props.data.station,
    props.data.voltage
  );
  modalForm.voltage = filter(voltageOptions.value, {
    name: props.data.station + "/" + props.data.voltage,
  })[0].oid;
  // 间隔
  bayOptions.value = findMapKey(
    "bay",
    data.bay,
    props.data.station + "/" + props.data.voltage,
    props.data.bay
  );
  modalForm.bay = filter(bayOptions.value, {
    name: props.data.station + "/" + props.data.voltage + "/" + props.data.bay,
  })[0].oid;
  // 设备
  devOptions.value = findMapKey(
    "dev",
    data.switchMap,
    props.data.station + "/" + props.data.voltage + "/" + props.data.bay,
    props.data.dev
  );
  modalForm.dev = filter(devOptions.value, {
    name:
      props.data.station +
      "/" +
      props.data.voltage +
      "/" +
      props.data.bay +
      "/" +
      props.data.dev,
  })[0].oid;
};

// 获取设备态配置映射信息
const getDevStatusMap = async () => {
  const { data } = await mokeGet("getDevStatusMap");
  data.forEach((item) => {
    if (item.name === "operate") {
      operateOptions.value = mapKey("operate", item.info, props.data.operate);
    } else if (item.name === "pType") {
      pTypeOptions.value = mapKey("pType", item.info, props.data.pType);
    } else if (item.name === "devStatus") {
      devStatusOptions.value = mapKey(
        "devStatus",
        item.info,
        props.data.yxValue
      );
    }
  });
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
      const names = name === curName ? name : name + "/" + curName;
      if (key === names) modalForm[type] = object[key];
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

    if (key === names) modalForm[type] = object[key];
  }
  return arr;
};

// 监听select变化
const handleSelectChange = async (action, value) => {
  const { data: dataMap } = await mokeGet("getModelMap");
  switch (action) {
    case "station":
      {
        modalForm.voltage = null;
        voltageOptions.value = [];

        modalForm.bay = null;
        bayOptions.value = [];

        modalForm.dev = null;
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
        modalForm.bay = null;
        bayOptions.value = [];

        modalForm.dev = null;
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
        modalForm.dev = null;
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
      stationName.value = resData.name;
      handleDevStatusByCondition(0, "/" + stationName.value, station.value); // 查询设备态信息
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
<style lang="scss" scoped></style>
