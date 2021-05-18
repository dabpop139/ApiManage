/* eslint-disable */

/**
 * 深冻结
 */
var deepFreeze = function(obj) {
    // 取回定义在obj上的属性名
    var propNames = Object.getOwnPropertyNames(obj)
    // 在冻结自身之前冻结属性
    propNames.forEach(function(name) {
        var prop = obj[name]
        // 如果prop是个对象，冻结它
        if (typeof prop == 'object' && prop !== null) {
            deepFreeze(prop)
        }
    })
    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj)
}

export default {
    /**
     *   对Date的扩展，将 Date 转化为指定格式的String
     *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *   例子：
     *   (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
     *   (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
     */
    fmtDate(date, fmt) {
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },
    /**
     * 字符长度
     */
    strlen(str) {
        if (!str) {
            return 0
        }
        var length = 0
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= 0x4e00 && str.charCodeAt(i) <= 0x9fa5) {
                length += 2
            } else {
                length++
            }
        }
        return length
    },
    /**
     * 配置节流函数
     * @param  {[Function]}  fn     [要执行的函数]
     * @param  {[Number]}  delay    [延迟执行的毫秒数]
     * @param  {[Number]}  mustRun  [至少多久执行一次]
     * @return {[Function]}         [节流函数]
     */
    throttle(fn, wait, mustRun) {
        let timeout
        let startTime = new Date()
        return function() {
            let context = this
            let args = arguments
            let curTime = new Date()
            
            clearTimeout(timeout)
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= mustRun) {
                fn.apply(context, args)
                startTime = curTime
                // 没达到触发间隔，重新设定定时器
            } else {
                timeout = setTimeout(fn, wait)
            }
        }
    },
    /**
     * 深冻结
     */
    deepFreeze: deepFreeze,
    backTop() {
        var timer = setInterval(() => {
            let osTop = document.documentElement.scrollTop || document.body.scrollTop
            let ispeed = Math.floor(-osTop / 5)
            document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed
            if(osTop === 0){
                clearInterval(timer);
            }
        }, 30)
    },
}