import axios from 'axios'



var instance = axios.create({
    timeout: 5000,
    headers:{'Content-Type':'application/json'}
})
instance.interceptors.request.use((data)=> {
    data['startTime'] = new Date()
    return data
},(error) => {
    
    return error
})
export  default instance
