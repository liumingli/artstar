//--------  UTF-8 encode needed ---------
//---- 2012/07/01 ----

//当前取到的城市列表数据
var topTen;

function queryTopTenCities(){
	$.post('/artstar/artapi',{
		'method' : 'topTenCity'
	},function(result){
		topTen = result;		
		if(topTen.length>0){
			for(var i=0; i<topTen.length; i++){
				var cityObj = topTen[i];
				var link = "<a href='javascript:;' id='"+cityObj['city']+"'>"+cityObj['cityCN']+"</a><br/>";
				$("#citylinks").append(link);
				//添加点击事件
				addClickEvent(cityObj['city']);
				//把城市定位到地球上
				createCube(cityObj['longitude'], cityObj['latitude'],cityObj['city']);
				//查询第一个城市的场馆
				getFirstCityMuseums();
			}
		}
	},"json");
}

function getFirstCityMuseums(){
	if(!topTen) return;
	
	var city = topTen[0]["city"];
	$.post('/artstar/artapi',{
		'method' : 'getMuseumBy','location' : city, 'page' : '1'
	},function(result){
		if(result.length>0){
			$("#museumlist").empty();						
			for(var i=0; i<result.length; i++){
				var museum = result[i];
				addMuseum(museum);
			}
		}
	},"json");
}

function addClickEvent(id){
	
	$("#"+id).click(function(){
		//按照城市，查询该城市的艺术馆
		$.post('/artstar/artapi',{
			'method' : 'getMuseumBy','location' : id, 'page' : '1'
		},function(result){
			if(result.length>0){
				$("#museumlist").empty();						
				for(var i=0; i<result.length; i++){
					var museum = result[i];
					addMuseum(museum);
				}
			}
		},"json");
		//Click to FLYTO ...				
		var lonlat = getLonLatValue(id);
		var lon = lonlat.split(",")[0];
		var lat = lonlat.split(",")[1];
//		trace("lon/lat:"+lon+"/"+lat);
		planet.flyTo(lon, lat);
	});
}

function getLonLatValue(city){
	var pos;
	for(var i=0; i<topTen.length; i++){
		var cityObj = topTen[i];
		if(city==cityObj['city']){
			pos = cityObj['longitude']+","+cityObj['latitude'];
			break;
		}		
	}
	return pos;
}


function addMuseum(museum){
	var msmElement = createMuseumElement(museum);
	$("#museumlist").append(msmElement);
}

/**
 * 要根据场馆的多少，指定柱子的大小
 * @param lon, longitude
 * @param lat, latitude
 * @param city, city name in english
 */
function createCube(lon, lat, city){
	var color = 0x00FF00;
	lon = Number(lon);
	lat = Number(lat);
	planet.createCube(lon, lat, 2, 0.1, color, city, city);
	
//	planet.createCube(0.1, 51.3, 0.05, color, "234", "london");	
//	planet.createCube(-123.1, 49.2, 0.05, color, "345", "wengehua");
//	planet.createCube(151.1, -33.5, 0.05, color, "456", "xini");

}

function emptyEventList(){
	$("#citylist").empty();
}

function resetInput(){
	$("#searchinput").attr("value", "");//清空
	$("#searchinput").removeClass("short");//恢复样式
}

function createMuseumElement(museum){
	var msmName = museum['name'];
	var shortPath = museum['shotPath'];
	trace(msmName+":"+shortPath);	
	var shotUrl = '/artstar/artapi?method=getMuseumShot&relativePath='+shortPath;
	var description = museum['description'];
	var officialUrl = museum['officialUrl'];
	
	var div = document.createElement("div");
	//底部加一个边线
	div.style.borderBottom = "1px solid rgba(255,255,255,0.4)"
	//------ title --------
	var eventNode = document.createElement("p");
	eventNode.style.fontSize = "14px";
	eventNode.style.color = "#FFFFFF";
	eventNode.style.fontWeight = "bold";
	eventNode.innerHTML = msmName;
	div.appendChild(eventNode);			
	//----- content ------
	var content = document.createElement("p");
	content.style.color = "#FFFFFF";
	div.appendChild(content);
	
	content.innerHTML = "<img src='"+shotUrl+"'/>"+"<br/>"
									+"简介："+description+"<br/><br/>"
									+"官网："+officialUrl;			
	return div;
}

function searchMuseumBy(){	
	var keywords = $('#searchinput').val().trim();
	if(keywords==null || keywords.length==0) return;
	//show loading...
	$('#prompt').show();
	$('#querybtn').attr("disabled","true");
	
	$.post('/artstar/artapi',
			{'method' : 'searchMuseumBy','key' : keywords},
			function(result){
				if(result.length>0){
					$("#museumlist").empty();						
					for(var i=0; i<result.length; i++){
						var museum = result[i];
						addMuseum(museum);
					}
					$('#prompt').hide();
					$('#querybtn').removeAttr("disabled");
				}
			},"json");
}

function trace(msg){
	if(console) console.log(msg);
}
