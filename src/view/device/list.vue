<template>
  <div class="oc-box oc-flex device-list">
    <div class="oc-box__header oc-view">
      <el-form :inline="true">
        <el-form-item label="站所">
          <el-select v-model="station" placeholder="请选择" clearable filterable
            @change="handleSelectChange('station', $event)">
            <el-option v-for="item in stationOptions" :key="item.oid" :label="item.name" :value="item.oid" />
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级">
          <el-select v-model="voltage" placeholder="请选择" clearable filterable
            @change="handleSelectChange('voltage', $event)">
            <el-option v-for="item in voltageOptions" :key="item.oid" :label="item.name" :value="item.oid" />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔">
          <el-select v-model="bay" placeholder="请选择" clearable filterable @change="handleSelectChange('bay', $event)">
            <el-option v-for="item in bayOptions" :key="item.oid" :label="item.name" :value="item.oid" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="oc-box__main oc-view">
      <div class="device-state__text" v-if="false">
        <dv-decoration-11 style="width: 500px; height: 60px">
          <el-text size="large">{{ stationName }}-设备态解析结果</el-text>
        </dv-decoration-11>
      </div>
      <el-table v-if="tableLoad || tableData.length" :data="tableData" v-loading="tableLoad" stripe empty-text="暂无数据"
        class="oc-table">
        <template v-for="(item, i) in tableColumn" :key="i">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : null"
            :align="item.align ? item.align : null" />
        </template>
      </el-table>
      <div v-else class="oc-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { mokeGet } from "@/api";
import { baseUrl } from "@/config";

const station = ref(null);
const stationName = ref(null);
const stationOptions = ref([]);
const voltage = ref(null);
const voltageName = ref(null);
const voltageOptions = ref([]);
const bay = ref(null);
const bayName = ref(null);
const bayOptions = ref([]);

const tableLoad = ref(true);
const tableData = ref([]);
const tableColumn = ref([
  { prop: "oid", label: "OID" },
  { prop: "path", label: "路径", width: "300px" },
  { prop: "statusName", label: "任务名称" },
  { prop: "statusId", label: "设备态ID" },
  { prop: "formulaId", label: "公式ID" },
  // { prop: "bayOid", label: "所属间隔" },
  { prop: "status", label: "状态" },
]);

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
        getVoltage(resData.oid);
        station.value = resData.oid;
        stationName.value = resData.name;
        handleDevStatusByCondition(0, "/" + stationName.value, station.value); // 查询设备态信息
      }
    })
    .catch((error) => {
      tableLoad.value = false;
    });
};

// 查询电压等级
const getVoltage = (oid) => {
  mokeGet("getVoltage", { oid }).then((res) => {
    if (res.data.length > 0) {
      voltageOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });
    }
  });
};

// 查询间隔
const getBays = (oid) => {
  mokeGet("getBay", { oid }).then((res) => {
    if (res.data.length > 0) {
      bayOptions.value = res.data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.oid,
        };
      });
    }
  });
};

// 查询设备态信息
const handleDevStatusByCondition = async (type, path, oid) => {
  tableLoad.value = true;
  const { data } = await mokeGet("getDevStatusByCondition", {
    type,
    path,
    oid,
  });

  tableData.value = [];
  if (!data?.length) return (tableLoad.value = false);
  tableData.value = data;
  tableLoad.value = false;
};

// 监听select变化
const handleSelectChange = (action, value) => {
  switch (action) {
    case "station":
      {
        voltage.value = null;
        voltageOptions.value = [];

        bay.value = null;
        bayOptions.value = [];

        if (value) {
          getVoltage(value); // 查询电压等级
          const obj = stationOptions.value.find((item) => {
            return item.oid === value;
          });
          stationName.value = obj.name;
          handleDevStatusByCondition(0, "/" + stationName.value, value);
        } else {
          handleDevStatusByCondition(0);
        }
      }
      break;
    case "voltage":
      {
        bay.value = null;
        bayOptions.value = [];

        if (value) {
          getBays(value); // 查询间隔
          const obj = voltageOptions.value.find((item) => {
            return item.oid === value;
          });
          voltageName.value = obj.name;
          handleDevStatusByCondition(
            1,
            "/" + stationName.value + "/" + voltageName.value,
            value
          );
        } else {
          handleDevStatusByCondition(0, "/" + stationName.value, station.value);
        }
      }

      break;
    case "bay":
      {
        if (value) {
          const obj = bayOptions.value.find((item) => {
            return item.oid === value;
          });

          bayName.value = obj.name;
          handleDevStatusByCondition(
            2,
            "/" +
            stationName.value +
            "/" +
            voltageName.value +
            "/" +
            bayName.value,
            value
          );
        } else {
          handleDevStatusByCondition(
            1,
            "/" + stationName.value + "/" + voltageName.value,
            voltage.value
          );
        }
      }

      break;

    default:
      break;
  }
};

onMounted(() => {
  getStation();
});
</script>

<style lang="scss" scoped>
.device-list {
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
