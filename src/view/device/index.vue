<template>
  <div class="oc-box oc-flex device-state">
    <div class="oc-box__header oc-view">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select
            v-model="station"
            placeholder="请选择"
            clearable
            filterable
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
    <div class="oc-box__main oc-view">
      <div class="device-state__text" v-if="false">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-设备态解析结果</el-text>
        </dv-decoration-11>
      </div>
      <el-table
        v-if="tableLoad"
        :data="tableData"
        :span-method="objectSpanMethod"
        v-loading="tableLoad"
        stripe
        empty-text="暂无数据"
        class="oc-table"
      >
        <template v-for="(item, i) in tableColumn" :key="i">
          <el-table-column
            v-if="item.prop == 'operator'"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
          >
            <template #default="scope">
              <el-button
                type="warning"
                size="small"
                @click="handleConfirm(scope.$index, scope.row)"
              >
                确认
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
          />
        </template>
      </el-table>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
    <UploadModal
      v-model="uploadVisible"
      :title="uploadTitle"
      :width="uploadWidth"
      :url="uploadUrl"
      @confirm="uploadConfirm"
      @cancel="uploadCancel"
    ></UploadModal>
    <DevStatusModal
      v-model="modalVisible"
      :title="modalTitle"
      :width="modalWidth"
      :data="modalData"
      @confirm="modalConfirm"
      @cancel="modalCancel"
    ></DevStatusModal>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import UploadModal from "@/components/UploadModal.vue";
import DevStatusModal from "@/components/DevStatusModal.vue";

const router = useRouter();

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

const tableLoad = ref(true);
const tableData = ref([]);
const tableColumn = ref([
  { prop: "index", label: "序号", width: "80px", align: "center" },
  { prop: "state", label: "状态" },
  { prop: "condition", label: "条件" },
  { prop: "parseResults", label: "解析结果" },
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
        getDevstatus(resData.name); // 查询设备态信息
      }
    })
    .catch((error) => {
      tableLoad.value = false;
    });
};

// 查询设备态信息
const getDevstatus = (value) => {
  tableLoad.value = true;
  mokeGet("getDevstatus", {
    station: value,
  }).then((res) => {
    if (!res?.data) return (tableLoad.value = false);
    tableData.value = [];
    for (let i = 0; i < res.data.length; i++) {
      const resData = res.data[i];
      const dataStatus = resData.status;
      for (let j = 0; j < dataStatus.length; j++) {
        const dataMap = dataStatus[j];
        dataMap.parseMap.forEach((item) => {
          tableData.value.push({
            ...item,
            index: dataMap.sequence,
            state: dataMap.status,
            station: resData.station,
            intetval: resData.intetval,
            condition:
              item.voltage + item.bay + item.dev + item.operate + item.yxValue,
            parseResults: `${item.voltage}/${item.bay}/${item.dev}/${item.operate}/${item.yxValue}`,
            operator: dataMap.status,
          });
        });
      }
    }

    // 给列表赋值
    const colFields = ["index", "state", "operator"];
    setTableRowSpan(tableData.value, colFields);
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
        getDevstatus(obj.name);
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
        uploadTitle.value = "设备态模型导入";
        uploadWidth.value = "650px";
        uploadUrl.value = baseUrl + "/uploadDevstatus";
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
  getDevstatus(data[0].station); // 查询设备态信息
};

// 导入取消
const uploadCancel = () => {
  uploadVisible.value = false;
};

// 确认信息
const handleConfirm = (ids, rows) => {
  console.log(ids, rows);
  modalVisible.value = true;
  modalTitle.value = "确认信息";
  modalWidth.value = "80%";
  modalData.value = rows;
};

const modalConfirm = () => {
  modalCancel();
  getDevstatus(stationName.value); // 查询设备态信息
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
