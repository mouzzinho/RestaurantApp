package restaurant.backend.dto;

public class IngredientDTO {
    private Integer id;
    private float quantity;
    private String unit;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public float getQuantity() { return quantity; }
    public void setQuantity(float quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}