package com.ybcx.art.facade;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.util.Streams;

import com.sun.image.codec.jpeg.ImageFormatException;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageDecoder;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import com.ybcx.art.beans.Location;
import com.ybcx.art.beans.Museum;
import com.ybcx.art.dao.DBAccessInterface;
import com.ybcx.art.tools.ImageOperate;
import com.ybcx.art.utils.ArtUtils;

@SuppressWarnings("restriction")
public class ArtServiceImplement implements ArtServiceInterface {


	// 由Spring注入
	private DBAccessInterface dbVisitor;
	
	public void setDbVisitor(DBAccessInterface dbVisitor) {
		this.dbVisitor = dbVisitor;
	}
	
	private Properties systemConfigurer;

	public void setSystemConfigurer(Properties systemConfigurer) {
		this.systemConfigurer = systemConfigurer;
	}

	private String imagePath;
	
	@Override
	public void saveImagePathToProcessor(String filePath) {
	//	this.imgProcessor.setImagePath(filePath);
		imagePath = filePath;
	}
	
	// 设定输出的类型
	private static final String GIF = "image/gif;charset=UTF-8";

	private static final String JPG = "image/jpeg;charset=UTF-8";

	private static final String PNG = "image/png;charset=UTF-8";
	
	
	public String createAdImg(FileItem adData) {
		String type = "";
		if (adData != null) {
			String fileName = adData.getName();
			int dotPos = fileName.lastIndexOf(".");
			type = fileName.substring(dotPos);
		}

		Date date = new Date();//获取当前时间
		SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMddHHmmss");
		String newfileName = sdfFileName.format(date);//文件名称
		
		String path = imagePath + File.separator
				+ newfileName + type;
		try {
			BufferedInputStream in = new BufferedInputStream(adData.getInputStream());
			// 获得文件输入流
			BufferedOutputStream outStream = new BufferedOutputStream(new FileOutputStream(new File(path)));// 获得文件输出流
			Streams.copy(in, outStream, true);// 开始把文件写到你指定的上传文件夹
		} catch (IOException e) {
			e.printStackTrace();
		}
		//上传成功，则插入数据库
		if (new File(path).exists()) {
			//保存到数据库
			System.out.println("保存成功"+path);
		}
		return path;
	}

