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
  >
    <el-form :model="modalForm" label-width="120px">
      <el-form-item label="站所">
        <el-select v-model="modalForm.station" placeholder="请选择站所">
          <el-option
            v-for="item in stationOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电压等级">
        <el-select v-model="modalForm.voltage" placeholder="请选择电压等级">
          <el-option
            v-for="item in voltageOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="间隔">
        <el-select v-model="modalForm.bay" placeholder="请选择间隔">
          <el-option
            v-for="item in bayOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备">
        <el-select v-model="modalForm.dev" placeholder="请选择设备">
          <el-option
            v-for="item in devOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作">
        <el-select v-model="modalForm.operate" placeholder="请选择操作">
          <el-option
            v-for="item in operateOptions"
            :key="item.oid"
            :label="item.name"
            :value="item.oid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="点位">
        <el-select v-model="modalForm.yxValue" placeholder="请选择点位">
          <el-option
            v-for="item in yxValueOptions"
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
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          保存<span v-if="loading">中</span>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

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
});

const loading = ref(false);
const modalForm = reactive({
  station: "",
  voltage: "",
  bay: "",
  dev: "",
  operate: "",
  yxValue: "",
});

const stationOptions = ref([]);
const voltageOptions = ref([]);
const bayOptions = ref([]);
const devOptions = ref([]);
const operateOptions = ref([]);
const yxValueOptions = ref([]);

const handleSubmit = () => {
  loading.value = true;
  uploadRef.value.submit();
};

const handleCancel = () => {
  emits("cancel", false);
};
</script>
<style lang="scss" scoped></style>
