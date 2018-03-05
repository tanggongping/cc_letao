/**
 * Created by 公平 on 2018/3/4.
 */

$(function () {
    var page = 1;
    var pageSize = 4;


    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            dataType: 'json',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log(data);
                // 组合模板和模板
                $("#tbody").html(template("tab-tmp", data));

                // 分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage: page,
                    numberOfPages: 5,
                    totalPages: Math.ceil(data.total / data.size),
                    onPageClicked: function (e, o, t, p) {
                        page = p;   // 修改页码 重新渲染停在当前页
                        render();
                    }
                });
            }
        })
    }

    render();

    // 表单元素
    var $form = $("#form");


    // 添加分类模块
    $(".js_addCategory").click(function () {

        $form.data('bootstrapValidator').resetForm(true);

        // 显示状态分类模态框
        $("#categoryModal").modal("show");
        //$form.data('bootstrapValidator').updateStatus("categoryName", "NOT_VALIDATED");

    });

    // 验证表单规则
    $form.bootstrapValidator({

        // 小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 验证规则
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类的名称"
                    }
                }
            }
        }
    });


    // 表单验证成功事件
    $form.on("success.form.bv", function (e) {
        // 清除submit在表单中的默认提交功能
        e.preventDefault();
        // 获取一级分类文本框的值
        var categoryName = $("[name='categoryName']").val();

        // 拿到分类名称 重新渲染
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: {
                categoryName: categoryName
            },
            success: function (data) {
                // 添加成功
                if (data.success) {
                    // 隐藏分类模态框
                    $("#categoryModal").modal('hide');
                    // 添加后渲染后始终在第一页
                    page = 1;
                    render();
                    // 清除表单内容和样式
                    $form.data("bootstrapValidator").resetForm(true);
                }
            }
        });
    });
});