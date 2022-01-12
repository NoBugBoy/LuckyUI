<template>
    <n-card title="离线文档分享">
        <n-space vertical :size="24">
            <n-statistic label="你一共提供了" tabular-nums>
                <template #prefix>
                    <n-icon>
                        <Rocket />
                    </n-icon>
                </template>
                <n-number-animation :active="true" :from="0" :to="to" />

                <template #suffix>
                    条可分享的RestfulApi
                </template>
            </n-statistic>
            <div>
                <n-button text size="large" :disabled="checkedRowKeys.length == 0" @Click="exec">
                    <template #icon>
                        <n-icon>
                            <Eye />
                        </n-icon>
                    </template>
                    勾选需要分享的API进行预览、二次编辑、导出
                </n-button>
            </div>
            <n-space vertical>
               
                <div v-show="checkedRowKeys.length > 0">已选择 {{checkedRowKeys.length}} 条API</div>
                <n-data-table 
                ref="table" 
                :columns="columns" 
                :data="datas"
                striped="true"
                v-model:checked-row-keys="checkedRowKeys" 
                />
                <n-back-top :right="40" :bottom="50">
                    <div
                      style="width: 120px; height: 40px; line-height: 40px; text-align: center; font-size: 14px;"
                    >
                      回到顶部
                    </div>
                  </n-back-top>
            </n-space>

        </n-space>

        <n-modal v-model:show="showModal">
            <n-card style="width: 850px;" title="Md预览(支持编辑修改导出md格式,可以复制到任意支持md格式的工具网站二次美化)" :bordered="false"
                size="huge" role="dialog" aria-modal="true">
                <n-button text size="large" :disabled="checkedRowKeys.length == 0" @Click="exportRaw">
                    <template #icon>
                        <n-icon>
                            <DownloadOutline />
                        </n-icon>
                    </template>
                    点击下载Md格式文件
                </n-button>
                <md-editor v-model="mdtext" :theme="theme" style="width: 850; height: 600px;" />



            </n-card>
        </n-modal>


    </n-card>

</template>

