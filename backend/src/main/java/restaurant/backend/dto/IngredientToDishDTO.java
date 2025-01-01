package restaurant.backend.dto;

public class IngredientToDishDTO {
    private Integer id;
    private String name;
    private float quantity;
    private String unit;

    public IngredientToDishDTO(Integer id, String name, float quantity, String unit) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public float getQuantity() { return quantity; }
    public void setQuantity(float quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
