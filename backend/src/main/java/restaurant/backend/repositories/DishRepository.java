package restaurant.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Dish;

public interface DishRepository extends JpaRepository<Dish, Integer> {
}