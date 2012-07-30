/**
 * 
 */
package com.ybcx.art.facade;

/**
 * 这里定义外部访问接口需要的常量字符串
 * @author lml
 *
 */
public interface ExtVisitorInterface {
	
	//按关键字搜索艺术馆
	public static final String SEARCHMUSEUMBY  = "searchMuseumBy";
	
	//分页取得
	public static final String GETMUSEUMBY = "getMuseumBy";
	
	//添加艺术馆
	public static final String ADDARTMUSEUM = "addArtMuseum";
	
	//添加国家城市
	public static final String ADDCOUNTRYCITY = "addCountryCity";
    
	//根据相对路径获取艺术馆截图
	public static final String GETMUSEUMSHOT  = "getMuseumShot";
	
	//上传裁剪后的截图
	public static final String UPLOADSHOT = "uploadShot";
}
