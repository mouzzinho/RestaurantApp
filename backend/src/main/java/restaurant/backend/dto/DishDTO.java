package restaurant.backend.dto;

import java.util.List;
import restaurant.backend.models.ImageData;

public class DishDTO {
    private String name;
    private float price;
    private ImageData image;
    private List<Integer> categories;
    private List<IngredientDTO> ingredients;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public float getPrice() { return price; }
    public void setPrice(float price) { this.price = price; }

    public ImageData getImage() { return image; }
    public void setImage(ImageData image) { this.image = image; }

    public List<Integer> getCategories() { return categories; }
    public void setCategories(List<Integer> categories) { this.categories = categories; }

    public List<IngredientDTO> getIngredients() { return ingredients; }
    public void setIngredients(List<IngredientDTO> ingredients) { this.ingredients = ingredients; }
}