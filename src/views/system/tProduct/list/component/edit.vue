<template>  
  <div class="system-tProduct-edit">
    <el-drawer v-model="isShowDialog" direction="ltr" size="80%">
      <template #header>
        <div>{{'修改商品'}}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" style="margin-top: 20px;">    
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="formData.price"/>
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
            <el-select v-model="formData.status" style="width: 100%;">
            <el-option label="正常" :value="'正常'" />
            <el-option label="下架" :value="'下架'" />
          </el-select>
        </el-form-item>        
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="formData.description"/>
        </el-form-item>        
        <el-form-item label="商品图片" prop="image">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <el-button type="primary">选择图片</el-button>
            <div class="image-preview mt10">
                  <img :src="formData.image_path" alt="商品图片" class="preview-img" />
            </div>
          </el-upload>
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
import { reactive, toRefs, ref,unref,getCurrentInstance,computed } from 'vue';
import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';
import {
  listTProduct,
  getTProduct,
  // delTProduct,
  addTProduct,
  updateTProduct,
  uploadImage,  
} from "/@/api/system/tProduct";
import {
  TProductTableColumns,
  TProductInfoData,
  TProductTableDataState,
  TProductEditState
} from "/@/views/system/tProduct/list/component/model"
defineOptions({ name: "ApiV1SystemTProductEdit"})
const emit = defineEmits(['tProductList'])
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);
const menuRef = ref();
const state = reactive<TProductEditState>({
  loading:false,
  isShowDialog: false,
  formData: {    
    id: "",    
    store_id: "",    
    gtid: "",    
    name: "",    
    price: 0.0,    
    image_path: "",       
    description: "",    
    status: "",    
    createa_at: undefined,    
    updated_at: undefined,    
  },
  // 表单校验
  rules: {    
    id : [
        { required: true, message: "ID不能为空", trigger: "blur" }
    ],    
    store_id : [
        { required: true, message: "ID不能为空", trigger: "blur" }
    ],    
    gtid : [
        { required: true, message: "不能为空", trigger: "blur" }
    ],    
    name : [
        { required: true, message: "不能为空", trigger: "blur" }
    ],    
    save_name : [
        { required: true, message: "不能为空", trigger: "blur" }
    ],    
    price : [
        { required: true, message: "不能为空", trigger: "blur" }
    ],
  }
});
const { loading,isShowDialog,formData,rules } = toRefs(state);
// 打开弹窗
const openDialog = (row?: TProductInfoData) => {
  resetForm();
  if(row) {
    getTProduct(row.id!).then((res:any)=>{
      const data = res.data;      
      data.image_url = import.meta.env.VITE_API_URL+ res.data.image_path+'/'+res.data.image_name;
      state.formData = data;
  })
}
  state.isShowDialog = true;
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
      updateTProduct(state.formData.id, state.formData).then(()=>{
          ElMessage.success('修改成功');
          closeDialog(); // 关闭弹窗
          emit('tProductList')
        }).finally(()=>{
          state.loading = false;
        })
      }
  });
};
const resetForm = ()=>{
  state.formData = {    
    id: "",    
    store_id: "",    
    gtid: "",    
    name: "",    
    price: 0.0,    
    image_path: "",       
    description: "",    
    status: "" ,    
    createa_at: undefined,    
    updated_at: undefined,    
  }  
};
// 校验图片类型和大小（可选）
const beforeUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  if (!isValidType) {
    ElMessage.error('只能上传 JPG/PNG/GIF 格式的图片');
    return false;
  }

  const isValidSize = file.size / 1024 <= 512; // 限制 512KB
  if (!isValidSize) {
    ElMessage.error('图片大小不能超过 512KB');
    return false;
  }

  return true;
};

// 处理图片上传事件，转为 base64
const handleImageChange = async(uploadFile: any) => {
  const formData = new FormData();
  formData.append("file", uploadFile.raw)
  try {
    const { code, data, message } = await uploadImage(formData)
    console.log(code, data, message)
    state.formData.image_path = data.url
    console.log(data.url)
  } catch(error) {
    console.error('图片上传失败',error)
  }
};
</script>
<style scoped>  
  .kv-label{margin-bottom: 15px;font-size: 14px;}
  .mini-btn i.el-icon{margin: unset;}
  .kv-row{margin-bottom: 12px;}
  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 图片裁剪以适应容器 */
}  
.image-preview {
  margin-top: 10px;
  border: 1px solid #eee;
  padding: 5px;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>