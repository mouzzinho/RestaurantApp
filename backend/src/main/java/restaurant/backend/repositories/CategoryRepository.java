package restaurant.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}