<script setup>
    import {
        NButton,
        NDataTable,
        NCard,
        NStatistic,
        NNumberAnimation,
        NSpace,
        NIcon,
        NModal,
        NBackTop,
        darkTheme

    } from 'naive-ui'
    import {
        ref,
        inject,
        watch,
        onMounted
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'
    import {
        Rocket,
        Eye,
        DownloadOutline
    } from '@vicons/ionicons5'
    import
    CommonApi
    from '../common.js'
    import
    Md
    from '../md.js'
    import MdEditor from 'md-editor-v3';


    let g = inject('g')
    let lodingShow = ref(false)
    const refObj = g.value['data']
    const pathsTagsMap = CommonApi.process(refObj)
    let datas = ref([])
    let apis = Object.keys(pathsTagsMap);
    let index = 0

    apis.forEach((item) => {
        let api = pathsTagsMap[item]

        if (!!api && api.length > 0) {
            api.forEach((i) => {
                //同一个path下可能有多个同路径请求 只是请求方式不同 别问我怎么知道的
                const keys = Object.keys(i)
                keys.forEach((v) => {
                    v = i[v]
                    datas.value.push({
                        "group": item,
                        "api": v.summary,
                        "path": v.url,
                        "method": v.method,
                        "data": v,
                        "key": index++
                    })

                })
            })
        }
    })
    let to = ref(datas.value.length);

    let checkedRowKeys = ref([])

    const columns = [{
            type: 'selection',
            options: [{
                    label: "选择所有GET Api",
                    key: 'get',
                    onSelect: (pageData) => {
                        checkedRowKeys.value = pageData
                            .filter((row) => row.method.toLowerCase() == 'get').map((row) => row.key)
                    }
                },
                {
                    label: "选择所有POST Api",
                    key: 'post',
                    onSelect: (pageData) => {
                        checkedRowKeys.value = pageData
                            .filter((row) => row.method.toLowerCase() == 'post').map((row) => row.key)
                    }
                },
                {
                    label: "选择所有DELETE Api",
                    key: 'del',
                    onSelect: (pageData) => {
                        checkedRowKeys.value = pageData
                            .filter((row) => row.method.toLowerCase() == 'delete').map((row) => row.key)
                    }
                },
                {
                    label: "选择所有PUT Api",
                    key: 'put',
                    onSelect: (pageData) => {
                        checkedRowKeys.value = pageData
                            .filter((row) => row.method.toLowerCase() == 'put').map((row) => row.key)
                    }
                }
            ],
        },
        {
            title: '分组',
            key: 'group'
        },
        {
            title: 'Api',
            key: 'api'
        },
        {
            title: 'Method',
            key: 'method',
            sorter: 'default',
            width: '200px'
        },
        {
            title: 'Path',
            key: 'path'
        },
    ]
    let mdtext = ref('')
    let showModal = ref(false)

    let exec = () => {

        showModal.value = true

        CommonApi.setRefObj(refObj)
        let zenData = datas.value.filter((row) => checkedRowKeys.value.findIndex((r) => r == row.key) != -1)
        let title = Md.title("LuckUI Api文档分享", 1)
        zenData.forEach((value) => {
            title = title.concat(processData(value.data)).concat(Md.split())
        })
        title = title.substring(0, title.length - 5)

        mdtext.value = title



        CommonApi.setRefObj({})



    }

    function fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        obj.dispatchEvent(ev);
    }

    function exportRaw() {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([mdtext.value]);
        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = 'api文档导出.md';
        fakeClick(save_link);
    }
    let theme = ref('light')
    watch(() => g.value['theme'], () => {
        let t = g.value['theme']
        theme.value = t == 0 ? 'dark' : 'light'
    })
    const mdTitiles = ['参数名称', '参数说明', 'in', '是否必须', '参数类型']
    const resTtiltes = ['参数名称', '参数说明', '参数类型']
    let processData = (data) => {
        let markdown = ''
        let reqParams = []
        let reqBody = ''
        let editJson = ""
        let bodyTreeData = []
        let responseTreeData = []
        let jsonData = undefined
      
        const json = data
        let reqType = json.method.toUpperCase()
        let desc = json.summary
        let url = json.url
        if (data != undefined && data != 'identity') {
            for (let index in json.parameters) {
                if (json.parameters[index].in != 'body') {
                    reqParams.push(json.parameters[index])
                } else {
                    reqBody = json.parameters[index]
                }
            }

            if (reqType == 'GET') {

            } else if (!!reqBody) {
                //处理request body 

                let bodyRef = reqBody.schema.$ref
                let def = refObj.definitions[bodyRef.replace('#/definitions/', '')]
                let jsonout = Object.keys(def['properties'])
                let bodyData = {}
                jsonout.forEach((x) => {
                    //补充字段名
                    def['properties'][x]['key'] = x
                    bodyData[x] = CommonApi.deep(def['properties'][x], x, bodyTreeData)
                })

                editJson = JSON.stringify(bodyData)
            }
            //返回值处理
            let res = json.responses['200'].schema
            let def = {}
            if (!!res) {
                if ('items' in res && '$ref' in res.items) {
                    def = refObj.definitions[res.items.$ref.replace('#/definitions/', '')]
                } else if ('$ref' in res && res.$ref != undefined) {
                    def = refObj.definitions[res.$ref.replace('#/definitions/', '')]
                } else if ('items' in res) {
                    let json = {}
                    json[''] = {
                        "type": res.items.type,
                        "description": res.items.type,
                        "key": '',
                    }
                    def['properties'] = json
                } else {
                    def = res
                }

                if (!!def['properties']) {
                    let jsonout = Object.keys(def['properties'])
                    let resJson = {}
                    jsonout.forEach((x) => {
                        //补充字段名
                        def['properties'][x]['key'] = x
                        resJson[x] = CommonApi.deep(def['properties'][x], x, responseTreeData)
                    })
                    jsonData = resJson
                }


            }

        }
        markdown = markdown.concat(Md.title("接口描述: " + desc, 3));
        markdown = markdown.concat(Md.title("接口地址: " + url, 3));
        markdown = markdown.concat(Md.title("请求方式: " + reqType, 3));
        markdown = markdown.concat(Md.title("请求参数: ", 3));

        let paramsMd = []
        reqParams.forEach(param => {
            let p = []
            p.push(param.name)
            p.push(param.description)
            p.push(param.in)
            p.push(param.required)
            p.push(param.type)
            paramsMd.push(p)
        })
        markdown = markdown.concat(Md.table(mdTitiles, paramsMd));
        if (!!reqBody) {
            markdown = markdown.concat(Md.title("请求体: ", 3));
            markdown = markdown.concat(Md.jsonCode(JSON.stringify(JSON.parse(editJson), null, 2)));
        }



        if (responseTreeData.length > 0) {
            markdown = markdown.concat(Md.title("响应参数: ", 3));
            let responseMd = []
            responseTreeData.forEach(res => {
                let p = []
                p.push(res.name)
                p.push(res.description)
                p.push(res.type)
                responseMd.push(p)
            })
            markdown = markdown.concat(Md.table(resTtiltes, responseMd));
        }
        if (!!jsonData) {
            markdown = markdown.concat(Md.title("响应示例: ", 3));
            markdown = markdown.concat(Md.jsonCode(JSON.stringify(jsonData, null, 2)));
        }
        return markdown
    }
</script>

<style>
</style>
