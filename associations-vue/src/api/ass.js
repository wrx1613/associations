/**
 * 社团API
 */
export default {
    // 社团管理
    ass: {
        get: '/ass/ass/get',
        list: '/ass/ass/list',
        delete: '/ass/ass/delete',
        save: '/ass/ass/save',
        masterList: '/ass/ass/masterList',
        updateLogo: '/ass/ass/updateLogo',
        updateSummary: '/ass/ass/updateSummary',
        allList: '/ass/ass/allList'
    },
    // 活动
    activity: {
        list: '/ass/activity/list',
        delete: '/ass/activity/delete',
        save: '/ass/activity/save',
        submit: '/ass/activity/submit',
        pass: '/ass/activity/pass',
        back: '/ass/activity/back',
        checkList: '/ass/activity/checkList',
    },
    assUser: {
        list: '/ass/assUser/list',
        save: '/ass/assUser/save',
        delete: '/ass/assUser/delete'
    }
}
