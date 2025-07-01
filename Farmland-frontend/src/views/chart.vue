<template>
  <el-card>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12">
            搜索：
            <el-input style="width: 300px" v-model="search" placeholder="请输入行政区域名称" clearable></el-input>
            &emsp;
            <el-button type="primary" @click="getFarmlandList">搜索</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" @click="exportExcel">导出Excel</el-button>
            <el-button type="primary" @click="exportImages">导出图表</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>

        <el-table :data="farmlandList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="areaCode" label="区划码"></el-table-column>
          <el-table-column prop="county" label="县级"></el-table-column>
          <el-table-column prop="city" label="地级"></el-table-column>
          <el-table-column prop="province" label="省级"></el-table-column>
          <el-table-column prop="slope" label="坡度"></el-table-column>
          <el-table-column prop="ph" label="酸碱度"></el-table-column>
          <el-table-column prop="organicMatter" label="有机质"></el-table-column>
          <el-table-column prop="fertility" label="地力"></el-table-column>
          <el-table-column prop="farmlandArea" label="耕地面积"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <br> <br>
        <el-row :gutter="20">
          <el-col :span="12">
            <img id="pieChart" src="/饼状图.jpg" alt="饼状图" style="width: 100%;" />
          </el-col>
          <el-col :span="12">
            <img id="barChart" src="/柱状图.png" alt="柱状图" style="width: 100%;" />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import http from "../utils/http";
import * as XLSX from "xlsx";

const farmlandList = ref([]);
const search = ref("");
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const getFarmlandList = async () => {
  const res = await http.get("/searchfarmland", {
    params: {
      page: currentPage.value,
      limit: pageSize.value,
      name: search.value,
    },
  });
  if (res.data.code === 0) {
    farmlandList.value = res.data.data;
    total.value = res.data.total;
  }
};

const exportExcel = () => {
  const data = farmlandList.value.map(item => ({
    ID: item.id,
    名称: item.name,
    区划码: item.areaCode,
    县级: item.county,
    地级: item.city,
    省级: item.province,
    // 年份: item.year,
    // 质地: item.texture,
    坡度: item.slope,
    酸碱度: item.ph,
    有机质: item.organicMatter,
    地力: item.fertility,
    耕地面积: item.farmlandArea,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Farmland");
  XLSX.writeFile(workbook, "farmland.xlsx");
};

const exportImages = () => {
  const pieChart = document.getElementById('pieChart').src;
  const barChart = document.getElementById('barChart').src;
  const link = document.createElement('a');

  link.href = pieChart;
  link.download = '饼状图.jpg';
  link.click();

  link.href = barChart;
  link.download = '柱状图.png';
  link.click();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  getFarmlandList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getFarmlandList();
};

onMounted(() => {
  getFarmlandList();
});
</script>
