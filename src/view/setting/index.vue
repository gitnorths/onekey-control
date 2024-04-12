<template>
  <div class="oc-box oc-flex">
    <div class="oc-box__header oc-view">
      <vxe-toolbar>
        <template #buttons>
          <vxe-button @click="insertEvent()">新增</vxe-button>
          <vxe-button @click="removeSelectRowEvent">删除选中</vxe-button>
          <vxe-button @click="revertEvent">还原</vxe-button>
          <vxe-button @click="saveEvent">保存</vxe-button>
        </template>
      </vxe-toolbar>
    </div>
    <div class="oc-box__main oc-view">
      <vxe-table
        v-if="tableLoad"
        stripe
        border
        show-overflow
        keep-source
        ref="xTable"
        max-height="100%"
        align="center"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="key" title="名称" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.key" type="text"></vxe-input>
          </template>
        </vxe-column>
        <!-- <vxe-column field="value" title="Value" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.value" type="text"></vxe-input>
          </template>
        </vxe-column> -->
      </vxe-table>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { VXETable } from "vxe-table";
import { mokePost } from "@/api";
import { ElMessage } from "element-plus";

const xTable = ref();
const tableLoad = ref(true);
const tableData = ref([]);

const insertEvent = async (row) => {
  const $table = xTable.value;
  if ($table) {
    const record = {
      key: "",
    };
    const { row: newRow } = await $table.insertAt(record, row);
    await $table.setEditCell(newRow, "name");
  }
};

const removeSelectRowEvent = () => {
  const $table = xTable.value;
  if ($table) {
    $table.removeCheckboxRow();
  }
};

const revertEvent = async () => {
  const $table = xTable.value;
  if ($table) {
    const type = await VXETable.modal.confirm("您确定要还原数据吗?");
    if (type === "confirm") {
      await $table.revertData();
    }
  }
};

const saveEvent = () => {
  const $table = xTable.value;
  if ($table) {
    const data = $table.getTableData().tableData;
    setGeneralTermsMap(data);
  }
};

// 查询通用操作术语接口
const getGeneralTermsMap = () => {
  mokeGet("generalTermsMap")
    .then((res) => {
      if (!res?.data) return (tableLoad.value = false);
      tableData.value = [];
      const obj = res.data.parseAssistanceMap;
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          tableData.value.push({
            key,
            //   value,
          });
        }
      }
    })
    .catch((error) => {
      tableLoad.value = false;
    })
    .finally(() => {
      tableLoad.value = false;
    });
};

// 设置通用操作术语接口
const setGeneralTermsMap = (data) => {
  const generalTerms = {};
  data.forEach((item) => {
    generalTerms[item.key] = "";
  });
  mokePost("generalTermsMap", { generalTerms }).then((res) => {
    if (res.code == 0) {
      ElMessage.success("保存成功！");
      getGeneralTermsMap();
    }
  });
};

onMounted(() => {
  getGeneralTermsMap();
});
</script>
<style lang="scss" scoped>
.vxe-table {
  width: 100%;
}
</style>
