<template>
    <div class="system-tProduct-container">
      <el-drawer v-model="isShowDialog" direction="ltr" size="80%">
        <el-card shadow="hover">
          <div class="system-tProduct-search mb15">
            <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
              <el-row>                
                <el-col :span="8" class="colBlock">
                  <el-form-item label="ID" prop="id">
                    <el-input
                        v-model="tableData.param.id"
                        placeholder="请输入ID"
                        clearable                        
                    />                    
                  </el-form-item>
                </el-col>                
                <el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
                  <el-form-item>
                    <el-button type="primary"  @click="getProductDetails"><el-icon><ele-Search /></el-icon>搜索</el-button>
                    <el-button  @click="resetQuery(queryRef)"><el-icon><ele-Refresh /></el-icon>重置</el-button>
                  </el-form-item>
                </el-col>            
              </el-row>
            </el-form>
          </div>
          
          <!-- 树形结构展示 -->
          <div v-loading="loading">
            <div class="tree-head">
              <div class="tree-head-order-id">订单ID</div>
              <div class="tree-head-create-time">创建时间</div>
              <div class="tree-head-status">支付状态</div>
              <div class="tree-head-method">支付方式</div>
              <div class="tree-head-payment-time">支付时间</div>
              <div class="tree-head-product-amount">商品数量</div>
            </div>
            
            <el-tree 
              :data="treeTableData" 
              :show-checkbox="false"
              node-key="id" 
              ref="treeTableRef" 
              :props="treeDefaultProps" 
              @node-expand="onNodeExpand"
            >
              <template #default="{  data }">
                <div v-if="data.isProduct" class="tree-product-node">
                  <div class="tree-col tree-col-product-id">商品id:{{ data.id }}</div>
                  <div class="tree-col tree-col-product-name">商品名称：{{ data.name }}</div>
                  <div class="tree-col tree-col-product-amount">商品数量：{{ data.amount }}件</div>
                  <div class="tree-col tree-col-product-price">商品价格：¥{{ data.price }}</div>
                </div>
                <div v-else class="tree-custom-node">
                  <div class="tree-col tree-col-order-id">{{ data.order_id }}</div>
                  <div class="tree-col tree-col-create-time">{{ data.create_time }}</div>
                  <div class="tree-col tree-col-status">{{ data.order_status }}</div>
                  <div class="tree-col tree-col-method">{{ data.payment_method }}</div>
                  <div class="tree-col tree-col-payment-time" >{{ data.payment_time || '暂未支付' }}</div>
                  <div class="tree-col tree-col-product" v-if=data.products  >
                    {{ `共${data.products ? data.products.length : 0}件商品` }}
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
          
          <pagination
              v-show="tableData.total>0"
              :total="tableData.total"
              v-model:page="tableData.param.page_num"
              v-model:limit="tableData.param.page_size"
              @pagination="tProductList"
          />
        </el-card>
      </el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
  import {
    TProductTableDataState,
} from "/@/views/system/tProduct/list/component/model"
  import { listTOrder, getTStoreOrder } from "/@/api/system/tOrder";
  
  defineOptions({ name: "apiV1SystemTProductList"})
  
  const loading = ref(false);
  const queryRef = ref<FormInstance>();
  const treeTableRef = ref();
  const storeID = ref("");
  const showAll = ref(false);
  
  // 树形结构配置
  const treeDefaultProps = {
    children: 'children',
    label: 'order_id'
  };
  
  // 重置查询条件
  const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      tProductList()
  };
  
  // 定义订单数据接口
  interface OrderData {
    id: string;
    order_id: string;
    create_time: string;
    order_status: string;
    payment_method: string;
    payment_time: string;
    products?: ProductData[];
    store_id: string;
    total_price: number;
  }
  
  // 定义商品数据接口
  interface ProductData {
    id: string;
    name: string;
    price: number;
    amount: number;
  }
  
  // 定义树形数据接口
  interface TreeDataState {
    id: string;
    order_id: string;
    create_time: string;
    order_status: string;
    payment_method: string;
    payment_time: string;
    products?: ProductData[];
    children?: TreeDataState[];
    isProduct?: boolean;
    // 商品特有属性
    name?: string;
    price?: number;
    amount?: number;
  }
  
  // 定义组件状态
  const state = reactive<TProductTableDataState & {
    treeTableData: TreeDataState[];
  }>({
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
          },
      },
      treeTableData: []
  });
  
  const { tableData, treeTableData, isShowDialog } = toRefs(state);
  
  // 初始化树的长度
  const initTreeLengh = (arr: TreeDataState[]) => {
    let count = 0;
    arr.map((item) => {
      if (item.children) {
        count += item.children.length;
      }
    });
  };
  
  // 节点展开时的回调
  const onNodeExpand = (node: any) => {
 
  };
  
  // 将扁平数据转换为树形结构
  const convertToTreeData = (list: OrderData[]) => {
    return list.map(order => ({
      id: order.id || order.order_id,
      order_id: order.order_id,
      create_time: order.create_time,
      order_status: order.order_status,
      payment_method: order.payment_method,
      payment_time: order.payment_time,
      products: order.products,
      children: order.products?.map(product => ({
        id: product.id,
        order_id: order.order_id,
        create_time: order.create_time,
        order_status: order.order_status,
        payment_method: order.payment_method,
        payment_time: order.payment_time,
        isProduct: true,
        // 商品详情字段
        name: product.name,
        price: product.price,
        amount: product.amount
      })) || []
    }));
  };
  
  // 获取订单列表
  const tProductList = () => {
    loading.value = true;
    listTOrder(storeID.value, state.tableData.param).then((res: any) => {
      let list = res.data.orders ?? [];    
      state.tableData.data = list;
      state.tableData.total = res.data.total;
      
      state.treeTableData = convertToTreeData(list);
      initTreeLengh(state.treeTableData);
      
      loading.value = false;
    });
  };
  
  // 搜索
  const getProductDetails = () => { 
    const id = state.tableData.param.id;
    if (!id || id.trim() === '') {
      ElMessage.warning('商品ID不能为空');
      return;
    }
    loading.value = true;
    getTStoreOrder(state.tableData.param.id).then((res: any) => { 
      state.tableData.data = [res.data];
      state.tableData.total = 1;
      
      state.treeTableData = convertToTreeData([res.data]);
      initTreeLengh(state.treeTableData);
      
      loading.value = false;
    });
  };
  
  // 初始进来
  const openDialog = (row?: any) => {
    state.isShowDialog = true;
    if (row) { 
      storeID.value = row.id!;
      listTOrder(row.id!, state.tableData.param).then((res) => {
        let list = res.data.orders ?? [];  
        state.tableData.data = list;
        state.tableData.total = res.data.total;
        
        state.treeTableData = convertToTreeData(list);
        initTreeLengh(state.treeTableData);
        
        loading.value = false;
      });
    }
  };
  
  defineExpose({
    openDialog
  });
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
  
  /* 树形结构样式优化 */
  .tree-head {
    height: 48px;
    line-height: 48px;
    border: 1px solid var(--next-border-color-light);
    border-bottom: none;
    display: flex;
    padding-left: 26px;
    font-weight: bold;
    color: #909399;
    box-sizing: border-box;
    
    
    
    .tree-head-order-id {
      flex: 1;
      padding-left: 8px;
    }
    
    .tree-head-create-time {
      flex: 1;
    }
    
    .tree-head-status,
    .tree-head-method {
      flex: 1;
    }
    
    .tree-head-payment-time {
      flex: 1;
    }
    
    .tree-head-product-amount {
      flex: 1;
    }
  }
  
  .el-tree {
    overflow: hidden;
    border-bottom: 1px solid var(--next-border-color-light);
    
    .tree-custom-node, .tree-product-node {
      display: flex;
      align-items: center;
      justify-content: space-between;
     
      width: 100%;
      box-sizing: border-box;
   
    }
    
    &:deep(.el-tree-node) {
      border: 1px solid var(--next-border-color-light);
      border-bottom: none;
      color: #606266;
      
      .el-tree-node__content {
        line-height: 48px !important;
        height: 48px !important;
        padding: 0;
      }
      
      .el-tree-node__children {
        .el-tree-node {
          border: none;
        }
        .el-tree-node__content {
          border-top: 1px solid var(--next-border-color-light);
          background-color: #f5f7fa;
          padding-left: 30px; /* 优化缩进 */
        }
      }
    }
    
    .tree-col {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 5px;
      box-sizing: border-box;
    }
    
    .tree-col-order-id {
      padding-left: 8px;
    }
    
    .tree-product-node {
      .tree-col-product-id {
        flex: 1; 
      }
      
      .tree-col-product-name {
        flex: 1;
      }
      
      .tree-col-product-amount,
      .tree-col-product-price {
        flex: 1;
      }
    }
  }
  </style>