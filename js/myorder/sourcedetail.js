(function($, doc) {
				$.init();
				$.ready(function() {
					var _getParam = function(obj, param) {
						return obj[param] || '';
					};
					var userPicker = new $.PopPicker();
					userPicker.setData([{
						value: '0',
						text: '提货'
					}, {
						value: '1',
						text: '发车'
					}, {
						value: '2',
						text: '入仓(中转仓)'
					}, {
						value: '3',
						text: '到达'
					}, {
						value: '4',
						text: '签收'
					}, {
						value: '5',
						text: '异常'
					}, {
						value: '6',
						text: '交接'
					}, {
						value: '7',
						text: '入账'
					}]);
					var showUserPickerButton = doc.getElementById('showUserPicker');
					var selval = doc.getElementById('selval');
					var seltext = doc.getElementById('seltext');
					showUserPickerButton.addEventListener('tap', function(event) {
						userPicker.show(function(items) {
							showUserPickerButton.innerText='';
							showUserPickerButton.innerText ='已选择:'+ JSON.stringify(items[0].text);
							selval.value=items[0].value;
							seltext.value=items[0].text;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);
					//-----------------------------------------
					//级联
					/*var cityPicker = new $.PopPicker({
						layer: 2
					});
					cityPicker.setData(cityData);
					var showCityPickerButton = doc.getElementById('showCityPicker');
					var cityResult = doc.getElementById('cityResult');
					showCityPickerButton.addEventListener('tap', function(event) {
						cityPicker.show(function(items) {
							cityResult.innerText = "你选择的城市是:" + items[0].text + " " + items[1].text;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);*/
					//-----------------------------------------
					//					//级联示例
					/*var cityPicker3 = new $.PopPicker({
						layer: 3
					});
					cityPicker3.setData(cityData3);
					var showCityPickerButton = doc.getElementById('showCityPicker3');
					var cityResult3 = doc.getElementById('cityResult3');
					showCityPickerButton.addEventListener('tap', function(event) {
						cityPicker3.show(function(items) {
							cityResult3.innerText = "你选择的城市是:" + _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);*/
				});
			})(mui, document);

mui.init();

window.addEventListener("LoadDetailById", function(e) {
				loadSourceInfo(e.detail.transid,e.detail.transno);
		});
function loadSourceInfo(wid,wno)
{
	document.getElementById("maintitle").innerText=wno;
	document.getElementById('workid').value=wid;
	//console.log(wid);
}
var i=1,gentry=null,w=null;
var hl=null,le=null,de=null,ie=null;
var unv=true;
var bUpdated=false;
var addrStr='';
// H5 plus事件处理
function plusReady(){
	plus.io.resolveLocalFileSystemURL('_doc/', function(entry){
		entry.getDirectory('camera', {create:true}, function(dir){
			gentry = dir;
			updateHistory();
		}, function(e){
			//outSet('Get directory "camera" failed: '+e.message);
		} );
	}, function(e){
		//outSet('Resolve "_doc/" failed: '+e.message);
	});
	
	getGeocode();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready', plusReady, false);
}
	document.addEventListener('DOMContentLoaded', function(){
	// 获取DOM元素对象
	hl=document.getElementById('history');
	le=document.getElementById('empty');
	de=document.getElementById('display');
	if(ie=document.getElementById('index')){
		ie.onchange=indexChanged;
	}
	// 判断是否支持video标签
	unv=!document.createElement('video').canPlayType;
	updateHistory();
},false );
	function getImage(){
	var tmp=document.getElementById('selval').value;
	var spc=document.getElementById('curraddr').value;
	if(!tmp)
	{
		mui.alert('请先选择节点!');
		return;}
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p){
		plus.io.resolveLocalFileSystemURL(p, function(entry){
			createItem(entry);
			//console.log('2'+addrStr);
			ToBase64(entry.toLocalURL(),500,20,spc);
		}, function(e){
			//outLine('读取拍照文件错误：'+e.message);
		});
	}, function(e){

	}, {filename:'_doc/camera/',index:1});
};

function createItem(entry){
	var li = document.createElement('li');
	li.className = 'ditem';
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute('onclick', 'displayFile(this)' );
	hl.insertBefore( li, le.nextSibling );
	li.querySelector('.aname').innerText = entry.name;
	li.querySelector('.ainf').innerText = '...';
	li.entry = entry;
	updateInformation(li);
	// 设置空项不可见
	le.style.display = 'none';
};

function updateHistory(){
	if(bUpdated||!gentry||!document.body){//bug 兼容可能提前注入导致DOM未解析完更新的问题
		return;
	}
	var spc=document.getElementById('curraddr').value;
  	var reader = gentry.createReader();
  	reader.readEntries(function(entries){
  		for(var i in entries){
  			if(entries[i].isFile){
  				createItem(entries[i]);
  				//console.log('1'+addrStr);
  				ToBase64(entries[i].toLocalURL(),500,20,spc);
  			}
  		}
  	}, function(e){

  	});
  	bUpdated = true;
};

function updateInformation(li){
	if(!li || !li.entry){
		return;
	}
	var entry = li.entry;
	entry.getMetadata(function(metadata){
		li.querySelector('.ainf').innerText = dateToStr(metadata.modificationTime);
	}, function(e){
		//outLine('获取文件"'+entry.name+'"信息失败：'+e.message);
	} );
};

function displayFile(li){
	if(w){
		//outLine('重复点击！');
		return;
	}
	if(!li || !li.entry){
		//ouSet('无效的媒体文件');
		return;
	}
	var name = li.entry.name;
	var suffix = name.substr(name.lastIndexOf('.'));
	var url = '';
	if(suffix=='.mov' || suffix=='.3gp' || suffix=='.mp4' || suffix=='.avi'){
		//if(unv){plus.runtime.openFile('_doc/camera/'+name);return;}
		url = 'camera_video.html';
	} else {
		url = 'camera_image.html';
	}
	w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:'all'});
	w.addEventListener('loaded', function(){
		w.evalJS('loadMedia("'+li.entry.toLocalURL()+'")');
		//w.evalJS('loadMedia("'+'http://localhost:13131/_doc/camera/'+name+'")');
	}, false );
	w.addEventListener('close', function(){
		w = null;
	}, false);
	w.show('pop-in');
};

