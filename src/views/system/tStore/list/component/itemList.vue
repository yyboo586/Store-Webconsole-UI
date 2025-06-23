<template>
	<div class="system-tProduct-container">
		<el-drawer v-model="isShowDialog" direction="ltr" size="80%">
			<el-card shadow="hover">
				<div class="system-tProduct-search mb15">
					<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
						<el-row>
							<el-col :span="8" class="colBlock">
								<el-form-item label="ID" prop="id">
									<el-input v-model="tableData.param.id" placeholder="请输入ID" clearable @keyup.enter.native="tProductList" />
								</el-form-item>
							</el-col>
							<el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
								<el-form-item>
									<el-button type="primary" @click="getProductDetails"
										><el-icon><ele-Search /></el-icon>搜索</el-button
									>
									<el-button @click="resetQuery(queryRef)"
										><el-icon><ele-Refresh /></el-icon>重置</el-button
									>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-row :gutter="10" class="mb8">
						<el-col :span="1.5">
							<el-button type="primary" @click="handleAdd(storeID)"
								><el-icon><ele-Plus /></el-icon>新增</el-button
							>
						</el-col>
						<el-col :span="1.5">
							<el-button type="primary" @click="showImport = true"
								><el-icon><ele-Plus /></el-icon>批量导入</el-button
							>
						</el-col>
					</el-row>
				</div>
				<el-table v-loading="loading" :data="tableData.data" @selection-change="handleSelectionChange">
					<el-table-column label="商品ID" align="center" prop="id" min-width="100px" />
					<el-table-column label="商品条形码" align="center" prop="gtid" min-width="50px" />
					<el-table-column label="商品名称" align="center" prop="name" min-width="50px" />
					<el-table-column label="商品价格" align="center" prop="price" min-width="50px" />
					<el-table-column label="商品图片" align="center" min-width="50px">
						<template #default="scope">
							<img :src="`${scope.row.image_path}`" alt="商品图片" style="width: 100px; height: 100px" />
						</template>
					</el-table-column>
					<el-table-column label="商品状态" align="center" prop="status" min-width="50px" />
					<el-table-column label="创建时间" align="center" prop="created_at" min-width="100px" />
					<el-table-column label="商品描述" align="center" prop="description" min-width="100px"> </el-table-column>
					<el-table-column label="操作" align="center" class-name="small-padding" min-width="160px" fixed="right">
						<template #default="scope">
							<el-button type="primary" link @click="handleUpdate(scope.row)"
								><el-icon><ele-EditPen /></el-icon>编辑商品</el-button
							>
							<!-- <el-button
                type="primary"
                link
                @click="handleUpdate2(scope.row)"
              ><el-icon><ele-DeleteFilled /></el-icon>下架商品</el-button> -->
						</template>
					</el-table-column>
				</el-table>
				<pagination
					v-show="tableData.total > 0"
					:total="tableData.total"
					v-model:page="tableData.param.page_num"
					v-model:limit="tableData.param.page_size"
					@pagination="tProductList"
				/>
			</el-card>
		</el-drawer>
	</div>
	<ApiV1SystemTProductCreate :storeID="storeID" ref="createProductRef" @tProductList="tProductList" />
	<ApiV1SystemTProductEdit :storeID="storeID" ref="editProductRef" @tProductList="tProductList" />
	<el-dialog
		:before-close="
			() => {
				files = null;
			}
		"
		destroy-on-close
		v-model="showImport"
		:width="'300px'"
		title="批量导入上传文件"
	>
		<div>
			<el-upload
				drag
				:auto-upload="false"
				:limit="1"
				:multiple="false"
				:on-change="
					(file: File) => {
						files = file;
					}
				"
			>
				<div class="el-upload__text">拖拽或者<em>点击上传</em></div>
				<template #tip>
					<div>仅支持 csv 文件</div>
				</template>
			</el-upload>
			<el-row justify="center">
				<el-col>
					<el-button type="primary" @click="upload">上传</el-button>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
	<el-dialog v-model="showErr">
		<p v-for="item in errMsg">{{ item }}</p>
	</el-dialog>
