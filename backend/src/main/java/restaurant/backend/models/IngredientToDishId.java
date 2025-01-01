package restaurant.backend.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class IngredientToDishId implements Serializable {
    private Integer ingredientId;
    private Integer dishId;

    public IngredientToDishId() {}

    public IngredientToDishId(Integer ingredientId, Integer dishId) {
        this.ingredientId = ingredientId;
        this.dishId = dishId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IngredientToDishId that = (IngredientToDishId) o;
        return Objects.equals(ingredientId, that.ingredientId) && Objects.equals(dishId, that.dishId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ingredientId, dishId);
    }
}