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
					createMuseum(museum);
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


function createMuseum(museum){		
	$("#museumlist").append(museum['name']+"<br/>"+museum['officialUrl']+"<br/>");
}
		
function createCube(lon, lat, city){
	var color = new THREE.Color( 0x00FF00);
	lon = Number(lon);
	lat = Number(lat);
	planet.createCube(lon, lat, 0.1, 0, color, city, city);
	
//	planet.createCube(0.1, 51.3, 0.05, color, "234", "london");	
//	planet.createCube(-123.1, 49.2, 0.05, color, "345", "wengehua");
//	planet.createCube(151.1, -33.5, 0.05, color, "456", "xini");

}	


function createEventsToday(){
	//动态创建事件条目
	var eventName = "艺术北京即将举行！";
	var address = "北京 中国";
	var startTime = "2012/05/01";
	var endTime = "2012/05/03";
	var description = "每年举行一次的艺术盛会，来自全球的艺术团体为大家奉上精美的艺术大餐，不可错过啊。。。";
	var officialUrl = "http://ipintu.com";
	var eventItem = createEventItem(eventName, address, startTime, endTime, description, officialUrl);
	$("#eventlist").append(eventItem);
	var anotherEvent = createEventItem(eventName, address, startTime, endTime, description, officialUrl);
	$("#eventlist").append(anotherEvent);
	var thridEvent = createEventItem(eventName, address, startTime, endTime, description, officialUrl);
	$("#eventlist").append(thridEvent);
	
	//TODO, ADD EVENT CUBE ON PLANET...
	
}

function emptyEventList(){
	$("#citylist").empty();
}



function resetInput(){
	$("#searchinput").attr("value", "");//清空
	$("#searchinput").removeClass("short");//恢复样式
}

function trace(msg){
	console.log(msg);
}

function createEventItem(eventName, address, startTime, endTime, description, officialUrl){
	var div = document.createElement("div");
	//底部加一个边线
	div.style.borderBottom = "1px solid rgba(255,255,255,0.4)"
	//------ title --------
	var eventNode = document.createElement("p");
	eventNode.style.fontSize = "14px";
	eventNode.style.color = "#FFFFFF";
	eventNode.style.fontWeight = "bold";
	eventNode.innerHTML = eventName;
	div.appendChild(eventNode);			
	//----- content ------
	var content = document.createElement("p");
	content.style.color = "#FFFFFF";
	div.appendChild(content);
	
	content.innerHTML = "地址："+address+"<br/>"
									+"时间："+startTime+"--"+endTime+"<br/>"
									+description+"<br/>"
									+"<a href='"+officialUrl+"' target='_blank'>更多...</a>";			
	return div;
}
