package restaurant.backend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer status;

    @Column(name = "order_date")
    private String orderDate;

    @Column(name = "table_id")
    private Integer tableId;

    @Transient
    private List<DishOrderDetails> dishes;

    public Order() {}

    public Order(Integer id, Integer tableId, String orderDate, Integer status) {
        this.id = id;
        this.tableId = tableId;
        this.orderDate = orderDate;
        this.status = status;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public List<DishOrderDetails> getDishes() { return dishes; }
    public void setDishes(List<DishOrderDetails> dishes) { this.dishes = dishes; }
}