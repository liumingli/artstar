package com.ybcx.art.dao;

import java.util.List;

import com.ybcx.art.beans.Location;
import com.ybcx.art.beans.Museum;


public interface DBAccessInterface {

	public List<Museum> searchMuseumBy(String key);

	public List<Museum> getMuseumBy(int pageNum, int pageSize, String location);
	
	public int addArtMuseum(Museum museum);

	public int addCountryCity(Location location);

	public List<Location> getAllCountryCity();
	
	public List<Location> getTopTenCity();



}
