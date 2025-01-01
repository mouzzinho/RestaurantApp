package restaurant.backend.controllers;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.*;
import restaurant.backend.security.TableWebSocketHandler;
import restaurant.backend.repositories.OrderRepository;
import restaurant.backend.repositories.DishRepository;
import restaurant.backend.repositories.DishToOrderRepository;
import restaurant.backend.repositories.TableRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final DishToOrderRepository dishToOrderRepository;
    private final TableRepository tableRepository;
    private final TableWebSocketHandler webSocketHandler;

    public OrderController(OrderRepository orderRepository, DishRepository dishRepository, DishToOrderRepository dishToOrderRepository, TableRepository tableRepository, TableWebSocketHandler webSocketHandler) {
        this.orderRepository = orderRepository;
        this.dishRepository = dishRepository;
        this.dishToOrderRepository = dishToOrderRepository;
        this.tableRepository = tableRepository;
        this.webSocketHandler = webSocketHandler;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> response = getOrdersWithDishes(orders);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable Integer status) {
        List<Order> orders = orderRepository.findByStatus(status);
        List<OrderResponse> response = getOrdersWithDishes(orders);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer id) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();

            List<DishWithQuantity> dishesWithQuantity = dishToOrderRepository.findByOrder(order).stream()
                    .map(dishToOrder -> new DishWithQuantity(
                            dishToOrder.getDish(),
                            dishToOrder.getQuantity(),
                            dishToOrder.getPreparedQuantity()
                    ))
                    .collect(Collectors.toList());

            OrderResponse response = new OrderResponse(
                    order.getId(),
                    order.getOrderDate(),
                    order.getStatus(),
                    order.getTableId(),
                    dishesWithQuantity
            );

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order orderDetails) {
        Order savedOrder = orderRepository.save(orderDetails);
        saveDishes(savedOrder, orderDetails.getDishes());

        Optional<RestaurantTable> tableOptional = tableRepository.findById(savedOrder.getTableId());
        if (tableOptional.isPresent()) {
            RestaurantTable table = tableOptional.get();
            table.setStatus("ordered");
            tableRepository.save(table);
        }
        webSocketHandler.sendTableUpdateNotification();
        return ResponseEntity.ok(savedOrder);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer id, @RequestBody Order orderDetails) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setTableId(orderDetails.getTableId());
            order.setOrderDate(orderDetails.getOrderDate());
            order.setStatus(orderDetails.getStatus());

            dishToOrderRepository.deleteAll(dishToOrderRepository.findByOrder(order));
            saveDishes(order, orderDetails.getDishes());

            Order updatedOrder = orderRepository.save(order);
            webSocketHandler.sendTableUpdateNotification();
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Order> deactivateOrder(@PathVariable Integer id) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setStatus(0);
            Order updatedOrder = orderRepository.save(order);
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        Optional<Order> order = orderRepository.findById(id);

        if (order.isPresent()) {
            dishToOrderRepository.deleteAll(dishToOrderRepository.findByOrder(order.get()));
            orderRepository.delete(order.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private void saveDishes(Order order, List<DishOrderDetails> dishDetails) {
        if (dishDetails != null) {
            List<DishToOrder> dishToOrders = dishDetails.stream()
                    .map(detail -> {
                        Optional<Dish> dish = dishRepository.findById(detail.getDishId());
                        System.out.println(detail);
                        System.out.println(dish);
                        return dish.map(d -> new DishToOrder(d, order, detail.getQuantity(), detail.getPreparedQuantity())).orElse(null);
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            dishToOrderRepository.saveAll(dishToOrders);
        }
    }

    private List<OrderResponse> getOrdersWithDishes (List<Order> orders) {
        return orders.stream().map(order -> {
            List<DishWithQuantity> dishesWithQuantity = dishToOrderRepository.findByOrder(order).stream()
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
                    dishesWithQuantity
            );
        }).toList();
    }
}