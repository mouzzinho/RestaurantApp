package restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.*;
import restaurant.backend.repositories.DishToOrderRepository;
import restaurant.backend.repositories.OrderRepository;
import restaurant.backend.repositories.TableRepository;
import restaurant.backend.security.TableWebSocketHandler;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableRepository tableRepository;
    private final TableWebSocketHandler webSocketHandler;
    private final OrderRepository orderRepository;
    private final DishToOrderRepository dishToOrderRepository;

    public TableController(TableRepository tableRepository, OrderRepository orderRepository, DishToOrderRepository dishToOrderRepository, TableWebSocketHandler webSocketHandler) {
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
        this.dishToOrderRepository = dishToOrderRepository;
        this.webSocketHandler = webSocketHandler;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        List<RestaurantTable> tables = tableRepository.findAll();
        List<RestaurantTable> tablesWithOrders = getOrders(tables, false);
        return ResponseEntity.ok(tablesWithOrders);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RestaurantTable>> getAllTablesWithActiveOrders() {
        List<RestaurantTable> orderedTables = tableRepository.findAll().stream()
                .filter(table -> "ordered".equalsIgnoreCase(table.getStatus()))
                .toList();
        List<RestaurantTable> tablesWithOrders = getOrders(orderedTables, true);
        return ResponseEntity.ok(tablesWithOrders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Integer id) {
        Optional<RestaurantTable> tableOptional = tableRepository.findById(id);

        if (tableOptional.isPresent()) {
            RestaurantTable table = tableOptional.get();
            Optional<Order> orderOptional = orderRepository.findFirstByTableIdAndStatus(id, 1);

            if (orderOptional.isPresent()) {
                Order order = orderOptional.get();
                OrderResponse orderResponse = buildOrderResponse(order);
                table.setOrder(orderResponse);
            }

            return ResponseEntity.ok(table);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable newTable) {
        RestaurantTable savedTable = tableRepository.save(newTable);
        return ResponseEntity.ok(savedTable);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Integer id, @RequestBody RestaurantTable updatedTable) {
        Optional<RestaurantTable> tableOptional = tableRepository.findById(id);

        if(tableOptional.isPresent()) {
            RestaurantTable table = tableOptional.get();

            table.setStatus(updatedTable.getStatus());
            table.setName(updatedTable.getName());

            RestaurantTable savedTable = tableRepository.save(table);
            webSocketHandler.sendTableUpdateNotification();

            return ResponseEntity.ok(savedTable);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/order")
    public ResponseEntity<RestaurantTable> updateTableOrder(@PathVariable Integer id, @RequestBody RestaurantTable updatedTable) {
        Optional<RestaurantTable> tableOptional = tableRepository.findById(id);

        if(tableOptional.isPresent()) {
            RestaurantTable table = tableOptional.get();

            table.setStatus(updatedTable.getStatus());
            table.setName(updatedTable.getName());

            Optional<Order> orderOptional = orderRepository.findFirstByTableIdAndStatus(id, 1);
            if (orderOptional.isPresent()) {
                Order order = orderOptional.get();
                List<DishToOrder> dishes = dishToOrderRepository.findByOrder(order);
                dishes.forEach(dish -> {
                    dish.setPreparedQuantity(dish.getQuantity());
                    dishToOrderRepository.save(dish);
                });
            }

            RestaurantTable savedTable = tableRepository.save(table);
            webSocketHandler.sendTableUpdateNotification();

            return ResponseEntity.ok(savedTable);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Integer id) {
        Optional<RestaurantTable> table = tableRepository.findById(id);

        if (table.isPresent()) {
            tableRepository.delete(table.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private OrderResponse buildOrderResponse(Order order) {
        List<DishToOrder> dishes = dishToOrderRepository.findByOrder(order);
        List<DishWithQuantity> dishWithQuantityList = dishes.stream()
                .map(dishToOrder -> new DishWithQuantity(
                        dishToOrder.getDish(),
                        dishToOrder.getQuantity(),
                        dishToOrder.getPreparedQuantity()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTableId(),
                dishWithQuantityList
        );
    }

    private List<RestaurantTable> getOrders(List<RestaurantTable> tables, Boolean onlyActive) {
        return tables.stream()
                .filter(table -> {
                    List<Order> activeOrders = orderRepository.findByTableIdAndStatus(table.getId(), 1);
                    if (!activeOrders.isEmpty()) {
                        Order activeOrder = activeOrders.get(0);
                        OrderResponse orderResponse = buildOrderResponse(activeOrder);
                        table.setOrder(orderResponse);
                        return true;
                    }

                    return !onlyActive;
                })
                .collect(Collectors.toList());
    }
}