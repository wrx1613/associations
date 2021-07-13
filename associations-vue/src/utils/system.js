import { getRequest, jsonRequest, formRequest } from "./http";
import api from "@/api";
import Vue from "vue";
import store from '@/store'

/*
 ************************************
               菜单相关
 ************************************
 */
export const initMenu = (router, store) => {
    if (store.state.menu.length > 0) {
        return;
    }
    /* 获取菜单 */
    getRequest(api.userMenu).then(resp => {
        /* 将菜单储存在store中 */
        store.commit("initMenu", resp);
    });
};

/*
 ************************************
               用户相关
 ************************************
 */
export const initUser = () => {
    if (!store.state.user == '') {
        return;
    }
    /* 获取菜单 */
    getRequest(api.userInfo).then(resp => {
        /* 将菜单储存在store中 */
        store.commit("initUser", resp);
    });
};
/* 更新用户信息 */
export const updateUserInfo = () => {
    getRequest(api.userInfo).then(resp => {
        /* 将菜单储存在store中 */
        store.commit("initUser", resp);
    });
};

/*
 ************************************
               字典相关
 ************************************
 */
export const getDictListt = type => {
    let dictList = store.state.dict[type];
    if (dictList != undefined && dictList.length > 0) {
        return dictList;
    }
    formRequest('/sys/dict/getDictList', {
        type: type
    }).then(result => {
        if (result != undefined && result.length > 0) {
            let storeDictList = store.state.dict;
            Vue.set(storeDictList, type, result);
            store.commit("initDict", storeDictList);
            dictList = result;
        }
    });
    return dictList;

};

export const getDictLabell = (value1, type) => {
    value1 = new String(value1);
    if (value1 == undefined || value1 == "") {
        return "";
    }
    let dictList =  getDictListt(type);
    if (dictList == undefined || dictList.length <= 0) {
        return "";
    }
    let result = "";
    dictList.forEach(item => {
        let {
            value,
            label
        } = item;
        if (value == value1) {
            result = label;
        }
    });
    return result;
};
