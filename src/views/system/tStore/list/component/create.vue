<template>
  <div class="system-tStore-create">
    <el-drawer v-model="isShowDialog" direction="ltr" size="80%">
      <template #header>
        <div>{{ '添加门店' }}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="140px" style="margin-top: 20px;">         
        <!-- 下拉选择店铺 -->
        <el-form-item label="门店信息" prop="storeId">
          <el-select v-model="formData.id" placeholder="请选择商户" @change="handleStoreChange" style="width: 100%">
            <el-option
              v-for="store in storeList"
              :key="store.id"
              :label="store.store_name"
              :value="store.id">
              <span style="float: left">{{ store.store_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ store.address }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第三方平台门店ID" prop="third_id">
          <el-input v-model="formData.third_id" disabled placeholder="自动填充" />
        </el-form-item>
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="formData.name" disabled placeholder="自动填充" />
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="formData.address" disabled placeholder="自动填充" />
        </el-form-item>        
        <!-- 自动填充字段 -->
        <!-- 下拉选择用户 -->
        <el-form-item label="租户信息" prop="storeId">
          <el-select v-model="formData.owner_id" placeholder="请选择商户" @change="handleUserChange" style="width: 100%">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.userName"
              :value="user.id">
              <span style="float: left">{{ user.userName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ user.mobile }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户ID" prop="owner_id">
          <el-input v-model="formData.owner_id" disabled placeholder="自动填充" />
        </el-form-item>        
        <el-form-item label="商户姓名" prop="owner_name">
          <el-input v-model="formData.owner_name" disabled placeholder="自动填充" />
        </el-form-item>        
        <el-form-item label="商户电话" prop="owner_phone">
          <el-input v-model="formData.owner_phone" disabled placeholder="自动填充" />
        </el-form-item>       
        <!-- 自动填充字段 -->       
        <el-form-item label="客服姓名" prop="customer_service_name">
          <el-input v-model="formData.customer_service_name" placeholder="请输入客服姓名" />
        </el-form-item>        
        <el-form-item label="客服电话" prop="customer_service_phone">
          <el-input v-model="formData.customer_service_phone" placeholder="请输入客服电话" />
        </el-form-item>        
        <el-form-item label="客服微信" prop="customer_service_wechat">
          <el-input v-model="formData.customer_service_wechat" placeholder="请输入客服微信" />
        </el-form-item>        
        <el-form-item label="商户号" prop="merchant_no">
          <el-input v-model="formData.merchant_no" placeholder="请输入拉卡拉分配的商户号" />
        </el-form-item>        
        <el-form-item label="业务终端号" prop="term_no">
          <el-input v-model="formData.term_no" type="password" placeholder="请输入拉卡拉分配的业务终端号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit" :disabled="loading">确 定</el-button>
          <el-button @click="onCancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
const storeList = ref<any[]>([])
const userList = ref<any[]>([])
// 获取店铺列表数据
const fetchStoreList = async () => {
  try {
    console.log('开始获取店铺列表数据...')
    const response = await listThirdStore()
    console.log('获取店铺列表成功:', response);
    storeList.value = response.data.list;
    console.log(storeList.value);
    // storeList.value =  [
    //         {
    //             "id": 11,
    //             "store_name": "测试店铺A",
    //             "contacts": "测试联系人A",
    //             "mobile": "13211223311",
    //             "city": "北京市/北京市/朝阳区",
    //             "address": "测试地址A",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "北京市北京市朝阳区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 8,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 7,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 6,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 5,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 4,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "2",
    //             "state": "2",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "待审批",
    //             "state_text": "装修中"
    //         },
    //         {
    //             "id": 3,
    //             "store_name": "福年无人小超市",
    //             "contacts": "福小年",
    //             "mobile": "13612345678",
    //             "city": "四川省/成都市/武侯区",
    //             "address": "吉泰路666号(天府三街地铁站A口步行310米)",
    //             "status": "1",
    //             "state": "1",
    //             "logo": "",
    //             "city_text": "四川省成都市武侯区",
    //             "status_text": "正常",
    //             "state_text": "开业"
    //         },
    //         {
    //             "id": 2,
    //             "store_name": "测试门店2",
    //             "contacts": "王五",
    //             "mobile": "13312341234",
    //             "city": "四川省/成都市/青羊区",
    //             "address": "王五路778号左转第二个门",
    //             "status": "1",
    //             "state": "1",
    //             "logo": "",
    //             "city_text": "四川省成都市青羊区",
    //             "status_text": "正常",
    //             "state_text": "开业"
    //         },
    //         {
    //             "id": 1,
    //             "store_name": "测试门店1",
    //             "contacts": "李四",
    //             "mobile": "13000000000",
    //             "city": "福建省/厦门市/海沧区",
    //             "address": "双子大厦118号",
    //             "status": "1",
    //             "state": "1",
    //             "logo": "",
    //             "city_text": "福建省厦门市海沧区",
    //             "status_text": "正常",
    //             "state_text": "开业"
    //         }
    //     ]
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  }
}

const fetchUserList = async () => {
  try {
    const response = await getUsersById(13)
    console.log('获取用户列表成功:', response)
    userList.value = response.data.userList;
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 当管理员选择店铺时，更新对应字段
const handleStoreChange = (id:number) => {
  const selectedStore = storeList.value.find(store => store.id === id)
  if (selectedStore) {
    state.formData.third_id = selectedStore.id
    state.formData.name = selectedStore.store_name
    state.formData.address = selectedStore.address
  }
}
// 当管理员选择用户时，更新对应字段
const handleUserChange = (id: number) => { 
  const selectedUser = userList.value.find(user => user.id === id)
  if (selectedUser) {
    state.formData.owner_id = selectedUser.id
    state.formData.owner_name = selectedUser.userName
    state.formData.owner_phone = selectedUser.mobile
  }
}


import { reactive, toRefs, ref,unref,getCurrentInstance,computed } from 'vue';
import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';
import {
  addTStore,
  listThirdStore,
} from "/@/api/system/tStore";
import { 
  getUsersById,
} from "/@/api/system/user"
import {
  TStoreInfoData,
  TStoreCreateState
} from "/@/views/system/tStore/list/component/model"
defineOptions({ name: "ApiV1SystemTStoreCreate"})
const emit = defineEmits(['tStoreList'])
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);
const menuRef = ref();
const state = reactive<TStoreCreateState>({
  loading:false,
  isShowDialog: false,
  formData: {    
    id: undefined,    
    third_id: undefined,    
    name: undefined,    
    address: undefined,    
    owner_id: undefined,    
    owner_name: undefined,    
    owner_phone: undefined,    
    customer_service_name: undefined,    
    customer_service_phone: undefined,    
    customer_service_wechat: undefined,    
    merchant_no: undefined,    
    term_no: undefined,    
    status: undefined,    
    created_at: undefined,    
    updated_at: undefined,    
  },
  // 表单校验
  rules: {
    third_id : [
        { required: true, message: "第三方平台门店ID不能为空", trigger: "blur" }
    ],    
    name : [
        { required: true, message: "门店名称不能为空", trigger: "blur" }
    ],    
    address : [
        { required: true, message: "门店地址不能为空", trigger: "blur" }
    ],    
    owner_id : [
        { required: true, message: "商户ID不能为空", trigger: "blur" }
    ],    
    owner_name : [
        { required: true, message: "商户姓名不能为空", trigger: "blur" }
    ],    
    owner_phone : [
        { required: true, message: "商户电话不能为空", trigger: "blur" }
    ],
  }
});
const { loading,isShowDialog,formData,rules } = toRefs(state);
// 打开弹窗
const openDialog = () => {
  resetForm();
  state.isShowDialog = true;
  fetchStoreList();
  fetchUserList();
};
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false;
};
defineExpose({
  openDialog,
});

// 取消
const onCancel = () => {
  closeDialog();
};

// 提交
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      addTStore(state.formData).then(()=>{
          ElMessage.success('添加成功');
          closeDialog(); // 关闭弹窗
          emit('tStoreList')
        }).finally(()=>{
          state.loading = false;
        })
    }
  });
};

const resetForm = ()=>{
  state.formData = {    
    id: undefined,    
    third_id: undefined,    
    name: undefined,    
    address: undefined,    
    owner_id: undefined,    
    owner_name: undefined,    
    owner_phone: undefined,    
    customer_service_name: undefined,    
    customer_service_phone: undefined,    
    customer_service_wechat: undefined,    
    merchant_no: undefined,    
    term_no: undefined,    
    status: '' ,    
    created_at: undefined,    
    updated_at: undefined,    
  }  
};
</script>
<style scoped>  
  .kv-label{margin-bottom: 15px;font-size: 14px;}
  .mini-btn i.el-icon{margin: unset;}
  .kv-row{margin-bottom: 12px;}
</style>