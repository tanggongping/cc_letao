/**
 * Created by 公平 on 2018/3/7.
 */

$(function () {

    // 取出地址栏参数
    var URLParam = getURLParam('proName');
    // 设置文本框的内容
    $('.search_box > input').val(URLParam);

    var page = 1;
    var pageSize = 6;


    function render() {

        // 传递的参数列表
        var paramobj = {
            proName: $('.search_box > input').val(),
            page: page,
            pageSize: pageSize
        }

        // 是否需要传递排序参数
        var pitchLi = $('.sort_list li.now');
        if (pitchLi.length > 0) {

            // 获取价格传递参数的参数名
            var sortName = pitchLi.data('type');
            var sortValue = pitchLi.find('i').hasClass('fa-angle-down') ? 2 : 1;
            console.log(pitchLi.find('i'));
            // 存放在传递参数对象中
            paramobj[sortName] = sortValue;

        } else {
            console.info('不需要传递参数');
        }


        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: paramobj,
            success: function (data) {
                console.log(data);
                console.log(paramobj);
                $('.product').html(template('product-list-tmp', data));
            }
        });
    }

    // 功能1: 页面加载 截取地址栏参数 渲染
    render();

    // 功能2: 点击搜索按钮 获取文本框内容 渲染指定内容的数据
    $('.js_btn_search').on('click', function () {

        // 先清除排序列表的所有选中状态 在让所有箭头变态降序状态
        $('.sort_list li[data-type]').removeClass('now')
            .find('i').removeClass('fa-angle-up').addClass('fa-angle-down');


            // // 获取文本框内容
            // URLParam = $(this).prev('input').val();
        // 修改对象中的proName值 重新渲染
        // paramobj.proName = URLParam;
        render();
    });


    // 功能3: 价格和库存升降序排列
    $('.sort_list li[data-type]').on('click', function () {
        var $this = $(this);

        // 判断有没有now这个类
        if ($this.hasClass('now')) {

            // 有类 切换升降序小箭头
            $this.find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');

        } else {

            // 没有类 就自身添加 同时移除其它类
            $this.addClass('now').siblings('li').removeClass('now');

            // 让其它元素的小箭头变成往下 降序
            $this.siblings('li').find('i').addClass('fa-angle-down').removeClass('fa-angle-up');
        }

        render();
    });
});