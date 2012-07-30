package com.ybcx.art.tools;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.objectplanet.image.PngEncoder;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * 图片缩小
 * 
 * @author liumingli
 * 
 */

@SuppressWarnings("restriction")
public class ImageHelper {

	public static BufferedImage handleImage(File file, int defWidth,
			int defHeight, String filePath) throws IOException {
		
		Image image = ImageIO.read(file);
		int srcWidth = image.getWidth(null);
		int srcHeight = image.getHeight(null);

		float theImgHeightFloat = Float.parseFloat(String.valueOf(srcHeight));
		float theImgWidthFloat = Float.parseFloat(String.valueOf(srcWidth));

		int newWidth = 0, newHeight = 0;

		// 按比例算出新图片大小
		if (srcWidth <= defWidth && srcHeight <= defHeight) {
			newWidth = srcWidth;
			newHeight = srcHeight;
		} else {
			if (srcWidth < srcHeight) {
				float scale = theImgHeightFloat / theImgWidthFloat;
				newWidth = Math.round(defHeight / scale);
				newHeight = defHeight;
			} else {
				float scale = theImgWidthFloat / theImgHeightFloat;
				newWidth = defWidth;
				newHeight = Math.round(defWidth / scale);
			}
		}

		String fileType = filePath.substring(filePath.lastIndexOf(".") + 1);

		BufferedImage newImage;
		// 写图片
		if (fileType.toLowerCase().equals("png")) {
			newImage = writePngImage(image, newWidth, newHeight, filePath);
		} else {
			newImage = writeOtherImage(image, newWidth, newHeight, filePath);
		}

		return newImage;
	}

	// 写png图片
	private static BufferedImage writePngImage(Image image, int newWidth, int newHeight,
			String filePath) {
		BufferedImage newImage = new BufferedImage(newWidth, newHeight,
				BufferedImage.TRANSLUCENT);
		newImage.getGraphics()
				.drawImage(
						image.getScaledInstance(newWidth, newHeight,
								Image.SCALE_SMOOTH), 0, 0, null);
		try {
			PngEncoder encoder = new PngEncoder(PngEncoder.COLOR_TRUECOLOR_ALPHA);
			FileOutputStream outStream = new FileOutputStream(filePath);
			encoder.encode(newImage, outStream);
			outStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return newImage;
	}

	// 写jpg等图片
	private static BufferedImage writeOtherImage(Image image, int newWidth,
			int newHeight, String filePath) {

		BufferedImage newImage = new BufferedImage(newWidth, newHeight,
				BufferedImage.TYPE_INT_RGB);
		newImage.getGraphics()
				.drawImage(
						image.getScaledInstance(newWidth, newHeight,
								Image.SCALE_SMOOTH), 0, 0, null);
		try {
			FileOutputStream outStream = new FileOutputStream(filePath);
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(outStream);
			encoder.encode(newImage);
			outStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return newImage;
	}
	
}