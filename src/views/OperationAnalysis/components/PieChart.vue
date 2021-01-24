<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import echarts, { EChartOption } from "echarts";
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";
import { getTransactions } from "@/api/transactions";
import { ITransactionData } from "@/api/types";
import { OperationAnalysisModule } from '@/store/modules/OperationAnalysis';

@Component({
  name: "PieChart"
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: "chart" }) private className!: string;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "300px" }) private height!: string;

  private pieData!: Array<{ value: number; name: string }>;
  private list: ITransactionData[] = [];

  mounted() {
    this.pieData = [
      { value: 320, name: "正常" },
      { value: 240, name: "一般" },
      { value: 149, name: "严重" }
    ];
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
    this.chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        left: "center",
        bottom: "10",
        data: ["正常", "一般", "严重"]
      },
      color: ["#67C23A", "#E6A23C", "#F56C6C"],
      series: [
        {
          name: "监控状况",
          type: "pie",
          roseType: "radius",
          radius: [15, 95],
          center: ["50%", "38%"],
          data: this.pieData,
          animationEasing: "cubicInOut",
          animationDuration: 2600
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>);
    this.chart.on("click", this.pieClick);
  }

  private async fetchData() {
    const { data } = await getTransactions({
      /* Your params here */
    });
    this.list = data.items.slice(0, 8);
  }

  private pieClick(params: any) {
    let percent = params.percent;
    let name = params.name;
    let dataIndex = params.dataIndex;
    let filedName = name == "正常" ? "normal" : name == "一般" ? "warn" : "danger";
    OperationAnalysisModule.SET_STATEFILED(filedName);
    // alert(OperationAnalysisModule.stateFiled)
  }
}
</script>
