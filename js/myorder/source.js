mui.init();

var pageIndex = 1;
var toEnd = false;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: pullupRefresh
		},
		down: {
            callback: pulldownRefresh
        }
	}
});

mui.plusReady(function() {

	mui.preload({
		url: "sourcedetail.html",
		id: "sourcedetail"
	});
	
	initload(pageIndex);
	
	mui("#pullrefresh").on("tap", "li.success", function(e) {
		var success = plus.webview.getWebviewById("sourcedetail")
		var transid = (this.getAttribute("attr-name"));
		var transno = (this.getAttribute("attr-no"));
		mui.fire(success, "LoadDetailById", {
			transid: transid,
			transno:transno
		});
		mui.openWindow("sourcedetail.html", "sourcedetail", "pop-in", false);
	});
	//mui("#daily").on("tap","li.refund",function(){ alert("11331") })
	var reloadButton = document.getElementById("reload");
	reloadButton.addEventListener("tap", function() {
		pulldownRefresh();
	}, false);
});
				
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
    //pageIndex = 1;
    //console.log('下拉刷新');
    //table.innerHTML = '';
    setTimeout(function() {
        initload(pageIndex);
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().refresh(true);
    }, 1000);
}

function pullupRefresh(){
	//mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
	pageIndex++;
	var self = this;
	setTimeout(function() {
		//console.log("reload pageIndex = "+ pageIndex);
		
		initload(pageIndex);
		if(toEnd){
			self.endPullupToRefresh(true);
		}else{
			self.endPullupToRefresh(false);
		}
		//console.log("run endPullupToRefresh function ");
	}, 300);
}
        
//function opensearch() {
//	clicked("source_search.html", true);
//}

function initload(pageIndex) {
	
	var token = plus.storage.getItem("token");
	var deviceid = plus.device.uuid;
	var url = tmsApiUrl;
	var xhr1 = new plus.net.XMLHttpRequest();
	xhr1.onreadystatechange = function() {
		if(xhr1.readyState == 4) {
			if(xhr1.status == 200) {
				//console.log("data: "+ xhr1.responseText);
				//xhr1.responseText = xhr1.responseText.replace(/\r\n/g,"<br>") ;
				console.log("data: "+ xhr1.responseText);
				var code = JSON.parse(xhr1.responseText).Code;
				var msg = JSON.parse(xhr1.responseText).Message;
				//console.log("result: "+ result);
				if(code == 1) {
					console.log("myorderlist: "+xhr1.responseText);
					
					var daliylistrans = JSON.parse(xhr1.responseText).Data;
					//console.log("result: "+ daliylistrans.length);
					if(daliylistrans.length > 0) {
						for(var i = 0; i < daliylistrans.length; i++) {
							var everydayhtml = "";
							var ul = document.createElement("ul");
							ul.className = "mui-table-view mui-table-view-chevron";
							var li = document.createElement('li');
							li.className = "mui-table-view-cell success";
							li.setAttribute("attr-name", daliylistrans[i].work_id);
							li.setAttribute("attr-no", daliylistrans[i].work_no);
							//li.setAttribute("onclick",'openSourceInfo(' + daliylistrans[i].id + ')');
							li.innerHTML =
								'<a href="#" class="mui-navigate-right">' +
								'<img class="mui-media-object mui-pull-left" src="' + 'img/mainpage/icons/more.png' + '" />' +
								'<div class="mui-media-body"><h5>' + 
								'<p class="mui-ellipsis">' + daliylistrans[i].work_no + '<span class="mui-badge mui-badge-warning">'+daliylistrans[i].STATUS+'</span></p>' +
								'</h5>' + 
								'<div class="triangle-topleft"></div>' +
								'<p>装:<span class="mui-badge mui-badge-primary">'+daliylistrans[i].load_addr+'</span>卸:<span class="mui-badge mui-badge-success">'+daliylistrans[i].unload_addr+'</span></p></div>' +
								//'<span class="mui-h5 mui-badge mui-badge-danger mui-badge-inverted mui-pull-left" style="font-size:16px;font-family: "微软雅黑";">￥' + parseFloat(daliylistrans[i].totalAmountFee).toFixed(2) + '</span>' +
								'</a>';
							ul.appendChild(li);
							document.getElementById("tradelist").appendChild(ul);
							var picLoading=document.getElementById("loading");
							var btnReload=document.getElementById("reload");
							picLoading.style.display="none";
							btnReload.style.display="none";
						}
					}else{
						toEnd = true;
						mui('#pullrefresh').endPullupToRefresh(true);
					}
					
				} else {
					mui.alert("登陆超时,重新登陆");
				}
			}
		}
	}
	xhr1.open("POST", url);
	var data = {
		"ActionId": "OrderListCommand",
		"Parameters": {
			"DRIVERID": '"13039"'
		}
	}
	xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr1.setRequestHeader('charset','utf-8');
	var body = "body=" + JSON.stringify(data);
	body = body.replace(/\\"/g,"") ;
	console.log("req=" + body);
	xhr1.send(body);
}