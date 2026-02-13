package service.utils;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import configs.Params;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;



public class JWT {
	private static final Key KEY = Keys.hmacShaKeyFor(Params.JWT_SECRET.getBytes(StandardCharsets.UTF_8));

	public static String generateToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 1)).signWith(KEY).compact();
	}

	public static String validate(String token) {
		return Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token).getBody().getSubject();
	}
}
