<template>
  <el-card>
    <el-container>
      <el-header>
        <el-button type="primary" @click="showAddModal = true">新增用户</el-button>
      </el-header>
      <el-main>
        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="password" label="密码"></el-table-column>
          <el-table-column prop="type" label="用户类型">
            <template #default="{ row }">
              <el-tag v-if="row.type === 0">普通用户</el-tag>
              <el-tag v-if="row.type === 1">管理员</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别"></el-table-column>
          <el-table-column prop="phone" label="电话" width="150" ></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="showEditModal2(row)">编辑</el-button>
              <el-button type="text" @click="deleteUser(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-dialog title="新增用户" v-model="showAddModal">
        <el-form :model="addForm">
          <el-form-item label="姓名">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-select v-model="addForm.type" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="addForm.gender" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑用户" v-model="showEditModal">
        <el-form :model="editForm">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-select v-model="editForm.type" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="editForm.gender" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEditModal = false">取消</el-button>
          <el-button type="primary" @click="editUser">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import http from "../utils/http";

const userList = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);

const types = ref([
  { value: 0, label: "普通用户" },
  { value: 1, label: "管理员" },
]);
const addForm = ref({
  name: "",
  username: "",
  password: "",
  type: "",
  gender: "",
  phone: "",
  remark: ""
});
const editForm = ref({
  id: "",
  name: "",
  username: "",
  password: "",
  type: "",
  gender: "",
  phone: "",
  remark: ""
});

const getUserList = async () => {
  const res = await http.get("/list");
  if (res.data.code === 0) {
    userList.value = res.data.data;
  }
};

const addUser = async () => {
  const res = await http.post("/add", addForm.value);
  if (res.data.code === 0) {
    showAddModal.value = false;
    getUserList();
  } else {
    alert(res.data.msg);
  }
};

const showEditModal2 = (user) => {
  editForm.value = { ...user };
  showEditModal.value = true;
};

const editUser = async () => {
  const res = await http.post("/edit", editForm.value);
  if (res.data.code === 0) {
    showEditModal.value = false;
    getUserList();
  } else {
    alert(res.data.msg);
  }
};

const deleteUser = async (user) => {
  const res = await http.post("/del", { id: user.id });
  if (res.data.code === 0) {
    getUserList();
  } else {
    alert(res.data.msg);
  }
};

getUserList();
</script>
