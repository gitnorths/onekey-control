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
      <el-form-item label="导入装置" prop="scdProtect">
        <el-select
          v-model="modalForm.scdProtect"
          placeholder="请选择导入装置"
          clearable
          filterable
          style="width: 100%"
          @change="handleSelectChange('scdProtect', $event)"
        >
          <el-option
            v-for="item in scdProtectOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="测点组" prop="pointGroup">
        <el-select
          v-model="modalForm.pointGroup"
          placeholder="请选择测点组"
          clearable
          filterable
          style="width: 100%"
          @change="handleSelectChange('pointGroup', $event)"
        >
          <el-option
            v-for="item in pointGroupOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="遥信点" prop="scDigtal">
        <el-select
          v-model="modalForm.scDigtal"
          placeholder="请选择遥信点"
          clearable
          filterable
          style="width: 100%"
          @change="handleSelectChange('scDigtal', $event)"
        >
          <el-option
            v-for="item in scDigtalOptions"
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
          确定<span v-if="loading">中</span>
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
    default: "信息",
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
  station: {
    type: String,
    default: "",
  },
});

const loading = ref(false);
const modalFormRef = ref();
const modalForm = reactive({
  scdProtect: "",
  pointGroup: "",
  scDigtal: "",
});

const modalFormRules = reactive({
  scdProtect: [
    { required: true, message: "导入装置不能为空！", trigger: "blur" },
  ],
  pointGroup: [
    { required: true, message: "测点组不能为空！", trigger: "blur" },
  ],
  scDigtal: [{ required: true, message: "遥信点不能为空！", trigger: "blur" }],
});

const scdProtectOptions = ref([]);
const pointGroupOptions = ref([]);
const scDigtalOptions = ref([]);

const handleOpened = () => {
  modalForm.scdProtect = "";
  modalForm.pointGroup = "";
  modalForm.scDigtal = "";
  getScdProtect(props.station); // 查询导入装置;
};

const handleSubmit = async (formEl) => {
  if (!formEl) return;
  loading.value = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      setDigtalRelation();
    } else {
      loading.value = false;
    }
  });
};

const handleCancel = () => {
  emits("cancel", false);
};

// 手动关联刀闸与信号
const setDigtalRelation = async (sOid, dOid) => {
  const res = await mokePost("SetDigtalRelation", {
    switchOid: props.data.oid,
    digitalOids: modalForm.scDigtal,
  });

  if (res.code == 0) {
    ElMessage({
      message: res.desc ? res.desc : "关联成功！",
      type: "success",
    });
    emits("confirm", props.data.oid);
  } else {
    ElMessage.error(res.desc ? res.desc : "关联失败，请联系管理员！");
    handleCancel();
  }
};

// 查询导入装置
const getScdProtect = async (oid) => {
  const { data } = await mokeGet("getScdProtect", { oid });
  if (!data?.length) return;

  scdProtectOptions.value = data;
};
// 查询测点组
const getPointGroup = async (oid) => {
  const { data } = await mokeGet("getPointGroup", { oid });
  if (!data?.length) return;

  pointGroupOptions.value = data;
};

// 查询遥信点位
const getScDigtal = async (oid) => {
  const { data } = await mokeGet("getScDigtal", { oid });
  if (!data?.length) return;

  scDigtalOptions.value = data;
};

// 监听select变化
const handleSelectChange = (action, value) => {
  switch (action) {
    case "scdProtect":
      {
        modalForm.pointGroup = "";
        modalForm.scDigtal = "";
        pointGroupOptions.value = [];
        scDigtalOptions.value = [];
        if (value) {
          getPointGroup(value); // 查询测点组
        }
      }

      break;
    case "pointGroup":
      {
        // 遥信点位
        modalForm.scDigtal = "";
        scDigtalOptions.value = [];
        if (value) {
          getScDigtal(value); // 查询测点组
        }
      }

      break;
    case "scDigtal":
      {
      }

      break;

    default:
      break;
  }
};
</script>
<style lang="scss" scoped></style>
