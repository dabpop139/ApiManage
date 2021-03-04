<template>
<div id="content-container" class="container">
    AAAA
</div>
</template>

<script>
/* eslint-disable */
export default {
    data () {
        return {
            homeTop : 0,
        }
    },
    methods: {
        
    },
    beforeMount() {
        
    },
    activated() {
        document.getElementById('content-container').scrollTop = this.homeTop || 0
    },
    beforeRouteLeave(to, from, next) {
        // 记录滚动距离
        this.homeTop = document.getElementById('content-container').scrollTop || 0
        next()
    }
}
</script>