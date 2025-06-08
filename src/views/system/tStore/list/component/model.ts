export interface TStoreTableColumns {    
    id:string;  // 门店ID(主键、业务标识)    
    third_id:string;  // 第三方平台门店ID    
    name:string;  // 门店名称(如"无人超市-中关村店")    
    address:string;  // 门店地址(如"北京市海淀区中关村大街1号")    
    owner_id:string;  // 门店所有者标识    
    owner_name:string;  // 门店所有者姓名    
    owner_phone:string;  // 门店所有者电话    
    customer_service_name:string;  // 客服姓名    
    customer_service_phone:string;  // 客服联系电话    
    customer_service_wechat:string;  // 客服微信    
    merchant_no:string;  // 拉卡拉分配的商户号    
    term_no:string;  // 拉卡拉分配的业务终端号 
    status:string;  // 门店状态: 1=正常营业、2=暂停营业、3=店铺倒闭    
    created_at: string;  // 门店创建时间    
    updated_at: string
}


export interface TStoreInfoData {    
    id:string|undefined;        // 门店ID(主键、业务标识)    
    third_id:string|undefined; // 第三方平台门店ID    
    name:string|undefined; // 门店名称(如"无人超市-中关村店")    
    address:string|undefined; // 门店地址(如"北京市海淀区中关村大街1号")    
    owner_id:string|undefined; // 门店所有者标识    
    owner_name:string|undefined; // 门店所有者姓名    
    owner_phone:string|undefined; // 门店所有者电话    
    customer_service_name:string|undefined; // 客服姓名    
    customer_service_phone:string|undefined; // 客服联系电话    
    customer_service_wechat:string|undefined; // 客服微信    
    merchant_no:string|undefined; // 拉卡拉分配的商户号    
    term_no:string|undefined; // 拉卡拉分配的业务终端号
    status:string|undefined; // 门店状态: 1=正常营业、2=暂停营业、3=店铺倒闭    
    created_at:string|undefined; // 门店创建时间    
    updated_at: string | undefined; // 门店信息更新时间    
}


export interface TStoreTableDataState {
    ids:any[];
    tableData: {
        data: Array<TStoreTableColumns>;
        total: number;
        loading: boolean;
        param: {
            page_num: number;
            page_size: number;            
            id: string|undefined;            
            third_id: string|undefined;            
            name: string|undefined;            
            address: string|undefined;            
            owner_id: string|undefined;            
            owner_name: string|undefined;            
            owner_phone: string|undefined;            
            customer_service_name: string|undefined;            
            customer_service_phone: string|undefined;            
            customer_service_wechat: string|undefined;            
            merchant_no: string|undefined;            
            term_no: string|undefined;            
            status: string|undefined;            
            created_at: string|undefined;            
        };
    };
}
export interface TStoreCreateState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TStoreInfoData;
    rules: object;
}

export interface TStoreEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TStoreInfoData;
    rules: object;
}