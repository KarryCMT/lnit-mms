import request from '@/utils/request'

// request.get('/db,json').then(response => {
//     console.log(response.data)
// })

request({
    method: 'get',
    url:'/dev-api/db.json'
}).then(response => {
    console.log(response.data)
})
request({
    method:'get',
    url:'/dev-api/db.json'
})

export default {
    getList(){
        const req = request({
            method:'get',
            url:'/dev-api/db.json'
        })
        console.log(req)
        return req
    }
}