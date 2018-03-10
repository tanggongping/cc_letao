/**
 * Created by 公平 on 2018/3/9.
 */

$(function () {

    // 功能1: 获取验证码
    $('.get_Vcode').click(function (e) {
        var $this = $(this);

        // 阻止默认提交功能
        e.preventDefault();

        // 禁用点击按钮
        $this.prop('disabled', true).addClass('disabled').text('发送中....');

        // 请求验证码
        $.ajax({
            url: '/user/vCode',
            type: 'get',
            success: function (data) {
                // 更改提示信息
                var count = 5;
                var timerID = setInterval(function () {
                    count--;
                    $this.text(count + '秒后在次发送');

                    if (count <= 0) {
                        $this.prop('disabled', false).removeClass('disabled').text('再次获取验证码');
                        clearInterval(timerID);
                    }
                }, 1000);
            }
        });
    })

    // 注册功能2: 校验
    $(".btn_register").on('click', function (e) {
        e.preventDefault();

        // 获取到每个内容框内容
        var username = $('[name="username"]').val();
        var password = $('[name="password"]').val();
        var rePassword = $('.re_password').val();
        var mobile = $('[name="mobile"]').val();
        var vCode = $('[name="vCode"]').val();
        var ck = $('.ck');


        // 验证规则
        if (!username) {
            mui.toast("用户名不能为空");
            return;
        }

        if (!password) {
            mui.toast('密码不能为空');
            return;
        }

        if (rePassword != password) {
            mui.toast('两边输入密码不一致');
            return;
        }

        if (!mobile) {
            mui.toast('手机号不能为空');
            return;
        }

        var reg = /^1[3-9]\d{9}$/;
        if (!reg.test(mobile)) {
            mui.toast('手机号格式不正确');
            return;
        }

        if (!vCode) {
            mui.tosat('验证码不能为空');
            return;
        }

        if (!ck.prop('checked')) {
            mui.tosat('请同意《会员服务协议》');
            return;
        }

        // 校验通过 把用户信息传递给后台
        $.ajax({
            url: '/user/register',
            type: 'post',
            data: $('#js_form').serialize(),
            success: function (data) {

                // 注册失败 提示信息
                if (data.error) {
                    mui.toast(data.message);
                }

                // 注册成功 跳回登录页
                if (data.success) {
                    mui.toast("恭喜你，注册成功了，2秒后自动跳转到登录页");
                    setTimeout(function () {
                        location.href = "login.html";
                    },2000);

                }
            }
        });

    });
});