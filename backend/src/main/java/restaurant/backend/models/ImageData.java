package restaurant.backend.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class ImageData {
    private String content;
    private String mimeType;
    private String name;

    public ImageData() {}

    public ImageData(String content, String mimeType, String name) {
        this.content = content;
        this.mimeType = mimeType;
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}