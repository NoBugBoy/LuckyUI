<template>
        <n-card style="margin: 10px;">
            <n-tabs default-value="doc" size="large">
                <n-tab-pane name="doc" tab="文档">
                    <n-card title="Documentation" style="margin: 10px;">
                        <n-space vertical>
                            <n-row>
                                <n-statistic label="接口描述" :value="desc" />
                            </n-row>
        
                            <n-row>
                                <n-statistic label="请求方式" :value="reqType" />
                            </n-row>
        
                            <n-row>
                                <n-statistic label="接口地址" :value="url" />
                            </n-row>
                        </n-space>
                    </n-card>
                    <n-card style="margin: 10px;">
                        <n-tabs default-value="request">
                            <n-tab-pane name="request" tab="请求参数">
                                <n-space vertical :size="12">
                                    <n-card>
                                        <n-table :single-line="false">
                                            <thead>
                                                <tr>
                                                    <th>参数名称</th>
                                                    <th>参数说明</th>
                                                    <th>请求类型</th>
                                                    <th>是否必须</th>
                                                    <th>数据类型</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="p in reqParams">
                                                    <td>{{p.name}}</td>
                                                    <td>{{p.description}}</td>
                                                    <td v-if="p.in == 'header'">
                                                        <n-tag type="success" size="medium" round>
                                                            {{p.in}}
                                                        </n-tag>
                                                    </td>
                                                    <td v-else>
                                                        <n-tag type="info" size="medium" round>
                                                            {{p.in}}
                                                        </n-tag>
                                                    </td>
                                                    <td v-if="p.required">
                                                        <n-tag type="error" size="medium" round>
                                                            {{p.required}}
                                                        </n-tag>
                                                    </td>
                                                    <td v-else>
                                                        <n-tag type="info" size="medium" round>
                                                            {{p.required}}
                                                        </n-tag>
                                                    </td>
                                                    <td>{{p.type}}</td>
                                                </tr>
                                            </tbody>
                                        </n-table>
                                    </n-card>
                                    <n-card title="RequestBody" v-if="isBody && show">
                                        <n-button type='success' style="margin-bottom: 10px;" @Click='format'>格式化</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='zip'>折叠</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='narrow'>缩小</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='enlarge'>放大</n-button>
                                        <b-ace-editor v-model="editJson" lang="json" width="100%" height="600"
                                            :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                            :font-size="fontsize"></b-ace-editor>
                                    </n-card>
        
                                </n-space>
                            </n-tab-pane>
                            <n-tab-pane name="signup" tab="返回值">
                                <n-collapse style="font-size: 18px;">
                                    <div v-for="(item,key,index) in out">
                                        <div v-if="'type' in item">
                                            <n-collapse-item :title='key' :name='key'>
                                                <n-space>
                                                    <n-tag type="success">{{item.type}}</n-tag>
                                                    <div v-if="item.type != 'array'">
                                                        <n-tag type="info">
                                                            {{'description' in item && item.description == null ? item.items.description : item.description==null?'':item.description}}
                                                        </n-tag>
                                                    </div>
        
                                                </n-space>
                                            </n-collapse-item>
                                        </div>
                                        <div v-else>
                                            <n-collapse>
                                                <n-collapse-item :title='key' :name='key'>
                                                    <Back :value='item' />
                                                </n-collapse-item>
        
                                            </n-collapse>
                                        </div>
                                    </div>
                                </n-collapse>
                            </n-tab-pane>
                            <n-tab-pane name="show" tab="返回值示例">
                                <json-viewer :theme="darkTheme" :value="jsonData" style="font-size: 16px;" copyable boxed
                                    sort />
                            </n-tab-pane>
                        </n-tabs>
                    </n-card>
                </n-tab-pane>
                <n-tab-pane name="run" tab="运行">
                    <n-card title="Send Request">
                        <n-space vertical :size="22">
                            <n-switch>
                                <template #checked>关闭发送后自动保存为测试用例</template>
                                <template #unchecked>开启点击发送后保存为测试用例</template>
                            </n-switch>
                            <n-input-group size="large">
                                <n-input-group-label>
                                    <n-gradient-text type="success"> {{reqType}} </n-gradient-text>
                                </n-input-group-label>
                                <n-input :disabled="true" :style="{ width: '50%' }" v-model:value="url" />
                                <n-button @Click="send" type="success" ghost>发送</n-button>
                            </n-input-group>
                            <n-radio-group v-model:value="radio" name="radiobuttongroup1">
                                <n-radio-button v-for="k in radios" :key="k.value" :value="k.value">
                                    {{ k.label }}
                                </n-radio-button>
                            </n-radio-group>
                            <n-tabs default-value="Params" :value="switchResponse" :on-update:value="switchResponseFun">
                                <n-tab-pane name="Params" tab="Params">
                                    <n-table :bordered="false" :single-line="false">
                                        <thead>
                                            <tr>
                                                <th>是否启用</th>
                                                <th>参数类型</th>
                                                <th>参数名称</th>
                                                <th>参数值</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="p in reqParams">
                                                <td>
                                                    <n-switch v-model:value="p.active" />
                                                </td>
                                                <td>
                                                    <n-tag type="success">{{p.type}}({{p.in}})</n-tag>
                                                </td>
                                                <td>
                                                    <n-tag type="info"> {{p.name}}</n-tag>
        
                                                </td>
                                                <td>
                                                    <n-input v-model:value="p.value" type="text" size="medium"
                                                        :placeholder="'请填写'+p.name " :disabled="!p.active" round
                                                        clearable />
                                                </td>
        
                                            </tr>
                                        </tbody>
                                    </n-table>
                                </n-tab-pane>
                                <n-tab-pane name="RequestBody" tab="RequestBody">
                                    <div v-if="show">
                                        <n-button type='success' style="margin-bottom: 10px;" @Click='format'>格式化</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='zip'>折叠</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='narrow'>缩小</n-button>
                                        <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                            @Click='enlarge'>放大</n-button>
                                        <b-ace-editor v-model="editJson" lang="json" width="100%" height="600"
                                            :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                            :font-size="fontsize"></b-ace-editor>
                                    </div>
                                </n-tab-pane>
                                <n-tab-pane name="ResponseBody" tab="ResponseBody">
                                   <n-card title="Response">
                                       <div style="display: flex;">
                                           <n-button type='success' style="margin-bottom: 10px;" @Click='format0'>格式化</n-button>
                                           <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;" @Click='zip0'>折叠
                                           </n-button>
                                           <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                               @Click='narrow'>缩小</n-button>
                                           <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                               @Click='enlarge'>放大</n-button>  
                                                 
                                               <span v-if=" rescode!= '' " style="display: flex;justify-content: flex-end;margin-left: auto;">
                                                     <span style="font-size: 16px;">状态码: {{rescode}} </span>
                                                     <n-divider vertical />
                                                     <span style="font-size: 16px;">耗时: {{restime}}ms </span>
                                               </span>
                                             
                                           
                                       </div>
                                       <b-ace-editor v-model="responseJson" lang="json" width="100%" height="600"
                                           :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                           :font-size="fontsize"></b-ace-editor>
                                   </n-card>
                                </n-tab-pane>
        
                            </n-tabs>
                        
        
                        </n-space>
                    </n-card>
                        
                   
                </n-tab-pane>
        
            </n-tabs>
        </n-card>
   
