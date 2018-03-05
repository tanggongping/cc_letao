/**
 * Created by 公平 on 2018/3/4.
 */

$(function () {
    var page = 1;   //页码
    var pageSize = 5;   //每页页数

    /**
     * 渲染表格内容
     */
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: page,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (data) {
                $("#tbody").html(template("tab-tmp", data));


                // 根据数据数量 创建分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,   // 选择bootstrap版本
                    currentPage: page,  // 当前页
                    numberOfPages: 5,   // 设置显示的页数
                    totalPages: Math.ceil(data.total / data.size), // 总页数

                    // 给操作按钮注册点击事件
                    onPageClicked: function (e, o, t, p) {
                        page = p;   // 修改页码
                        render();   // 重新渲染
                    }
                });
            }
        });
    }

    render();   // 页面加载 动态渲染表格数据


    // 操作功能
    $("#tbody").on("click", ".js_btn", function () {
        var id = $(this).parent().data("id");   // 获取id
        var status = $(this).data("status");    // 获取状态
        status = status === "禁用" ? "0" : "1";
        $("#userModal").modal("show");  // 显示用户提示信息的模态框

        // 模态框确认按钮注册点击事件
        // 更改当前点击的那一条数据的状态
        $(".js_confirm").off().on("click", function () {
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: {
                    id: id,
                    isDelete: status
                },
                success: function (data) {
                    // 更改完成 重新渲染
                    if (data.success) {
                        render();
                    }
                    // 隐藏模态框
                    $("#userModal").modal("hide");
                }
            });
        });
    });

});