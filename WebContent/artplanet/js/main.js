//--------  UTF-8 encode needed ---------
//---- 2012/07/01 ----
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
	$("#eventlist").empty();
}

function createLeftMenus(){
	$("#todayevents").click(function(){
		renderMenuLinkSelect(this);
		createEventsToday();
	});
	$("#thisweekevents").click(function(){
		renderMenuLinkSelect(this);
		emptyEventList();
	});
	$("#nextweekevents").click(function(){
		renderMenuLinkSelect(this);
		emptyEventList();
	});
	$("#thismonthevents").click(function(){
		renderMenuLinkSelect(this);
		emptyEventList();
	});
	$("#nextmonthevents").click(function(){
		renderMenuLinkSelect(this);
		emptyEventList();
	});
	
	//默认载入今日数据...
	renderMenuLinkSelect($("#todayevents"));			
}


function renderMenuLinkSelect(selecta){			
	//先清掉所有链接样式
	$("#todayevents").removeClass("linkselected");
	$("#thisweekevents").removeClass("linkselected");
	$("#nextweekevents").removeClass("linkselected");
	$("#thismonthevents").removeClass("linkselected");
	$("#nextmonthevents").removeClass("linkselected");			
				
	//添加选中样式
	$(selecta).addClass("linkselected");
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
