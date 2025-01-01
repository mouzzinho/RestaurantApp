package restaurant.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.DishToOrderId;
import restaurant.backend.models.Order;
import restaurant.backend.models.DishToOrder;

public interface DishToOrderRepository extends JpaRepository<DishToOrder, DishToOrderId> {
    List<DishToOrder> findByOrder(Order order);
}