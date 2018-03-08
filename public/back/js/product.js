/**
 * Created by 公平 on 2018/3/5.
 */

$(function () {
    var page = 1;
    var pageSize = 5;
    var imgURLArr = [];  //上传图像的地址名称

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                // 渲染
                $("#tbody").html(template("tab-tmp", data));

                // 分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(data.total / data.size),

                    // 控制每个操作按钮的显示文字
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            default:
                                return page;
                        }
                    },

                    // 设置是否使用Bootstrap内置的tooltip。 true是使用
                    useBootstrapTooltip: true,

                    // 操作按钮的title属性
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            default:
                                return '第' + page + '页';
                        }
                    },

                    onPageClicked: function (e, o, t, p) {
                        page = p;
                        render();
                    }
                });
            }
        });
    }

    render();

    // 添加商品
    $(".js_addProduct").click(function () {
        // 显示模态框
        $("#productModal").modal('show');

        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                $(".js_dropdown-menu").html(template("product-tmp", data));
            }
        });
    });


    // 下拉列表选择
    $('.dropdown').on('click', 'a', function () {
        //获取id
        var id = $(this).data('id');

        var value = $(this).text();

        $('.js_dropdown_text').text(value);

        // 把值赋值给隐藏域
        $("[name='brandId']").val(id);

        // 更新字段的状态为成功
        $('#form').data('bootstrapValidator').updateStatus("brandId", "VALID");

    });


    // 上传图片初始化
    $("#uploadFile").fileupload({
        dataType: 'json',
        done: function (e, data) {

            // 数组存储的图片超过3张 就不添加
            if (imgURLArr.length >= 3) {
                return;
            }

            // data 图像上传后的对象 根据对象个数创建img标签
            // 获取到上传的图片地址， 往img_box里面添加图片
            var pic = data.result.picAddr;

            $("<img src='" + pic + "' width='100' height='100'>").appendTo(".js_img_box");

            // 数组接收上传文件的信息
            imgURLArr.push(data.result);
            console.log(imgURLArr);
            // 根据数组的长度判断 图像的数量是否是3张
            if (imgURLArr.length === 3) {
                // 满足 就显示成功信息
                $('#form').data('bootstrapValidator').updateStatus("brandLogo", "VALID");
            } else {
                // 不满足 显示错误信息
                $('#form').data('bootstrapValidator').updateStatus("brandLogo", "INVALID");
            }
        }
    });

    // 验证表单规则
    $('#form').bootstrapValidator({

        excluded: [],

        // 小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 验证规则
        fields: {
            // 二级分类下拉
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类名称'
                    }
                }
            },

            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },

            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的描述'
                    }
                }
            },

            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 正则匹配
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '请输入一个有效的商品库存'
                    }
                }
            },

            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "请输入一个合法的尺码（例如32-46）"
                    }
                }
            },

            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    regexp: {
                        regexp: /^\d*$/,
                        message: '请输入有效的数字'
                    }
                }
            },

            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品价格'
                    },
                    regexp: {
                        regexp: /^\d*$/,
                        message: '请输入有效的数字'
                    }
                }
            },

            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传3张图片'
                    }
                }
            }

        }
    });

    // 表单验证成功事件
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();

        //隐藏模态框
        $('#productModal').modal('hide');
        
        // 拼接数据
        var param = $('#form').serialize();
        param += '&picName1=' + imgURLArr[0].picName + '&picAddr1=' + imgURLArr[0].picAddr;
        param += '&picName2=' + imgURLArr[1].picName + '&picAddr2=' + imgURLArr[1].picAddr;
        param += '&picName3=' + imgURLArr[2].picName + '&picAddr3=' + imgURLArr[2].picAddr;

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: param,
            success: function (data) {
                if (data.success) {
                    // 清除表单默认和内容
                    $('#form').data('bootstrapValidator').resetForm(true);
                    $('.js_dropdown_text').text('请选择二级分类');
                    $('.js_img_box img').remove();

                    //重新渲染
                    page = 1;
                    render();

                    // 清空数组
                    imgURLArr = [];
                }
            }
        });
    })
});