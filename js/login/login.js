function plusReady() {
	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	// Android处理返回键
//	plus.key.addEventListener('backbutton', function() {
//		if(confirm('确认退出？')) {
//			plus.runtime.quit();
//		}
//	}, false);
};

mui.init();
function checkTokenIsExpire() {
	/*
	var deviceid = plus.device.uuid;
	var token = plus.storage.getItem("token")
	var url = publicUrl + "user/checktoken?ver=1&deviceid=" + deviceid + "&token=" + token + "&sign=";
	var xhr = new plus.net.XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				var code = JSON.parse(xhr.responseText).code;
				var msg = JSON.parse(xhr.responseText).msg;

				if(code != 1000) {
					clicked("login.html", true);
				} else {
					plus.navigator.closeSplashscreen();
					clicked("Calc.html", true);
				}

			} else {
				clicked("login.html", true);
			}
		}
	}

	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
	*/
}

mui.plusReady(function() {

	var phone = ""
	var password = ""

	if(plus.storage.getItem("phone") != "null" &&
		plus.storage.getItem("password") != "null" &&
		plus.storage.getItem("password") != "" &&
		plus.storage.getItem("phone") != "" &&
		plus.storage.getItem("phone") != null &&
		plus.storage.getItem("password") != null) {
		phone = document.getElementById("mobile").value = plus.storage.getItem("phone");
		password = document.getElementById("password").value = plus.storage.getItem("password");

		startlogin(phone, password);
	}
	plus.navigator.closeSplashscreen();

	plus.runtime.setBadgeNumber(0)

	plusReady();

	document.getElementById("login-form").addEventListener("keydown", function() {
		if(event.keyCode == 13) {
			phone = document.getElementById("mobile").value;
			password = document.getElementById("password").value
			startlogin(phone, password);
		}
	}, false);
	/*
	var forgetpwd = document.getElementById("forgetPassword");
	forgetpwd.addEventListener("tap", function() {
		clicked("forget_password.html");
	}, false)
	*/
	var reg = document.getElementById("reg");
	reg.addEventListener("tap", function() {
		clicked("register.html");
	}, false);
	var loginbutton = document.getElementById("login");
	loginbutton.addEventListener("tap", function() {
		document.activeElement.blur();
		phone = document.getElementById("mobile").value;
		password = document.getElementById("password").value
		startlogin(phone, password);
	}, false);
})

function startlogin(phone, pwd) {
	document.activeElement.blur();
	/*
	var info = plus.push.getClientInfo();
	var clientid = info.clientid;
	var devicetoken = info.token;
	if(plus.os.name == "Android") {
		devicetoken = "";
	}
	var deviceid = plus.device.uuid;
	*/
	var url = tmsApiUrl;
	var xhr = new plus.net.XMLHttpRequest();
	xhr.timeout = 10000;
		var phone = document.getElementById("mobile").value;
		var password = document.getElementById("password").value;

//	if(phone.replace(' ', '').length != 11) {
//		mui.alert("正确的手机号码长度为11位!");
//		return;
//	}
//
//	if(pwd.replace(' ', '').length < 5 || pwd.replace(' ', '').length > 16) {
//		mui.alert("密码是由6-15位数字或字母组成!");
//		return;
//	}
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		mui.alert("网络不给力，请稍后再试");
		return;
	}
	plus.nativeUI.showWaiting('正在登录', {
		modal: false
	});
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				plus.nativeUI.closeWaiting();
				var code = JSON.parse(xhr.responseText).Code;
				var msg = JSON.parse(xhr.responseText).Message;
				//console.log("code=" + code);
				if(code == 1) {
					var contid=JSON.parse(xhr.responseText).Data[0].cont_id;
					plus.storage.setItem("contid", contid.toString());
					plus.storage.setItem("phone", phone);
					plus.storage.setItem("password", password);
					//clicked("mainpage.html", true);
					
					mui.openWindow("mainpage.html", "mainpage", "pop-in", false);
				
					/*var w = plus.webview.create( "mainpage.html" );
                    w.show(); */
				} else {
					mui.alert(msg);
				}
			} else {
				plus.nativeUI.closeWaiting();
				mui.alert("重新登陆");
			}
		}
	}
	xhr.open("POST", url);
	var data = {
		"ActionId": "LoginCommand",
		"Parameters": {
			"USER_ID": '"' + phone +'"',
			"USER_PWS": '"' + pwd + '"'
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('charset','utf-8');
	var body = "Body=" + JSON.stringify(data);
	body = body.replace(/\\"/g,"") ;
	xhr.send(body);

}