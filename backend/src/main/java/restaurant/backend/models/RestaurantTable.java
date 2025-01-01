package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "tables")
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String status;
    private String name;
    private float x;
    private float y;
    private float width;
    private float height;

    @Transient
    private OrderResponse order;

    public RestaurantTable() {}

    public RestaurantTable(String status, String name, float x, float y, float width, float height) {
        this.status = status;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}

    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public OrderResponse getOrder() { return order; }
    public void setOrder(OrderResponse order) { this.order = order; }

    public float getX() {return x;}
    public void setX(float x) {this.x = x;}

    public float getY() {return y;}
    public void setY(float y) {this.y = y;}

    public float getWidth() {return width;}
    public void setWidth(float width) {this.width = width;}

    public float getHeight() {return height;}
    public void setHeight(float height) {this.height = height;}

}
