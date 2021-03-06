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
import VueClipboard from 'vue-clipboard2'
import Moment from 'moment'
import 'md-editor-v3/lib/style.css';



const app = createApp(App)

app.use(router)
app.use(JsonViewer)
app.use(VueClipboard)
app.component(Editor.name, Editor)
let g = {}
app.provide('g',ref(g))
app.mount('#app')



