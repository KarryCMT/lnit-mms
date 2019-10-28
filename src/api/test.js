import request from '@/utils/request'

// request.get('/db,json').then(response => {
//     console.log(response.data)
// })

request({
    method: 'get',
    url:'/db.json'
}).then(response => {
    console.log(response.data)
})