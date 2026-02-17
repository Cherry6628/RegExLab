package service.utils.manager;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import configs.ParamsAndDBLoader;

public class JWTService {

    public static String generateToken(String username, String nonce) {
        return Jwts.builder()
                .setSubject(username)
                .claim("nonce", nonce)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ParamsAndDBLoader.JWT_EXPIRY))
                .signWith(SignatureAlgorithm.HS256, ParamsAndDBLoader.JWT_SECRET)
                .compact();
    }

    public static String getUsername(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(ParamsAndDBLoader.JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public static String getNonce(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(ParamsAndDBLoader.JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("nonce", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public static String validate(String token) {
        String username = getUsername(token);
        if (username != null) {
            return username;
        }
        return null;
    }
}