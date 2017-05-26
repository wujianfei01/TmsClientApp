/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

var publicUrl = "http://115.159.219.240:8080/webPay/";
var tmsApiUrl = "http://192.168.102.80/AppHandler/Handler/MainHandler.ashx";
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}
}

function UrlSearch(url) {
	var name, value;
	var str = url; //取得整个地址栏
	var num = str.indexOf("?")
	str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

	var arr = str.split("&"); //各个参数放到数组里
	for(var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if(num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name] = value;
		}
	}
}



		var dtask = null;
		var _src = "";

		function createDownloadTask() {
			if(dtask) {
				return;
			}
			var img = document.getElementById('QR_picture').src;
			_src = img;
			var url = "" + _src + "";
			alert(url);
			var options = {
				method: "GET"
			};
			dtask = plus.downloader.createDownload(url, options);
			dtask.addEventListener("statechanged", function(task, status) {
				if(!dtask) {
					return;
				}
				switch(task.state) {
					case 1: // 开始
						break;
					case 2: // 已连接到服务器
						break;
					case 3: // 已接收到数据
						//						mui.alert(task.downloadedSize + "/" + task.totalSize);
						break;
					case 4: // 下载完成
						savePicture();
						break;
				}
			});
			startDownloadTask();
		}

		function startDownloadTask() {
			if(!dtask) {
				return;
			}
			dtask.start();
		}

		function startAll() {
			plus.downloader.startAll();
		}
		// 扩展API加载完毕后调用onPlusReady回调函数 
		document.addEventListener("plusready", onPlusReady, false);
		var r = null;
		// 扩展API加载完毕，现在可以正常调用扩展API 
		function onPlusReady() {}
		// 保存图片到相册中 
		function savePicture() {
			plus.gallery.save("_doc/gallery", function() {
				mui.alert("保存图片到相册成功");
				mui.openWindow({
					url: 'QR_code.html',
					id: 'QR_code',
				});
			});
		}