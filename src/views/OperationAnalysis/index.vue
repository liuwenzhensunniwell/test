<template style="background-color: #f0f2f6;">
  <div class="operation-analysis-container">
    <el-row :gutter="32">
      <el-col :span="8">
        <div class="pieContainer">
          <div class="title">
            系统监控图表
          </div>
          <PieChart style="padding: 15px"/>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="transacationTableContainer">
          <TransactionTable />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import PieChart from "./components/PieChart.vue";
import TransactionTable from "./components/TransactionTable.vue";
@Component({
  name: "OperationAnalysis",
  components: {
    PieChart,
    TransactionTable
  }
})
export default class extends Vue {

  get roles() {
    return UserModule.roles;
  }

  created() {}
}
</script>

<style lang="scss" scoped>
.operation-analysis-container {
  padding: 32px;
  background-color: #f0f2f6;
  position: relative;
  height: 88vh;

  .pieContainer {
    .title {
      padding: 18px;
      padding-top: 28px;
      width: 100%;
      text-align: center;
      border-bottom: #f0f2f6 1px solid;
      font-size: 1.1rem;
      letter-spacing: 3px;
    }
    border-radius: 5px;
    background-color: white;
  }

  .transacationTableContainer {
    border-radius: 5px;
    overflow: hidden;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
