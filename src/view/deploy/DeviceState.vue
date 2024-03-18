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
      <!-- <div class="device-state__text">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-设备态解析结果</el-text>
        </dv-decoration-11>
      </div> -->
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        style="width: 100%"
      >
        <template v-for="(item, i) in tableColumn" :key="i">
          <el-table-column
            v-if="item.prop != 'operator'"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
          />
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            v-else
          >
            <template #default="scope">
              <el-button
                type="warning"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                修正
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                确认
              </el-button>
            </template>
          </el-table-column>
        </template>
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
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

const tableColumn = ref([
  { prop: "index", label: "序号", width: "100px" },
  { prop: "state", label: "状态" },
  { prop: "condition", label: "条件" },
  { prop: "parseResults", label: "解析结果" },
  { prop: "operator", label: "操作", width: "150px" },
]);
const tableData = ref([]);

const uploadTitle = ref("设备态导入");
const uploadFormVisible = ref(false);
const uploadLoading = ref(false);
const uploadForm = reactive({});
const uploadRef = ref();
const uploadUrl = ref(baseUrl + "/uploadOptabInfo");
const uploadFileList = ref([]);

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

    // 给列表赋值
    const colFields = ["index", "state"];
    setTableRowSpan(tableData.value, colFields);
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

// 设置合并的行和列
const setTableRowSpan = (tableData, colFields) => {
  let lastItem = [];
  // 循环需要合并的列
  colFields.forEach((field, index) => {
    tableData.forEach((item) => {
      // 存值，把合并字段存入行，为了合并单元格时检索列是否含有该字段
      item.mergeCell = colFields;
      // 合并字段出现的次数
      const rowSpan = `rowspan_${field}`;
      // 比较上一次的存值和该轮的合并字段，判断是否合并到上个单元格
      if (colFields.slice(0, index + 1).every((e) => lastItem[e] === item[e])) {
        // 如果是，合并行
        item[rowSpan] = 0; // 该轮合并字段数量存0
        // 上轮合并字段数量+1
        lastItem[rowSpan] += 1;
      } else {
        // 初始化进入&& 如果不是，完成一次同类合并，lastItem重新赋值，进入下一次计算
        item[rowSpan] = 1; // 该轮合并字段第一次出现，数量存1
        // 改变比较对象，重新赋值，进行下一次计算
        lastItem = item;
      }
    });
  });
};

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (row.mergeCell.includes(column.property)) {
    const rowspan = row[`rowspan_${column.property}`];
    if (rowspan) {
      return { rowspan: rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
};
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
