package restaurant.backend.models;

import jakarta.persistence.Column;

public class DishOrderDetails {

    @Column (name = "dish_id")
    private Integer dishId;
    private Integer quantity;
    private Integer preparedQuantity;

    public DishOrderDetails() {}

    public DishOrderDetails(Integer dishId, Integer quantity, Integer preparedQuantity) {
        this.dishId = dishId;
        this.quantity = quantity;
        this.preparedQuantity = preparedQuantity;
    }

    public Integer getDishId() { return dishId; }
    public void setDishId(Integer dishId) { this.dishId = dishId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPreparedQuantity() { return preparedQuantity; }
    public void setPreparedQuantity(Integer preparedQuantity) { this.preparedQuantity = preparedQuantity; }
}