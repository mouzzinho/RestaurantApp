package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "category_to_dish")
public class CategoryToDish {

    @EmbeddedId
    private CategoryToDishId id;

    @ManyToOne
    @MapsId("dishId")
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public CategoryToDish() {}

    public CategoryToDish(Dish dish, Category category) {
        this.dish = dish;
        this.category = category;
        this.id = new CategoryToDishId(dish.getId(), category.getId());
    }

    public CategoryToDishId getId() { return id; }
    public void setId(CategoryToDishId id) { this.id = id; }

    public Dish getDish() { return dish; }
    public void setDish(Dish dish) { this.dish = dish; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}