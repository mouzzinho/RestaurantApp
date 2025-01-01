package restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.Ingredient;
import restaurant.backend.models.ErrorResponse;
import restaurant.backend.repositories.IngredientRepository;
import restaurant.backend.repositories.IngredientToDishRepository;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientRepository ingredientRepository;
    private final IngredientToDishRepository ingredientToDishRepository;

    public IngredientController(IngredientRepository ingredientRepository, IngredientToDishRepository ingredientToDishRepository) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientToDishRepository = ingredientToDishRepository;
    }

    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Integer id) {
        Optional<Ingredient> ingredient = ingredientRepository.findById(id);
        return ingredient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ingredient createIngredient(@RequestBody Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Integer id, @RequestBody Ingredient ingredientDetails) {
        Optional<Ingredient> ingredientOptional = ingredientRepository.findById(id);

        if (ingredientOptional.isPresent()) {
            Ingredient ingredient = ingredientOptional.get();
            ingredient.setName(ingredientDetails.getName());
            ingredient.setImage(ingredientDetails.getImage());
            ingredient.setQuantity(ingredientDetails.getQuantity());
            ingredient.setUnit(ingredientDetails.getUnit());

            Ingredient updatedIngredient = ingredientRepository.save(ingredient);
            return ResponseEntity.ok(updatedIngredient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIngredient(@PathVariable Integer id) {
        Optional<Ingredient> ingredient = ingredientRepository.findById(id);

        if (ingredient.isPresent()) {
            long count = ingredientToDishRepository.countByIngredientId(id);

            if (count > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse("Nie można usunąć składnika, ponieważ istnieją dania, w których jest on używany."));
            }

            ingredientRepository.delete(ingredient.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}