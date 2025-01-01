package restaurant.backend.models;

import java.util.List;
import jakarta.persistence.*;
import restaurant.backend.dto.IngredientToDishDTO;

@Entity
@Table(name = "dishes")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private float price;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "content", column = @Column(name = "image_content", columnDefinition = "LONGTEXT")),
            @AttributeOverride(name = "mimeType", column = @Column(name = "image_mime_type")),
            @AttributeOverride(name = "name", column = @Column(name = "image_name"))
    })
    private ImageData image;

    @Transient
    private List<Category> categories;

    @Transient
    private List<IngredientToDishDTO> ingredients;

    @Transient
    private boolean isAvailable;

    public Dish() {

    }

    public Dish(String name, float price, ImageData image) {
        this.name = name;
        this.price = price;
        this.image = image;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ImageData getImage() { return image; }
    public void setImage(ImageData image) { this.image = image; }

    public float getPrice() { return price; }
    public void setPrice(float price) { this.price = price; }

    public List<Category> getCategories() { return categories; }
    public void setCategories(List<Category> categories) { this.categories = categories; }

    public List<IngredientToDishDTO> getIngredients() { return ingredients; }
    public void setIngredients(List<IngredientToDishDTO> ingredients) { this.ingredients = ingredients; }

    public boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
}