</template>
<script setup lang="ts">
import { ItemOptions } from '/@/api/items';
import { toRefs, reactive, onMounted, ref, defineComponent, computed, getCurrentInstance, toRaw, toRef } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { listTProduct, getTProduct, updateTProduct, uploadcsv } from '/@/api/system/tProduct';
import { TProductTableColumns, TProductInfoData, TProductTableDataState } from '/@/views/system/tProduct/list/component/model';
import ApiV1SystemTProductCreate from '/@/views/system/tProduct/list/component/create.vue';
import ApiV1SystemTProductEdit from '/@/views/system/tProduct/list/component/edit.vue';
import { TStoreInfoData, TStoreTableDataState } from './model';
import { update } from 'lodash';
// import createProduct from './createProduct.vue';
defineOptions({ name: 'apiV1SystemTProductList' });
const loading = ref(false);
const queryRef = ref();
const createProductRef = ref();
const editProductRef = ref();
const storeID = ref('');
const files = ref(null);
const showImport = ref(false);
const showErr = ref(false);
// 是否显示所有搜索选项
const showAll = ref(false);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	tProductList();
};
const state = reactive<TProductTableDataState>({
	isShowDialog: false,
	ids: [],
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			page_num: 1,
			page_size: 10,
			id: undefined,
			store_id: undefined,
			gtid: undefined,
			name: undefined,
			save_name: undefined,
			price: undefined,
			image_path: undefined,
			image_type: undefined,
			description: undefined,
			status: undefined,
			createa_at: undefined,
			image: undefined,
		},
	},
});
const { tableData } = toRefs(state);
const errMsg = ref('');
const upload = async () => {
	const formdata = new FormData();
	formdata.append('store_id', storeID.value);
	formdata.append('type', 'internal');
	formdata.append('file', (files.value! as any).raw);
	const res = await uploadcsv(formdata);
	if (res.data.failed) {
		errMsg.value = res.data.failed;
		showErr.value = true;
	}
};
const tProductList = () => {
	loading.value = true;
	listTProduct(storeID.value, state.tableData.param).then((res: any) => {
		if (res?.data?.products && Array.isArray(res.data.products)) {
			const products = res.data.products.map((item: any) => ({
				...item,
				image_url: `${import.meta.env.VITE_API_URL}${item.image_path}/${item.image_name}`,
			}));
			state.tableData.data = products;
			state.tableData.total = res.data.total || 0;
		} else {
			state.tableData.data = [];
			state.tableData.total = 0;
		}
		loading.value = false;
	});
};
const handleAdd = (id: string) => {
	createProductRef.value.openDialog(id);
};
const getProductDetails = () => {
	const id = state.tableData.param.id;
	if (!id || id.trim() === '') {
		ElMessage.warning('商品ID不能为空');
		return;
	}
	loading.value = true;
	if (!state.tableData.param.id) {
		return;
	}
	getTProduct(state.tableData.param.id).then((res: any) => {
		const item = res.data;
		const product = {
			...item,
			image_url: `${import.meta.env.VITE_API_URL}${item.image_path}/${item.image_name}`,
		};
		state.tableData.data = [product];
		state.tableData.total = 1;
		loading.value = false;
	});
};

const handleUpdate = (row: TProductTableColumns | null) => {
	if (!row) {
		row = state.tableData.data.find((item: TProductTableColumns) => {
			return item.id === state.ids[0];
		}) as TProductTableColumns;
	}
	editProductRef.value.openDialog(toRaw(row));
};

// 多选框选中数据
const handleSelectionChange = (selection: Array<TProductInfoData>) => {
	state.ids = selection.map((item) => item.id);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
};
const openDialog = (row?: TStoreInfoData) => {
	// resetForm();
	state.isShowDialog = true;
	if (row) {
		storeID.value = row.id!;
		tProductList();
	}
};
defineExpose({
	openDialog,
});
const { isShowDialog } = toRefs(state);
</script>
<style lang="scss" scoped>
.colBlock {
	display: block;
}
.colNone {
	display: none;
}
.ml-2 {
	margin: 3px;
}
</style>
