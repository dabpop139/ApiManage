/* eslint-disable */
const configSite = {
    apicomm: 'http://localhost:8044/app.php/api/',
    install(Vue) {
        // Vue({configBase: configBase})
        Vue.prototype.$configSite = configSite
    }
}

export default configSite