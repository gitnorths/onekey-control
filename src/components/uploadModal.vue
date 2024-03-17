<template>
  <el-dialog
    v-model="uploadFormVisible"
    :title="uploadTitle"
    modal-class="dialog-import"
  >
    <el-form :model="uploadForm">
      <el-upload
        ref="uploadRef"
        v-model:file-list="uploadFileList"
        class="upload-demo"
        :action="uploadUrl"
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
        <el-button @click="uploadFormVisible = false">取消</el-button>
        <!-- <el-button
            type="success"
            v-if="uploadFileList.length > 0"
            @click="uploadFormVisible = false"
          >
            预览
          </el-button> -->
        <el-button
          type="primary"
          :disabled="uploadFileList.length == 0"
          :loading="uploadLoading"
          @click="submitUpload"
        >
          上传<span v-if="uploadLoading">中</span>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElMessage, ElMessageBox } from "element-plus";

const uploadTitle = ref("模型导入");
const uploadFormVisible = ref(false);
const uploadLoading = ref(false);
const uploadForm = reactive({});
const uploadRef = ref();
const uploadUrl = ref("/api/uploadModel");
const uploadFileList = ref([]);

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview = (uploadFile) => {
  console.log(uploadFile);
};

const handleSuccess = (res) => {
  console.log(res);
  if (res.code == 0 && res?.data?.length) {
    uploadLoading.value = false;
    uploadFormVisible.value = false;
    ElMessage({
      message: "上传成功！",
      type: "success",
    });
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

const submitUpload = () => {
  uploadLoading.value = true;
  uploadRef.value.submit();
};
</script>
<style lang="scss" scoped></style>
