package com.ybcx.art.facade;

import java.io.File;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;

public class ServerListener implements ServletContextListener {

	//文件上传路径
	private String filePath;
	private String tempPath;
	
	private Logger log = Logger.getLogger(ServerListener.class);
	
	@Override
	public void contextInitialized(ServletContextEvent event) {
		// 从context param中获取相对路径
		filePath = event.getServletContext().getInitParameter("filepath");
		tempPath = event.getServletContext().getInitParameter("temppath");

		//这时得到绝对路径
		filePath = event.getServletContext().getRealPath(filePath);
		tempPath = event.getServletContext().getRealPath(tempPath);
		
		//并保持在环境变量中
		System.setProperty("filePath", filePath);
		log.debug(">>> Environment variable, filePath: "+filePath);
		//并保持在环境变量中
		System.setProperty("tempPath", tempPath);		
		log.debug(">>> Environment variable, tempPath: "+tempPath);
		
		//初始化上传文件保存路径
		File fp = new File(filePath);
		if (!fp.exists())
			fp.mkdir();

		File tp = new File(tempPath);
		if (!tp.exists())
			tp.mkdir();

		log.debug("filePath and tempPath complete");

	}
	
	
	@Override
	public void contextDestroyed(ServletContextEvent event) {
		log.debug(">>>>>> SERVER IS DOWN <<<<<<");		
	}


}
