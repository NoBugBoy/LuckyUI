<template>
    <div>
        <n-layout has-sider position="absolute" style="top: 64px;">
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="100" :width="280" :native-scrollbar="false"
                show-trigger="bar" content-style="padding: 20px;">
                <n-menu :on-update:value="menuClick" :collapsed-width="60" :collapsed-icon-size="25"
                    :options="menuOptions" :render-label="renderMenuLabel" :render-icon="renderMenuIcon"
                    :expand-icon="expandIcon" :value="valueRef" />
            </n-layout-sider>
            <n-layout :native-scrollbar="false" content-style="padding: 24px;">
                <n-tabs v-model:value="valueRef" type="card" :closable="closableRef" default-value="home"
                    @close="handleClose" tab-style="min-width: 40px;">
                    <template #prefix>
                        <n-icon size="20">
                            <FolderOpenSharp />
                        </n-icon>
                    </template>
                    <template #suffix>
                        <n-tooltip>
                              <template #trigger>
                               <n-button text @click="closeTabs">
                                   <n-icon size="30">
                                       <close-circle />
                                   </n-icon>
                               </n-button>
                              </template>
                              关闭全部标签页,同时清理缓存
                            </n-tooltip>
                        
                    </template>
                   <n-tab-pane v-for="panel in panelsRef" :name="panel.id" :tab="panel.name" @click="switchPanel">
                       {{switchPanel(panel)}}
                    </n-tab-pane>
                </n-tabs>
               <router-view key="dynamicKey"></router-view>
            </n-layout>
        </n-layout>
    </div>


</template>


