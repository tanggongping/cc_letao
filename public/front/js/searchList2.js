$(function () {

    // 功能1: 页面加载 刷新地址栏传过来商品名称的数据
    var URLParam = getURLParam('proName');  // 获取地址栏指定参数
    var page = 1;   // 页数
    var pageSize = 4;   // 一页显示多少商品

    // 把商品名称添加到搜索框中
    $('.search_box > input').val(URLParam);


    /**
     * 渲染商品列表页
     */
    function render(callback) {

        // 请求后台数据传递的参数的对象
        var paramObj = {
            page: page,
            pageSize: pageSize,
            proName: URLParam
        };

        // 获取排序列表有没有某一项给选中
        var pitchLi = $('.sort_list li.now');
        if (pitchLi.length > 0) {
            // 有选中 就传响应的参数过去
            // 参数属性
            var sortName = pitchLi.data('type');
            // 参数值   2: 降序   1: 升序
            var sortValue = pitchLi.find('i').hasClass('fa-angle-down') ? 2 : 1;
            // 添加到传递参数对象中
            paramObj[sortName] = sortValue;
        }


        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: paramObj,
            success: function (data) {
                setTimeout(function () {
                    callback(data);
                }, 1000);
            }
        });
    }

    /**
     * 下拉刷新 上拉加载
     */
    mui.init({
        // 下拉刷新 上拉加载
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                height: '50',//可选,默认50px.下拉刷新控件的高度,
                range: '100', //可选 默认100px,控件可下拉拖拽的范围
                offset: '0', //可选 默认0px,下拉刷新控件的起始位置
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback: function () {
                    page = 1;   // 始终刷新第一页
                    // 调用渲染方法 传一个回调函数
                    render(function (data) {
                        // 渲染数据
                        $('.product').html(template('product-list-tmp', data));

                        //结束下拉刷新
                        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

                        //重置上拉加载 表示还有内容
                        mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
                    });
                }
            },

            up: {
                callback: function () {
                    page++; // 每次下拉页数加一 在渲染
                    render(function (data) {
                        // 渲染
                        // 下拉刷新
                        // 判断获取下一页是否有数据
                        if (data.data.length > 0) {
                            // 有就刷新数据
                            $('.product').append(template('product-list-tmp', data));
                            // 结束上拉刷新动画 参数: fasle表示后面还有数据
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        } else {
                            // 结束上拉刷新动画 参数: true表示后面没有数据
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }
                    })
                }
            }
        }
    });


    // 渲染
    // render();


    // 功能2: 点击搜索按钮 获取搜索框文本 刷新文本相关的数据
    $('.js_btn_search').on('click', function () {

        // 获取搜索框文本
        URLParam = $('.search_box > input').val().trim();
        // 没有内容 就给个提示信息 并终止代码的执行
        if (URLParam === '') {
            mui.toast('请输入搜索关键字');
            return;
        }

        // 清空排序列表所有选中状态 并让小箭头恢复初始值
        $('.sort_list li.now').removeClass('now')
            .find('i').removeClass('fa-angle-up').addClass('fa-angle-down');

        // 将搜索的记录存储在历史记录中
        var tempStr = localStorage.getItem('history') || '[]';
        var tempArr = JSON.parse(tempStr);
        var index = tempArr.indexOf(URLParam);
        if (index != -1) {
            tempArr.splice(index, 1);
        }

        if (tempArr.length >= 10) {
            tempArr.pop();
        }

        tempArr.unshift(URLParam);

        localStorage.setItem('history', JSON.stringify(tempArr));

        // 下拉刷新一次
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
    });


    // 功能3: 商品数据排序
    $('.sort_list > li[data-type]').bind('tap', function () {
        var $this = $(this);

        // 判断排序子项的选中状态
        if ($this.hasClass('now')) {
            // 有
            // 在此点击 就改变升序降序状态
            $this.find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
        } else {
            // 没有
            // 自身选中状态 其它移除选中状态 小箭头恢复初始值
            $this.addClass('now').siblings('li').removeClass('now')
                .find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        }

        // 下拉重新刷新
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
    });
});