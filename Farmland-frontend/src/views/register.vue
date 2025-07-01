<template>
  <el-form :model="user" @submit.native.prevent="register">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="user.name"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="confirmPassword"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-select v-model="user.gender" placeholder="请选择性别">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="user.phone"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="user.remark"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from "vue";
import http from "../utils/http";
import { ElMessage } from "element-plus";

const user = ref({
  username: "",
  password: "",
  name: "", // 新增字段
  gender: "", // 新增字段
  phone: "", // 新增字段
  remark: "", // 新增字段
  type: 0, // 普通用户
});
const confirmPassword = ref("");

const register = async () => {
  if (
    !user.value.name ||
    !user.value.username ||
    !user.value.password ||
    !confirmPassword.value ||
    !user.value.gender ||
    !user.value.phone
  ) {
    ElMessage.error("所有字段均为必填项");
    return;
  }
  if (user.value.password !== confirmPassword.value) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }
  try {
    const response = await http.post("/add", user.value);
    if (response.data.code === 0) {
      ElMessage.success("注册成功");
      // 注册成功后的逻辑处理...
      //清空表单
      user.value.username = "";
      user.value.password = "";
      user.value.name = ""; // 清空新增字段
      user.value.gender = ""; // 清空新增字段
      user.value.phone = ""; // 清空新增字段
      user.value.remark = ""; // 清空新增字段
      confirmPassword.value = "";
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error("注册失败");
  }
};
</script>
