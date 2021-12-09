<template>
    <n-collapse v-for="(item,key,index) in inner">
        <n-collapse-item :title="key" :name="key">
            <div v-if=" 'items' in item &&  '$ref' in item.items ">
                <n-collapse>
                    <Back :value='item.items' />
                </n-collapse>
            </div>
            <div v-else-if="'type' in item">
                <n-space>
                    <n-tag type="success">{{item.type}}</n-tag>
                    <div v-if="item.type != 'array'">
                        <n-tag type="info">
                            {{'description' in item && item.description == null ? item.items.description : item.description==null?'':item.description}}
                        </n-tag>
                    </div>
                </n-space>
                <n-divider />
            </div>
            <div v-else>
                <n-collapse>
                    <Back :value='item' />
                </n-collapse>
            </div>
        </n-collapse-item>
    </n-collapse>
</template>

<script setup>
    import {
        NCollapse,
        NDivider,
        NSpace,
        NCollapseItem,
        NTag,
        NText
    } from 'naive-ui'
    import Back from '/src/components/Back.vue'
    import {
        onMounted,
        ref,
        inject,
        defineProps
    } from 'vue'
    let g = inject('g')
    let refObj = g.value['data']
    const props = defineProps({
        value: String,
    })
    let inner = ref([])
    if (props.value['$ref'] != null) {
        let def = refObj.definitions[props.value['$ref'].replace('#/definitions/', '')]
        if (def != undefined) {
            inner.value = def['properties']
        } else {
            inner.value = []
        }

    } else {
        inner.value = props.value.items
    }
</script>

<style>
</style>
