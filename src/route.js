
import { createRouter,createWebHashHistory,createWebHistory} from "vue-router";

let VueRoute = createRouter(
   {
       history:createWebHistory(),
       routes: [
           {
               path: '/',
               name: 'FirstPage0',
               component: () => import("/src/components/FirstPage.vue")
           },
           {
              path: '/firstPage',
              name: 'FirstPage',
              component: () => import("/src/components/FirstPage.vue")
           },
           {
               path: '/api',
               name: 'Api',
               component: () => import("/src/components/Api.vue")
               
           }
       ]
   }
)
export default VueRoute;