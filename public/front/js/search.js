/**
 * Created by 公平 on 2018/3/7.
 */

$(function () {
    var historyArr = ['耐克', '阿迪', '新百伦'];
    var historyStr = JSON.stringify(historyArr);
    // 存储本地
    localStorage.setItem('history', historyStr);


    // 历史记录容器 因为要多次操作, 定个变量存起来, 减少DOM操作.
    var $history_box = $('.history_box');


    /**
     * 拿到本地存储的历史记录文件
     * 返回存储历史文件的数组
     */
    function getHistory() {
        // 获取本地存储数据 转换成对象形式  如没有值 就给默认的空数组
        var historyStr = localStorage.getItem('history') || '[]';
        var historyArr = JSON.parse(historyStr);
        // 返回对象
        return historyArr;
    }


    /**
     * 拿到本地存储的历史记录 渲染到页面历史记录列表中
     */
    function render() {
        // 渲染历史记录列表
        $history_box.html(template('history-tmp', {list: getHistory()}));
    }


    // 功能1: 页面加载 渲染历史记录功能
    render();


    // 功能2: 点击清空记录 删除存储在本地的历史记录, 在重新渲染显示历史列表页
    $history_box.on('click', '.js_clear_history', function () {
        // 提示框 只有用户点是才清空历史记录
        mui.confirm('你确定套删除历史记录吗', '温馨提示', ['否', '是'], function (e) {
            if (e.index) {
                localStorage.removeItem('history');
                render();
            }
        })
    });


    // 功能3: 点击当前删除按钮, 删除当前那条历史数据
    $history_box.on('click', '.js_btn_delete', function () {

        // 记录this的指向
        var that = this;

        mui.confirm('您确定要删除吗', '温馨提示', function (e) {
            if (e.index) {
                // 拿到当前的索引
                var index = $(that).data('index');

                var historyArr = getHistory();

                // 从历史数组中删除这一条数据
                historyArr.splice(index, 1);

                // 删除完成 数组json化
                localStorage.setItem('history',  JSON.stringify(historyArr));

                // 重新渲染
                render();
            }
        });
    });


    // 功能4: 点击搜索按钮, 获取搜索框的内容, 添加到历史记录的最前面
    $('.js_btn_search').on('click', function () {
        var textEle = $(this).prev('input');

        // 获取文本框内容
        var value = textEle.val().trim();

        // 文本框内容为空 终止代码执行
        if (value === '') {
            // 恢复初始值
            textEle.val('');
            return;
        }

        // 根据内容在数组中查找所在的位置
        var historyArr = getHistory();
        var index = historyArr.indexOf(value);

        // 判断数组中是否有相应的内容
        if (index != -1) {
            // 有内容 就拼接掉
            historyArr.splice(index, 1);
        }

        // 存储的数据大于指定值 每次添加数据就删除最后一项数据
        if (historyArr.length >= 10) {
            historyArr.pop();
        }

        // 在数组最前面添加数据
        historyArr.unshift(value);

        // 添加完成 让文本框恢复初始值
        textEle.val('');

        // 在存储到本地中
        localStorage.setItem('history', JSON.stringify(historyArr));
        // 渲染
        render();

        // 跳转到详情分类页 携带产品的名称
        location.href = 'searchList.html?proName=' + value;
    })
});