import request from '@/utils/request'
export default {
    //获取供应商数据列表
    getList() {
        return request({
            url: '/goods/list',
            method: 'get',
        })
    },
    getById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            url: '/goods',
            method: 'post',
            data: pojo
        })
    },
    update(pojo) {
        return request({
            url: `/goods/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    delete(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        })
    },
}