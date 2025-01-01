package restaurant.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "dish_categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "content", column = @Column(name = "image_content", columnDefinition = "LONGTEXT")),
            @AttributeOverride(name = "mimeType", column = @Column(name = "image_mime_type")),
            @AttributeOverride(name = "name", column = @Column(name = "image_name"))
    })
    private ImageData image;

    public Category() {}

    public Category(String name, ImageData image) {
        this.name = name;
        this.image = image;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ImageData getImage() { return image; }
    public void setImage(ImageData image) { this.image = image; }
}
