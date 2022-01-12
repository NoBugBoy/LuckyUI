<template>
    <n-space vertical>
        <n-card title="请求用例管理" v-if="flush">
            <div v-if="jsons.length > 0">
            <n-space vertical :size="15">
                <n-popconfirm
                    positive-text="好的,没关系."
                    negative-text="Emmm,算了吧."
                    @positive-click="clearAll"
                  >
                   <template #icon>
                        <n-icon>
                          <Happy />
                        </n-icon>
                      </template>
                    <template #trigger>
                      <n-button dashed type='primary'>点我清除全部用例</n-button>
                    </template>
                    你确定要全部清理吗，我会把LocalStorage全部干掉哦。
                  </n-popconfirm>
                 <div v-for="(item,index) in jsons">
                        <n-collapse>
                            <n-collapse-item name=index>
                                <template #header> <span style="font-size: 18px;">{{item.key}}</span> </template>
                                <n-data-table :columns="columns" :data="item.value" />
                            </n-collapse-item>
                        </n-collapse>
                    </div>
                      </n-space>
                </div>
          
            
            <div v-else>
                <n-result status="404" title="好像没有多余的请求用例了" description="去创建几个试试吧">
                </n-result>
            </div>
        
        
        </n-card>
    </n-space>
   
</template>

<script setup>
    import {
        NPopconfirm,
        NButton,
        NIcon,
        NDynamicTags,
        NSpace,
        NCard,
        NResult,
        NDataTable,
        NCollapse,
        NCollapseItem,
    } from 'naive-ui'
     import Moment from 'moment'
    import {
        h,
        inject,
        ref,
        watch,
        onMounted,
        computed
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'
    import {
        Happy,
    } from '@vicons/ionicons5'
    import CommonApi from '../common.js'
    let statusList = CommonApi.radioConsts
    
    let jsons = ref([])
    let columns = ref([{
            title: '名称',
            key: 'title'
        },
        {
            title: '状态',
            key: 'status',
                
            },
        {
            title: '创建时间',
            key: 'time'
        },
        {
            title: '请求参数',
            key: 'param',
            render(row) {
                row.param.forEach((s) => {
                    delete s['in']
                    delete s['type']
                    delete s['required']
                    delete s['active']
                })

                return JSON.stringify(row.param);
            }
        },
        {
            title: '请求体',
            key: 'body'
        }, {
            title: '操作',
            key: 'action',
            render(row) {
                return h(
                    NButton, {
                        type:"primary",
                        onClick: () => deleteLocal(row)
                    }, {
                        default: () => '删除'
                    }
                )
            }
        },

    ])
    let flush = ref(true)
    let route = useRouter()
    let deleteLocal = (row) => {
        let group = localStorage.getItem(row.group)
        let arr = JSON.parse(group)
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].title == row.title) {
                if (arr.length == 1) {
                    localStorage.removeItem(row.group)
                } else {
                    arr.splice(i, 1);

                    localStorage.setItem(row.group, JSON.stringify(arr))

                }
                break;
            }
        }
        flushData()
    }
    let clearAll = () => {
        localStorage.clear()
        flushData()
    }
    let flushData = () => {
        flush.vlaue = false
        jsons.value = []
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.startsWith('lucky')) {
                let temp = {}
                let json = JSON.parse(localStorage.getItem(key))
                json.forEach((k) => {
                    k['group'] = key
                })
                temp['key'] = key.split("_")[1]
                temp['value'] = json
                jsons.value.push(temp)
            }
        }
        flush.vlaue = true
    }


    onMounted(() => {
        flushData()
    })
</script>

<style scoped="scoped">
</style>
