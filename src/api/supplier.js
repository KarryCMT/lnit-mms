import request from '@/utils/request'
export default {
    //获取供应商数据列表
    getList() {
        return request({
            url: '/supplier/list',
            method: 'get',
        })
    },
    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            url: '/supplier',
            method: 'post',
            data: pojo
        })
    },
    update(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    delete(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        })
    },
}