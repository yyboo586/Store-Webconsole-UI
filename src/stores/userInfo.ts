import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { UserInfosStates } from './interface';
import { Session } from '/@/utils/storage';
import {getUpFileUrl} from '/@/utils/gfast'
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosStates => ({
		userInfos: {
			id:0,
			userName: '',
			userNickname:'',
			avatar: '',
			roles: [],
			time: 0,
			authBtnList:[],
		},
		permissions:[],
	}),
	actions: {
		async setUserInfos() {
			// 模拟数据，请求接口时，记得删除多余代码及对应依赖的引入
			const userName = Cookies.get('userName');
			// 模拟数据
			let defaultRoles: Array<string> = [];
			let defaultAuthBtnList: Array<string> = [];
			// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
			let adminRoles: Array<string> = ['admin'];
			// admin 按钮权限标识
			let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
			// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
			let testRoles: Array<string> = ['common'];
			// test 按钮权限标识
			let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
			// 不同用户模拟不同的用户权限
			if (userName === 'admin') {
				defaultRoles = adminRoles;
				defaultAuthBtnList = adminAuthBtnList;
			} else {
				defaultRoles = testRoles;
				defaultAuthBtnList = testAuthBtnList;
			}
			// 用户信息模拟数据
			const userInfos = {
				id:0,
				userName: userName,
				userNickname: "",
				avatar:'',
				time: new Date().getTime(),
				roles: defaultRoles,
				authBtnList: defaultAuthBtnList,
			};
			const sessUserInfo	= Session.get('userInfo')
			if(sessUserInfo){
				if(sessUserInfo.avatar!=''){
					sessUserInfo.avatar = getUpFileUrl(sessUserInfo.avatar)
				}else{
					sessUserInfo.avatar = '/favicon.ico'
				}
				this.userInfos=sessUserInfo
			}else {
				this.userInfos = userInfos;
			}
		},
		async setPermissions() {
			this.permissions = Session.get('permissions')
		},
	},
});
