package com.ybcx.art.tools;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadBase.SizeLimitExceededException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;


/**
 * Servlet implementation class ImageUploader 似乎不能用这个上传类，而应该统一到一个外部访问接口中
 */
public class FileUploader extends HttpServlet {

	private static final long serialVersionUID = -543085089916376144L;

	private String filePath; // 文件存放目录
	private String tempPath; // 临时文件目录
	
	// 最大文件上传尺寸设置
	private int fileMaxSize = 4 * 1024 * 1024;
	
	private Logger log = Logger.getLogger(FileUploader.class);

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileUploader() {
		super();
	}

	// 初始化
		public void init(ServletConfig config) throws ServletException {
			super.init(config);
			// 从配置文件中获得初始化参数
			filePath = config.getInitParameter("filepath");
			tempPath = config.getInitParameter("temppath");

			ServletContext context = getServletContext();

			filePath = context.getRealPath(filePath);
			tempPath = context.getRealPath(tempPath);

			File fp = new File(filePath);
			if (!fp.exists())
				fp.mkdir();

			File tp = new File(tempPath);
			if (!tp.exists())
				tp.mkdir();

			log.debug("File storage directory, the temporary file directory is ready ...");
			log.debug("filePath: " + filePath);
			log.debug("tempPah: " + tempPath);
		}
		
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}  	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		PrintWriter pw = response.getWriter();

		try {
			DiskFileItemFactory diskFactory = new DiskFileItemFactory();
			// threshold 极限、临界值，即内存缓存 空间大小
			diskFactory.setSizeThreshold(fileMaxSize);
			// repository 贮藏室，即临时文件目录
			diskFactory.setRepository(new File(tempPath));

			ServletFileUpload upload = new ServletFileUpload(diskFactory);
			// 设置允许上传的最大文件大小 4M
			upload.setSizeMax(fileMaxSize);
			
			// 解析HTTP请求消息头
			@SuppressWarnings("unchecked")
			List<FileItem> fileItems = upload.parseRequest(request);
			Iterator<FileItem> iter = fileItems.iterator();
			while (iter.hasNext()) {
				FileItem item = iter.next();
				if (item.isFormField()) {
					log.debug("Processing the contents of the form...");
				} else {
					log.debug("Upload file handling...");
					processUploadFile(item, pw);
				}
			}// end while()

			// close write to front end
			pw.close();

		} catch (SizeLimitExceededException e) {
			
			log.debug(">>>File size exceeds the limit, can not upload!");
			pw.print(">>> File size exceeds the limit, can not upload!");
			return;
			
		} catch (Exception e) {
			log.debug("Exception occurs when using fileupload package...");
			e.printStackTrace();
		}// end try ... catch ...
	}   	  	    
	
	// 处理上传的文件
	@SuppressWarnings("static-access")
	private void processUploadFile(FileItem item, PrintWriter pw)
		throws Exception {
			boolean flag = false;
			// 此时的文件名包含了完整的路径，得注意加工一下
			String fileName = item.getName();
			int dotPos = fileName.lastIndexOf(".");
			//文件类型
			String fileType = fileName.substring(dotPos+1);
			
			if(fileType.equals("png") || fileType.equals("jpg") || fileType.equals("gif")){
				log.debug(">>>The current file type is:"+fileType);
			}else{
				pw.print("reject");
				return;			
			}

			// 如果是用IE上传就需要处理下文件名，否则是全路径了
			if (fileName != null) {
				fileName = FilenameUtils.getName(fileName);
			}

			long fileSize = item.getSize();
			//String sizeInK = (int) fileSize / 1024 + "K";

			if ("".equals(fileName) && fileSize == 0) {
				log.debug("fileName is null ...");
				return;
			}

			
			File uploadFile = new File(filePath + File.separator +"shot"+File.separator+ fileName);
			item.write(uploadFile);
			
			ImageHelper imgHelper = new ImageHelper();
			BufferedImage bufImg = 	imgHelper.handleImage(uploadFile, 300, 300, fileType);
			
			// 生成文件
			 ImageIO.write(bufImg, fileType, uploadFile);  
		
			
			log.debug(fileName + " File is complete ...");
			
			String imgPath = uploadFile.getAbsolutePath();
			
			if (new File(imgPath).exists()) {
				int position = imgPath.lastIndexOf("uploadFile");
				String relativePath =  imgPath.substring(position+10);
				pw.print(relativePath);
				
			}else{
				pw.print(String.valueOf(flag));
			}
			// 返回客户端信息
		//	pw.print(uploadFile.getAbsolutePath());
		}
}
