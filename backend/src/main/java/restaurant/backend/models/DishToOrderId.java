package restaurant.backend.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DishToOrderId implements Serializable {
    private Integer dishId;
    private Integer orderId;

    public DishToOrderId() {}

    public DishToOrderId(Integer dishId, Integer orderId) {
        this.dishId = dishId;
        this.orderId = orderId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DishToOrderId that = (DishToOrderId) o;
        return Objects.equals(dishId, that.dishId) && Objects.equals(orderId, that.orderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dishId, orderId);
    }
}