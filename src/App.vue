<script setup>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    import {
        NConfigProvider,
        NMessageProvider,
        darkTheme,
        NButton,
        NCard,
        NBreadcrumb,
        NLayout,
        NLayoutHeader,
        NLayoutContent,
        NLayoutFooter,
        NSpin,
        NAlert,
        NSpace,
        NCollapse,
        NCollapseItem,
         useMessage,
        NH2,
        NSelect,
        NGradientText,
        NLayoutSider
    } from 'naive-ui'
    import {
        getCurrentInstance,
        ref,
        computed,
        inject,
        defineComponent,
        provide,
        onMounted
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'
    import Home from '/src/components/Home.vue'
    import axios from "/src/request.js"
    // import hljs from 'highlight.js/lib/core'
    // import javascript from 'highlight.js/lib/languages/javascript'
    // hljs.registerLanguage('javascript', javascript)
    let show = ref(true)
    const g = inject('g')
    g.value['theme'] = 1
    let theme = ref(null)
    let msg = ref("深色")
    const switchTheme = () => {
        if (theme.value == null) {
            theme.value = darkTheme;
            msg.value = "浅色"
            g.value['theme'] = 0
        } else {
            theme.value = null;
            msg.value = "深色"
            g.value['theme'] = 1
        }
    }
    let route = useRouter()
    let swaggerResource = ref()
    let swaggerData = ref()
    let options = ref([])
    let value = ref({})
    onMounted(() => {
        let url = window.location.pathname.replace('/doc.html','')
        //获取分组信息
        let run = axios({
            url:  url + "/swagger-resources",
            method: "get",
        })
        run.then(res => {
            
            swaggerResource.value = res.data
            g.value['resource'] = res.data
            options.value = res.data.map((x) => {
                return {
                    "label": x.name,
                    'key': x.url
                }
            })
            value.value = options.value[0].label
            let getAll = axios({
                url:  url + res.data[0].url,
                method: "get",
            })
            //获取全部数据
            getAll.then(res => {
                swaggerData.value = res.data
                g.value['data'] = res.data
                show.value = false

route.push("/firstPage")
            })
        })
    })
</script>

<template>
    <n-config-provider :theme="theme">
        <!-- <div style="height: 360px; position: relative"> -->
        <n-layout position="absolute">
            <n-layout-header style="height: 64px;display: flex;" bordered>
                <img style="padding: 14px;height: 32px;width: 32px;"
                    src="https://www.naiveui.com/assets/naivelogo.93278402.svg" />
                <span style="display: flex;justify-content: flex-start;align-items: center;">
                    <n-gradient-text type="success" :size="23">
                        YDoc Lucky UI
                    </n-gradient-text>
                </span>
                <span
                    style="display: flex;justify-content: flex-start;align-items: center;margin-left: 45px;width: 200px;">
                    <n-select v-model:value="value" :options="options" :loading="show"/>
                </span>
                <span style="position:absolute;right: 50px;padding: 14px;">
                    <n-button @click="switchTheme" Ghost>{{msg}}</n-button>
                </span>
            </n-layout-header>
            <n-message-provider>

                <n-spin :show="show" style="position: absolute;top: 50%;left: 50%;">

                    <template #description>加载数据中</template>
                </n-spin>
                <div v-if="!show">
                    <Home />
                </div>
               



            </n-message-provider>
            <n-layout-footer bordered position="absolute" style="height: 32px;">
                
            </n-layout-footer>
        </n-layout>
    </n-config-provider>


</template>

<style>

</style>
