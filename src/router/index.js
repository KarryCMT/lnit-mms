import Vue from "vue";
import VueRouter from "vue-router";
import Login from '../views/login'
import Layout from '@/components/Layout'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',//路由名称
      component: Login//组件对象
    },
    {
      path: '/',
      name: 'layout',//路由名称
      component: Layout//组件对象
    }
  ]
})