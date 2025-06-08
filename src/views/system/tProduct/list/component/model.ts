export interface TProductTableColumns {    
    id:string;  // ID    
    store_id:string;  // ID    
    gtid:string;  //    
    name:string;  //    
    price: number;  //    
    image_path: string;  // 
    description:string;  //    
    status:number;  // : 1=, 2=    
    createa_at:string;  //    
}


export interface TProductInfoData {    
    id:string;        // ID    
    store_id:string; // ID    
    gtid:string; //    
    name:string; //    
    price: number; // 
    image_path: string; //
    description: string; //    
    status: string; // : 1=, 2=    
    createa_at?: string|undefined; //    
    updated_at?: string|undefined; //    
}


export interface TProductTableDataState {
    isShowDialog:  boolean;
    ids:any[];
    tableData: {
        data: Array<TProductTableColumns>;
        total: number;
        loading: boolean;
        param: {
            page_num: number;
            page_size: number;            
            id: string;            
            store_id: string;            
            gtid: string;            
            name: string|undefined;            
            price: number | undefined;  
            image_path: string | undefined;  
            description: string|undefined;            
            status: number|undefined;            
            createa_at: string|undefined;            
        };
    };
}

export interface TProductCreateState {
    loading:boolean; 
    formData: {
        store_id:string|undefined;
        products: TProductInfoData[];
    };
}

export interface TProductEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TProductInfoData;
    rules: object;
}