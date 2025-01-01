package restaurant.backend.controllers;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.dto.DishDTO;
import restaurant.backend.dto.IngredientDTO;
import restaurant.backend.dto.IngredientToDishDTO;
import restaurant.backend.models.Dish;
import restaurant.backend.models.Category;
import restaurant.backend.models.CategoryToDish;
import restaurant.backend.models.Ingredient;
import restaurant.backend.models.IngredientToDish;
import restaurant.backend.repositories.CategoryRepository;
import restaurant.backend.repositories.CategoryToDishRepository;
import restaurant.backend.repositories.DishRepository;
import restaurant.backend.repositories.IngredientRepository;
import restaurant.backend.repositories.IngredientToDishRepository;

@RestController
@RequestMapping("/api/dishes")
public class DishController {
    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryToDishRepository categoryToDishRepository;
    private final IngredientRepository ingredientRepository;
    private final IngredientToDishRepository ingredientToDishRepository;

    public DishController(DishRepository dishRepository,
                          CategoryRepository categoryRepository,
                          CategoryToDishRepository categoryToDishRepository,
                          IngredientRepository ingredientRepository,
                          IngredientToDishRepository ingredientToDishRepository) {
        this.dishRepository = dishRepository;
        this.categoryRepository = categoryRepository;
        this.categoryToDishRepository = categoryToDishRepository;
        this.ingredientRepository = ingredientRepository;
        this.ingredientToDishRepository = ingredientToDishRepository;
    }

    @GetMapping
    public List<Dish> getAllDishes() {
        List<Dish> dishes = dishRepository.findAll();
        dishes.forEach(dish -> {
            List<IngredientToDish> ingredients = ingredientToDishRepository.findByDish(dish);
            setCategories(dish);
            setIngredients(dish);
            setIsAvailable(dish, ingredients);
        });
        return dishes;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Integer id) {
        Optional<Dish> dishOptional = dishRepository.findById(id);

        if (dishOptional.isPresent()) {
            Dish dish = dishOptional.get();
            setCategories(dish);
            setIngredients(dish);
            return ResponseEntity.ok(dish);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Dish createDish(@RequestBody DishDTO dishDTO) {
        Dish dish = new Dish();
        dish.setName(dishDTO.getName());
        dish.setPrice(dishDTO.getPrice());
        dish.setImage(dishDTO.getImage());

        Dish savedDish = dishRepository.save(dish);

        createCategories(savedDish, dishDTO.getCategories());
        createIngredients(savedDish, dishDTO.getIngredients());

        return savedDish;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Dish> updateDish(@PathVariable Integer id, @RequestBody DishDTO dishDTO) {
        Optional<Dish> dishOptional = dishRepository.findById(id);

        if (dishOptional.isPresent()) {
            Dish dish = dishOptional.get();
            dish.setName(dishDTO.getName());
            dish.setPrice(dishDTO.getPrice());
            dish.setImage(dishDTO.getImage());

            categoryToDishRepository.deleteAll(categoryToDishRepository.findByDish(dish));
            ingredientToDishRepository.deleteAll(ingredientToDishRepository.findByDish(dish));

            createCategories(dish, dishDTO.getCategories());
            createIngredients(dish, dishDTO.getIngredients());

            Dish updatedDish = dishRepository.save(dish);
            return ResponseEntity.ok(updatedDish);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Integer id) {
        Optional<Dish> dish = dishRepository.findById(id);

        if (dish.isPresent()) {
            dishRepository.delete(dish.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    private void createCategories(Dish dish, List<Integer> categoryIds) {
        List<CategoryToDish> newCategoryLinks = categoryIds.stream()
                .map(categoryId -> {
                    Optional<Category> category = categoryRepository.findById(categoryId);
                    return category.map(cat -> new CategoryToDish(dish, cat)).orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        categoryToDishRepository.saveAll(newCategoryLinks);
    }

    private void createIngredients(Dish dish, List<IngredientDTO> ingredientDTOs) {
        List<IngredientToDish> newIngredientLinks = ingredientDTOs.stream()
                .map(dto -> {
                    Optional<Ingredient> ingredient = ingredientRepository.findById(dto.getId());
                    return ingredient.map(ing -> new IngredientToDish(ing, dish, dto.getQuantity(), dto.getUnit())).orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        ingredientToDishRepository.saveAll(newIngredientLinks);
    }

    private void setCategories(Dish dish) {
        List<Category> categories = categoryToDishRepository.findByDish(dish)
                .stream()
                .map(CategoryToDish::getCategory)
                .collect(Collectors.toList());
        dish.setCategories(categories);
    }

    private void setIngredients(Dish dish) {
        List<IngredientToDishDTO> ingredientsDTO = ingredientToDishRepository.findByDish(dish)
                .stream()
                .map(link -> new IngredientToDishDTO(
                        link.getIngredient().getId(),
                        link.getIngredient().getName(),
                        link.getQuantity(),
                        link.getUnit()
                ))
                .collect(Collectors.toList());
        dish.setIngredients(ingredientsDTO);
    }

    private void setIsAvailable(Dish dish, List<IngredientToDish> ingredients) {
        boolean isAvailable = ingredients.stream().allMatch(link -> {
            Ingredient ingredient = link.getIngredient();
            float requiredQuantity = link.getQuantity();

            if (Objects.equals(link.getUnit(), "kg") || Objects.equals(link.getUnit(), "l")) {
                return ingredient.getQuantity() >= requiredQuantity * 1000;
            }

            return ingredient.getQuantity() >= requiredQuantity;
        });

        dish.setIsAvailable(isAvailable);
    }
}