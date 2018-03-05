/**
 * Created by 公平 on 2018/3/4.
 */

$(function () {
    var page = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                $("#tbody").html(template("tab-tmp", data));

                // 分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(data.total / data.size),
                    onPageClicked: function (e, o, t, p) {
                        // 重新渲染
                        page = p;
                        render();
                    }
                })
            }
        });
    }

    //页面加载 渲染表格数据
    render();


    // 点击二级分类按钮
    $(".js_addSecond").click(function () {

        // 模态框显示
        $("#secondCategoryModal").modal("show");

        // 请求服务器 获取一级分类列表 渲染
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                // 组合模板和数据
                $(".js_dropdown-menu").html(template("dropdown-menu-tmp", data));
            }
        })
    });


    // 给所有一级列表注册点击事件 获取内容 让下拉选项内容同步
    $(".js_dropdown-menu").on("click", "a", function () {
        var value = $(this).text();
        $(".js_dropdown_text").text(value);

        // 获取当前选中的分类id
        var id = $(this).data("id");
        // 添加一个后台指定name属性的input标签 把id的值赋值 在让表单提交
        $("[name='categoryId']").val(id);

        // 更新状态
        $("#form").data('bootstrapValidator').updateStatus('categoryId', 'VALID');
    });


    // 上传文件 获取图片的地址
    $("#uploadFile").fileupload({
        dataType: 'json',
        done: function (e, data) {
            // data 图像上传后的对象
            // 通过data.result.picAddr 获取到上传图片的地址
            var imgSrc = data.result.picAddr;
            // 预览上传的图片
            $(".preview").attr("src", imgSrc);

            // 隐藏文本框存储图片路径
            $("[name='brandLogo']").val(imgSrc);

            // 跟新状态
            $("#form").data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
    });

    // 校验表单规则
    $("#form").bootstrapValidator({

        // 指定不校验类型 默认为
        // excluded: [':disabled', ':hidden', ':not(:visible)'],
        excluded: [],


        // 小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 验证规则
        fields: {
            // 分类名称不能为空
            brandName: {
                validators: {
                    notEmpty: {
                        message: "一级分类不能为空"
                    }
                }
            },

            // id不能为空
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "二级分类不能为空"
                    }
                }
            },

            // 图像地址不能为空
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图像"
                    }
                }
            }
        }
    });

    // 表单校验成功事件
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $("#form").serialize(),
            success: function (data) {
                // 操作成功
                if (data.success) {

                    //关闭模态框
                    $("#secondCategoryModal").modal("hide");

                    // 清除表单的内容和样式
                    $("#form").data('bootstrapValidator').resetForm(true);

                    //重新渲染到第一页
                    page = 1;
                    render();
                }
            }
        })
    })
});