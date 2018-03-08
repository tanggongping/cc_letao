/**
 * Created by 公平 on 2018/3/5.
 */

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    interval: 3000  //自动轮播周期，若为0则不自动播放，默认为0；
});

// 初始化区域滚动
mui('.mui-scroll-wrapper').scroll({
    indicators: false,  // 是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});



function getURLParam(key) {
    var obj = {};
    // 获取到地址栏参数 进行解码
    var tempStr = decodeURI(location.search.substr(1));
    // 进行分隔
    var paramArr = tempStr.split('&');
    // 遍历数组
    paramArr.forEach(function (ele) {
        // 继续分隔
        var key = ele.split('=')[0];
        var value = ele.split('=')[1];
        obj[key] = value;
    });
    return obj[key];
}