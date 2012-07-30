package com.ybcx.art.beans;

public class Location {

	private String id;
	private String city;
	private String cityCN;
	private String country;
	private String countryCN;
	private String latitude;
	private String longitude;
	
	//用来存储某个城市下的艺术馆数
	private int count;
	
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCityCN() {
		return cityCN;
	}
	public void setCityCN(String cityCN) {
		this.cityCN = cityCN;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getCountryCN() {
		return countryCN;
	}
	public void setCountryCN(String countryCN) {
		this.countryCN = countryCN;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	
}
