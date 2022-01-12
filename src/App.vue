<script setup>
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
        NTooltip,
        NLayoutFooter,
        NTag,
        NSpin,
        NAlert,
        NSpace,
        NCollapse,
        NCollapseItem,
        useMessage,
        NH2,
        NSelect,
        NGradientText,
        NLayoutSider,
        NIcon,
    } from 'naive-ui'
    import {
        LogoGithub,
        ShareSocial
    } from '@vicons/ionicons5'
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
    const lightOverrides = {
        "Card": {
            "borderRadius": "15px",
            "boxShadow": "1px 3px 3px #00b873"
        }
    }
    const nightOverrides = {
        "Card": {
            "borderRadius": "15px",
            "boxShadow": "1px 3px 3px #ac9b9a"
        }
    }

    let show = ref(true)
    const g = inject('g')
    g.value['theme'] = 1
    let theme = ref(null)
    let msg = ref("Dark Theme")
    const switchTheme = () => {
        if (theme.value == null) {
            theme.value = darkTheme;
            msg.value = "Light Theme"
            g.value['theme'] = 0
        } else {
            theme.value = null;
            msg.value = "Dark Theme"
            g.value['theme'] = 1
        }
    }
    let route = useRouter()
    let swaggerResource = ref()
    let swaggerData = ref()
    let options = ref([])
    let value = ref({})
    let toGithub = () => {
        window.open("https://github.com/NoBugBoy/LuckyUI")
    }
    let toYDocGithub = () => {
        window.open("https://github.com/NoBugBoy/YDoc")
    }
    onMounted(() => {
        //先清理一下
        sessionStorage.clear()
        let url = window.location.pathname.replace('/doc.html', '')
        //调试时替换成自己本地的 同时后端要加跨域
        // url = "http://127.0.0.1:8080/projectreview"
        //获取分组信息
        let run = axios({
            url: url + "/swagger-resources",
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
                url: url + res.data[0].url,
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
    <n-config-provider :theme="theme" :theme-overrides="theme == null ?  nightOverrides : lightOverrides">
        <!-- <div style="height: 360px; position: relative"> -->
        <n-layout position="absolute">
            <n-layout-header style="height: 64px;display: flex;" bordered>
                <div style="display: flex;width: 100%;">
                    <img style="padding: 14px;height: 32px;width: 32px;" src="/src/assets/title.png" />
                    <span style="display: flex;justify-content: flex-start;align-items: center;">
                        <n-gradient-text type="success" :size="23">
                            YDoc Lucky UI
                        </n-gradient-text>
                    </span>
                    <span
                        style="display: inline-flex;justify-content: flex-start;align-items: center;margin-left: 45px;width: 200px;">
                        <n-select v-model:value="value" :options="options" :loading="show" />
                    </span>
                    <n-space style="position:absolute;right: 50px ;padding: 14px;">
                        <n-tooltip trigger="hover">
                            <template #trigger>
                                <n-button @click="switchTheme" Ghost>{{msg}}</n-button>
                            </template>
                            切换一个主题,换换心情!

                        </n-tooltip>

                        <n-button strong style="display: inline-flex;align-items: center;margin: auto;"
                            @click="toGithub">
                            <template #icon>
                                <n-icon size="20">
                                    <logo-github />
                                </n-icon>
                            </template>
                            LuckyUI
                        </n-button>

                        <n-button strong style="display: inline-flex;align-items: center;margin: auto;"
                            @click="toYDocGithub">
                            <template #icon>
                                <n-icon size="20">
                                    <logo-github />
                                </n-icon>
                            </template>
                            YDoc
                        </n-button> 
                    </n-space>

                </div>





            </n-layout-header>
            <n-message-provider>

                <n-spin :show="show" style="position: absolute;top: 50%;left: 50%;">

                    <template #description>加载数据中</template>
                </n-spin>
                <div v-if="!show">
                    <Home />
                </div>




            </n-message-provider>
           <!-- <n-layout-footer bordered position="absolute" style="height: 32px;">

            </n-layout-footer> -->
        </n-layout>
    </n-config-provider>


</template>

<style>

</style>
