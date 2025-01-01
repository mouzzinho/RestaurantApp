package restaurant.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Dish;
import restaurant.backend.models.CategoryToDish;

public interface CategoryToDishRepository extends JpaRepository<CategoryToDish, Integer> {
    long countByCategoryId(Integer categoryId);
    List<CategoryToDish> findByDish(Dish dish);
}