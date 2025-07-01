<template>
  <el-card>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12">
            搜索：
            <el-input
              style="width: 300px"
              v-model="search"
              placeholder="请输入行政区域名称"
              clearable
            ></el-input>
            &emsp;
            <el-button type="primary" @click="getFarmlandList">搜索</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" @click="showAddModal = true">新增耕地</el-button>
            <el-button type="primary" @click="exportExcel">导出Excel</el-button>
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
          <!-- <el-table-column prop="year" label="年份"></el-table-column> -->
          <!-- <el-table-column prop="texture" label="质地"></el-table-column> -->
          <el-table-column prop="slope" label="坡度"></el-table-column>
          <el-table-column prop="ph" label="酸碱度"></el-table-column>
          <el-table-column prop="organicMatter" label="有机质"></el-table-column>
          <el-table-column prop="fertility" label="地力"></el-table-column>
          <el-table-column prop="farmlandArea" label="耕地面积"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="showEditModal2(row)">编辑</el-button>
              <el-button type="text" @click="deleteFarmland(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-main>
      <el-dialog title="新增耕地" v-model="showAddModal">
        <el-form :model="addForm">
          <el-form-item label="名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="区划码">
            <el-input v-model="addForm.areaCode"></el-input>
          </el-form-item>
          <el-form-item label="县级">
            <el-input v-model="addForm.county"></el-input>
          </el-form-item>
          <el-form-item label="地级">
            <el-input v-model="addForm.city"></el-input>
          </el-form-item>
          <el-form-item label="省级">
            <el-input v-model="addForm.province"></el-input>
          </el-form-item>
          <!-- <el-form-item label="年份">
            <el-input v-model="addForm.year"></el-input>
          </el-form-item>
          <el-form-item label="质地">
            <el-input v-model="addForm.texture"></el-input>
          </el-form-item> -->
          <el-form-item label="坡度">
            <el-input v-model="addForm.slope"></el-input>
          </el-form-item>
          <el-form-item label="酸碱度">
            <el-input v-model="addForm.ph"></el-input>
          </el-form-item>
          <el-form-item label="有机质">
            <el-input v-model="addForm.organicMatter"></el-input>
          </el-form-item>
          <el-form-item label="地力">
            <el-input v-model="addForm.fertility"></el-input>
          </el-form-item>
          <el-form-item label="耕地面积">
            <el-input v-model="addForm.farmlandArea"></el-input>
          </el-form-item>
          <el-form-item label="坐标">
            <el-input v-model="addForm.coordinates" placeholder=""></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="addFarmland">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑耕地" v-model="showEditModal">
        <el-form :model="editForm">
          <el-form-item label="名称">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="区划码">
            <el-input v-model="editForm.areaCode"></el-input>
          </el-form-item>
          <el-form-item label="县级">
            <el-input v-model="editForm.county"></el-input>
          </el-form-item>
          <el-form-item label="地级">
            <el-input v-model="editForm.city"></el-input>
          </el-form-item>
          <el-form-item label="省级">
            <el-input v-model="editForm.province"></el-input>
          </el-form-item>
          <!-- <el-form-item label="年份">
            <el-input v-model="editForm.year"></el-input>
          </el-form-item>
          <el-form-item label="质地">
            <el-input v-model="editForm.texture"></el-input>
          </el-form-item> -->
          <el-form-item label="坡度">
            <el-input v-model="editForm.slope"></el-input>
          </el-form-item>
          <el-form-item label="酸碱度">
            <el-input v-model="editForm.ph"></el-input>
          </el-form-item>
          <el-form-item label="有机质">
            <el-input v-model="editForm.organicMatter"></el-input>
          </el-form-item>
          <el-form-item label="地力">
            <el-input v-model="editForm.fertility"></el-input>
          </el-form-item>
          <el-form-item label="耕地面积">
            <el-input v-model="editForm.farmlandArea"></el-input>
          </el-form-item>
          <el-form-item label="坐标">
            <el-input v-model="editForm.coordinates" placeholder="格式：[x, y]"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEditModal = false">取消</el-button>
          <el-button type="primary" @click="editFarmland">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import http from "../utils/http";
import * as XLSX from "xlsx";

const farmlandList = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const search = ref("");
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const addForm = ref({
  name: "",
  areaCode: "",
  county: "",
  city: "",
  province: "",
  // year: "",
  // texture: "",
  slope: "",
  ph: "",
  organicMatter: "",
  fertility: "",
  farmlandArea: "",
  coordinates: "",
});
const editForm = ref({
  id: "",
  name: "",
  areaCode: "",
  county: "",
  city: "",
  province: "",
  // year: "",
  // texture: "",
  slope: "",
  ph: "",
  organicMatter: "",
  fertility: "",
  farmlandArea: "",
  coordinates: "",
});

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

const addFarmland = async () => {
  const geom = { type: "Polygon", coordinates: JSON.parse(addForm.value.coordinates) };
  const res = await http.post("/addfarmland", { 
    ...addForm.value, 
    geom,
  });
  if (res.data.code === 0) {
    showAddModal.value = false;
    getFarmlandList();
  } else {
    alert(res.data.msg);
  }
};

const showEditModal2 = (farmland) => {
  editForm.value = { 
    ...farmland, 
    coordinates: JSON.stringify(farmland.geom.coordinates)
  };
  showEditModal.value = true;
};

const editFarmland = async () => {
  const geom = { type: "Polygon", coordinates: JSON.parse(editForm.value.coordinates) };
  const res = await http.post("/editfarmland", { 
    ...editForm.value, 
    geom,
  });
  if (res.data.code === 0) {
    showEditModal.value = false;
    getFarmlandList();
  } else {
    alert(res.data.msg);
  }
};

const deleteFarmland = async (farmland) => {
  const res = await http.post("/delfarmland", { id: farmland.id });
  if (res.data.code === 0) {
    getFarmlandList();
  } else {
    alert(res.data.msg);
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  getFarmlandList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getFarmlandList();
};

const exportExcel = () => {
  const data = farmlandList.value.map(item => ({
    ID: item.id,
    名称: item.name,
    区划码: item.areaCode,
    县级: item.county,
    地级: item.city,
    省级: item.province,
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

onMounted(() => {
  getFarmlandList();
});
</script>
