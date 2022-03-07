import Moment from 'moment'
//处理整体api数据
let process  = (t) => {
    let pathsTagsMap = {};
    //api分组
    let tags = t.tags
    let paths = t.paths
    let key = Object.keys(paths);
    //重排列结构
    key.forEach((k) => {
        let item = paths[k]
        const innerKey = Object.keys(item);
        innerKey.forEach((ik) => {
            const tag = item[ik].tags[0]
            item[ik]['method'] = ik
            item[ik]['url'] = k
            if (Object.keys(pathsTagsMap).indexOf(tag) < 0) {
                pathsTagsMap[tag] = []
                pathsTagsMap[tag].push(item)
            } else {
                pathsTagsMap[tag].push(item)
            }
    
        })
    })
    return pathsTagsMap;
}
//简单转换下
let mockDataByType = (type) => {
        switch (type.toLowerCase()) {
            case 'array':
                return [];
            case 'integer':
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'object':
                return {};
            case 'string(date-time)':
                return Moment().format("YYYY-MM-DD HH:mm:ss")
            default:
                return '';
        }
    }
let refObj = {}
//深度递归
let deep = (dep,key,responseTreeData) => {
        if ('$ref' in dep || ('items' in dep && '$ref' in dep.items)) {
        
            let ref = ''
            let type = ''
            if ('$ref' in dep) {
                type = 'object'
                ref = dep['$ref'].replace('#/definitions/', '')
            } else {
                 type = 'array'
                ref = dep['items']['$ref'].replace('#/definitions/', '')
            }
         
            let realData = refObj?.definitions?.[ref]
            if (realData == undefined) {
                return {}
            }
            let properties = realData['properties']
            let json = {}
            let keys = Object.keys(properties)
           
            if(responseTreeData != undefined){
                let treeChildren = []
                let tree = {
                   "name": key,
                   "type": dep.type,
                   "description": dep.description,
                   "children" : treeChildren
                }
                for (let item in keys) {
                    // console.log(properties[keys[item]])
                    json[keys[item]] = deep(properties[keys[item]],keys[item],treeChildren)
                    // json[keys[item]] = deep(realData[keys[item]])
                }
                responseTreeData.push(tree)
            }else{
                for (let item in keys) {
                    // console.log(properties[keys[item]])
                    json[keys[item]] = deep(properties[keys[item]],keys[item],undefined)
                    // json[keys[item]] = deep(realData[keys[item]])
                }
            }
          
            return json
        } else {
            let type = CommonApi.mockDataByType(dep.type)
            if(responseTreeData != undefined){
                responseTreeData.push({
                    "name": key,
                    "type": dep.type,
                    "required": dep.required,
                    "description": dep.description
                })
            }
           
            return type
        }

    }
//抽屉里面的单选预设值
const radioConsts = [{
            "value": "success",
            "label": "成功"
        },
        {
            "value": 'error',
            "label": '失败'
        },
        {
            "value": 'error-retry',
            "label": '失败待重试'
        },
        {
            "value": 'retry',
            "label": '待重试'
        },
        {
            "value": 'no-auth',
            "label": '无权限'
        },
        {
            "value": 'no-data',
            "label": '无响应数据'
        },
        {
            "value": 'no-some-data',
            "label": '响应缺少部分数据'
        },
        {
            "value": 'big-some-data',
            "label": '返回了多余数据'
        },
        {
            "value": 'no-format',
            "label": '响应参数未驼峰命名'
        },
        {
            "value": 'type-error',
            "label": '参数类型错误'
        },
    ]

let CommonApi = {
    "process": process,
    "radioConsts": radioConsts,
    "deep": deep,
    "mockDataByType": mockDataByType,
    "setRefObj": (ref) => {
          refObj = ref
      
    },
    "refObj": refObj
}

export default CommonApi;