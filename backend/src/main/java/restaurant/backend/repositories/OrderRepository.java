package restaurant.backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByStatus(Integer status);
    List<Order> findByTableIdAndStatus(Integer tableId, Integer status);

    @Query("SELECT o FROM Order o WHERE o.tableId = :tableId AND o.status = :status")
    Optional<Order> findFirstByTableIdAndStatus(@Param("tableId") Integer tableId, @Param("status") Integer status);
}