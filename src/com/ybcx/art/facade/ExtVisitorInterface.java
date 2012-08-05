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
	
	//按关键字搜索艺术馆(参数艺术馆名)
	public static final String SEARCHMUSEUMBY  = "searchMuseumBy";
	
	//分页取得（传city或者country都可以）
	public static final String GETMUSEUMBY = "getMuseumBy";
	
	//添加艺术馆
	public static final String ADDARTMUSEUM = "addArtMuseum";
	
	//添加国家城市
	public static final String ADDCOUNTRYCITY = "addCountryCity";
    
	//根据相对路径获取艺术馆截图
	public static final String GETMUSEUMSHOT  = "getMuseumShot";
	
	//上传裁剪后的截图
	public static final String UPLOADSHOT = "uploadShot";
	
	//删除选择了但没有截图的多余图片
	public static final String DELETEIMAGE = "deleteImage";
	
	//获取所有的国家和城市
	public static final String GETALLCOUNTRYCITY = "getAllCountryCity";
	
	//根据国家获取城市
	public static final String GETCITYBYCOUNTRY = "getCityByCountry";
	
	//获取排名前十的国家
	public static final String TOPTENCITY = "topTenCity";
	
}