function doUpload()
{
	var tmp=document.getElementById('selval').value;
	var transid=document.getElementById("workid").value;
	var myspace=document.getElementById('curraddr').value;
	var contid=plus.storage.getItem("contid");
	if(!tmp)
	{
		mui.alert('请先选择节点!');
		return;} 
		if(!transid)
		{
			mui.alert('未取得运单信息,请重试!');
		return;
		}
		if(base64Data.length==0)
		{
			mui.alert('无待上传照片!');
		    return;
		}
  		//console.log(base64Data[0]);  
  		while(FinishedTask)
		{
			break;
		}	
		FinishedTask=false;
  		var tmpStr='{"data":[';
  		for(var i=0;i<base64Data.length;i++)
  		{
  			//console.log(addrStr);
  			//console.log(typeof(addrStr));
  			tmpStr+='{"files":"'+base64Data[i]+'","workid":"'+transid+'","stauesid":"'+tmp+'","address":"'+myspace+'","contid":"'+contid+'"},';
  			//console.log(tmpStr);
  		}
  		if(tmpStr!='')
		   tmpStr=tmpStr.substr(0,tmpStr.length-1);
		tmpStr+=']}';
		var tdata=JSON.parse(tmpStr); 
		
  		var data = {"ActionId":"UploadPhotoCommand","Parameters": tdata};
	    //console.log(typeof(data.Parameters));
	    //console.log(data);
  	    doPost(data);
  	    //console.log(typeof(tdata));
  	    //console.log(typeof(tdata.Parameters));
};

