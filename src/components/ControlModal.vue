<template>
  <el-dialog v-model="visible" :title="title" :width="props.width" :show-close="false" :close-on-click-modal="false"
    :close-on-press-escape="false" destroy-on-close modal-class="dialog-import" @opened="handleOpened">
    <el-form ref="modalFormRef" :model="modalForm" :inline="true">
      <el-collapse v-model="activeName" class="collapse">
        <el-collapse-item title="操作任务" name="1">
          <div>名称：{{ modalForm.taskName }}</div>
          <el-form-item v-for="(item, i) in modalForm.tasks" :key="i" :prop="'tasks.' + i"
            :rules="{ required: true, message: '不能为空！', trigger: 'blur', }">
            <el-select v-model="modalForm.tasks[i].name" placeholder="请选择" filterable :style='`width:
              ${modalForm.tasks[i].name.length * 40}px`'>
              <el-option v-for="(value) in item.data" :key="value" :label="value" :value="value" />
            </el-select>
            <el-icon class="remove-icon" @click.prevent="removeSelected('task', i, item)">
              <Remove />
            </el-icon>
          </el-form-item>
          <el-button type="primary" :disabled="modalForm.steps.length >= stepOptions.length" :icon="Plus"
            @click="addControl('task')" />
        </el-collapse-item>
        <el-collapse-item title="操作步骤" name="2">
          <el-form-item v-for="(item, index) in modalForm.steps" :key="index" :prop="'steps.' + index"
            :rules="{ required: true, message: '操作步骤不能为空！', trigger: 'blur', }">
            <el-select v-model="modalForm.steps[index]" placeholder="请选择" filterable>
              <el-option v-for="value in stepOptions" :key="value" :label="value" :value="value" />
            </el-select>
            <el-icon class="remove-icon" @click.prevent="removeSelected('step', index, item)">
              <Remove />
            </el-icon>
          </el-form-item>
          <el-button type="primary" :disabled="modalForm.steps.length >= stepOptions.length" :icon="Plus"
            @click="addControl('step')" />
        </el-collapse-item>
        <el-collapse-item title="操作前条件" name="3">
          <el-form-item v-for="(item, index) in modalForm.conditions" :key="index"
            :prop="'conditions.' + index + '.value'"
            :rules="{ required: true, message: '操作前条件不能为空！', trigger: 'blur', }">
            <el-select v-model="modalForm.conditions[index]" placeholder="请选择" filterable>
              <el-option v-for="value in conditionOptions" :key="value" :label="value" :value="value" />
            </el-select>
            <el-icon class="remove-icon" @click.prevent="removeSelected('condition', index, item)">
              <Remove />
            </el-icon>
          </el-form-item>
          <el-button type="primary" :disabled="modalForm.conditions.length >= conditionOptions.length" :icon="Plus"
            @click="addControl('condition')" />
        </el-collapse-item>
        <el-collapse-item title="目标状态" name="4">
          <el-form-item v-for="(item, index) in modalForm.status" :key="index" :prop="'status.' + index + '.value'"
            :rules="{ required: true, message: '目标状态不能为空！', trigger: 'blur', }">
            <el-select v-model="modalForm.status[index]" placeholder="请选择" filterable>
              <el-option v-for="value in statusOptions" :key="value" :label="value" :value="value" />
            </el-select>
            <el-icon class="remove-icon" @click.prevent="removeSelected('status', index, item)">
              <Remove />
            </el-icon>
          </el-form-item>
          <el-button type="primary" :disabled="modalForm.status.length >= statusOptions.length" :icon="Plus"
            @click="addControl('status')" />
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit(modalFormRef)">
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
import { filter, forIn } from "lodash";
import { Plus } from '@element-plus/icons-vue'


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

const title = ref(`操作任务`); // 弹窗标题
const loading = ref(false); // 加载状态
const activeName = ref("1"); // 当前激活的步骤
const modalFormRef = ref(); // 表单实例
const taskOptions = ref([]); // 操作任务选项
const stepOptions = ref([]); // 操作步骤选项
const conditionOptions = ref([]); // 操作前条件选项
const statusOptions = ref([]); // 目标状态选项
const initData = {
  taskName: "",
  tasks: [],
  steps: [{ value: '', }],
  conditions: [{ value: '', }],
  status: [{ value: '', }],
}
const modalForm = reactive({ ...initData });

// 页面加载完成后初始化数据
const handleOpened = () => {


  title.value = `操作任务【${props.data.taskName}】${props.title}`; // 弹窗标题
  // 表单数据初始化
  modalForm.taskName = props.data.taskName;

  console.log('tasks', props.data.task.parseMap, modalForm.tasks);
  forIn(props.data.task.parseMap, (value, key) => {
    modalForm.tasks.push({
      name: value,
      data: [props.data.task.parseMap[key]],
    });
  });
  console.log(modalForm.tasks);

  modalForm.steps = stepOptions.value = props.data.opt_step.rawInfo.filter((item) => {
    return item !== undefined && item !== '' && item !== null;
  });
  modalForm.conditions = conditionOptions.value = props.data.pre_condition.rawInfo.filter((item) => {
    return item !== undefined && item !== '' && item !== null;
  });
  modalForm.status = statusOptions.value = props.data.dst_status.rawInfo.filter((item) => {
    return item !== undefined && item !== '' && item !== null;
  });


};

// 添加条件
const addControl = (type) => {
  if (type === 'step') {
    modalForm.steps.push({
      value: '',
    });
  } else if (type === 'condition') {
    modalForm.conditions.push({
      value: '',
    });
  } else if (type === 'status') {
    modalForm.status.push({
      value: '',
    });
  }
};

// 移除已选条件
const removeSelected = (type, index, item) => {
  if (type === 'step') {
    modalForm.steps.splice(index, 1);
  } else if (type === 'condition') {
    modalForm.conditions.splice(index, 1);
  } else if (type === 'status') {
    modalForm.status.splice(index, 1);
  }
};

// 确认提交
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

// 取消
const handleCancel = () => {
  Object.assign(modalForm, initData);
  emits("cancel", false);
};

// 设备态确认入库
const confirmDevStatus = async () => { };

</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
  padding: 10px 0;
}

.collapse {
  min-height: 16vh;
  max-height: 65vh;
  overflow-y: auto;
}

.remove-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 10;
  font-size: 20px;
  cursor: pointer;
  background-color: #ff0000;
  border-radius: 50%;
}
</style>
