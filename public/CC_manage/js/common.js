/**
 * Created by 公平 on 2018/3/2.
 */

$(function () {

    // 全局ajax事件
    // ajax请求之前触发
    $(document).ajaxStart(function () {

        // 出现加载条
        NProgress.start();
    });

    // ajax请求结束触发  和complate有点类似
    // 相同点: 都是在ajax请求完成后触发
    // 不同点: 如果请求中再次发送请求 complate会执行两次, 而stop只会一次.
    $(document).ajaxStop(function () {

        // 加载条结束
        NProgress.done();
    });

});