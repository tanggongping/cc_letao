/**
 * Created by 公平 on 2018/3/5.
 */

window.onload = function () {

    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 3000  //自动轮播周期，若为0则不自动播放，默认为0；
    });
}