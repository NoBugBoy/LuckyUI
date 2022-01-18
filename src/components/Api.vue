<template>
    <n-card style="margin: 10px;" :key="new Date().getTime()">
        <n-tabs default-value="doc" size="large" :value="tabValue" :on-update:value="changeTab">
            <n-tab-pane name="doc" tab="文档">
                <n-card title="Documentation" style="margin: 10px;">
                    <n-grid :x-gap="50" :y-gap="10" :cols="3">
                        <n-grid-item>
                         <n-card title="接口地址" hoverable>
                              <n-ellipsis id="titleDoc">
                                 {{url}}
                               </n-ellipsis>
                         </n-card>
                        </n-grid-item>
                        <n-grid-item>
                         <n-card title="请求方式" hoverable>
                             <n-ellipsis id="titleDoc">
                                 {{reqType}}
                               </n-ellipsis>
                         </n-card>
                        </n-grid-item>
                        <n-grid-item>
                         <n-card title="接口描述" hoverable> 
                         <n-ellipsis id="titleDoc">
                             {{desc}}
                           </n-ellipsis>
                          </n-card>
                        </n-grid-item>
                       
                      

                        </n-grid>
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
                                            <tr v-for="p in reqParams" :key="p.name">
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
                                      <n-data-table  ref="table" :columns="columns" :data="bodyTreeData" :row-key="rowKey" :row-class-name="rowClassName"  />
                                </n-card>
                                <n-card v-if="isBody && show">
                                    <n-button type='success' style="margin-bottom: 10px;" @Click='format' size="small">格式化</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='zip' size="small">折叠</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='narrow' size="small">缩小</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='enlarge' size="small">放大</n-button>
                                    <b-ace-editor style="border-style:none" v-model="editJson" lang="json" width="100%" height="600"
                                        :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                        :font-size="fontsize"></b-ace-editor>
                                </n-card>

                            </n-space>
                        </n-tab-pane>
                        <n-tab-pane name="signup" tab="返回值">
                            <n-data-table  ref="table" :columns="columns" :data="responseTreeData" :row-key="rowKey" :row-class-name="rowClassName"  />
                            <!-- 食之无味 弃之可惜 -->
                            <!-- <n-collapse style="font-size: 18px;">
                                <div v-for="(item,key,index) in out">
                                    <div v-if="'type' in item">
                                        <n-collapse-item :title='key' :name='key'>
                                            <n-space>
                                                <n-tag type="success">{{item.type}}</n-tag>
                                                <div
                                                    v-if="item.type != 'array' && 'description' in item && item.description!=null && item.description!=''">
                                                    <n-tag type="info">
                                                        {{item.description}}
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
                            </n-collapse> -->
                        </n-tab-pane>
                        <n-tab-pane name="show" tab="返回值示例">
                            <json-viewer :theme="darkTheme" :value="jsonData" style="font-size: 16px;" copyable expand-depth="2"
                                 />
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </n-tab-pane>
            <n-tab-pane name="run" tab="运行">
                <n-card title="Send Request" size="large">
                    <n-space vertical :size="22">
                        <n-switch v-model:value="openSelect">
                            <template #checked>关闭从本地请求用例选择</template>
                            <template #unchecked>开启从本地请求用例选择</template>
                        </n-switch>
                        <n-input-group size="large">
                            <n-input-group-label>
                                <n-gradient-text type="success"> {{reqType}} </n-gradient-text>
                            </n-input-group-label>
                            <n-input :disabled="true" :style="{ width: '50%' }" v-model:value="url" />
                            <n-button @Click="send" type="success" ghost>发送</n-button>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <n-button round style="font-size: 26px;" @Click="openSave">
                                        <n-icon>
                                            <SaveSharp />
                                        </n-icon>
                                    </n-button>
                                </template>
                                保存请求用例
                            </n-tooltip>
                        </n-input-group>
                         <n-select
                              v-if="openSelect"
                              :options="openSelectOptions"
                              :render-label="renderLabel"
                              :render-tag="renderSingleSelectTag"
                              :on-update:value="overrides"
                              placeholder="选择一个请求用例,覆盖当前的参数."
                              style="width: 50%;"
                            />
                        <n-drawer v-model:show="open" :width="502">
                            <n-drawer-content title="保存请求用例" closable>
                                <n-space vertical>
                                    <n-card title="起一个名字吧">
                                        <n-input size="large" placeholder="写点什么.." v-model:value="itemTitle"/>
                                    </n-card>
                                    <n-card title="选一种状态吧">
                                       <n-radio-group v-model:value="status" name="statusGroup" size="large">

                                            <n-radio v-for="s in statusList" :key="s.value" :value="s.value">
                                                <n-space justify="space-around" size="large">

                                                    {{ s.label }}
                                                </n-space>
                                            </n-radio>

                                        </n-radio-group>

                                    </n-card>
                                </n-space>

                                <template #footer>
                                    <n-button size="large" @Click="saveToLocal">保存请求用例</n-button>
                                </template>
                            </n-drawer-content>

                        </n-drawer>
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
                                        <tr v-for="p in reqParams" :key="p.name">
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
                                    <n-button type='success' style="margin-bottom: 10px;" @Click='format' size="small">格式化</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='zip' size="small">折叠</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='narrow' size="small">缩小</n-button>
                                    <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                        @Click='enlarge' size="small">放大</n-button>
                                    <b-ace-editor style="border-style:none" v-model="editJson" lang="json" width="100%" height="600"
                                        :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                        :font-size="fontsize"></b-ace-editor>
                                </div>
                            </n-tab-pane>
                            <n-tab-pane name="ResponseBody" tab="ResponseBody">
                                <n-card title="Response">
                                   <n-spin :show="resOk">
                                        <template #description>等待数据响应中..</template>
                                           <div style="display: flex;">
                                               <n-button type='success' style="margin-bottom: 10px;" @Click='format0' size="small">格式化
                                               </n-button>
                                               <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                                   @Click='zip0' size="small">折叠
                                               </n-button>
                                               <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                                   @Click='narrow' size="small">缩小</n-button>
                                               <n-button type='success' style="margin-bottom: 10px;margin-left: 10px;"
                                                   @Click='enlarge' size="small">放大</n-button>
                                           
                                               <span v-if=" rescode!= '' "
                                                   style="display: flex;justify-content: flex-end;margin-left: auto;">
                                                   <span style="font-size: 16px;">状态码: {{rescode}} </span>
                                                   <n-divider vertical />
                                                   <span style="font-size: 16px;">耗时: {{restime}}ms </span>
                                               </span>
                                           
                                             
                                           </div>
                                           
                                            
                                                 <b-ace-editor style="border-style:none" v-model="responseJson" lang="json" width="100%" height="600"
                                                     :theme="localRef==0 ? 'vibrant_ink':'github'" :readonly="read"
                                                     :font-size="fontsize"></b-ace-editor>
                                                  
                                    
                                   
                                      </n-spin>
                                   
                                         
                                </n-card>
                            </n-tab-pane>

                        </n-tabs>


                    </n-space>
                </n-card>


            </n-tab-pane>

        </n-tabs>
        <n-back-top :right="40" :bottom="50">
            <div
              style="width: 120px; height: 40px; line-height: 40px; text-align: center; font-size: 16px"
            >
              回到顶部
            </div>
          </n-back-top>
    </n-card>

