/**
 * 
 */
package com.ybcx.art.facade;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.fileupload.FileItem;

import com.ybcx.art.beans.Location;
import com.ybcx.art.beans.Museum;





/**
 * Servlet调用服务的参数转换器，用来封装客户端参数并实现服务调用；
 * 
 * @author lwz
 * 
 */

public class ApiAdaptor {
	
	// 由Spring注入
	private ArtServiceInterface artService;

	public void setArtService(ArtServiceInterface artService) {
		this.artService = artService;
	}
	public ApiAdaptor() {

	}

	// 由AppStarter调用
	public void setImagePath(String filePath) {
		this.artService.saveImagePathToProcessor(filePath);
	}

	public String createThumbnail(List<FileItem> fileItems) {
		FileItem sourceData = null;
		for (int i = 0; i < fileItems.size(); i++) {
			FileItem item = fileItems.get(i);
			if (!item.isFormField()) {
				//图片数据
				sourceData = item;
			}
		}
		String imgPath = artService.createAdImg(sourceData);
		return imgPath;
	}
	
	
	public void getImageFile(String relativePath, HttpServletResponse res) {
		artService.getImageFile(relativePath,res);
	}
	
	private void processPath(JSONArray jsonArray) {
		for (int i = 0; i < jsonArray.length(); i++) {
			//DIY成品的缩略图
			String thumbnailPath = jsonArray.getJSONObject(i).get("shotPath").toString();
			if(!"".equals(thumbnailPath)){
				//先从字符串中找到文件夹uploadFile的位置，再加上uploadFile的长度10，即可截取到下属文件路径
				int position = thumbnailPath.lastIndexOf("uploadFile");
				String relativePath = thumbnailPath.substring(position+10);
				jsonArray.getJSONObject(i).set("shotPath", relativePath);
			}
		}
	}
	
	
	public String searchMuseumBy(String key) {
		List<Museum> resList = artService.searchMuseumBy(key);
		JSONArray jsonArray = JSONArray.fromCollection(resList);
	    processPath(jsonArray);
		return jsonArray.toString();
	}
	
	
	public String addArtMuseum(String name, String country, String city,
			String shotPath, String url, String description) {
		String result = artService.addArtMuseum(name,country,city,shotPath,url,description);
		return result;
	}
	
	
	public String addCountryCity(String country, String countryCN, String city,
			String cityCN, String longitude, String latitude) {
		String result = artService.addCountryCity(country,countryCN,city,cityCN,longitude,latitude);
		return result;
	}
	
	public String getMuseumBy(String page, String location) {
		List<Museum> resList = artService.getMuseumBy(page,location);
		JSONArray jsonArray = JSONArray.fromCollection(resList);
	    processPath(jsonArray);
		return jsonArray.toString();
	}
	
	public String uploadShot(String srcPath, String width, String height,
			String x, String y) {
		String res = artService.uploadShot(srcPath,width,height,x,y);
		return res;
	}
	
	public String deleteImage(String relativePath) {
		String res = artService.deleteImage(relativePath);
		return res;
	}
	
	public String getAllCountryCity() {
		List<Location> list = artService.getAllCountryCity();
		return JSONArray.fromCollection(list).toString();
	}
	
	public String getTopTenCity() {
		List<Location> list = artService.getTopTenCity();
		return  JSONArray.fromCollection(list).toString();
	}
	
	


} // end of class
