package restaurant.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
}