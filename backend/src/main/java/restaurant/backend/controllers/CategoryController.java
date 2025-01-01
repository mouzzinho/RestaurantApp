package restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.Category;
import restaurant.backend.models.ErrorResponse;
import restaurant.backend.repositories.CategoryRepository;
import restaurant.backend.repositories.CategoryToDishRepository;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryToDishRepository categoryToDishRepository;

    public CategoryController(CategoryRepository categoryRepository, CategoryToDishRepository categoryToDishRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryToDishRepository = categoryToDishRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Integer id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Integer id, @RequestBody Category categoryDetails) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            category.setName(categoryDetails.getName());
            category.setImage(categoryDetails.getImage());

            Category updatedCategory = categoryRepository.save(category);
            return ResponseEntity.ok(updatedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        Optional<Category> category = categoryRepository.findById(id);

        if (category.isPresent()) {
            long count = categoryToDishRepository.countByCategoryId(id);

            if (count > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse("Nie można usunąć kategorii, ponieważ istnieją dania, które są do niej przypisane."));
            }

            categoryRepository.delete(category.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}