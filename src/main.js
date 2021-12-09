import { createApp,ref } from 'vue'
import App from './App.vue'
import router from './route'
import JsonViewer from "vue3-json-viewer"
import Editor from 'bin-editor-next';
import * as ace from 'brace'
import 'brace/ext/emmet'
import 'brace/ext/language_tools'
import 'brace/mode/json'
import 'brace/snippets/json'
import 'brace/theme/github'
import 'brace/theme/vibrant_ink'
import Moment from 'moment'



const app = createApp(App)

app.use(router)
app.use(JsonViewer)
app.component(Editor.name, Editor)
let g = {}
app.provide('g',ref(g))
app.mount('#app')



