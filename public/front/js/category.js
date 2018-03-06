/**
 * Created by 公平 on 2018/3/6.
 */


$(function () {

    /**
     * 渲染二级分类列表
     * @param id 一级菜单id
     */
    function listRender(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            success: function (data) {
                $('.category_list ul').html(template('category_list_tmp', data));
            }
        });
    }

    // 页面加载就加载当前选中的一级分类和一级分类下的子分类
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function (data) {
            // 组合数据和模板 渲染左侧导航
            $(".aside_categroy_nav ul").html(template("aside_nav_tmp", data));

            // 拿到一级分类导航第一个子项id 来获取当前子项下二级分类的数据
            var id = data.rows[0].id;
            listRender(id);
        }
    });

    // 侧边导航栏 高亮切换
    $('.aside_categroy_nav').on('click', 'li', function () {



        // 当前子菜单高亮显示
        $(this).addClass('now').siblings('li').removeClass('now');

        // 拿到一级分类导航当前子项id 来获取当前子项下二级分类的数据
        var id = $(this).data('id');
        listRender(id);

        // 回滚到顶部
        mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0, 0, 300);
    });
})