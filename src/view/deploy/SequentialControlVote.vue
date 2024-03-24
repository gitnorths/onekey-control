<template>
  <div class="oc-box device-task">
    <div class="oc-box__header">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="onModalImport">
            顺控票导入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main">
      <template v-if="false">
        <div class="device-task__text">
          <dv-decoration-11 style="width: 500px; height: 60px">
            <el-text size="large">龙湖变-梧220-顺控票解析结果</el-text>
          </dv-decoration-11>
        </div>
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          style="width: 100%"
        >
          <el-table-column prop="index" label="序号" width="70" />
          <el-table-column prop="task" label="操作任务" />
          <el-table-column prop="step" label="操作步骤" />
          <el-table-column prop="parse" label="步骤解析" />
          <el-table-column prop="precondition" label="操作前条件" />
          <el-table-column prop="preconditionParse" label="操作前条件解析" />
          <el-table-column prop="state" label="目标状态" />
          <el-table-column prop="stateParse" label="目标状态解析" />
          <el-table-column prop="Signal" label="修正/确认">
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
      </template>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
    <UploadModal
      v-model="uploadVisible"
      :title="uploadTitle"
      :width="uploadWidth"
      :url="uploadUrl"
      @cancel="uploadCancel"
    ></UploadModal>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";
import UploadModal from "@/components/uploadModal.vue";

// 导入信息
const uploadVisible = ref(false);
const uploadTitle = ref(null);
const uploadWidth = ref(null);
const uploadUrl = ref(null);

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
    if (rowIndex % tableData.length === 0) {
      return {
        rowspan: tableData.length,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

const tableData = [
  {
    index: "1",
    task: "梧220开关恢复备用、加入运行",
    step: "推上梧220东刀闸",
    parse: "/1/）/推上/梧220/东刀闸/",
    precondition: "1)无弹簧未储能",
    preconditionParse: "/1/）/无/弹簧/未/储能/",
    state: "1）梧220东刀闸由分变合",
    stateParse: "/1/）梧220/东刀闸/由分/变合/",
  },
  {
    index: "1",
    task: "梧220开关恢复备用、加入运行",
    step: "推上梧220西刀闸",
    parse: "/2/）/推上/梧220/西刀闸/",
    precondition: "2)控制回路正常",
    preconditionParse: "/2/）/控制/回路/正常/",
    state: "2）梧220西刀闸由分变合",
    stateParse: "/2/）梧220/西刀闸/由分/变合/",
  },
  {
    index: "1",
    task: "梧220开关恢复备用、加入运行",
    step: "合上梧220开关",
    parse: "/3/）/合上/梧220/开关/",
    precondition: "3)操作电源正常",
    preconditionParse: "/3/）/操作/电源/正常/",
    state: "3）梧220西刀闸由分变合",
    stateParse: "/2/）梧220/西刀闸/由分/变合/",
  },
];

const onModalImport = () => {
  if (!uploadVisible.value) {
    uploadVisible.value = !uploadVisible.value;
    uploadTitle.value = "顺控票模型导入";
    uploadWidth.value = "550px";
    uploadUrl.value = baseUrl + "/uploadOptabInfo";
  }
};

const uploadCancel = () => {
  uploadVisible.value = false;
};
</script>

<style lang="scss" scoped>
.device-task {
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
