<template>
     <div>
         <n-space>
           <n-menu :options="options" style="width: 180px" default-value="1" />    
              asdsa
         </n-space>
     </div>
    

</template>

<script setup>
    import {onMounted,ref,h} from 'vue'
    import axios from '../request.js'
    import { NEllipsis,NMenu,NSpace } from 'naive-ui';
     const options = ref([
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "1"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "3"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "4"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "5"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "6"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "7"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "电灯熄灭 物换星移 泥牛入海" }),
            key: "8"
          },
          {
            label: () => h(NEllipsis, null, { default: () => "黑暗好像 一颗巨石 按在胸口" }),
            key: "2"
          }
        ])
     onMounted(() => {
         let url = window.location.pathname.replace('/doc.html', '')
         //调试时替换成自己本地的 同时后端要加跨域
         url = "http://127.0.0.1:8888"
         //获取分组信息
         let run = axios({
             url: url + "/getMc",
             method: "get",
         })
         run.then(res => {
            
            if(!!res.data){
                //每个大list里第一个list index 0 就是目标接口
                  console.log(res.data)
            }
           
             
         })
     })
</script>

<style>
</style>
