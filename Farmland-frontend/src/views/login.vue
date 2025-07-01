<template>
  <div class="login-wrap">
    <el-dialog title="注册" v-model="regiser1" width="30%">
      <register></register>
    </el-dialog>
    <div class="ms-login">
      <div class="ms-title">广东省耕地信息系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button><br />
          <el-button type="success" @click="regiser1 = true">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTagsStore } from "../store/tags";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import http from "../utils/http";
import register from "./register.vue";

interface LoginInfo {
  username: string;
  password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
  username: "admin",
  password: "123123",
});
const regiser1 = ref(false);

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      http.post("/login", param).then((res) => {
        if (res.data.code === 0) {
          ElMessage.success("登录成功");
          localStorage.setItem("ms_username", param.username);
          if (res.data.data.type == 1) {
            localStorage.setItem("ms_type", "1");
            localStorage.setItem("ms_id", res.data.data.id);
            router.push("/people");
          } else {
            localStorage.setItem("ms_type", "0");
            localStorage.setItem("ms_id", res.data.data.id);
            router.push("/map");
          }
        } else {
          ElMessage.error("登录失败");
        }
      });
    } else {
      ElMessage.error("登录成功");
      return false;
    }
  });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100% 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
