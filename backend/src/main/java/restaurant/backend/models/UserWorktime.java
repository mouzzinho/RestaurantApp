package restaurant.backend.models;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "worktime")
public class UserWorktime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Long date_start;
    private Long date_end;

    @Column(name = "user_id")
    private Integer userId;

    public UserWorktime() {}

    public UserWorktime(Integer user_id, Long date_start, Long date_end) {
        this.userId = user_id;
        this.date_start = date_start;
        this.date_end = date_end;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public Integer getUser_id() {return userId;}
    public void setUser_id(Integer user_id) {this.userId = user_id;}

    public Long getDate_start() {return date_start;}
    public void setDate_start(Long date_start) {this.date_start = date_start;}

    public Long getDate_end() {return date_end;}
    public void setDate_end(Long date_end) {this.date_end = date_end;}
}
