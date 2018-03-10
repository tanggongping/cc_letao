/**
 * Created by 公平 on 2018/3/8.
 */

$(function () {
    // 获取id
    var productID = getURLParam('id');

    // 功能1: 页面加载请求数据 渲染商品详情
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: productID
        },
        success: function (data) {

            /* // 把尺寸范围字符串值切换成一个数组
             var tempArr = data.size.split('-');
             var sizeArr = [];
             // 注意: 第一个数值是字符串 需要转换成数值
             for (var i = +(tempArr[0]); i <= tempArr[1]; i++) {
             sizeArr.push(i);
             }
             console.log(sizeArr);
             // 处理好的尺寸数组添加进去
             data['sizeArr'] = sizeArr;*/

            // 渲染数据
            $('.js_sroll_wrap').html(template('scroll_wrap_tmp', data));

            //重新初始化轮播图 因为元素动态生成了
            mui(".mui-slider").slider();

            // 初始化数字输入框
            mui('.mui-numbox').numbox()

            // 选择尺寸
            $('.pro_size > span').bind('click', function () {
                // 当前点击的元素 高亮显示 其它恢复默认值
                $(this).toggleClass('active').siblings('span').removeClass('active');
            });
        }
    });


    // 功能2: 加入购物车
    $('.btn_add_cart').delegate(null, 'click', function () {

        // 获取用户选中尺码值
        var proSize = $('.pro_size > span.active').text();
        // 判断是否选了
        if (!proSize) {
            // 没选
            mui.toast('请选择商品尺码');
            return;
        }

        // 获取用户选中的商品数量 默认为1
        var Pronum = $('.mui-numbox-input').val();
        
        // 发送请求
        $.ajax({
            url: '/cart/addCart',
            type: 'post',
            data: {
                productId: productID,
                size: proSize,
                num: Pronum
            },
            success: function (data) {

                if (data.error) {
                    // 说明没有登录 给用户一个提示信息 2秒后跳转到登录页
                    setTimeout(function () {
                        // mui.toast(data.message);
                        // 跳转到登录页 在存一个标记 方便登录成功后跳转回来
                        location.href = 'login.html?resURL=' + location.href;
                    }, 2000);
                }

                // 有登录 跳到购物车页面
                if (data.success) {
                    mui.confirm('添加成功', '温馨提示', ['去购物车', '继续浏览'], function (e) {
                        if (e.index === 0) {
                            location.href = 'cart.html';
                        }
                    })

                }
            }
        });

    });
});