package com.ybcx.art.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;


public class ArtUtils {

	private static final  SimpleDateFormat simpledDateFormat= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	//TODO, some static functions here;
	
	public static String generateUID(){
		String uid = UUID.randomUUID().toString().replace("-", "").substring(16);
		return uid;
	}
	
	public static String getFormatNowTime(){
		String now = simpledDateFormat.format(new Date().getTime());
		return now;
	}
	
	public static String formatDate(Date date){
		return simpledDateFormat.format(date);
	}

	public static String formatLong(Long time){
		return simpledDateFormat.format(time);
	}
}
