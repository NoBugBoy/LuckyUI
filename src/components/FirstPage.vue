<template>
    <div >
    <n-list bordered style="width: 75%;text-align: center; margin: 10px auto;">
        <template #header><span style="font-size: 22px;">Restful Api Documentation</span></template>
        <n-list-item>
          <n-thing title="标题">{{t.info.title}}</n-thing>
        </n-list-item> 
        <n-list-item>
          <n-thing title="简介">{{t.info.description}}</n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing title="作者"> {{t.info.contact.name}}</n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing title="Host" >{{t.info.contact.url}}</n-thing>
        </n-list-item> 
        <n-list-item>
          <n-thing title="base path">{{t.basePath}}</n-thing>
        </n-list-item> 
         <n-list-item>
          <n-thing title="分组名称">{{res[0].url}}</n-thing>
        </n-list-item> 
        <n-list-item>
          <n-thing title="分组Url">{{res[0].location}}</n-thing>
        </n-list-item> 
        <n-list-item>
             <n-thing title="接口统计信息">
                 <n-row >
                     <n-col :span="4">
                         <n-statistic label="POST" :value="postCount"/>
                     </n-col>
                     <n-col :span="4">
                          <n-statistic label="GET" :value="getCount"/>
                     </n-col>
                     <n-col :span="4">
                          <n-statistic label="PUT" :value="putCount"/>
                     </n-col>
                     <n-col :span="4">
                          <n-statistic label="DELETE" :value="deleteCount"/>
                     </n-col>
                 </n-row>
             </n-thing>
       </n-list-item>
      </n-list>
     </div>
</template>

<script setup>
    import {
        NRow,
        NList,
        NListItem,
        NThing,
        NTabs,
        NTabPane,
        NCol,
        NStatistic,
        darkTheme,
        NButton,
        NCard,
        NBreadcrumb,
        NLayout,
        NLayoutHeader,
        NLayoutContent,
        NLayoutFooter,
        NSpace,
        NH2,
        NIcon,
        NMenu,
        NLayoutSider
    } from 'naive-ui'
    import {
        defineProps,h,inject,ref
    } from 'vue'
    let g = inject('g')
    let t = g.value['data']
    let res = g.value['resource']
    let paths = t.paths
    let key = Object.keys(paths);
    let getCount = 0
    let postCount = 0
    let putCount = 0
    let deleteCount = 0
    key.forEach((k) => {
         let method = paths[k]
         let alls = Object.keys(method);
         alls.forEach((s) => {
             switch(s) {
                 case 'get' : getCount += 1; break;
                 case 'post' : postCount += 1; break;
                 case 'put' : putCount += 1; break;
                 case 'delete' : deleteCount +=1; break;
                 default: break;
             }
         })
    })
    
</script>

<style>
</style>
