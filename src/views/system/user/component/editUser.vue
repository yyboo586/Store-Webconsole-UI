<template>
	<div class="system-edit-user-container">
		<el-dialog :title="(ruleForm.userId!==0?'修改':'添加')+'用户'" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"  v-if="ruleForm.userId===0">
						<el-form-item label="用户名" prop="userName">
							<el-input v-model="ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"  v-if="ruleForm.userId===0">
            <el-form-item label="账户密码" prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="用户昵称" prop="nickName">
							<el-input v-model="ruleForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
          <!-- 
            TODO: Feature 
            令牌内省，如果用户角色为 店铺运维，给默认值，不允许修改。
            但需要注意， 前端显示的是 角色名称，但是接口接收的是 角色ID.
             -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="关联角色" prop="roleIds">
              <el-cascader
                  :options="roleList"
                  :props="{ checkStrictly: true,emitPath: false, value: 'id', label: 'name',multiple: true }"
                  placeholder="请选择角色"
                  clearable
                  class="w100"
                  v-model="ruleForm.roleIds"
                  :disabled="isStoreOperator()"
              >
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="部门" prop="deptId">
							<el-cascader
								:options="deptData"
								:props="{ checkStrictly: true,emitPath: false, value: 'deptId', label: 'deptName' }"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="ruleForm.deptId"
                :disabled="isStoreOperator()"
							>
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="ruleForm.mobile" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="性别" prop="sex">
							<el-select v-model="ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option
                   v-for="gender in genderData"
                   :key="'gender-'+gender.value"
                   :label="gender.label"
                   :value="gender.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="岗位" prop="postIds">
              <el-select v-model="ruleForm.postIds" placeholder="请选择" clearable class="w100" multiple>
                <el-option
                    v-for="post in postList"
                    :key="'post-'+post.postId"
                    :label="post.postName"
                    :value="post.postId">
                </el-option>
              </el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
						<el-form-item label="用户状态">
							<el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
          <!-- 
            TODO: Feature
            令牌内省，如果用户角色为 店铺运维，给默认值（后台管理员），不允许修改。
          -->
          <el-col :span="24">
            <el-form-item label="用户类型">
              <el-radio-group v-model="ruleForm.isAdmin" :disabled="isStoreOperator()">
                <el-radio
                    :value="1"
                >后台管理员</el-radio>
                <el-radio
                    :value="0"
                >前台用户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
						<el-form-item label="用户描述">
							<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.userId!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import {reactive, toRefs, onMounted, defineComponent, ref, unref, getCurrentInstance, computed} from 'vue';
import {getParams, addUser, editUser, getEditUser} from "/@/api/system/user";
import {ElMessage} from "element-plus";
import {Session} from "/@/utils/storage";

defineOptions({ name: "systemEditUser"})
const props = defineProps({
  deptData:{
    type:Array,
    default:()=>[]
  },
  genderData:{
    type:Array,
    default:()=>[]
  }
})
const emit = defineEmits(['getUserList']);
const {proxy} = getCurrentInstance() as any;
const roleList = ref([]);
const postList = ref([]);
const formRef = ref<HTMLElement | null>(null);
const state = reactive({
  isShowDialog: false,
  ruleForm: {
    userId: 0,
    deptId: 0,
    userName: '',
    nickName: '',
    password: '',
    mobile:'',
    email: '',
    sex: '',
    status: 1,
    remark: '',
    postIds: [],
    roleIds: [],
    isAdmin:1,
  },
  //表单校验
  rules: {
    userName: [
      { required: true, message: "用户名称不能为空", trigger: "blur" }
    ],
    nickName: [
      { required: true, message: "用户昵称不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "归属部门不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "用户密码不能为空", trigger: "blur" }
    ],
    email: [
      {
        type: "email",
        message: "'请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    mobile: [
      { required: true, message: "手机号码不能为空", trigger: "blur" },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ]
  }
});
const { ruleForm, isShowDialog, rules } = toRefs(state)

// 获取当前登录用户信息
let currentUserRoleInfo = Session.get('roleInfo') || {};
let currentUserInfo = Session.get('userInfo') || {};
// 判断当前用户是否为店铺运维角色
function isStoreOperator() {
  const userRoles = currentUserRoleInfo.user_roles || [];
  console.log(userRoles.includes('店铺运维'))
  return userRoles.includes('店铺运维');
}

function isSuperAdmin() {
  const userRoles = currentUserRoleInfo.user_roles || [];
  return userRoles.includes('超级管理员');
}


// 获取店铺租户角色ID
function getStoreTenantRoleId() {
  console.log("roleList", roleList.value);
  if (!roleList.value.length) return null;
  
  // 递归查找店铺租户角色
  const findStoreTenantRole = (roles) => {
    for (const role of roles) {
      if (role.name === '店铺租户') {
        return role.id;
      }
      if (role.children && role.children.length > 0) {
        const found = findStoreTenantRole(role.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findStoreTenantRole(roleList.value);
}

// 打开弹窗
const openDialog = (row?:any) => {
  resetForm()
  if(row) {
    getEditUser(row.id).then((res:any)=>{
      const user = res.data.user;
      state.ruleForm = {
        userId: user.id,
        deptId: user.deptId,
        userName: user.userName,
        nickName: user.userNickname,
        password: '-',
        mobile:user.mobile,
        email: user.userEmail,
        sex: String(user.sex),
        status: user.userStatus,
        remark: user.remark,
        postIds: res.data.checkedPosts??[],
        roleIds: res.data.checkedRoleIds??[],
        isAdmin:user.isAdmin,
      };
    })
  } else {
    state.ruleForm.isAdmin = 1;
    if (isStoreOperator() && getStoreTenantRoleId()) {
      state.ruleForm.deptId = currentUserInfo.deptId;
      state.ruleForm.roleIds = [ getStoreTenantRoleId() ];
    }
  }
  state.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 新增
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      if(state.ruleForm.userId===0){
        //添加
        addUser(state.ruleForm).then(()=>{
          ElMessage.success('用户添加成功');
          closeDialog(); // 关闭弹窗
          emit('getUserList')
        });
      }else{
        //修改
        editUser(state.ruleForm).then(()=>{
          ElMessage.success('用户修改成功');
          closeDialog(); // 关闭弹窗
          emit('getUserList')
        });
      }
    }
  });
};
// 初始化部门数据
const initTableData = () => {
  //获取角色岗位选项
  getParams().then((res:any)=>{
    const roles = res.data.roleList??[];
    const roleAccess = res.data.roleAccess??[];
    roles.map((item:any)=>{
      if(!roleAccess.includes(item.id)){
        item.disabled = true
      }
    })
    roleList.value = proxy.handleTree(roles??[], "id","pid","children",true);
    postList.value = res.data.posts??[];
  });
};
// 页面加载时
onMounted(() => {
  initTableData();
});
const resetForm = ()=>{
  state.ruleForm = {
    userId: 0,
    deptId: 0,
    userName: '',
    nickName: '',
    password: '',
    mobile:'',
    email: '',
    sex: '',
    status: 1,
    remark: '',
    postIds: [],
    roleIds: [],
    isAdmin:0,
  }
};
defineExpose({openDialog})
</script>
