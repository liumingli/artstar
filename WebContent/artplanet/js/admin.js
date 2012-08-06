	//main function...
	$(function() {
		console.log("main function...");
		//fill country/city select options...
		//初始化下拉选框
		initSelectOptions();
		
		//create datepicker components...
		$( "#datepicker_start" ).datepicker();
		$( "#datepicker_start" ).datepicker("option", "dateFormat","yy-mm-dd");
		$( "#datepicker_end" ).datepicker();
		$( "#datepicker_end" ).datepicker("option", "dateFormat","yy-mm-dd");
		
		//art event form elements...
		var museumName = $("#museumName"), country = $("#country"), city = $("#city"), shotPath = $("#shotPath"), url = $("#url"), description = $("#description"); 
				
		//sending art event to backend...
		$("#submit").click(function(){
			var flag = checkNull(museumName,country,city,shotPath,url,description);
			//检验空
			if(flag){
				//提交
				createMuseum(museumName.val(),country.val(),city.val(),shotPath.val(),url.val(),description.val());
				//清空表单
				clearFormInputs(museumName,shotPath,url,description);
				//show the loading image...
				$('#subm').attr("style","visibility:hidden");
			}else{
				$('#subm').attr("style","visibility:visible");
				$('#subm').children().remove();
				$('#subm').append('<font color="red">所有字段不能为空</font>');
			}
		});
		
		
		//dialog used form elements...
		var countryCN = $( "#countryCN" ), countryEN = $( "#countryEN" ),
		cityCN = $( "#cityCN" ), cityEN = $( "#cityEN" ), longitude = $( "#longitude" ), latitude = $( "#latitude" );
		
		//initialize dialog interaction...
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 310,
			width: 280,
			modal: true,
			resizable: false,
			buttons: {
				"添加": function() {
					var flag = checkNull(countryCN,countryEN,cityCN,cityEN,longitude,latitude);
					//检验空
					if(flag){
						//获取表单输入字符串					
						//FIXME, submit immediately right now...
						createCityofCountry(countryCN.val(),countryEN.val(),cityCN.val(),cityEN.val(),longitude.val(),latitude.val());					
						//清空输入内容					
						clearFormInputs(countryCN,countryEN,cityCN,cityEN,longitude,latitude);					
						//show progress bar...
						$("#loadingtxt").remove();
						$(".ui-dialog-buttonpane").append('<p id="loadingtxt" style="text-align:center;">loading...</p>');					
					}else{
						$("#loadingtxt").remove();
						$(".ui-dialog-buttonpane").append('<p id="loadingtxt" style="text-align:center;"><font color="red">所有字段不能为空</font></p>');					
					}
				},
				"关闭": function() {
					$( this ).dialog( "close" );
					$("#loadingtxt").remove();
				}
			},//end of buttons
			close: function() {
				$("#loadingtxt").remove();
			}
		});//end of dialog controling...

		//create button skin and event...
		$( "#create-city" )
			.button()
			.click(function() {
				$( "#dialog-form" ).dialog( "open" );				
			});//open dialog...				
		
	});//end of js main function...
	
	function initSelectOptions(){
		console.log("init country and city options...");
		//country,city
		$.post('/artstar/artapi',{
			'method' : 'getAllCountryCity'
		},
		function(result){
			if(result.length > 0){
				for(key in result){
					var countryCN = result[key].countryCN, countryEN =  result[key].country;
					if(!isDuplicate(countryEN,"country")){
						$("#country").append("<option value="+countryEN+">"+countryCN+"</option>");
					}
					
					if(countryEN == "china" || countryCN=="中国" ){
						var cityCN = result[key].cityCN, cityEN =  result[key].city;
						if(!isDuplicate(cityEN,"city")){
							$("#city").append("<option value="+cityEN+">"+cityCN+"</option>");
						}
					}
				}
			}else{
				console.log("init countrycity error");
				$("#country").append("<option value='china'>中国</option>");
				$("#city").append("<option value='beijing'>北京</option>");
			}
		},"json");
		
	}
	
	
	window.onload = function(){
		console.log("window onload...");
		$('#fileUpload').fileupload({
			add : function(e, data) {
				var fileName = data.files[0].name;
				var regexp = /\.(png)|(jpg)|(gif)$/i;
			    if (!regexp.test(fileName)) {
			    	  $('#fileInfo').show().html('<img src="icons/no.png">');
			    }else{
					var jqXHR = data.submit().success(
							function(result, textStatus, jqXHR) {
								if(result == "reject"){
								    $('#fileInfo').show().html('<img src="icons/no.png">');
								}else{
									$('#shotPath').val(result);
									$('#fileInfo').show().html('<img src="icons/ok.png">');
									
									//禁用文件上传
									//$('#fileUpload').attr("style","visibility:hidden");
									$('#fileUpload').attr('disabled','disabled');
									
									//可以框选图片的操作
									var html = '<img id="shotImg" src="/artstar/artapi?method=getMuseumShot&relativePath='+result+'">';
									html += '<div align="center" id="opt"><button onclick="saveSelectedImg()">继续</button>';
									html += '<button onclick="reelect()">重选</button></div>';
									$('#shot').append(html);
									
									//注册可以框选裁剪图片的js
									initSelectImage();
									
								}
							}).error(
							function(jqXHR, textStatus, errorThrown) {
								console.log("error");
								$('#fileInfo').show().html('<img src="imgs/no.png">');
							}).complete(
							function(result, textStatus, jqXHR) {
								console.log(result);
							});
			    }
			}
		});
	};
	
	//TODO, submit to backend...
	function createCityofCountry(cntrCN, cntrEN, cityCN, cityEN, lon, lat){
		console.log("saving city to backend...");
		$.post('/artstar/artapi', {
			'method' : 'addCountryCity',
			'country' : cntrEN,
			'countryCN' : cntrCN,
			'city' : cityEN,
			'cityCN' : cityCN,
			'longitude' : lon,
			'latitude' : lat
		}, 
		//回调函数
		function (result) {
			$("#loadingtxt").remove();
			if(result == "false"){
				$(".ui-dialog-buttonpane").append('<p id="loadingtxt" style="text-align:center;"><img src="icons/no.png"></p>');					
			}else{
				$(".ui-dialog-buttonpane").append('<p id="loadingtxt" style="text-align:center;"><img src="icons/ok.png"></p>');					
				//给地点下拉列表添加上
				if(!isDuplicate(cntrEN,"country")){
					$("#country").append("<option value="+cntrEN+" selected>"+cntrCN+"</option>");
				}
				if(!isDuplicate(cityEN,"city")){
					$("#city").append("<option value="+cityEN+" selected>"+cityCN+"</option>");
				}
			}
		});
	}
	
	//TODO, submit the art event...
	function createMuseum(museumName,country,city,shotPath,url,description){
		if(ias != null){
			ias.cancelSelection();
			console.log("cancelSelection submit");
		}
		$.post('/artstar/artapi', {
			'method' : 'addArtMuseum',
			'name' : museumName,
			'country' : country,
			'city' : city,
			'shotPath' : shotPath,
			'url' : url,
			'description' : description
		}, 
		//回调函数
		function (result) {
			$('#subm').children().remove();
			$('#fileUpload').removeAttr('disabled');
//			$('#fileUpload').attr("style","visibility:visible");
			$('#shotImg').remove();
			
			if(result == "false"){
				$('#subm').append('<img src="icons/no.png">');
			}else{
				$('#subm').append('<img src="icons/ok.png">');
			}
		});
		
	}
	
	//清除方法中所有输入元素的内容，在提交之后
	function clearFormInputs(){
		var params = arguments;		
		for(var i=0; i<params.length; i++){
			//clear input value...
			params[i].removeAttr("value");
		}
	}
	
	//检查字段空值
	function checkNull(){
		var flag = true;
		var params = arguments;		
		for(var i=0; i<params.length; i++){
			//clear input value...
			var val = params[i].attr("value");
			if(val == null || val == ""){
				flag = false;
			}
		}
		return flag;
	}
	
	//判断重复并去除
	function isDuplicate(value,location){
		var flag = false;
		var options = $("#"+location).get(0).options;  
		for(var index=0; index<options.length; index++){
			if(value == "china"){
				options[index].setAttribute("selected","true"); 
			}
			
			if(value == options[index].value){
				flag = true;
				break;
			}
		}
		return flag;
	}

	function getCity(){
		$.post('/artstar/artapi', {
			'method' : 'getCityByCountry',
			'country' : $('#country').val()
		}, 
		function(result){
			$('#city').empty();
			if(result.length > 0){
				for(key in result){
					var cityCN = result[key].cityCN, cityEN =  result[key].city;
					if(!isDuplicate(cityEN,"city")){
						$("#city").append("<option value="+cityEN+">"+cityCN+"</option>");
					}
				}
			}
		},"json");
		
	}

	
	//图片剪裁并上传
	//初始化选择框
	var ias = null;
	var selectionImg = null;
	
	function initSelectImage(){
		$(document).ready(function () {
		        ias = $('#shotImg').imgAreaSelect({
		    	maxWidth: 200,
		    	maxHeight: 150,
		        handles: true,
		        instance: true,
		        x1: 0,
		        y1: 0,
		        x2: 200,
		        y2: 150,
		        onInit: function (img, selection) {
		        	selectionImg = selection;
		        	console.log('width: ' + selectionImg.width + ',height: ' + selectionImg.height + ',x1: ' + selection.x1 + ',y1: ' + selection.x2);
		        },
		        onSelectEnd: function (img, selection) {
		        	selectionImg = selection;
		        	console.log('width: ' + selectionImg.width + ',height: ' + selectionImg.height + ',x1: ' + selection.x1 + ',y1: ' + selection.x2);
		        }
		    });
		});
	}
	
	//上传框选后的图片到后台
	function saveSelectedImg(){
		console.log("saveSelectedImg");
		if(selectionImg == null){
			return;
		}
	 	$.post('/artstar/artapi', {
			'method' : 'uploadShot',
			'srcPath' : $('#shotPath').val(),
			'width' : selectionImg.width,
			'height' : selectionImg.height,
			'xPosition' : selectionImg.x1,
			'yPosition' : selectionImg.y1
		}, 
		//回调函数
		function (result) {
			if(ias != null){
				ias.cancelSelection();
				console.log("cancelSelection>>>");
			}
			
			if(result == "false"){
				 reelect();
			}else{
				//显示截后的图片
				$('#shotImg').remove();
				$('#opt').remove();
				var html = '<img id="shotImg" src="/artstar/artapi?method=getMuseumShot&relativePath='+result+'">';
				$('#shot').append(html);
				$('#shotPath').val(result);
			}
		});
	}
	
	//重选按钮所触发的操作
	function reelect(){
		//删除选择框
		if(ias != null){
			ias.cancelSelection();
			console.log("cancelSelection reelect");
		}
		$('#shotImg').remove();
		$('#opt').remove();
//		$('#fileUpload').attr("style","visibility:visible");
		$('#fileUpload').removeAttr('disabled');
		
		//删除刚才已上传的图片，避免垃圾
		deleteImage();
	}
	
	//删除上传但取消剪裁了的图片
	function deleteImage(){
		var path =  $('#shotPath').val();
		if(path != null && path !=""){
			$.post('/artstar/artapi', {
				'method' : 'deleteImage',
				'relativePath' : path
			}, 
			function(result){
				if(result == "true"){
					console.log("delete unuseful image success");
				}
			});
			$('#shotPath').attr("value","");
		}
	}