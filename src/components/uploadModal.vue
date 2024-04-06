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
    <el-form :model="uploadForm">
      <el-upload
        ref="uploadRef"
        v-model:file-list="uploadFileList"
        class="upload-demo"
        :action="props.url"
        :auto-upload="false"
        multiple
        accept="file"
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
      >
        <el-button type="primary">选择上传文件</el-button>
        <template #tip> </template>
      </el-upload>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleUploadCancel">取消</el-button>
        <el-button
          type="primary"
          :disabled="uploadFileList.length == 0"
          :loading="uploadLoading"
          @click="handleUploadSubmit"
        >
          上传<span v-if="uploadLoading">中</span>
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
    default: "模型导入",
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

const uploadForm = reactive({});
const uploadRef = ref();
const uploadFileList = ref([]);
const uploadLoading = ref(false);

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview = (uploadFile) => {
  console.log(uploadFile);
};

const handleSuccess = (res) => {
  uploadLoading.value = false;
  if (res.code == 0) {
    ElMessage({
      message: "上传成功！",
      type: "success",
    });
    emits("confirm", res.data);
  } else {
    ElMessage.error(res.desc);
  }
};

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`确定删除已选择的文件 - ${uploadFile.name} ?`, {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    // center: true,
    type: "warning",
  }).then(
    () => true,
    () => false
  );
};

const handleUploadSubmit = () => {
  uploadLoading.value = true;
  uploadRef.value.submit();
};

const handleUploadCancel = () => {
  emits("cancel", false);
};
</script>
<style lang="scss" scoped></style>
