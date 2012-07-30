/**-------- A planet Object for earth ---------
--- by rainbirdtech.com -------
 core algorithm reference Google WebGL Globe -----
http://code.google.com/p/webgl-globe/
----- 2012/06/07 -----------
-- lwz7512 ----
*/

var RBT = RBT || {};

RBT.Earth = function(container){//container:DIV
	
	 var earth = this;//easily to reference...
	 
	 var radius = 200, distance=400;
	 var globeWidth=window.innerWidth-10, globeHeight=window.innerHeight-10;
	 var camera, controls, scene, projector, renderer;
	 var geometry, material, meshPlanet;
	 var objects = [];		 

	 //�����Ƕȣ�Ĭ����������90�ȣ������
	 var _cameraLon = -Math.PI;
	 var _cameraLat = 0;
	 
	 var flyStartFlag = false;
	 var flyingSpeed = 0.01;
	 var flyingTracks = [];
	 var trackPtIndex = 0;
	 
	//����㷨���ˣ�����@2012/07/27
	 this.flyTo = function(lon, lat){//lat, γ�� lon, ����
		 //ת���ɻ��Ƚ��м���
		lon = toRadius(-lon);
		lat = toRadius(lat);
		
		//�����һ�εĹ켣��
		flyingTracks = flyingTracks.splice(0, 0);
		
		//��ʼλ����Ŀ��λ�þ��Ȳ�
		var lonDelta = lon - _cameraLon;
		//��ʼλ����Ŀ��λ��γ�Ȳ�
		var latDelta = lat - _cameraLat;
		//�����˶�������
		var lonSteps = Math.round(lonDelta/flyingSpeed);
		var latSteps = Math.round(latDelta/flyingSpeed);
		var trackPtNum = Math.max(lonSteps, latSteps);
		var lonMoveSpeed = lonDelta/trackPtNum;
		var latMoveSpeed = latDelta/trackPtNum;
			
		//TODO, �������Ĺ켣��
		for(var i=0; i<trackPtNum; i++){
			var nextPtLon = _cameraLon + lonMoveSpeed*i;
			var nextPtLat = _cameraLat + latMoveSpeed*i;
			
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
		}
		 
		 //������ת������Ƕ�
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
	 
	 //api implementation...	 	 
	 this.createCube = function (lon, lat, size, color, id, name){
		   var geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, null, false, { px: true,
		          nx: true, py: true, ny: true, pz: false, nz: true});

		    for (var i = 0; i < geometry.vertices.length; i++) {
		      var vertex = geometry.vertices[i];
		      vertex.z += 0.5;
		    }
		    var material = new THREE.MeshBasicMaterial({
	            color: 0xffffff,
	            vertexColors: THREE.FaceColors,
	            morphTargets: false
	          });
		    var cube = new THREE.Mesh(geometry,material);
		    cube.id = id;
		    cube.name = name;
		    
		    //����֤���˹�ʽ��ȫ��ȡ��
		    //��������γΪ��������γΪ��
		    //2012/07/23
		    var phi = (90 - lat) * Math.PI / 180;
		    var theta = -lon * Math.PI / 180;		    	 

		    cube.position.x = radius * Math.sin(phi) * Math.cos(theta);
		    cube.position.y = radius * Math.cos(phi);
		    cube.position.z = radius * Math.sin(phi) * Math.sin(theta);		   
		    
		    cube.lookAt(meshPlanet.position);
		    
		    size = size*radius;
		    cube.scale.z = -size;
		    cube.updateMatrix();

		    var i;
		    for (i = 0; i < cube.geometry.faces.length; i++) {
		    	cube.geometry.faces[i].color = color;
		    }

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
//			controls.noZoom = true;			
			controls.noPan = true;			
			
			// planet
			material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/planets/earth_atmos_2048_meridian _line.jpg' ), overdraw: true } ); 		
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

			for ( i = 10; i < 30; i ++ ) {

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
	 
	
	  function onWindowResize( event ) {
		  //FIXME, ��ȫ���ߴ���ֹ������ˣ�ŪС��
		  globeWidth = window.innerWidth-10;
		  globeHeight = window.innerHeight-10;

		
		  renderer.setSize( globeWidth, globeHeight );
		  camera.aspect = globeWidth / globeHeight;
		  camera.updateProjectionMatrix();
		
		  controls.screen.width = globeWidth;
		  controls.screen.height = globeHeight;
		
		  camera.radius = ( globeWidth + globeHeight ) / 4;			
	  }
	  
	  
	  function onDocumentClick(event){
		 
		  var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		  projector.unprojectVector( vector, camera );

		  var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
		  //�������б�
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
		
	
	animate = function() {
		requestAnimationFrame( animate );
		
		render();//initially rotate globe...
		controls.update();
	};
	

	function moveCamera(){
		if(!flyStartFlag) return;
		
		if(trackPtIndex>flyingTracks.length-1) return;
		
		//TODO, ȡ���켣�㣬���¶�λ���
		camera.position = flyingTracks[trackPtIndex];
		
		//TODO, �켣����������
		trackPtIndex ++;
		
		if(trackPtIndex>flyingTracks.length-1){
			trackPtIndex = 0;
			flyStartFlag = false;
		}
		
	}//end of move camera
	
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