	@Override
	public void getImageFile(String relativePath, HttpServletResponse res) {
		try {
			//默认
			File defaultImg = new File(imagePath + File.separator +"default.png");
			InputStream defaultIn = new FileInputStream(defaultImg);
			
			String type = relativePath.substring(relativePath.lastIndexOf(".") + 1);
			File file = new File(imagePath+relativePath);
			
			if (file.exists()) {
				InputStream imageIn = new FileInputStream(file);
				if (type.toLowerCase().equals("jpg") || type.toLowerCase().equals("jpeg")) {
					writeJPGImage(imageIn, res);
				} else if (type.toLowerCase().equals("png")) {
					writePNGImage(imageIn, res);
				} else if (type.toLowerCase().equals("gif")) {
					writeGIFImage(imageIn, res);
				} else {
					writePNGImage(defaultIn, res);
				}
			} else {
				writePNGImage(defaultIn, res);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	
	private void writeJPGImage(InputStream imageIn, HttpServletResponse res) {
		try {
			res.setContentType(JPG);
			JPEGImageDecoder decoder = JPEGCodec.createJPEGDecoder(imageIn);
			// 得到编码后的图片对象
			BufferedImage image = decoder.decodeAsBufferedImage();
			// 得到输出的编码器
			OutputStream out = res.getOutputStream();
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
			encoder.encode(image);
			// 对图片进行输出编码
			imageIn.close();
			// 关闭文件流
			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (ImageFormatException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private void writePNGImage(InputStream imageIn, HttpServletResponse res) {
		res.setContentType(PNG);
		getOutInfo(imageIn, res);
	}

	private void writeGIFImage(InputStream imageIn, HttpServletResponse res) {
		res.setContentType(GIF);
		getOutInfo(imageIn, res);
	}

	private void getOutInfo(InputStream imageIn, HttpServletResponse res) {
		try {
			OutputStream out = res.getOutputStream();
			BufferedInputStream bis = new BufferedInputStream(imageIn);
			// 输入缓冲流
			BufferedOutputStream bos = new BufferedOutputStream(out);
			// 输出缓冲流
			byte data[] = new byte[4096];
			// 缓冲字节数
			int size = 0;
			size = bis.read(data);
			while (size != -1) {
				bos.write(data, 0, size);
				size = bis.read(data);
			}
			bis.close();
			bos.flush();
			// 清空输出缓冲流
			bos.close();
			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	@Override
	public List<Museum> searchMuseumBy(String key) {
		List<Museum> list = dbVisitor.searchMuseumBy(key);
		return list;
	}

	@Override
	public String addArtMuseum(String name, String country, String city,
			String shotPath,  String url, String description) {
		boolean flag = false;
		Museum museum = this.generateMuseum(name,country,city,shotPath,url,description);
		int rows = dbVisitor.addArtMuseum(museum);
		if(rows >0){
			flag = true;
		}
		return String.valueOf(flag);
	}

	private Museum generateMuseum(String name, String country, String city,
			String shotPath, String url, String description) {
		Museum museum = new Museum();
		museum.setId(ArtUtils.generateUID());
		museum.setName(name);
		museum.setCity(city);
		museum.setCountry(country);
		museum.setShotPath(shotPath);
		museum.setDescription(description);
		museum.setOfficialUrl(url);
		return museum;
	}

	@Override
	public String addCountryCity(String country, String countryCN, String city,
			String cityCN, String longitude, String latitude) {
		boolean flag = false;
		Location location  = this.generateCountryCity(country,countryCN,city,cityCN,longitude,latitude);
		int rows = dbVisitor.addCountryCity(location);
		if(rows >0){
			flag = true;
		}
		return String.valueOf(flag);
	}

	private Location generateCountryCity(String country, String countryCN,
			String city, String cityCN, String longitude, String latitude) {
		Location loc = new Location();
		loc.setId(ArtUtils.generateUID());
		loc.setCity(city);
		loc.setCityCN(cityCN);
		loc.setCountry(country);
		loc.setCountryCN(countryCN);
		loc.setLongitude(longitude);
		loc.setLatitude(latitude);
		return loc;
	}

	@Override
	public List<Museum> getMuseumBy(String page, String location) {
		int pageNum = Integer.parseInt(page);
		int pageSize = Integer.parseInt(systemConfigurer.getProperty("pageSize"));
		List<Museum> list = dbVisitor.getMuseumBy(pageNum,pageSize,location);
		return list;
	}

	@Override
	public String uploadShot(String srcPath, String width, String height,
			String x, String y) {
		String result = "";
		ImageOperate imgOpt = new ImageOperate();
		imgOpt.setSrcpath(imagePath + srcPath);
		
		String suffix = srcPath.substring(srcPath.lastIndexOf(".") ).toLowerCase();
		String subPath = File.separator+"shot"+File.separator+ArtUtils.generateUID()+suffix;
		imgOpt.setSubpath(imagePath+ subPath);
		
		imgOpt.setWidth(Integer.parseInt(width));
		imgOpt.setHeight(Integer.parseInt(height));
		imgOpt.setX(Integer.parseInt(x));
		imgOpt.setY(Integer.parseInt(y));
		try {
			result = imgOpt.cut();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public List<Location> getAllCountryCity() {
		List<Location> list = dbVisitor.getAllCountryCity();
		return list;
	}

	@Override
	public List<Location> getTopTenCity() {
		List<Location> list = dbVisitor.getTopTenCity();
		return list;
	}

	@Override
	public String deleteImage(String relativePath) {
		boolean flag = false;
		String filePath = imagePath +File.separator +relativePath;
		File file = new File(filePath);
		if(file.exists()){
			boolean del = file.delete();
			if(del){
				flag = true;
			}
		}
		return String.valueOf(flag);
	}

}
