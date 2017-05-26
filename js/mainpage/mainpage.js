mui.init({
			swipeBack:true //启用右滑关闭功能
});
mui.plusReady(function(){
        //var old_back = mui.back;
mui.back = function(){
  var btn = ["确定","取消"];
  mui.confirm('确认退出新宁TMS？','提示',btn,function(e){
    if(e.index==0){
    	//old_back();
    	plus.runtime.quit();
    }
  });
}
});

		var slider = mui("#slider");
//		document.getElementById("switch").addEventListener('toggle', function(e) {
//			if (e.detail.isActive) {
//				slider.slider({
//					interval: 5000
//				});
//			} else {
//				slider.slider({
//					interval: 0
//				});
//			}
//		});
//轮播图片
slider.slider({
					interval: 5000
				});
				
				
				function gotopage(pagename)
				{
					clicked(pagename, false);
					//mui.openWindow(pagename, "sourcelist", "pop-in", false);
				};
