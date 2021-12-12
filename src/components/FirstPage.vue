<template>
    <div >
        <n-card title="基础信息"> 
        <n-grid :x-gap="12" :y-gap="20" :cols="2">
            <n-grid-item>
             <n-card title="标题:" hoverable> {{t.info.title}} </n-card>
            </n-grid-item>
               <n-grid-item>
            <n-card title="Host:" hoverable> {{t.info.contact.url}} </n-card>
            </n-grid-item>
         
            <n-grid-item>
             <n-card title="简介:" hoverable> {{t.info.description}} </n-card>
            </n-grid-item>
            <n-grid-item>
             <n-card title="base path:" hoverable> {{t.basePath}} </n-card>
            </n-grid-item>
            <n-grid-item>
             <n-card title="作者:" hoverable> {{t.info.contact.name}} </n-card>
            </n-grid-item>
          
            <n-grid-item>
              <n-card title="分组名称:" hoverable> {{res[0].url}} </n-card>
            </n-grid-item>

                     </n-grid>
        </n-card>
        <n-card  title="Api类型统计" style="margin-top: 30px;">
        
                <n-grid :x-gap="50" :y-gap="10" :cols="4">
                    <n-grid-item>
                     <n-card title="POST" hoverable> <span id="typeCount">{{postCount}}</span>  </n-card>
                    </n-grid-item>
                    <n-grid-item>
                     <n-card title="GET" hoverable> <span id="typeCount">{{getCount}}</span> </n-card>
                    </n-grid-item>
                    <n-grid-item>
                     <n-card title="PUT" hoverable><span id="typeCount">{{putCount}}</span></n-card>
                    </n-grid-item>
                    <n-grid-item>
                    <n-card title="DELETE" hoverable><span id="typeCount">{{deleteCount}}</span></n-card>
                    </n-grid-item>
                    </n-grid>
           
               
               
              
             
        </n-card>
       
     </div>
</template>

<script setup>
    import {
        NRow,
        NList,
        NGrid,
        NGridItem,
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
    #typeCount{
        font-size: 24px;
    }
</style>
