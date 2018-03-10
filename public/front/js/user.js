/**
 * Created by 公平 on 2018/3/9.
 */


$(function () {

    // 页面加载 渲染个人信息
    $.ajax({
        url: '/user/queryUserMessage',
        type: 'get',
        success: function (data) {
            // 没登录 跳到登录页
            if (data.error === 400) {
                location.href = 'login.html';
            }

            // 登录成功 渲染个人信息
            $('.mui-media-body').html(template('info-tmp', data));
        }
    });

    // 退出功能
    $('.js_login_out').delegate(null, 'click', function () {
        $.ajax({
            url: '/user/logout',
            type: 'get',
            success: function (data) {



                // 退出成功
                if (data.success) {
                    location.href = 'login.html';
                }
            }
        });
    });
});