function cleanHistory(){
	hl.innerHTML = '<li id="empty" class="ditem-empty">当前派车单未拍照</li>';
	le = document.getElementById('empty');
	gentry.removeRecursively(function(){
		//console.log('success');
	}, function(e){
		//console.log('error');
	});
};
var FinishedTask=false;
function ToBase64(path,zipwidth,tsize,txval)
	{
		while(addrStr=='')
		{
			break;
		}
		FinishedTask=true;
    var img = new Image();
    img.src = path; 
    img.onload = function() {
        var that = this;
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = zipwidth;
        h = w / scale;
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(that, 0, 0, w, h);
        ctx.save();
      ctx.font = tsize+"px Arial";
      ctx.textBaseline = 'middle';//更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
        ctx.textAlign = 'center';
      var tw = ctx.measureText(addrStr).width;
      //console.log(addrStr);
      var ftop = canvas.height-15;
      var fleft = canvas.width-290;
      //var ftop = canvas.height/2;
      //var fleft = canvas.width/2;
      //ctx.fillStyle="#ff0000";
        //ctx.fillRect(fleft-tw/2,ftop-tsize/2,tw,tsize);
        //ctx.fillStyle="#ffffff";
        ctx.fillText(addrStr,fleft,ftop);
        ctx.strokeStyle = 'yellow';
        ctx.strokeText(addrStr,fleft,ftop);//文字边框

        var base64 = canvas.toDataURL('image/jpeg', 1); //设置图像清晰度 1最清晰，越低越模糊。
        //var base64 = canvas.toDataURL();
         //console.log(base64);
         base64Data.push(base64);
         //console.log('xx:'+base64Data.length);
			}};
			
function getGeocode(){
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		//console.log( "获取定位位置信息失败："+e.message );
	},{geocode:true});};

var base64Data= new Array();
function geoInf( position ) {
	//plus.nativeUI.showWaiting('获取位置中...', {
	//	modal: false
	//});
	var str = "";
	str += "地址："+position.addresses+"\n";//获取地址信息
	//str += "坐标类型："+position.coordsType+"\n";
	//var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；
	//str += "时间戳："+timeflag+"\n";
	//var codns = position.coords;//获取地理坐标信息；
	//var lat = codns.latitude;//获取到当前位置的纬度；
	//str += "纬度："+lat+"\n";
	//var longt = codns.longitude;//获取到当前位置的经度
	//str += "经度："+longt+"\n";
	//var alt = codns.altitude;//获取到当前位置的海拔信息；
	//str += "海拔："+alt+"\n";
	//var accu = codns.accuracy;//地理坐标信息精确度信息；
	//str += "精确度："+accu+"\n";
	//var altAcc = codns.altitudeAccuracy;//获取海拔信息的精确度；
	//str += "海拔精确度："+altAcc+"\n";
	//var head = codns.heading;//获取设备的移动方向；
	//str += "移动方向："+head+"\n";
	//var sped = codns.speed;//获取设备的移动速度；
	//str += "移动速度："+sped;
	//console.log(JSON.stringify(position));
	//console.log( str );
	addrStr=str;
	document.getElementById('curraddr').value=position.addresses;
	//console.log( addrStr );
	//plus.nativeUI.closeWaiting();
};

function sleep(numberMillis) { 
var now = new Date(); 
var exitTime = now.getTime() + numberMillis; 
while (true) { 
now = new Date(); 
if (now.getTime() > exitTime) 
return; 
} };

function doPost(postdata) {
	document.activeElement.blur();
	var url = tmsApiUrl;
	var xhr = new plus.net.XMLHttpRequest();
	xhr.timeout = 10000;

	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		mui.alert("网络不给力，请稍后再试");
		return;
	}
	plus.nativeUI.showWaiting('正在上传...', {
		modal: false
	});
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				//console.log('1');
				plus.nativeUI.closeWaiting();
				console.log(xhr.responseText);
				var code = JSON.parse(xhr.responseText).Code;
				var msg = JSON.parse(xhr.responseText).Message;
				//console.log("code=" + code);
				if(code == 0) {
					base64Data=new Array();
					cleanHistory();
					mui.alert(msg);
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
	
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('charset','utf-8');
	var body = "Body=" + JSON.stringify(postdata);
	body = body.replace(/\\"/g,"") ;
	xhr.send(body);
};
// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
};