import request from '@/utils/request'
//获取会员数据列表
export default  {
    getList(){
       return request({
            url: '/member/list',
            method: 'get',
            })
        }
    }