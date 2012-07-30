package com.ybcx.art.dao.impl;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;

import com.ybcx.art.beans.Location;
import com.ybcx.art.beans.Museum;
import com.ybcx.art.dao.DBAccessInterface;



public class DBAccessImplement  implements DBAccessInterface {

	private JdbcTemplate jdbcTemplate;

	// Inject by Spring
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}
	
	// Constructor
	public DBAccessImplement() {

	}

	@Override
	public List<Museum> searchMuseumBy(String key) {
		List<Museum> resList = new ArrayList<Museum>();
		String sql = "select * from apmuseum where am_museumName like '%"+key+"%'";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if (rows != null && rows.size() > 0) {
			for (int i = 0; i < rows.size(); i++) {
				Map<String, Object> map = (Map<String, Object>) rows.get(i);
				Museum museum = new Museum();
				museum.setId(map.get("am_id").toString());
				museum.setName(map.get("am_museumName").toString());
				museum.setCity(map.get("am_city").toString());
				museum.setCountry(map.get("am_country").toString());
				museum.setDescription(map.get("am_description").toString());
				museum.setOfficialUrl(map.get("am_officialUrl").toString());
				museum.setShotPath(map.get("am_shotPath").toString());
				resList.add(museum);
			}
		}
		return resList;
	}

	@Override
	public List<Museum> getMuseumBy(int pageNum, int pageSize, String country) {
		List<Museum> resList = new ArrayList<Museum>();
		int startLine = (pageNum -1)*pageSize;
		String sql = "select * from apmuseum where am_country = '"+country+"' limit "+startLine+","+pageSize;
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if (rows != null && rows.size() > 0) {
			for (int i = 0; i < rows.size(); i++) {
				Map<String, Object> map = (Map<String, Object>) rows.get(i);
				Museum museum = new Museum();
				museum.setId(map.get("am_id").toString());
				museum.setName(map.get("am_museumName").toString());
				museum.setCity(map.get("am_city").toString());
				museum.setCountry(map.get("am_country").toString());
				museum.setDescription(map.get("am_description").toString());
				museum.setOfficialUrl(map.get("am_officialUrl").toString());
				museum.setShotPath(map.get("am_shotPath").toString());
				resList.add(museum);
			}
		}
		return resList;
	}

	@Override
	public int addArtMuseum(final Museum museum) {
		String sql = "insert into apmuseum(am_id,am_museumName,am_city,am_country,am_description,am_officialUrl,am_shotPath,am_memo)" +
				" values (?,?,?,?,?,?,?,?)";
		
		int res =jdbcTemplate.update(sql, new PreparedStatementSetter() {
			public void setValues(PreparedStatement ps) {
				try {
					ps.setString(1, museum.getId());
					ps.setString(2, museum.getName());
					ps.setString(3, museum.getCity());
					ps.setString(4, museum.getCountry());
					ps.setString(5, museum.getDescription());
					ps.setString(6, museum.getOfficialUrl());
					ps.setString(7, museum.getShotPath());
					ps.setString(8, "");

				} catch (SQLException e) {
					e.printStackTrace();
				}

			}
		});

		return res;
	}

	@Override
	public int addCountryCity(final Location location) {
		String sql = "insert into citylocation(cl_id,cl_city,cl_cityCN,cl_country,cl_countryCN,cl_longitude,cl_latitude,cl_memo)" +
				" values (?,?,?,?,?,?,?,?)";
		
		int res =jdbcTemplate.update(sql, new PreparedStatementSetter() {
			public void setValues(PreparedStatement ps) {
				try {
					ps.setString(1, location.getId());
					ps.setString(2, location.getCity());
					ps.setString(3, location.getCityCN());
					ps.setString(4, location.getCountry());
					ps.setString(5, location.getCountryCN());
					ps.setString(6, location.getLongitude());
					ps.setString(7, location.getLatitude());
					ps.setString(8, "");

				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		});

		return res;
	}

	@Override
	public List<Location> getAllCountryCity() {
		List<Location> resList = new ArrayList<Location>();
		String sql = "select * from citylocation order by cl_city";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if (rows != null && rows.size() > 0) {
			for (int i = 0; i < rows.size(); i++) {
				Map<String, Object> map = (Map<String, Object>) rows.get(i);
				Location loc = new Location();
				loc.setId(map.get("cl_id").toString());
				loc.setCity(map.get("cl_city").toString());
				loc.setCountry(map.get("cl_country").toString());
				loc.setCityCN(map.get("cl_cityCN").toString());
				loc.setCountryCN(map.get("cl_countryCN").toString());
				loc.setLatitude(map.get("cl_latitude").toString());
				loc.setLongitude(map.get("cl_longitude").toString());
				resList.add(loc);
			}
		}
		return resList;
	}

	@Override
	public List<Location> getTopTenCity() {
		List<Location> resList = new ArrayList<Location>();
		String sql = "select c.cl_id,c.cl_city,c.cl_cityCN,c.cl_country,c.cl_countryCN,c.cl_longitude,c.cl_latitude,count(m.am_id) as cl_count" +
				" from citylocation c,apmuseum m where c.cl_city = m.am_city group by m.am_city order by c.cl_city";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if (rows != null && rows.size() > 0) {
			for (int i = 0; i < rows.size(); i++) {
				Map<String, Object> map = (Map<String, Object>) rows.get(i);
				Location loc = new Location();
				loc.setId(map.get("cl_id").toString());
				loc.setCity(map.get("cl_city").toString());
				loc.setCountry(map.get("cl_country").toString());
				loc.setCityCN(map.get("cl_cityCN").toString());
				loc.setCountryCN(map.get("cl_countryCN").toString());
				loc.setLatitude(map.get("cl_latitude").toString());
				loc.setLongitude(map.get("cl_longitude").toString());
				loc.setCount(Integer.parseInt(map.get("cl_count").toString()));
				resList.add(loc);
			}
		}
		return resList;
	}


}
