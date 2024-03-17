<template>
  <div class="oc-box device-state">
    <div class="oc-box__header">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select
            v-model="station"
            placeholder="请选择"
            clearable
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
        <el-form-item>
          <el-button type="primary" @click="onModalImport">
            设备态导入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <div class="device-state__text">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-设备态解析结果</el-text>
        </dv-decoration-11>
      </div>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, i) in tableColumn"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : null"
          :key="i"
        >
          <template #default="scope">
            <el-link
              @click="handleEdit(scope.$index, scope.row)"
              type="success"
            >
              修正
            </el-link>
            <el-link
              @click="handleEdit(scope.$index, scope.row)"
              type="success"
            >
              确认
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { mokeGet } from "@/api";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

const tableColumn = ref([
  { prop: "index", label: "序号", width: "70px" },
  { prop: "state", label: "状态" },
  { prop: "condition", label: "条件" },
  { prop: "parseResults", label: "解析结果" },
]);
const tableData = ref([]);

const uploadTitle = ref("设备态导入");
const uploadFormVisible = ref(false);
const uploadLoading = ref(false);
const uploadForm = reactive({});
const uploadRef = ref();
const uploadUrl = ref("/api/uploadOptabInfo");
const uploadFileList = ref([]);

// 获取所有单元格合并数据
const spanArr = computed(() => {
  if (!tableData.value.length) return [];
  const mergeCols = ["index"]; // 需要合并的列（字段）
  return getMergeCells(tableData.value, tableColumn.value, mergeCols);
});

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  return spanArr[rowIndex][columnIndex];
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
      getDevstatus(resData.name); // 查询设备态信息
    }
  });
};

// 查询设备态信息
const getDevstatus = (value) => {
  mokeGet("getDevstatus", {
    station: value,
  }).then((res) => {
    if (!res?.data) return;
    const arr = [];
    for (let i = 0; i < res.data.length; i++) {
      const dataStatus = res.data[i].status;
      for (let j = 0; j < dataStatus.length; j++) {
        const dataMap = dataStatus[j];
        dataMap.parseMap.forEach((item) => {
          tableData.value.push({
            index: dataMap.sequence,
            state: dataMap.status,
            condition:
              item.voltage + item.inteval + item.dev + item.jieci + item.status,
            parseResults: `${item.voltage}/${item.inteval}/${item.dev}/${item.jieci}/“/${item.status}/”"`,
          });
        });
      }
    }
    console.log("tableData", tableData.value);
    // tableData.value = [
    //   {
    //     index: "1",
    //     state: "运行状态",
    //     condition: "220kV梧220开关在“合位”",
    //     parseResults: "220kV/梧220/开关/在/“/合位/”",
    //   },
    // ];
  });
};

// 监听select变化
const handleSelectChange = (action, value) => {
  switch (action) {
    case "station":
      {
        const obj = stationOptions.value.find((item) => {
          return item.oid === value;
        });
        stationName.value = obj.name;
        getDevstatus(obj.name);
      }
      break;

    default:
      break;
  }
};

const onModalImport = () => {
  uploadFormVisible.value = true;
};

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview = (uploadFile) => {
  console.log(uploadFile);
};

const handleSuccess = (res) => {
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

onMounted(() => {
  getStation();
});
</script>

<style lang="scss" scoped>
.device-state {
  &__text {
    display: flex;
    justify-content: center;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    .el-text {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
