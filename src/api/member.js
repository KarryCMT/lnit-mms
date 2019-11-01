import request from '@/utils/request'
//获取会员数据列表
export default {
    getList() {
        return request({
            url: '/member/list',
            method: 'get',
        })
    },
    //分页搜索方法
    //page当前页码，size每页查询条数，searchMap条件查询的条件值
    search(page,size,searchMap) {
        return request({
            url:`/member/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    //新增会员
    add(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data:pojo
        })
    },
    //查询数据
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        })
    },
    //更新数据
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data:pojo
        })
    },
    //删除数据
    delete(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        })
    },
}