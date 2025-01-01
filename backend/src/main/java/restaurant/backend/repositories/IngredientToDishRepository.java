package restaurant.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Dish;
import restaurant.backend.models.IngredientToDish;

public interface IngredientToDishRepository extends JpaRepository<IngredientToDish, Integer> {
    long countByIngredientId(Integer ingredientId);
    List<IngredientToDish> findByDish(Dish dish);
}