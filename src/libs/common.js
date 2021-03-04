/* eslint-disable */
import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
const Axios = require('axios')

const CommJs = {
    newAxios () {
        let userToken = localStorage.getItem('uticket') ? localStorage.getItem('uticket') : ''
        return Axios.create({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-User-Token': userToken,
            },
        })
    },
    doAjax (option, actype, succfun, failfun, ipm) {
        let url = option.url
        let pdata = option.data
        let userToken = localStorage.getItem('uticket') ? localStorage.getItem('uticket') : ''
        let headersConfig = {}
        let httpConfig = {}
        headersConfig = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-User-Token': userToken
        }
        httpConfig['headers'] = headersConfig
        
        let insAxios = null
        if (actype == 'GET') {
            insAxios = Axios.get(url, {
                params: pdata,
                headers: headersConfig
            })
        }
        if (actype == 'POST') {
            if (option.ctype == 'json'){
                httpConfig['headers']['Content-Type'] = 'application/json; charset=UTF-8'
                insAxios = Axios.post(url, pdata, httpConfig)
            }else{
                httpConfig['headers']['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
                insAxios = Axios.post(url, Qs.stringify(pdata), httpConfig)
            }
        }

        if (ipm === true) {
            return insAxios
        }

        if (insAxios) {
            insAxios.then(response => {
                if (response.data.code == 4007) {
                    MessageBox.alert('请登录后操作!!!', '错误 :-(', {})
                    localStorage.removeItem('uticket')
                    // localStorage.removeItem('userinfo')

                    Message.closeAll()
                    return false
                }
                if (response.data.code == 4008) {
                    MessageBox.alert('你没有权限访问', '错误 :-(', {})
                    Message.closeAll()
                    return false
                }
                if (typeof succfun === 'function') {
                    if (false === succfun(response)) {
                        return false
                    }
                }
                Message.closeAll()
                if (response.data.code == 1) {
                    MessageBox('', response.data.msg !== '' ? response.data.msg : '操作成功', {})
                    return true
                }
                MessageBox.alert(response.data.msg, '错误 :-(', {})
            })
            .catch(error => {
                if (typeof failfun === 'function') {
                    if (false === failfun(error)) {
                        return false
                    }
                }
                Message.closeAll()
                if (typeof error.response != 'undefined') {
                    if (error.response.status == 401) {
                        MessageBox.alert('请登录后操作!!!', '错误 :-(', {})
                        localStorage.removeItem('uticket')
                        // localStorage.removeItem('userinfo')
                        
                        return false
                    }
                    if (error.response.status == 403) {
                        MessageBox.alert('你没有权限访问', '错误 :-(', {})
                        return false
                    }
                }

                // console.log(error)
                MessageBox.alert('服务器发生错误，请联系管理员', '错误 :-(', {})
            })
        }
        
    },
}

export default CommJs