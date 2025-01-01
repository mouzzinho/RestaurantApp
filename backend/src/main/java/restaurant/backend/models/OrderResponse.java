package restaurant.backend.models;

import java.util.List;

public class OrderResponse {
    private Integer id;
    private String orderDate;
    private Integer status;
    private Integer tableId;
    private List<DishWithQuantity> dishes;

    public OrderResponse(Integer id, String orderDate, Integer status, Integer tableId, List<DishWithQuantity> dishes) {
        this.id = id;
        this.orderDate = orderDate;
        this.status = status;
        this.tableId = tableId;
        this.dishes = dishes;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getOrder_date() { return orderDate; }
    public void setOrder_date(String order_date) { this.orderDate = order_date; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }

    public List<DishWithQuantity> getDishes() { return dishes; }
    public void setDishes(List<DishWithQuantity> dishes) { this.dishes = dishes; }
}