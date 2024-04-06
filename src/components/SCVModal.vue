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
    <el-form
      ref="modalFormRef"
      :model="modalForm"
      :rules="modalFormRules"
      label-width="100px"
    >
      <el-form-item label="站所" prop="station">
        <el-select
          v-model="modalForm.station"
          placeholder="请选择站所"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in stationOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电压等级" prop="voltage">
        <el-select
          v-model="modalForm.voltage"
          placeholder="请选择电压等级"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in voltageOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="间隔" prop="bay">
        <el-select
          v-model="modalForm.bay"
          placeholder="请选择间隔"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in bayOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="dev">
        <el-select
          v-model="modalForm.dev"
          placeholder="请选择设备"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in devOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="pType">
        <el-select
          v-model="modalForm.pType"
          placeholder="请选择类型"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in pTypeOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作符" prop="operate">
        <el-select
          v-model="modalForm.operate"
          placeholder="请选择操作符"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in operateOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="刀闸状态" prop="devStatus">
        <el-select
          v-model="modalForm.devStatus"
          placeholder="请选择刀闸状态"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in devStatusOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
    </el-form>
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
const modalFormRef = ref();
const modalForm = reactive({
  station: "",
  voltage: "",
  bay: "",
  dev: "",
  pType: "",
  operate: "",
  devStatus: "",
});

const modalFormRules = reactive({
  station: [{ required: true, message: "站所不能为空！", trigger: "blur" }],
  voltage: [{ required: true, message: "电压等级不能为空！", trigger: "blur" }],
  bay: [{ required: true, message: "间隔不能为空！", trigger: "blur" }],
  dev: [{ required: true, message: "设备不能为空！", trigger: "blur" }],
  pType: [{ required: true, message: "类型不能为空！", trigger: "blur" }],
  operate: [{ required: true, message: "操作符不能为空！", trigger: "blur" }],
  devStatus: [
    { required: true, message: "刀闸状态不能为空！", trigger: "blur" },
  ],
});

const stationOptions = ref([]);
const voltageOptions = ref([]);
const bayOptions = ref([]);
const devOptions = ref([]);
const pTypeOptions = ref([]);
const operateOptions = ref([]);
const devStatusOptions = ref([]);

const handleOpened = () => {
  modalForm.station = "";
  modalForm.voltage = "";
  modalForm.bay = "";
  modalForm.dev = "";
  modalForm.pType = "";
  modalForm.operate = "";
  modalForm.devStatus = "";
  getModelMap(); // 查询模型映射信息
  getDevStatusMap(); // 获取设备态配置映射信息;
};

const handleSubmit = async (formEl) => {
  if (!formEl) return;
  loading.value = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      confirmDevStatus();
    } else {
      loading.value = false;
    }
  });
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
  stationOptions.value = findMapKey(
    "station",
    data.station,
    props.data.station,
    props.data.station
  );
  // 电压等级
  voltageOptions.value = findMapKey(
    "voltage",
    data.volLevel,
    props.data.station,
    props.data.voltage
  );
  // 间隔
  bayOptions.value = findMapKey(
    "bay",
    data.bay,
    props.data.station + "/" + props.data.voltage,
    props.data.bay
  );
  // 设备
  devOptions.value = findMapKey(
    "dev",
    data.switchMap,
    props.data.station + "/" + props.data.voltage + "/" + props.data.bay,
    props.data.dev
  );
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

// 模型键值对数据转换
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

// 键值对转换
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
</script>
<style lang="scss" scoped></style>
