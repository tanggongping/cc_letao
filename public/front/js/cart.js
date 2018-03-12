/**
 * Created by 公平 on 2018/3/7.
 */

$(function () {

    // 下拉刷新
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",
            down: {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback: function () {
                    render(function (data) {
                        setTimeout(function () {
                            // 渲染购物车商品列表
                            $('.product_wrap').html(template('cart_list_tmp', {data: data}));

                            // 下拉结束刷新
                            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                            // 清空总价格
                            $('.total_money > span').text('00.00');
                        }, 1000);
                    })
                }
            }
        }
    });

    function render(callback) {
        $.ajax({
            url: '/cart/queryCart',
            type: 'get',
            success: function (data) {
                console.log(data);
                if (data.error) {
                    location.href = 'login.html?resURL=' + location.href;
                }

                callback && callback(data);
            }
        });
    }

    // 功能1: 页面刷新购物车的商品
    // render();


    // 功能2: 删除指定的商品
    $('.product_wrap').delegate('.js_btn_delete', 'tap', function () {

        // 获取当前商品的id
        var id = $(this).data('id');

        // 弹出消息框
        mui.confirm('你是否要删除这个商品', '温馨提示', ['否', '是'], function (e) {
            if (e.index) {
                // 要删除
                $.ajax({
                    url: '/cart/deleteCart',
                    type: 'get',
                    data: {
                        id: [id]
                    },
                    success: function (data) {
                        // 删除
                        if (data.success) {
                            //触发下拉刷新
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                });
            }
        })
    });


    // 功能3: 更新模块
    $('.product_wrap').on('tap', '.js_btn_update', function () {

        // 获取指定的参数
        var data = this.dataset;
        // 渲染
        var html = template('update_tmp', data);
        // 多于的空格去掉
        html = html.replace(/\n/g, '');

        console.log(data);

        mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
            if (e.index === 0) {

                //获取到参数 id 尺码  num
                var id = data.id;
                var num = $(".mui-numbox-input").val();
                var size = $(".pro_size span.active").text();

                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    data: {
                        id: id,
                        num: num,
                        size: size
                    },
                    success: function (data) {
                        if (data.success) {
                            //下拉刷新一次
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                });
            }
        });


        //给尺码注册点击事件
        $(".pro_size span").on("tap", function () {
            $(this).addClass("active").siblings().removeClass("active");
        });

        //numbox也需要重新初始化
        mui(".mui-numbox").numbox();
    });


    // 功能4: 计算选中商品总价格
    $('.product_wrap').delegate('.ck', 'change', function () {

        var total = 0;  // 总价格

        // 找出选中产品
        $('.ck:checked').each(function (index, value) {
            // 商品价格
            var price = $(value).data('price');
            // 商品价格
            var num = $(value).data('num');
            // 商品总价格
            total += price * num;

        });
        // 总价格显示
        $('.total_money > span').text(total);
    });
});
