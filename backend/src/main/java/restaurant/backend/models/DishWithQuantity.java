package restaurant.backend.models;

public class DishWithQuantity {
    private Integer id;
    private String name;
    private float price;
    private ImageData image;
    private Integer quantity;
    private Integer preparedQuantity;

    public DishWithQuantity(Dish dish, Integer quantity, Integer preparedQuantity) {
        this.id = dish.getId();
        this.name = dish.getName();
        this.price = dish.getPrice();
        this.image = dish.getImage();
        this.quantity = quantity;
        this.preparedQuantity = preparedQuantity;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public float getPrice() { return price; }
    public void setPrice(float price) { this.price = price; }

    public ImageData getImage() { return image; }
    public void setImage(ImageData image) { this.image = image; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPreparedQuantity() { return preparedQuantity; }
    public void setPreparedQuantity(Integer preparedQuantity) { this.preparedQuantity = preparedQuantity; }
}
