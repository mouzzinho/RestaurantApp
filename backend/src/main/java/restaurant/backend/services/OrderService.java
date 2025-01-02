package restaurant.backend.services;

import java.util.*;
import java.text.SimpleDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import restaurant.backend.repositories.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Map<String, Object>> getDailyRevenuesWithMissingDays() {
        List<Object[]> dailyRevenues = orderRepository.getDailyRevenuesInLast30Days();
        List<Date> last30Days = getLast30Days();

        Map<String, Double> dailyRevenueMap = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Object[] row : dailyRevenues) {
            Date date = (Date) row[0];
            Double totalValue = (Double) row[1];
            String formattedDate = sdf.format(date);
            dailyRevenueMap.put(formattedDate, totalValue);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Date day : last30Days) {
            String dayString = sdf.format(day);
            Map<String, Object> dailyData = new HashMap<>();
            dailyData.put("day", dayString);
            dailyData.put("value", dailyRevenueMap.getOrDefault(dayString, 0.0));
            result.add(dailyData);
        }

        return result;
    }

    public List<Map<String, Object>> getMonthlyRevenuesWithMissingMonths() {
        List<Object[]> monthlyRevenues = orderRepository.getMonthlyRevenuesInLast12Months();
        List<String> last12Months = getLast12Months();
        Map<String, Double> monthlyRevenueMap = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");

        for (Object[] row : monthlyRevenues) {
            String month = (String) row[0];
            Double totalValue = (Double) row[1];
            monthlyRevenueMap.put(month, totalValue);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (String month : last12Months) {
            Map<String, Object> monthlyData = new HashMap<>();
            monthlyData.put("month", month);
            monthlyData.put("value", monthlyRevenueMap.getOrDefault(month, 0.0));
            result.add(monthlyData);
        }

        return result;
    }

    private List<Date> getLast30Days() {
        List<Date> days = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        for (int i = 0; i < 30; i++) {
            calendar.add(Calendar.DAY_OF_YEAR, -1);
            days.add(calendar.getTime());
        }
        return days;
    }

    private List<String> getLast12Months() {
        List<String> months = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        months.add(sdf.format(calendar.getTime()));

        for (int i = 1; i < 12; i++) {
            calendar.add(Calendar.MONTH, -1);
            months.add(sdf.format(calendar.getTime()));
        }
        return months;
    }
}