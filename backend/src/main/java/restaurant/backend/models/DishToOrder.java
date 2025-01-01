package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "dish_to_order")
public class DishToOrder {

    @EmbeddedId
    private DishToOrderId id;

    @ManyToOne
    @MapsId("dishId")
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Integer quantity;
    private Integer preparedQuantity;

    public DishToOrder() {}

    public DishToOrder(Dish dish, Order order, Integer quantity, Integer preparedQuantity) {
        this.id = new DishToOrderId(dish.getId(), order.getId());
        this.dish = dish;
        this.order = order;
        this.quantity = quantity;
        this.preparedQuantity = preparedQuantity;
    }

    public DishToOrderId getId() { return id; }
    public void setId(DishToOrderId id) { this.id = id; }

    public Dish getDish() { return dish; }
    public void setDish(Dish dish) { this.dish = dish; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPreparedQuantity() { return preparedQuantity; }
    public void setPreparedQuantity(Integer preparedQuantity) { this.preparedQuantity = preparedQuantity; }
}