package restaurant.backend.models;

import java.util.Collection;
import java.util.Collections;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String name;
    private String password;
    private String role;
    private String email;
    private String phone;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "content", column = @Column(name = "image_content", columnDefinition = "LONGTEXT")),
            @AttributeOverride(name = "mimeType", column = @Column(name = "image_mime_type")),
            @AttributeOverride(name = "name", column = @Column(name = "image_name"))
    })
    private ImageData image;

    public User() {}

    public User(String username, String name, String password, String role, String email, String phone, ImageData image) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.image = image;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public String getRole() {return role;}
    public void setRole(String role) {this.role = role;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}

    public ImageData getImage() {return image;}
    public void setImage(ImageData image) {this.image = image;}

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
}