<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="服务器 IP 地址" width="120" align="center">
      <template slot-scope="{ row }">
        {{ row.ip | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="连接延时" width="80" align="center">
      <template slot-scope="{ row }"> {{ row.ping }} ms </template>
    </el-table-column>
    <el-table-column label="上一次重启时间" width="170" align="center">
      <template slot-scope="{ row }">
        {{ row.timestamp | formatDate }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | transactionStatusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="错误信息" align="center">
      <template slot-scope="{ row }">
        {{
          row.status == "normal"
            ? ""
            : row.status == "warn"
            ? row.ping > 200
              ? "服务器延时过高"
              : "延时正常，但是站点无法访问"
            : "所有监控全部离线，服务器可能已经无响应"
        }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getTransactions } from "@/api/transactions";
import { ITransactionData } from "@/api/types";
import { OperationAnalysisModule } from "@/store/modules/OperationAnalysis";

@Component({
  name: "TransactionTable",
  filters: {
    transactionStatusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        normal: "success",
        warn: "warning",
        danger: "danger"
      };
      return statusMap[status];
    },
    orderNoFilter: (str: string) => str.substring(0, 30),
    // Input 10000 => Output "10,000"
    toThousandFilter: (num: number) => {
      return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
    },
    formatDate: (timestamp: string) => {
      let date = new Date(timestamp);
      let YY = date.getFullYear() + "-";
      let MM =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hh =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let mm =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return YY + MM + DD + " " + hh + mm + ss;
    }
  }
})
export default class extends Vue {
  private list: ITransactionData[] = [];

  get state() {
    return OperationAnalysisModule.stateFiled;
  }

  created() {
    this.fetchData();
  }
  @Watch("state")
  stateFiled(oldval: string, val: string) {
    // alert(val + " => " + oldval);
    this.fetchData();
  }

  private async fetchData() {
    const { data } = await getTransactions({
      /* Your params here */
    });
    let li = data.items.slice(0, 8);
    this.list = [];
    console.log("li", li);
    console.log("state", this.state);
    for (const item of li) {
      if (this.state == "") {
        this.list = li;
      } else {
        if (item.status == this.state) {
          this.list.push(item);
        }
      }
    }
  }
}
</script>