</template>

<script setup>
    import {
        NConfigProvider,
        NRadioGroup,
        NRadioButton,
        NSwitch,
        NRow,
        NInputGroupLabel,
        NGradientText,
        NDivider,
        NListItem,
        NInputGroup,
        NThing,
        NTabs,
        NTabPane,
        NStatistic,
        darkTheme,
        NButton,
        NInput,
        NCollapse,
        NCollapseItem,
        NText,
        NCard,
        NTag,
        NBreadcrumb,
        NLayout,
        NLayoutHeader,
        NTable,
        NLayoutContent,
        NLayoutFooter,
        useMessage,
        NSpace,
        NH2,
        NIcon,
        NEllipsis,
        NBadge,
        NMenu,
        NLayoutSider
    } from 'naive-ui'
    import {
        defineProps,
        getCurrentInstance,
        h,
        inject,
        onMounted,
        ref,
        watch,
        computed
    } from 'vue'
    import {
        useRoute
    } from 'vue-router'
    import Moment from 'moment'
    import Back from '/src/components/Back.vue'
    import {
        Rocket,
        CaretDownOutline,
        Home,
        Save,
        CloseCircle,
        FolderOpenSharp,
        ColorFilter
    } from '@vicons/ionicons5'
    import axios from "/src/request.js"

    const message = useMessage()
    //处理第三方json编辑框不能跟随主题变色问题
    let g = inject('g')
    let empty = {}
    let isBody = ref(false)
    let editJson = ref('')
    let show = ref(true)
    let radio = ref('application/json')
    let radios = ref([])
    let responseJson = ref('')
    radios.value = [{
            "label": "application/json",
            "value": "application/json",
        },
        {
            "label": "x-www-form-urlencoded",
            "value": "x-www-form-urlencoded",
        },
        {
            "label": "form-data",
            "value": "form-data",
        }
    ]
    let localRef = ref(empty)
    localRef.value = g.value['theme']
    let refObj = g.value['data']
    const alertMsg = '这似乎不是一个JSON吧 朋友？'

    //格式化 折叠
    let format = () => {
        try {
            editJson.value = JSON.stringify(JSON.parse(editJson.value), null, 2)
        } catch (err) {
            message.warning(alertMsg)
        }

    }
    let zip = () => {

        try {
            editJson.value = JSON.stringify(JSON.parse(editJson.value), null, 0)
        } catch (err) {
            message.warning(alertMsg)
        }
    }
    //格式化 折叠
    let format0 = () => {
        try {
           responseJson.value = JSON.stringify(JSON.parse(responseJson.value), null, 2)
        } catch (err) {

        }
    }
    let zip0 = () => {
        try {
            responseJson.value = JSON.stringify(JSON.parse(responseJson.value), null, 0)
        } catch (err) {}
    }
    let narrow = () => {
        if (fontsize.value <= 12) {
            message.warning('不能再缩小了')
        } else {
            fontsize.value = fontsize.value - 1
        }
    }
    let enlarge = () => {
        if (fontsize.value >= 20) {
            message.warning('不能再放大了')
        } else {
            fontsize.value = fontsize.value + 1
        }
    }
    let route = useRoute()
    //监听主题颜色变化
    watch(() => g.value['theme'], () => {
        setTimeout(() => {
            show.vlaue = false
            localRef.value = g.value['theme']
            show.vlaue = true
        }, 160)
    })
    let desc = ref('')
    let url = ref('')
    let reqType = ref('')
    let rescode = ref('')
    let restime = ref('')
    let switchResponse = ref('Params')
    //参数
    let reqParams = ref([])
    let reqBody = ref(null)
    //return 第一层数据
    let out = ref([])
   
    
    //递归将整个json拿出来 key字段 value是类型 ，然后根据类型 mock 一些数据 覆盖value
    let deep = (dep) => {
        // console.log(dep)
        if ('$ref' in dep || ('items' in dep && '$ref' in dep.items)) {
            let ref = ''
            if ('$ref' in dep) {
                ref = dep['$ref'].replace('#/definitions/', '')
            } else {
                ref = dep['items']['$ref'].replace('#/definitions/', '')
            }

            let realData = refObj.definitions[ref]
            if (realData == undefined) {
                return {}
            }
            let properties = realData['properties']
            let json = {}
            let keys = Object.keys(properties)
            for (let item in keys) {
                // console.log(properties[keys[item]])
                json[keys[item]] = deep(properties[keys[item]])
                // json[keys[item]] = deep(realData[keys[item]])
            }
            return json
        } else {
            return mockDataByType(dep.type)
        }

    }
    let switchResponseFun = (x) => {
          switchResponse.value = x
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
    //发送请求
    let send = () => {
        //处理参数 只处理active的
        let header = {
            'Content-Type': radio.value
        }
        let urlParam = {}
        reqParams.value.forEach((k) => {
            if (k.active) {
                if (k.in == 'header') {
                    header[k.name] = k.value
                } else if (k.in == 'query') {
                    urlParam[k.name] = k.value
                }
            }
        })
        if (reqType.value.toLowerCase() == 'get') {
            // 根据请求格式发送请求
            let getAll = axios({
                url: url.value,
                method: reqType.value.toLowerCase(),
                data: urlParam,
                config: {
                    headers: header,
                }
            })
            //获取全部数据
            getAll.then(res => {
            
                restime.value = new Date() - res.config.startTime
                rescode.value = res.status
                responseJson.value = JSON.stringify(res.data)
                 format0()
            }).catch(error => {
                
                  rescode.value = error.response.status
                 restime.value = new Date() - error.response.config.startTime
                 responseJson.value = err(error.response)
               format0()
            })
        } else {
            // 根据请求格式发送请求
            let getAll = axios({
                url: url.value,
                method: reqType.value.toLowerCase(),
                data: editJson.value,
                config: {
                    headers: header,
                    params: urlParam
                }
            })
            //获取全部数据
            getAll.then(res => {
                responseJson.value = JSON.stringify(res.data)
                rescode.value = res.status
                restime.value = new Date() - res.config.startTime
                 format0()
            }).catch(error => {
                  rescode.value = error.response.status
               restime.value = new Date() - error.response.config.startTime
                responseJson.value = err(error.response)
               format0()
            })
             
        }
        //切换到参数tab
        switchResponse.value = 'ResponseBody'
           
    }
    
    let err = (error) => {
        let json = {};
        json["timestamp"] = Moment().format("YYYY-MM-DD HH:mm:ss")
        json["code"] = error.data.status
        json["error"] = error.data.error
        json["path"] = error.data.path
        return JSON.stringify(json)
    }

    //json编辑器相关
    let read = false
    let fontsize = ref(12)
    let jsonData = ref('')
    
    
    //监听路由变化
    watch(() => route.params, () => {
        const data = route.params.data
        //初始化响应值
        rescode.value = ''
        restime.value = ''
        responseJson.value = ''
        editJson.value = ''
        //切换到参数tab
        switchResponse.value = 'Params'
        //undefined 跳到了主页
        if (data != undefined && data != 'identity') {
            const json = JSON.parse(data)
            //文档信息赋值
            desc.value = json.summary
            url.value = json.url
            reqType.value = json.method.toUpperCase()
            //参数赋值
            reqParams.value = []
            for (let index in json.parameters) {
                if (json.parameters[index].in != 'body') {
                    json.parameters[index]['active'] = true
                    json.parameters[index]['value'] = ref('')
                    reqParams.value.push(json.parameters[index])
                } else {
                    reqBody.vlaue = json.parameters[index]
                }
            }
            if (reqType.value == 'GET') {
                isBody.value = false
            } else {
                //处理request body 
                isBody.value = true
                let bodyRef = reqBody.vlaue.schema.$ref
                let def = refObj.definitions[bodyRef.replace('#/definitions/', '')]
                let jsonout = Object.keys(def['properties'])
                let bodyData = {}
                jsonout.forEach((x) => {
                    //补充字段名
                    def['properties'][x]['key'] = x
                    bodyData[x] = deep(def['properties'][x])
                })
                editJson.value = JSON.stringify(bodyData)
            }
            //返回值处理
            let res = json.responses['200'].schema
            if ('items' in res ) {
                let def = refObj.definitions[res.items.$ref.replace('#/definitions/', '')]
                out.value = def['properties']
                let jsonout = Object.keys(def['properties'])
                let resJson = {}
                jsonout.forEach((x) => {
                    //补充字段名
                    def['properties'][x]['key'] = x
                    resJson[x] = deep(def['properties'][x])
                })
                jsonData.value = resJson
            } else if(res.$ref != undefined){
                let def = refObj.definitions[res.$ref.replace('#/definitions/', '')]
                out.value = def['properties']
                let jsonout = Object.keys(def['properties'])
                let resJson = {}
                jsonout.forEach((x) => {
                    //补充字段名
                    def['properties'][x]['key'] = x
                    resJson[x] = deep(def['properties'][x])
                })
                jsonData.value = resJson
            }
            //递归json数据
            if (editJson.value != '') {
                format()
            }
        }
        //body
    
    
    
    },{immediate:true})
</script>

<style>

</style>
