package com.ybcx.art.facade;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class AssistProcess {
	
	// 由Spring注入
	private ApiAdaptor apiAdaptor;


	private Logger log = Logger.getLogger(AssistProcess.class);
	
	/**
	 * 处理正常用户登录post的请求
	 * 
	 * @param action
	 * @param req
	 * @param res
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doPostProcess(String action, HttpServletRequest req,
			HttpServletResponse res) throws ServletException, IOException {

		// 安全验证：如果不是上传文件请求，取用户id参数，判断是否为正常用户
		if(!GlobalController.isDebug){
		}

		if (action.equals(AppStarter.SEARCHMUSEUMBY)) {
				res.setContentType("text/plain;charset=UTF-8");
				PrintWriter pw = res.getWriter();
				String key = req.getParameter("key");
				String result= apiAdaptor.searchMuseumBy(key);
				log.debug(result);
				pw.print(result);
				pw.close();
				
		}else if (action.equals(AppStarter.ADDARTMUSEUM)) {
			res.setContentType("text/plain;charset=UTF-8");
			PrintWriter pw = res.getWriter();
			//title, country ,city, shot, description
			String name = req.getParameter("name");
			String city = req.getParameter("city");
			String country = req.getParameter("country");
			String shotPath = req.getParameter("shotPath");
			String url = req.getParameter("url");
			String description = req.getParameter("description");
			String result = apiAdaptor.addArtMuseum(name, country ,city, shotPath, url, description);
			log.debug(result);
			pw.print(result);
			pw.close();
			
		}else if (action.equals(AppStarter.ADDCOUNTRYCITY)) {
			res.setContentType("text/plain;charset=UTF-8");
			PrintWriter pw = res.getWriter();
			//country, countryCN, city, cityCN, longitude, latitude
			String city = req.getParameter("city");
			String country = req.getParameter("country");
			String cityCN = req.getParameter("cityCN");
			String countryCN = req.getParameter("countryCN");
			String longitude = req.getParameter("longitude");
			String latitude = req.getParameter("latitude");
			String result= apiAdaptor.addCountryCity(country, countryCN, city, cityCN, longitude, latitude);
			log.debug(result);
			pw.print(result);
			pw.close();
			
		}else if (action.equals(AppStarter.GETMUSEUMBY)) {
			res.setContentType("text/plain;charset=UTF-8");
			PrintWriter pw = res.getWriter();
			String page = req.getParameter("page");
			String country = req.getParameter("country");
			String result= apiAdaptor.getMuseumBy(page,country);
			log.debug(result);
			pw.print(result);
			pw.close();
			
		}else if (action.equals(AppStarter.UPLOADSHOT)) {
			res.setContentType("text/plain;charset=UTF-8");
			PrintWriter pw = res.getWriter();
			String srcPath = req.getParameter("srcPath");
			String width = req.getParameter("width");
			String height = req.getParameter("height");
			String x = req.getParameter("xPosition");
			String y = req.getParameter("yPosition");
			String result= apiAdaptor.uploadShot(srcPath,width,height,x,y);
			log.debug(result);
			pw.print(result);
			pw.close();
			
		}else{
			
		}

	}

	public void setApiAdaptor(ApiAdaptor apiAdaptor) {
		this.apiAdaptor = apiAdaptor;
	}

}
