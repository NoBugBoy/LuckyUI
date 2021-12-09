import instance from "/src/axios.js"
const axios = ({
    method,
    url,
    data,
    config
}) => {
    method = method.toLowerCase();
    if (method == 'post') {
        return instance.post(url, {'data':data}, {...config})
    } else if (method == 'get') {
        return instance.get(url, {
            params: data,
            ...config
        })
    } else if (method == 'delete') {
       return instance.delete(url, {'data':data}, {...config})
    } else if (method == 'put') {
        return instance.put(url, {'data':data},{...config})
    } else {
        console.error('未知的method' + method)
        return false
    }
}
export default axios