import Vue from "vue";
import VueRouter from "vue-router";
import Login from '../views/login'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',//路由名称
      component: Login//组件对象
    }
  ]
})