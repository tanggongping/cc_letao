/**
 * Created by 公平 on 2018/3/2.
 */

$(function () {

    // 如不是登录页, 请求服务器, 判断是否有登录记录 有就停留 没有就返回登录页
    // 截取当前页面名
    if (getUrl() != "login") {
        $.ajax({
            type: 'get',
            url: '/employee/checkRootLogin',
            dataType: 'json',
            success: function (data) {
                if (data.error === 400) {
                    location.href = "login.html";
                }
            }
        });
    }

    function getUrl() {
        var urlStr = location.pathname.split("/").pop();
        // urlStr = urlStr.substr(0, urlStr.indexOf("."));
        return urlStr;
    }


    //禁用加载环
    NProgress.configure({
        showSpinner: false
    });

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


    // jquery load方法 引入通用模块
    $("aside").load("./aside.html .lt_aside");

    $(".lt_main .topHeader").load("./topBar.html .topBar");


    // jquery load页面还没加载完成, 获取不到元素.
    // 使用window.load事件 让所有资源加载完成, 在获取元素绑定事件.
    // 或者可以直接使用事件委托来绑定事件

    window.onload = function () {

        // 根据二级分类菜单状态 显示或隐藏二级菜单
        $(".reclassify").prev().on("click", function () {
            $(this).next().slideToggle();
        });

        // 隐藏侧边栏
        $(".menu").on("click", function () {

            $(this).parents(".lt_main").toggleClass("now")
                .css("transition", "all 1s");

            $(".lt_aside").toggleClass("now")
                .css("transition", "all 1s");

        });

        // 点退出 显示模态框
        $(".login-out").on("click", function () {
            $("#myModal").modal("show");

            // 点击退出 发送请求 清除sessionID清除  成功返回登录页
            $(".btn_logout").off().on("click", function () {
                $.ajax({
                    type: "get",
                    url: '/employee/employeeLogout',
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            location.href = "./login.html";
                        } else {
                            console.assert(false, "退出失败");
                        }
                    }
                });

            });
        });


        // 获取当前页面地址
        var url = getUrl();
        //遍历列表所有a元素 获取href的值
        $(".lt_aside .list a").each(function (i, v) {
            var value = $(v).attr("href");

            // 判断值和页面地址相同 就高亮显示
            if (value === url) {
                $(v).toggleClass("now");
                // $(".reclassify").slideUp();
            }

            // 当前页面是一级分类或二级分类 让reclassify盒子显示
            if (url === "first.html" || url === "second.html") {
                $(".reclassify").show();
            }
        });
    }

});