<script setup>
    import {
        NTabs,
        NTooltip,
        NTabPane,
        NButton,
        NLayout,
        NCollapse,
        NCollapseItem,
        NGradientText,
        NSpace,
        NH2,
        NIcon,
        NEllipsis,
        NBadge,
        NPopover,
        NMenu,
        NLayoutSider
    } from 'naive-ui'
    import {
        defineProps,
        h,
        inject,
        ref,
        onMounted,
        computed
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'
    import {
        Rocket,
        ShareSocial,
        Analytics,
        Aperture,
        CaretDownOutline,
        Home,
        CloseCircle,
        FolderOpenSharp,
        ColorFilter
    } from '@vicons/ionicons5'
    import 
        CommonApi
     from '../common.js'

    const menuOptions = ref([{
            label: '主页',
            key: 'home',
            name: 'home',
        },
        {
            label: 'Models',
            key: 'mad',
        },
        {
            label: '请求用例管理',
            key: 'manager',
        },
        {
            label: '离线文档分享',
            key: 'share',
        }
    ])
    let g = inject('g')
    let pathsTagsMap = {};
    let dynamicKey = computed(() => {
         return new Date();
    })
    onMounted(() => {
        let t = g.value['data']
        //是否开启增强菜单
        let isBoost = g.value['data']['boost']
        if(isBoost){
             menuOptions.value.push({
                "label": "方法调用追踪",
                "key": "methodTrace",
                "name": "methodTrace",
            })
        }
        pathsTagsMap = CommonApi.process(t)
        //配置结构
        let apis = Object.keys(pathsTagsMap);
        apis.forEach((api) => {
            let menu = {
                "label": api,
                "key": api,
                "name": api,
            }
            let item = pathsTagsMap[api]
            //有api
            if (item.length > 0) {
               
                let methodMap = {}
                let methodTypes = Array.from(new Set(item.map((child) => {
                    let methodName = Object.keys(child)[0]
                    if (methodName in methodMap) {
                        methodMap[methodName].push(child)
                    } else {
                        methodMap[methodName] = []
                        methodMap[methodName].push(child)
                    }
                    return methodName
                })))
                let index = 0
                menu['children'] = methodTypes.map((group) => {
                    return {
                        "type": "group",
                        //不知道为啥这里已经渲染一次 还要在renderMenuLabel里再渲染一次
                        "label": () => groupFunc(group),
                        "key": api + group,
                        "group": group,
                        "children": methodMap[group].map((c) => {
                            index++;
                            return {
                                label: c[group].summary,
                                key: c[group].summary + index,
                                data: c[group]
                            }
                        })

                    }
                })

            }
            menuOptions.value.push(menu)
        })

    })
    const groupFunc = (group) => {
        let type = 'success'
        switch(group){
            case 'get' : type = 'info'; break;
            case 'post' : type = 'success'; break;
            case 'put' : type = 'warning'; break;
            case 'delete' : type = 'error'; break;
            default: break;
        }
        return h(NGradientText,{'type':type},{default: () => group.toUpperCase()})
    } 
    const valueRef = ref('')
    valueRef.value = 'home'
    let panelsRef = ref([{
        "id": "home",
        "name": "主页"
    }])
    let route = useRouter()
    let menuClick = (key, item) => {
          console.log(key, item)
        if (!panelsRef.value.find((x) => x.id == key)) {
            panelsRef.value.push({
                "id": key,
                "name": item.label,
                "data": item.data
            })
        }
        valueRef.value = key;
        routeFor(key, item.data)

    }
    let switchPanel = (panel) => {
        console.log(panel)
        routeFor(panel.id, panel.data)
    }

    //公共的tab和侧边栏跳转
    let routeFor = (routeKey, data) => {
        console.log(routeKey, data)
        if (routeKey == 'home') {
            route.push({
                name: 'FirstPage',
                params: {
                    "data": 'identity'
                }
            })
        }else if(routeKey == 'manager'){
            route.push({
                name: 'Manager'
            })
        }else if(routeKey == 'mad'){
            route.push({
                name: 'Models'
            })
        }else if (routeKey == 'share'){
            route.push({
                name: 'Share'
            })
        }else if(routeKey == 'methodTrace'){
          route.push({
              name: 'MethodTrace'
          })
        }else {
            route.push({
                name: 'Api',
                params: {
                    "data": JSON.stringify(data)
                }
            })
        }
    }

    //显示menu api数量和是否新增
    let renderMenuLabel = (option) => {
         if('group' in option){
                return groupFunc(option.group)
           }
        if ('children' in option) {
            let count = 0
            if (option.children != undefined) {
                option.children.forEach((i) => {
                    if (i != undefined && 'children' in i) {
                        count = count + i.children.length
                    }

                })
            }
            return h(
                "span",
                null, [
                    h(NEllipsis, null, [
                            h("span", null, option.label),
                            h(NBadge, {
                                value: count,
                                max: 20,
                                type: 'success',
                                style: "margin-left:6px"
                            }),
                        ],
                    ),
                ]
            )
                
             
        }

        return h(NEllipsis,null,{default:() => option.label })
    }

    let renderMenuIcon = (option) => {
        if (option.key === 'home') {
            return h(NIcon, null, {
                default: () => h(Home)
            })
        } else if (option.key === 'mad') {
            return h(NIcon, null, {
                default: () => h(ColorFilter)
            })
        }else if(option.key === 'manager'){
           return h(NIcon, null, {
               default: () => h(Aperture)
           })
        }
        else if(option.key === 'share'){
           return h(NIcon, null, {
               default: () => h(ShareSocial)
           })
        }else if(option.key === 'methodTrace'){
           return h(NIcon, null, {
               default: () => h(Analytics)
           })
        }else{
            return h(NIcon, null, {
                default: () => h(Rocket)
            })
        }  
    }
    
    let expandIcon = (option) => {
        return h(NIcon, null, {
            default: () => h(CaretDownOutline)
        })
    }

    let closeTabs = () => {
        panelsRef.value = panelsRef.value.filter((x) => x.id === "home")
        if (!panelsRef.value.find((x) => x.id == "home")) {
            panelsRef.value.push({
                "id": "home",
                "name": "主页"
            })
        }
        valueRef.value = 'home'
        sessionStorage.clear()
        route.push('/firstPage')
    }

    const closableRef = computed(() => {
        // console.log('关闭1')
        return panelsRef.value.length > 1
    })
    const handleClose = (name) => {
        const s =  panelsRef.value.find((x) => x.id == name)
        if(s.data != undefined){
             sessionStorage.removeItem(s.data.url + s.data.method)
        }
       
        const {
            value: panels
        } = panelsRef
        const nameIndex = panels.findIndex((panelName) => panelName.id === name)
        if (!~nameIndex) return
        panels.splice(nameIndex, 1)
        const first = panels[0]
        
        routeFor(first.id, first.data)
        valueRef.value = first.id

    }
</script>

<style scoped>
    a {
        color: #42b983;
    }
</style>
