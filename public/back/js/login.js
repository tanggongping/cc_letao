/**
 * Created by 公平 on 2018/3/2.
 */

$(function () {
    // 校验表单
    $("form").bootstrapValidator({
        // 配置校验的规则
        fields: {
            // 验证用户名 对应form表单的name属性
            username: {
                // 给username配置验证规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    // 长度验证
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名在2-6位之间"
                    },
                    // 提示错误信息
                    callback: {
                        message: "用户名或密码错误"
                    }
                }
            },
            // 验证密码
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码在6-12位之间"
                    },
                    callback: {
                        message: "用户名或密码错误"
                    }
                }
            },
        },

        // 配置小图标, 成功 失败  校验中
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
    });

    // 表单提交
    $("form").on("success.form.bv", function (e) {
        // 阻止提交按钮默认提交行为
        e.preventDefault();
        // 获取表单中用户信息 通过ajax发送请求服务器验证
        var userData = $(this).serialize();
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: userData,
            dataType: "json",
            success: function (data) {
                // 根据状态码提示相同的信息
                if (data.error === 1000) {
                    // 用户名校验不匹配
                    $("form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }

                if (data.error === 1001) {
                    // 密码校验不匹配
                    $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }

                if (data.success) {
                    // 校验通过 跳转到首页
                    location.href = "index.html";
                }
            }
        });
    });

    // 重置表单内容和样式
    $("button[type='reset']").on("click", function (){
        $("form").data("bootstrapValidator").resetForm(true);
    });
});