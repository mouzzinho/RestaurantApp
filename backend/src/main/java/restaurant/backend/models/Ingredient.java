package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private float quantity;
    private String unit;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "content", column = @Column(name = "image_content", columnDefinition = "LONGTEXT")),
            @AttributeOverride(name = "mimeType", column = @Column(name = "image_mime_type")),
            @AttributeOverride(name = "name", column = @Column(name = "image_name"))
    })
    private ImageData image;

    public Ingredient() {}

    public Ingredient(String name, float quantity, String unit, ImageData image) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.image = image;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public float getQuantity() { return quantity; }
    public void setQuantity(float quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public ImageData getImage() { return image; }
    public void setImage(ImageData image) { this.image = image; }
}
