package restaurant.backend.controllers;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import restaurant.backend.repositories.OrderRepository;
import restaurant.backend.services.OrderService;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private OrderService orderService;

    private final OrderRepository orderRepository;

    public StatsController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        List<Object[]> dishStats = orderRepository.findDishOrderStatistics();
        Double averageDailyRevenue = orderRepository.getAvgDailyRevenueInLast30Days();

        stats.put("mostOrderedDish", dishStats.get(0)[0]);
        stats.put("leastOrderedDish", dishStats.get(dishStats.size() - 1)[0]);
        stats.put("averageDailyRevenue", averageDailyRevenue);
        stats.put("dailyRevenues", orderService.getDailyRevenuesWithMissingDays());
        stats.put("monthlyRevenues", orderService.getMonthlyRevenuesWithMissingMonths());

        return ResponseEntity.ok(stats);
    }
}