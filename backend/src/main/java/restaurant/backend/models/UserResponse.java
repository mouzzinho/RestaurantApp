package restaurant.backend.models;

import java.util.Date;
import restaurant.backend.security.JwtUtils;

public class UserResponse {
    private int id;
    private String username;
    private String name;
    private String email;
    private String role;
    private String phone;
    private ImageData image;
    private String token;
    private Date expirationDate;

    public UserResponse(String token, User user, JwtUtils jwtUtils) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.phone = user.getPhone();
        this.image = user.getImage();
        this.token = token;
        this.expirationDate = jwtUtils.extractExpiration(token);
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public ImageData getImage() {
        return image;
    }

    public String getToken() {
        return token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }
}