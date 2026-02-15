package service.utils.manager;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import configs.ParamsLoader;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JWTService {
	private static final Key KEY = Keys.hmacShaKeyFor(ParamsLoader.JWT_SECRET.getBytes(StandardCharsets.UTF_8));

	public static String generateToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + ParamsLoader.JWT_EXPIRY)).signWith(KEY).compact();
	}

	public static String validate(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token).getBody().getSubject();
		} catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
			return null;
		}
	}
}