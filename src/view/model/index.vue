<template>
  <div class="oc-box oc-flex">
    <div class="oc-box__header oc-view">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select v-model="station" placeholder="请选择" no-data-text="暂无数据" clearable filterable
            @change="handleSelectChange('station', $event)">
            <el-option v-for="item in stationOptions" :key="item.oid" :label="item.name" :value="item.oid" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onModalImport">模型导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <div class="oc-box__left oc-view">
        <el-table v-if="tableLoad || tableData.length" :data="tableData" :span-method="objectSpanMethod"
          v-loading="tableLoad" stripe empty-text="暂无数据" class="oc-table">
          <template v-for="(item, i) in tableColumns" :key="i">
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : null"
              :align="item.align ? item.align : null" />
          </template>
        </el-table>
        <div v-else class="oc-empty">
          <el-empty description="暂无数据" />
        </div>
      </div>
      <div class="oc-box__right oc-view">
        <el-descriptions title="导入结果详情" :column="1" v-if="tableLoad || modelInfo.length" v-loading="tableLoad">
          <el-descriptions-item v-for="item in modelInfo" :key="item.name" :label="item.name">
            <p v-for="itemData in item.data" :key="itemData">
              {{ itemData }}
            </p>
          </el-descriptions-item>
        </el-descriptions>
        <div v-else class="oc-empty">
          <el-empty description="暂无数据" />
        </div>
      </div>
    </div>
    <!-- 模型导入 START-->
    <UploadModal v-model="uploadVisible" :title="uploadTitle" :width="uploadWidth" :url="uploadUrl"
      @confirm="uploadConfirm" @cancel="uploadCancel"></UploadModal>
    <!-- 模型导入 END-->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet, mokePost } from "@/api";
import { baseUrl } from "@/config";
import { map, toArray } from "lodash";
import UploadModal from "@/components/UploadModal.vue";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);

// 表格参数
const tableLoad = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);

// 说明详情
const modelInfo = ref([]);

// 导入信息
const uploadVisible = ref(false);
const uploadTitle = ref(null);
const uploadWidth = ref(null);
const uploadUrl = ref(null);

//查询场站
const getStation = async () => {
  // const res = await mokeGet("getStation");
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
        getModelInfo(stationName.value); // 查询刀闸列表
      }
    })
    .catch((error) => {
      tableLoad.value = false;
    });
};

// 查询模型解析结果
const getModelInfo = async (value) => {
  tableLoad.value = true;
  tableData.value = [];
  modelInfo.value = [];
  const { data } = await mokeGet("getModelInfo", {
    station: value,
  });

  if (!data?.length) return (tableLoad.value = false);
  const dataInfo = data[0][value];
  const dataT = dataInfo.data; // 表格数据
  const dataD = dataInfo.desc; // 说明数据
  tableColumns.value = [];
  modelInfo.value = [];

  if (dataT?.length) {
    const column = dataT[0]; // 表头
    for (const key in column) {
      if (Object.hasOwnProperty.call(column, key)) {
        const name = column[key];
        tableColumns.value.push({
          prop: key,
          label: name,
          width: key !== "dev" ? '260' : null
        });
      }
    }
    dataT.shift(); // 删除数组第一项
    tableData.value = dataT;

    // 给列表赋值
    const colFields = ["station", "volatage", "interval"];
    setTableRowSpan(tableData.value, colFields);
  }

  if (dataD) {
    for (const key in dataD) {
      if (Object.hasOwnProperty.call(dataD, key)) {
        modelInfo.value.push({
          name:
            key === "station"
              ? "站所"
              : key === "voltage"
                ? "电压等级"
                : key === "bay"
                  ? "间隔"
                  : key === "switch"
                    ? "设备"
                    : "",
          data: toArray(dataD[key]),
        });
      }
    }
  }
  tableLoad.value = false;
};

// 监听select变化
const handleSelectChange = (action, value) => {
  tableLoad.value = true;
  tableData.value = [];
  modelInfo.value = [];
  switch (action) {
    case "station":
      {
        if (value) {
          const obj = stationOptions.value.find((item) => {
            return item.oid === value;
          });
          stationName.value = obj.name;
          getModelInfo(stationName.value); // 查询刀闸列表
        } else {
          setTimeout(() => {
            tableLoad.value = false;
          }, 1000);
        }
      }
      break;
    default:
      break;
  }
};

const onModalImport = () => {
  if (!uploadVisible.value) {
    uploadVisible.value = !uploadVisible.value;
    uploadTitle.value = "一次模型导入";
    uploadWidth.value = "600px";
    uploadUrl.value = baseUrl + "/uploadModel";
  }
};

// 上传确认
const uploadConfirm = (data) => {
  console.log("data", data);
  uploadVisible.value = false;
  const obj = stationOptions.value.find((item) => {
    return item.name === data[0].station;
  });
  station.value = obj.oid;
  getModelInfo(data[0].station); // 查询模型解析结果
};

// 上传取消
const uploadCancel = () => {
  uploadVisible.value = false;
};

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

onMounted(() => {
  getStation();
});
</script>
<style lang="scss" scoped></style>
