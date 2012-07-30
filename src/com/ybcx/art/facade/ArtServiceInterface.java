package com.ybcx.art.facade;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;

import com.ybcx.art.beans.Museum;


public interface ArtServiceInterface {
	
	// 设置图片文件保存路径，由ApiAdaptor赋值
	public void saveImagePathToProcessor(String filePath);

	public String createAdImg(FileItem sourceData);

	public void getImageFile(String relativePath, HttpServletResponse res);

	public List<Museum> searchMuseumBy(String key);

	public String addArtMuseum(String title, String country, String city,
			String shotPath,  String url,String description);

	public String addCountryCity(String country, String countryCN, String city,
			String cityCN, String longitude, String latitude);

	public List<Museum> getMuseumBy(String page, String country);

	public String uploadShot(String srcPath, String width, String height,
			String x, String y);

}
