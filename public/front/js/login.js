/**
 * Created by 公平 on 2018/3/9.
 */


$(function () {
    $('.btn_login').bind('click', function () {
        // 获取用户输入的信息
        var username = $('[name="username"]').val().trim();
        var password = $('[name="password"]').val().trim();

        // 校验信息
        if (!username) {
            mui.toast('用户名不能为空');
            return;
        }

        if (!password) {
            mui.toast('密码不能为空');
            return;
        }

        // 校验成功 传递给服务器 匹配就跳回上一次页面 不匹配给个提示信息
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {

                // 错误的提示信息
                if (data.error === 403) {
                    mui.toast(data.message);
                    return;
                }

                // 成功 跳转的上一次有标记的页面 没有默认跳回个人信息页面
                if (data.success) {
                    // 判断是否有标记
                    var URLStr = location.search;
                    if (URLStr.indexOf('resURL') != -1) {
                        // 有标记 跳回标记页面
                        console.log(1);
                        location.href = URLStr.replace('?resURL=', '');
                    } else {
                        console.log(2);
                        // 没有标记 跳回个人信息页面
                        location.href = 'user.html';
                    }
                }
            }
        });
    });
});