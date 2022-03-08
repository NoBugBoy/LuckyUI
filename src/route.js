
import { createRouter,createWebHashHistory,createWebHistory} from "vue-router";

let VueRoute = createRouter(
   {
       history:createWebHashHistory(),
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
               
           },
           {
               path: '/manager',
               name: 'Manager',
               component: () => import("/src/components/Manager.vue")
               
           },
           {
               path: '/models',
               name: 'Models',
               component: () => import("/src/components/Models.vue")
               
           },
           {
               path: '/share',
               name: 'Share',
               component: () => import("/src/components/Share.vue")
               
           },
           {
               path: '/methodTrace',
               name: 'MethodTrace',
               component: () => import("/src/components/MethodTrace.vue")
           },
       ]
   }
)
export default VueRoute;