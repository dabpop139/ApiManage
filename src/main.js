// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'

import routes from './routes'

import VueRouter from 'vue-router'

import configSite from './config/site'

Vue.use(VueRouter)

window.$configSite = configSite
Vue.use(configSite)

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  // 网站标题
  if (to.matched.some(record => record.meta.requireAuth)) {
  } else {
    next()
  }
})

router.afterEach(function (to) {
})

/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  router,
  components: { App },
  template: '<App/>'
})
