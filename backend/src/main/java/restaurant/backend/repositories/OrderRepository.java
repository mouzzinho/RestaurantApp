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

    @Query(value = "SELECT d.name AS dish_name, SUM(dto.quantity) AS total_quantity " +
            "FROM dish_to_order dto " +
            "JOIN dishes d ON dto.dish_id = d.id " +
            "JOIN orders o ON dto.order_id = o.id " +
            "WHERE FROM_UNIXTIME(o.order_date / 1000) >= NOW() - INTERVAL 30 DAY " +
            "GROUP BY d.name ORDER BY total_quantity DESC", nativeQuery = true)
    List<Object[]> findDishOrderStatistics();

    @Query(value = "SELECT AVG(total_value) FROM ( " +
            "    SELECT SUM(d.price * dto.quantity) AS total_value " +
            "    FROM dish_to_order dto " +
            "    JOIN dishes d ON dto.dish_id = d.id " +
            "    JOIN orders o ON dto.order_id = o.id " +
            "    WHERE FROM_UNIXTIME(o.order_date / 1000) >= NOW() - INTERVAL 30 DAY " +
            "    GROUP BY DATE(FROM_UNIXTIME(o.order_date / 1000)) " +
            ") AS daily_revenue", nativeQuery = true)
    Double getAvgDailyRevenueInLast30Days();

    @Query(value = "SELECT " +
            "    DATE(FROM_UNIXTIME(o.order_date / 1000)) AS order_day, " +
            "    SUM(d.price * dto.quantity) AS total_value " +
            "FROM dish_to_order dto " +
            "JOIN dishes d ON dto.dish_id = d.id " +
            "JOIN orders o ON dto.order_id = o.id " +
            "WHERE FROM_UNIXTIME(o.order_date / 1000) >= NOW() - INTERVAL 30 DAY " +
            "GROUP BY order_day " +
            "ORDER BY order_day DESC", nativeQuery = true)
    List<Object[]> getDailyRevenuesInLast30Days();

    @Query(value = "SELECT " +
            "    DATE_FORMAT(FROM_UNIXTIME(o.order_date / 1000), '%Y-%m') AS order_month, " +
            "    SUM(d.price * dto.quantity) AS total_value " +
            "FROM dish_to_order dto " +
            "JOIN dishes d ON dto.dish_id = d.id " +
            "JOIN orders o ON dto.order_id = o.id " +
            "GROUP BY order_month " +
            "ORDER BY order_month DESC", nativeQuery = true)
    List<Object[]> getMonthlyRevenuesInLast12Months();
}