</template>

<script setup>
    import {
        NConfigProvider,
        NTooltip,
        NGrid,
        NSelect,
        NDataTable,
        NGridItem,
        NRadioGroup,
        NRadioButton,
        NRadio,
         NBackTop,
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
        NSpin,
        NCard,
        NTag,
        NTable,
        useMessage,
        NSpace,
        NDrawer,
        NDrawerContent,
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
        onUpdated,
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
        SaveSharp,
        CloseCircle,
        FolderOpenSharp,
        ColorFilter
    } from '@vicons/ionicons5'
    import axios from "/src/request.js"
    import CommonApi from '../common.js'
    
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
    let status = ref('success')
    let statusList = ref([])
    //开启选择本地请求
    let openSelect = ref('')
    
    let openSelectOptions = ref([])
     let renderLabel =  (option) => {
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center'
                }
              },
              [
                h(
                  'div',
                  {
                    style: {
                      marginLeft: '12px',
                      padding: '4px 0'
                    }
                  },
                  [
                    h('div', {style: {
                        'font-size': '16px',
                    }}, [option.label]),
                    h(
                      NTag,
                      { 
                          style:{'margin-top':'5px'},
                          size:'small',
                          type:option.status == '成功'?"success":option.status == '失败'?'error':'warning'},
                      {
                        default: () => option.status
                      }
                    )
                  ]
                )
              ]
            )
          }
          let renderSingleSelectTag = ({ option }) => {
                  return h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'center'
                      }
                    },
                    [
                     h('div', {style: {
                         'font-size': '16px',
                     }}, [option.label]),
                    ]
                  )
                }
    //一些常用的场景
    statusList.value = CommonApi.radioConsts
    //请求的content types
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
    let settingParam = () => {
        //配置请求用例
        const key = 'lucky' + '_' + desc.value +'_'+ reqType.value
        let localRequest = localStorage.getItem(key)
        if(localRequest != null){
            let jsons = JSON.parse(localRequest)
            jsons.forEach((i) => {
               let statuss =  statusList.value.find((item) => item.value == i.status)
                openSelectOptions.value.push({
                    "time": Moment().format("YYYY-MM-DD HH:mm:ss"),
                    "label": i.title,
                    "value": i.title,
                    "params" : i.param,
                    "body":i.body,
                    "status":statuss.label
                })
            })
            
        }
    }
    let itemTitle = ref('')
    let open = ref(false)
    //弹出抽屉
    let openSave = () => {
        open.value = true
    }
    let saveToLocal = () => {
        //分别保存params和body 
        if(itemTitle.value == ''){
            message.error('请求用例标题不能为空')
        }
        //url可能相同但是请求方式必然不同
        const key = 'lucky' + '_' + desc.value +'_'+ reqType.value
        let localRequest = localStorage.getItem(key)
        if(!!localRequest){
            const jsons = JSON.parse(localRequest)
            if(jsons.findIndex((x) => x.title == itemTitle.value) != -1){
                message.error('该用例名称已被使用,请更改后重试')
                return;
            }
            //请求参数
            let json = {}
            json['param'] = reqParams.value
            json['time'] = Moment().format("YYYY-MM-DD HH:mm:ss")
            json['body'] = editJson.value
            json['title'] = itemTitle.value
            json['status'] = status.value
            jsons.push(json)
            localStorage.setItem(key,JSON.stringify(jsons))
        }else{
            let jsons = []
            let json = {}
            json['param'] = reqParams.value
            json['time'] = Moment().format("YYYY-MM-DD HH:mm:ss")
            json['body'] = editJson.value
            json['title'] = itemTitle.value
            json['status'] = status.value
            jsons.push(json)
            localStorage.setItem(key,JSON.stringify(jsons))
        }
        message.success('保存成功')
        open.value = false
        settingParam()
        
        
    }
    let localRef = ref(empty)
    localRef.value = g.value['theme']
    const refObj = g.value['data']
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
    let tabValue = ref('doc')
    let changeTab = (x) => {
        tabValue.value = x
    }
    let desc = ref('')
    let url = ref('')
    let reqType = ref('')
    let rescode = ref('')
    let restime = ref('')
    let switchResponse = ref('Params')
    //参数
    let reqParams = ref([])
    let reqBody = ref({})
    //return 第一层数据
    let out = ref([])
    let rowKey = (row) => row.name
    let rowClassName = (row, index) => {
        //方便快速找到有没有id相关字段
           if (row.name.search("id") != -1 || row.name.search("Id") != -1) {
             return 'too-old'
           }
           return null
         }
    //返回值树的标题
    let columns =  [
        
        {
          title: '字段名',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type',
          render (row) {
            
                  return h(
                      NTag,
                      {
                        style: {
                          marginRight: '6px'
                        },
                        round: true,
                        type: 'warning'
                      },
                      {
                        default: () => { 
                          
                            if(row.type == undefined){
                                return "object";
                            }
                            return row.type;
                        }
                      }
                    )
                
        }},
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '是否必须',
          key: 'required',
          render (row) {
                  return h(
                      NTag,
                      {
                        style: {
                          marginRight: '6px'
                        },
                        round: true,
                        type: row.required?'error':'info'
                      },
                      {
                        default: () => row.required?'True':'False'
                      }
                    )
        }},
        {
              title: '快速复制字段名',
              key: 'actions',
              render (row) {
                return h(
                  NButton,
                  {
                    size: 'small',
                    round: true,
                    type: 'success',
                    quaternary: true,
                    onClick: () => copyTitle(row)
                  },
                  { default: () => 'Copy' }
                )
              }
            }
      ]
      let copyTitle = (row) => {
        
        const input = document.createElement('input');
        	input.value = row.name
        	document.body.appendChild(input);
        	input.select()
        	document.execCommand('Copy')
        	document.body.removeChild(input);
            message.success('已复制')
      }

    //递归将整个json拿出来 key字段 value是类型 ，然后根据类型 mock 一些数据 覆盖value
    let deep = (dep,key,responseTreeData) => CommonApi.deep(dep,key,responseTreeData)
    let switchResponseFun = (x) => {
        switchResponse.value = x
    }
    let resOk = ref(false)
    //发送请求
    let send = () => {
        
        //切换到参数tab
        switchResponse.value = 'ResponseBody'
        resOk.value = true;
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
                 resOk.value = false
                   saveSessionData()
            }).catch(error => {

                rescode.value = error.response.status
                restime.value = new Date() - error.response.config.startTime
                responseJson.value = err(error.response)
                format0()
                 resOk.value = false
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
                 resOk.value = false
                 saveSessionData()
            }).catch(error => {
                rescode.value = error.response.status
                restime.value = new Date() - error.response.config.startTime
                responseJson.value = err(error.response)
                format0()
                 resOk.value = false
            })

        }
       
    
    }
 let overrides = (titile,data) => {
      reqParams.value = data.params
      editJson.value = data.body
      message.success('参数已经覆盖')
     
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
 //返回值树的结构
    let responseTreeData = ref([])
    let bodyTreeData = ref([])
    //监听路由变化
    let saveSessionData = () => {
        sessionStorage.removeItem(url.value + reqType.value.toLowerCase())
        let sessiondata = {}
        sessiondata['editJson'] = editJson.value
        sessiondata['reqBody'] = reqBody.value
        sessiondata['reqParams'] = reqParams.value
        sessiondata['isBody'] = isBody.value
        sessiondata['tabValue'] = tabValue.value
        sessiondata['responseJson'] = responseJson.value
        sessiondata['rescode'] = rescode.value
        sessiondata['restime'] = restime.value
        sessiondata['openSelect'] = openSelect.value
        sessiondata['switchResponse'] = switchResponse.value
        sessiondata['radio'] = radio.value
        sessiondata['responseTreeData'] = responseTreeData.value
        sessiondata['bodyTreeData'] = bodyTreeData.value
        sessiondata['jsonData'] = jsonData.value
        sessionStorage.setItem(url.value + reqType.value.toLowerCase(), JSON.stringify(sessiondata));
    }
    watch(() => route.params, () => {
         CommonApi.setRefObj(refObj)
        
        const data = route.params.data
        //初始化响应值
        openSelectOptions.value= []
        if (!!data && data != 'identity') {
            const json = JSON.parse(data)
            //文档信息赋值
            desc.value = json.summary
            url.value = json.url
            reqType.value = json.method.toUpperCase()
            responseTreeData.value = []
            bodyTreeData.value = []
            reqBody.value = {}
            editJson.value = ''
            switchResponse.value = 'Params'
            rescode.value = ''
            restime.value = ''
            responseJson.value = ''
            out.value = []
            jsonData.value = ''
            let sessionJson = sessionStorage.getItem(json.url + json.method)
            if(!!sessionJson){
                //如果不是第一次进来 直接从缓存获取 不需要多次递归
                let sjson = JSON.parse(sessionJson)
                editJson.value = sjson.editJson
                reqBody.value = sjson.reqBody
                reqParams.value = sjson.reqParams
                isBody.value = sjson.isBody
                tabValue.value = sjson.tabValue
                responseJson.value = sjson.responseJson
                rescode.value = sjson.rescode
                restime.value = sjson.restime
                openSelect.value = sjson.openSelect
                switchResponse.value = sjson.switchResponse
                radio.value = sjson.radio
                responseTreeData.value = sjson.responseTreeData
                jsonData.value = sjson.jsonData
                bodyTreeData.value = sjson.bodyTreeData
                return;
            }//参数赋值
           reqParams.value = []
           for (let index in json.parameters) {
               if (json.parameters[index].in != 'body') {
                   json.parameters[index]['active'] = true
                   json.parameters[index]['value'] = ref('')
                   reqParams.value.push(json.parameters[index])
               } else {
                   reqBody.value = json.parameters[index]
               }
           }
            
            if (reqType.value == 'GET') {
                isBody.value = false
            } else {
                //处理request body 
                isBody.value = true
                let bodyRef = reqBody.value?.schema?.$ref
                
                if(!!bodyRef){
                    let def = refObj.definitions[bodyRef.replace('#/definitions/', '')]
                    let jsonout = Object.keys(def['properties'])
                    let bodyData = {}
    
                    jsonout.forEach((x) => {
                        //补充字段名
                        def['properties'][x]['key'] = x
                        bodyData[x] = deep(def['properties'][x],x,bodyTreeData.value)
                    })
                                   
                    editJson.value = JSON.stringify(bodyData)
                }
                
            }
            //返回值处理
            let res = json.responses['200'].schema
            let def = {}
            if(!!res){
               
                 if ('items' in res && '$ref' in res.items) {
                     def = refObj.definitions[res.items.$ref.replace('#/definitions/', '')]
                 } else if ('$ref' in res && res.$ref != undefined) {
                     def = refObj.definitions[res.$ref.replace('#/definitions/', '')]
                 }else if('items' in res){
                     //笑了 不支持变量作为key 跟py还有差距
                     let json = {}
                     json[''] = {
                             "type":res.items.type,
                             "description":res.items.type,
                             "key":'',
                         }
                     def['properties'] = json
                 }else{
                     def = res
                 }
                   
                 out.value = def['properties']
                 
                 let jsonout = Object.keys(def['properties'] == undefined ? [] : def['properties'])
                 let resJson = {}
                 jsonout.forEach((x) => {
                    
                     //补充字段名
                     def['properties'][x]['key'] = x
                     resJson[x] = deep(def['properties'][x],x,responseTreeData.value)
                 })
                
                 jsonData.value = resJson
             
                 //递归json数据
                 if (!!editJson.value) {
                     format()
                 }
                settingParam()
            }
            saveSessionData()
        }
        //body



    }, {
        immediate: true
    })
    
   
</script>

<style scoped>
 #titleDoc{
        font-size: 21px;
    }  
:deep(.too-old td) {
  /* background-color: rgba(80, 126, 0, 0.7) ; */
  color: rgba(255, 35, 30, 1.0) !important;
}
</style>
