<template>
    <n-card>
        <n-result
           status="500"
           title="作者太懒了,这个功能并不太想做"
           description="也许你真的不太需要这个东西."
         >
           <template #footer>
             <n-button @Click="openIssues">去提个Issues催一下</n-button>
           </template>
         </n-result>
    </n-card>
   
</template>

<script setup>
    import {
        NResult,
        NCard,
        NButton,
    } from 'naive-ui'
    let openIssues = () => {
        window.open('https://github.com/NoBugBoy/YdocLuckyUi/issues/new')
    }
</script>

<style>
</style>
