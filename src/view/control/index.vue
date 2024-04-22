<template>
  <div class="oc-box oc-flex device-state">
    <div class="oc-box__header oc-view">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select v-model="station" placeholder="请选择" clearable filterable
            @change="handleSelectChange('station', $event)">
            <el-option v-for="item in stationOptions" :key="item.oid" :label="item.name" :value="item.oid" />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔">
          <el-select v-model="bay" placeholder="请选择" clearable filterable @change="handleSelectChange('bay', $event)">
            <el-option v-for="item in bayOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onModalImport">
            顺控票导入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main oc-view">
      <div class="device-state__text" v-if="false">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-设备态解析结果</el-text>
        </dv-decoration-11>
      </div>
      <!-- <div v-if="!tableData.length" class="oc-empty">
        <el-empty description="暂无数据" />
      </div> -->
      <!-- :span-method="objectSpanMethod" -->
      <el-table v-if="tableLoad || tableData.length" :data="tableData" v-loading="tableLoad" border stripe
        empty-text="暂无数据" class="oc-table">
        <template v-for="(item, i) in tableColumn" :key="i">
          <el-table-column v-if="item.prop == 'operator'" :prop="item.prop" :label="item.label"
            :width="item.width ? item.width : null" :align="item.align ? item.align : null">
            <template #default="scope">
              <el-button type="warning" size="small" @click="handleConfirm(scope.$index, scope.row)">
                确认
              </el-button>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop === 'stepName'" :prop="item.prop" :label="item.label"
            :width="item.width ? item.width : null" :align="item.align ? item.align : null"
            :minWidth="item.minWidth ? item.minWidth : null">
            <template #default="scope">
              <div v-for="item in scope.row.stepName" :key="item">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop === 'conditionName'" :prop="item.prop" :label="item.label"
            :width="item.width ? item.width : null" :align="item.align ? item.align : null"
            :minWidth="item.minWidth ? item.minWidth : null">
            <template #default="scope">
              <div v-for="item in scope.row.conditionName" :key="item">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop === 'statusName'" :prop="item.prop" :label="item.label"
            :width="item.width ? item.width : null" :align="item.align ? item.align : null"
            :minWidth="item.minWidth ? item.minWidth : null">
            <template #default="scope">
              <div v-for="item in scope.row.statusName" :key="item">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.prop" :label="item.label" :width="item.width ? item.width : null"
            :align="item.align ? item.align : null" :minWidth="item.minWidth ? item.minWidth : null" />
        </template>
      </el-table>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
    <!-- 导入信息弹窗 -->
    <UploadModal v-model="uploadVisible" :title="uploadTitle" :width="uploadWidth" :url="uploadUrl"
      @confirm="uploadConfirm" @cancel="uploadCancel"></UploadModal>
    <!-- 确认信息弹窗 -->
    <ControlModal v-model="modalVisible" :title="modalTitle" :width="modalWidth" :data="modalData"
      @confirm="modalConfirm" @cancel="modalCancel"></ControlModal>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import UploadModal from "@/components/UploadModal.vue";
import ControlModal from "@/components/ControlModal.vue";

const router = useRouter();

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

const bay = ref(null);
const bayOptions = ref([]);

const tableLoad = ref(true);
const tableData = ref([]);
const tableCache = ref([]);
const tableColumn = ref([
  { prop: "index", label: "序号", width: "80px", align: "center" },
  { prop: "taskName", label: "操作任务", minWidth: "150px" },
  { prop: "stepName", label: "操作步骤", minWidth: "150px" },
  { prop: "conditionName", label: "操作前条件", minWidth: "300px" },
  { prop: "statusName", label: "目标状态", minWidth: "200px" },
  { prop: "operator", label: "操作", width: "150px", align: "center" },
]);

// 导入信息
const uploadVisible = ref(false);
const uploadTitle = ref(null);
const uploadWidth = ref(null);
const uploadUrl = ref(null);

// 确认信息
const modalVisible = ref(false);
const modalTitle = ref(null);
const modalWidth = ref(null);
const modalData = ref({});

//查询场站
const getStation = () => {
  mokeGet("getStation")
    .then((res) => {
      if (res.data.length > 0) {
        stationOptions.value = res.data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.oid,
          };
        });

        const resData = res.data[1];
        station.value = resData.oid;
        stationName.value = resData.name;
        tableLoad.value = false;
        getOperatorTab(resData.name); // 查询设备态信息
      }
    })
    .catch((error) => {
      tableLoad.value = false;
    });
};

// 查询设备态信息
const getOperatorTab = (station) => {
  tableLoad.value = true;
  mokeGet("getOptab", {
    station,
  }).then((res) => {
    if (!res?.data) return (tableLoad.value = false);
    tableData.value = [];
    let bayArr = []; // bay数组
    for (let i = 0; i < res.data.length; i++) {
      const { bay, optab: opTabs } = res.data[i];
      bayArr.push(bay);
      opTabs.forEach((item) => {
        tableCache.value.push({
          ...item,
          index: tableCache.value.length + 1,
          taskName: item.task.rawInfo,
          stepName: item.opt_step.rawInfo,
          conditionName: item.pre_condition.rawInfo,
          statusName: item.dst_status.rawInfo
        });
      })
    }
    bayOptions.value = bayArr;
    bay.value = bayArr?.length ? bayArr[0] : null;
    handleSelectChange('bay', bayArr?.length ? bayArr[0] : null);
    tableLoad.value = false;
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
        getOperatorTab(obj.name);
      }
      break;
    case "bay":
      {
        if (!value) {
          tableData.value = tableCache.value
        } else {
          tableData.value = tableCache.value.filter((item) => {
            return item.taskName.includes(value);
          });
        }
      }
      break;
    default:
      break;
  }
};

// 导入
const onModalImport = () => {
  ElMessageBox.confirm("导入前，请确认配置是否完善?", "Warning", {
    confirmButtonText: "继续导入",
    cancelButtonText: "去配置",
    closeOnPressEscape: false, //按下 ESC 键关闭弹窗
    closeOnClickModal: false, //点击遮罩关闭弹窗
    distinguishCancelAndClose: true, //区分取消与关闭
    type: "warning",
    title: "提示信息",
  })
    .then(() => {
      if (!uploadVisible.value) {
        uploadVisible.value = !uploadVisible.value;
        uploadTitle.value = "顺控票模型导入";
        uploadWidth.value = "550px";
        uploadUrl.value = baseUrl + "/uploadOptabInfo";
      }
    })
    .catch((action) => {
      if (action == "cancel") {
        router.push({ path: "/setting" });
      }
    });
};

// 导入确定
const uploadConfirm = (data) => {
  uploadVisible.value = false;
  const obj = stationOptions.value.find((item) => {
    return item.name === data[0].station;
  });
  station.value = obj.oid;
  getOperatorTab(data[0].station); // 查询设备态信息
};

// 导入取消
const uploadCancel = () => {
  uploadVisible.value = false;
};

// 确认信息
const handleConfirm = (ids, rows) => {
  modalVisible.value = true;
  modalTitle.value = "确认信息";
  modalWidth.value = "800px";
  modalData.value = rows;
};

const modalConfirm = () => {
  modalCancel();
  getOperatorTab(stationName.value); // 查询设备态信息
};
// 确认信息取消
const modalCancel = () => {
  modalVisible.value = false;
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
