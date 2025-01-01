package restaurant.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.RestaurantTable;

public interface TableRepository extends JpaRepository<RestaurantTable, Integer> {
}