package restaurant.backend.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CategoryToDishId implements Serializable {
    private Integer dishId;
    private Integer categoryId;

    public CategoryToDishId() {}

    public CategoryToDishId(Integer dishId, Integer categoryId) {
        this.dishId = dishId;
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryToDishId that = (CategoryToDishId) o;
        return Objects.equals(dishId, that.dishId) && Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dishId, categoryId);
    }
}