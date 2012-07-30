package com.ybcx.art.facade;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class ExtVisitorApi
 */
public class WebEntrance extends HttpServlet {

	private static final long serialVersionUID = 1L;

	//init参数中配置的bean名称
	private String targetBean;
	//从Spring得到的Bean
	private AppStarter proxy;

	public WebEntrance() {
		super();
		// do nothing...
	}

	//请求时触发该方法
	public void init() throws ServletException {		
		this.targetBean = getInitParameter("targetBean");
				
		//只查找一次，不重复查找Bean和初始化Servlet
		if(proxy==null){
			getServletBean();
		}
		
	}
	
	
	public void service(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		//通过代理Servlet进行具体的请求响应逻辑处理
		proxy.service(req, res);
	}

	private void getServletBean() {
		WebApplicationContext wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(getServletContext());		
		this.proxy = (AppStarter) wac.getBean(targetBean);
	}

}
