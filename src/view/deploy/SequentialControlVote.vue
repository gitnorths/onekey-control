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
            顺控票导入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <div class="device-state__text" v-if="false">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-顺控票解析结果</el-text>
        </dv-decoration-11>
      </div>
      <div v-if="!tableData.length" class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
      <el-table
        v-else
        :data="tableData"
        :span-method="objectSpanMethod"
        class="oc-table"
        stripe
        style="width: 100%"
      >
        <template v-for="(item, i) in tableColumn" :key="i">
          <el-table-column
            v-if="item.prop != 'operator'"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
          />
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : null"
            :align="item.align ? item.align : null"
            v-else
          >
            <template #default="scope">
              <!-- <el-button
                type="warning"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                修正
              </el-button> -->
              <el-button
                type="warning"
                size="small"
                @click="handleConfirm(scope.$index, scope.row)"
              >
                确认
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <UploadModal
      v-model="uploadVisible"
      :title="uploadTitle"
      :width="uploadWidth"
      :url="uploadUrl"
      @cancel="uploadCancel"
    ></UploadModal>
    <SCVModal
      v-model="modalVisible"
      :title="modalTitle"
      :width="modalWidth"
      :data="modalData"
      @confirm="modalConfirm"
      @cancel="modalCancel"
    ></SCVModal>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";
import UploadModal from "@/components/UploadModal.vue";
import SCVModal from "@/components/SCVModal.vue";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

const tableColumn = ref([
  { prop: "index", label: "序号", width: "80px", align: "center" },
  { prop: "state", label: "状态" },
  { prop: "condition", label: "条件" },
  { prop: "parseResults", label: "解析结果" },
  { prop: "operator", label: "操作", width: "150px", align: "center" },
]);
const tableData = ref([]);

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
      getOptab(resData.name); // 查询顺控票信息
    }
  });
};

// 查询顺控票信息
const getOptab = (value) => {
  mokeGet("getOptab", {
    station: value,
  }).then((res) => {
    if (!res?.data) return;
    tableData.value = [];
    const arr = [];
    for (let i = 0; i < res.data.length; i++) {
      const dataStatus = res.data[i].status;
      for (let j = 0; j < dataStatus.length; j++) {
        const dataMap = dataStatus[j];
        dataMap.parseMap.forEach((item) => {
          tableData.value.push({
            ...item,
            index: dataMap.sequence,
            state: dataMap.status,
            station: res.data[i].station,
            condition:
              item.voltage + item.bay + item.dev + item.operate + item.yxValue,
            parseResults: `${item.voltage}/${item.bay}/${item.dev}/${item.operate}/${item.yxValue}`,
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
        getOptab(obj.name);
      }
      break;

    default:
      break;
  }
};

// 导入
const onModalImport = () => {
  if (!uploadVisible.value) {
    uploadVisible.value = !uploadVisible.value;
    uploadTitle.value = "顺控票模型导入";
    uploadWidth.value = "550px";
    uploadUrl.value = baseUrl + "/uploadOptabInfo";
  }
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
  modalWidth.value = "450px";
  modalData.value = rows;
};

const modalConfirm = () => {
  modalCancel();
  getOptab(stationName.value); // 查询顺控票信息
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
