import request from '@/utils/request'

// request.get('/db,json').then(response => {
//     console.log(response.data)
// })
const BASE_URL = process.env.VUE_APP_BASE_API
request({
    method: 'get',
    url:'/db.json'
}).then(response => {
    console.log(response.data)
})
// request({
//     method:'get',
//     url:'/dev-api/db.json'
// })

export default {
    getList(){
        const req = request({
            method:'get',
            url:'/db.json'
        })
        console.log(req)
        return req
    }
}