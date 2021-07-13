/**
 * 权限相关
 */
/*
 ************************************
              token相关
 ************************************
 */
import Cookies from 'vue-cookies'
const TOKEN = 'com.rui.uid'

export function getToken() {
    return Cookies.get(TOKEN)
}

export function setToken(token) {
    return Cookies.set(TOKEN, token)
}

export function removeToken() {
    return Cookies.remove(TOKEN)
}
