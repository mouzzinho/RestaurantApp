package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredient_to_dish")
public class IngredientToDish {

    @EmbeddedId
    private IngredientToDishId id;
    private float quantity;
    private String unit;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @ManyToOne
    @MapsId("dishId")
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    public IngredientToDish() {}

    public IngredientToDish(Ingredient ingredient, Dish dish, float quantity, String unit) {
        this.id = new IngredientToDishId(ingredient.getId(), dish.getId());
        this.ingredient = ingredient;
        this.dish = dish;
        this.quantity = quantity;
        this.unit = unit;
    }

    public IngredientToDishId getId() { return id; }
    public void setId(IngredientToDishId id) { this.id = id; }

    public Ingredient getIngredient() { return ingredient; }
    public void setIngredient(Ingredient ingredient) { this.ingredient = ingredient; }

    public Dish getDish() { return dish; }
    public void setDish(Dish dish) { this.dish = dish; }

    public float getQuantity() { return quantity; }
    public void setQuantity(float quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}