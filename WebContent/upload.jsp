<%@ page language="java" import="java.util.*"
	contentType="text/html; charset=utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>My JSP 'login_sys.jsp' starting page</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		</head>
		<script type="text/javascript" language="javascript">
	function CheckFileType() {		 
		var objFileUpload = document.getElementById('file1');//FileUpload 
		var objMSG = document.getElementById('msg');//显示提示信息用的DIV 
		var FileName = new String(objFileUpload.value);//文件名 
		var extension = new String(FileName.substring(FileName.lastIndexOf(".") + 1, FileName.length));//文件扩展名
		extension = extension.toLowerCase();
		if (extension == "jpg" || extension == "png")//你可以添加扩展名 
		{
			objMSG.innerHTML="it's ok, now go to Upload!";
		} else {
			objMSG.innerHTML="oops! the file you selected not jpg or png file!";
			clearFileInput(objFileUpload);
						
		}
	}

	function clearFileInput(file){
	    var form=document.createElement('form');
	    document.body.appendChild(form);
	    //记住file在旧表单中的的位置
	    var pos=file.nextSibling;
	    form.appendChild(file);
	    form.reset();
	    pos.parentNode.insertBefore(file,pos);
	    document.body.removeChild(form);
	}

	function checkBlank(){
		var objFileUpload = document.getElementById('file1');//FileUpload
		var selectedFile = new String(objFileUpload.value);//文件名
					
		if(selectedFile==""){
			var objMSG = document.getElementById('msg');//显示提示信息用的DIV
			objMSG.innerHTML="No file selected!";
			alert("is blank!");
			return false;			
		}else{
			return true;
		}

							
	} 

	function clearMsg(){
		var objMSG = document.getElementById('msg');//显示提示信息用的DIV
		objMSG.innerHTML="";
	}
	
</script>
		<body>
		
				<form name="uploadForm" id="uploadForm" 
	onsubmit="return checkBlank();" onreset="clearMsg();"
	action="artapi" method="post" enctype="multipart/form-data">
	<div id="msg"></div>
		<input type="hidden" name ="method"  value="upload"/><br/>
	<input type="hidden" name ="user"  value="lml"/><br/>
	
	上传文件：
	<input type="file" name="file1" id="file1" size="30" onchange="CheckFileType();"/><br />

	<input type="submit" name="submit" value="上传">
	<input type="reset" name="reset" value="重置"><br />

</form>
</html>