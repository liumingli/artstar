/**
 * A planet Object for earth 
 * --- by rainbirdtech.com ---
 * core algorithm reference Google WebGL Globe 
 * http://code.google.com/p/webgl-globe/
 * --- author: lwz7512 ---
 * --- 2012/06/07 ---
 * 
*/

var RBT = RBT || {};

RBT.Earth = function(container){//container:DIV
	
	 var earth = this;//easily to reference...
	 
	 var radius = 200, distance=400;
	 var globeWidth=window.innerWidth-10, globeHeight=window.innerHeight-10;
	 var camera, controls, scene, projector, renderer;
	 var geometry, material, meshPlanet;
	 var objects = [];		 
	 var initialized = false;
	 
	 //相机所处角度，默认是在西经90度，赤道上
	 var _cameraLon = -Math.PI;
	 var _cameraLat = 0;
	 
	 var flyStartFlag = false;
	 var flyingSpeed = 0.01;
	 var flyingTracks = [];
	 var trackPtIndex = 0;
	 
	//这个算法对了！！！@2012/07/27
	 this.flyTo = function(lon, lat){//lat, 纬度 lon, 经度
		 //正在飞行时，不能重新设置
		 if(flyStartFlag) return;
		 
		 //转换成弧度进行计算
		 //FIXME, 要换成负数才行
		 //2012/08/09
		lon = toRadius(-lon);
		lat = toRadius(lat);
		
		//清空上一次的轨迹点
		flyingTracks = flyingTracks.splice(0, 0);
		
		//起始位置与目标位置经度差
		var lonDelta = lon - _cameraLon;
		//起始位置与目标位置纬度差
		var latDelta = lat - _cameraLat;
		//经向运动步长数
		var lonSteps = Math.round(lonDelta/flyingSpeed);
		var latSteps = Math.round(latDelta/flyingSpeed);
		//FIXME, 这个移动步数必须是正值
		//2012/08/06
		var trackPtNum = Math.max(Math.abs(lonSteps), Math.abs(latSteps));
		var lonMoveSpeed = lonDelta/trackPtNum;
		var latMoveSpeed = latDelta/trackPtNum;
		// 保存飞翔的轨迹点
		for(var i=0; i<trackPtNum; i++){
			var nextPtLon = _cameraLon + lonMoveSpeed*i;
			var nextPtLat = _cameraLat + latMoveSpeed*i;
			//核心算法：根据经纬度算位置
			var endY = distance*Math.sin(nextPtLat);
			var l= Math.sqrt(distance*distance-endY*endY);
			var endX = l*Math.cos(nextPtLon);
			var endZ = l*Math.sin(nextPtLon);
			
			var rotateEnd = new THREE.Vector3( endX, endY, endZ );
			flyingTracks.push(rotateEnd);
			
			//console.log("add pt "+i+": "+endX+"/"+endY+"/"+endZ);				
		}
		
		if(flyingTracks.length>0){
			flyStartFlag = true;
			controls.noRotate = true;
		}
		 
		 //保持旋转后的相机角度
		 _cameraLon = lon;
		 _cameraLat = lat;
		 
	 };
	 
	function toRadius(angle){
		return angle*Math.PI/180;
	}

	 function sin(v){
		 return Math.sin(v);
	 }
	 function cos(v){
		 return Math.cos(v);
	 }
	 function asin(v){
		return Math.asin(v);
	 }
	 function acos(v){
		 return Math.acos(v);
	 }
	 
	 //callback function...
	 this.onMeshClick = function(id,name){};//callback function
	 
	 /**
	  * 创建柱子在地球表面
	  * 
	  * @param lon, longitude, number;
	  * @param lat, latitude, number;
	  * @param size, (degree of) thickness, number;
	  * @param height, how tall the cube, number, 0~1;
	  * @param color, hex color, number;
	  * @param id, id of cube, string;
	  * @param name, name of cube, string;
	  */	 
	 this.createCube = function (lon, lat, size, height, color, id, name){
		 
		 	var materials = [];

			for ( var i = 0; i < 6; i ++ ) {
				materials.push( new THREE.MeshBasicMaterial( { color: color } ) );
			}
		 
		   var geometry = new THREE.CubeGeometry(1*size, 1*size, 1*size, 1, 1, 1, materials);
		   
		    var cube = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial() );
		    cube.id = id;
		    cube.name = name;
		    
		    //经验证，此公式完全争取：
		    //东经、北纬为正，西经南纬为负
		    //2012/07/23
		    var phi = (90 - lat) * Math.PI / 180;
		    var theta = -lon * Math.PI / 180;		    	 

		    cube.position.x = radius * Math.sin(phi) * Math.cos(theta);
		    cube.position.y = radius * Math.cos(phi);
		    cube.position.z = radius * Math.sin(phi) * Math.sin(theta);		   
		    
		    cube.lookAt(meshPlanet.position);
		    
		    //grow tall...
		    cube.scale.z = height*radius;
		    cube.updateMatrix();

		    scene.add(cube);
		    objects.push(cube);
		    
		    return cube;
	  }; //end of createCube

	
	 function init() {
		 
			scene = new THREE.Scene();
			projector = new THREE.Projector();
			
			renderer = new THREE.WebGLRenderer( { clearAlpha: 1, clearColor: 0x000000, antialias: true } );
			renderer.setSize(globeWidth, globeHeight);
			renderer.sortObjects = false;
			renderer.autoClear = false;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			container.appendChild( renderer.domElement );
			
			camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.z = distance;
			scene.add( camera );
			
			//camera control...
			controls = new THREE.TrackballControls( camera, renderer.domElement );
			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.panSpeed = 0.2;		
			controls.dynamicDampingFactor = 0.3;
			controls.minDistance = radius * 1.1;
			controls.maxDistance = radius * 100;	
			controls.noZoom = true;			
			controls.noPan = true;
			controls.noRotate = true;
			controls.addEventListener('change', onCamerMoved);
			
			// planet
			material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/planets/earth_atmos_2048.jpg' ), overdraw: true } ); 		
			geometry = new THREE.SphereGeometry( radius, 100, 50 );
			geometry.computeTangents();
			meshPlanet = new THREE.Mesh( geometry, material );					
			scene.add( meshPlanet );

			// stars
			var starsGeometry = new THREE.Geometry();

			for ( var i = 0; i < 1500; i ++ ) {

				var vertex = new THREE.Vector3();
				vertex.x = Math.random() * 2 - 1;
				vertex.y = Math.random() * 2 - 1;
				vertex.z = Math.random() * 2 - 1;
				vertex.multiplyScalar( radius );

				starsGeometry.vertices.push( vertex );

			}

			var stars,
			starsMaterials = [
				new THREE.ParticleBasicMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
				new THREE.ParticleBasicMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
				new THREE.ParticleBasicMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
				new THREE.ParticleBasicMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
				new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
				new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
			];

			for ( i = 10; i < 300; i ++ ) {

				stars = new THREE.ParticleSystem( starsGeometry, starsMaterials[ i % 6 ] );

				stars.rotation.x = Math.random() * 6;
				stars.rotation.y = Math.random() * 6;
				stars.rotation.z = Math.random() * 6;

				var s = i * 10;
				stars.scale.set( s, s, s );

				stars.matrixAutoUpdate = false;
				stars.updateMatrix();

				scene.add( stars );

			}
			
			window.addEventListener('resize', onWindowResize, false);
			document.addEventListener( 'click', onDocumentClick, false );
						
		 
	 } //end of init()
	 
	 //记录当前摄影机的角度_cameraLon,_cameraLat
	 function onCamerMoved(event){
		 if(flyStartFlag) return;//飞行时不记录，只有在手工旋转时记录
		 if(!initialized) return;
		 
		 var currentX = camera.position.x;
		 var currentY = camera.position.y;
		 
		 var l= Math.sqrt(distance*distance-currentY*currentY);
		 
		_cameraLat = Math.asin(currentY/distance);
		//FIXME, 很奇怪要这么搞一下才行
		//2012/08/09
		_cameraLon = -Math.acos(currentX/l);
		
	 }
	 
	  function moveCamera(){
		  if(!flyStartFlag) return;
		  
		  if(trackPtIndex>flyingTracks.length-1) return;
		  
		  //取出轨迹点，重新定位相机
		  camera.position = flyingTracks[trackPtIndex];
		  
		  //轨迹点索引增加
		  trackPtIndex ++;
		  
		  if(trackPtIndex>flyingTracks.length-1){//flying completed...
			  trackPtIndex = 0;
			  flyStartFlag = false;
			  controls.noRotate = false;//allow to rotate...
		  }
		  
	  }//end of move camera
	  
	  
	  function onDocumentClick(event){
		 
		  var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		  projector.unprojectVector( vector, camera );

		  var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
		  //检查对象列表
		  var intersects = ray.intersectObjects( objects );
		  
		  if ( intersects.length > 0 ) {
				var target = intersects[0].object;//this is mesh obj
				if(target.geometry instanceof THREE.CubeGeometry ){
					//callback to external function, deliver the object to outter app...
					if(earth.onMeshClick){
						earth.onMeshClick(target.id, target.name);
					}else{
						//console.log("no mesh click callback handler!");
					}
					//console.log("click on cube!");
				}
				//console.log(target);
		  }else{
			//console.log("no intersects  ");
		  }
			
	 } //end of document click
	  
	  function onWindowResize( event ) {
		  //FIXME, 将来部署到服务器时，得按照新浪应用大小要求，写死一个大小；
		  //2012/08/06
		  globeWidth = window.innerWidth-10;
		  globeHeight = window.innerHeight-10;

		  renderer.setSize( globeWidth, globeHeight );
		  camera.aspect = globeWidth / globeHeight;
		  camera.updateProjectionMatrix();
		
		  controls.screen.width = globeWidth;
		  controls.screen.height = globeHeight;
		
		  camera.radius = ( globeWidth + globeHeight ) / 4;			
	  }
	
	animate = function() {
		requestAnimationFrame( animate );
		
		render();//initially rotate globe...
		controls.update();
		
		initialized = true;
	};
	

	
	function render() {				
		
		moveCamera();
		
		controls.update();	
		
		renderer.clear();
		renderer.render( scene, camera );		
	}
	
	 //--- Constructor ------------
	 init();
	 
	 //------- INNER API NEED TO PUT IN BOTTOM -----------------	 
	 this.run = animate;	
	
	return this;
	
}; //end of RBT.Earth;