package restaurant.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import restaurant.backend.models.UserWorktime;

public interface UserWorktimeRepository extends JpaRepository<UserWorktime, Integer> {
    Optional<UserWorktime> findByIdAndUserId(Integer id, Integer userId);

    @Query(value = "SELECT * FROM worktime WHERE user_id = :userId AND " +
            "YEAR(FROM_UNIXTIME(date_start / 1000)) = :year AND " +
            "MONTH(FROM_UNIXTIME(date_start / 1000)) = :month",
            nativeQuery = true)
    List<UserWorktime> findAllByUserIdAndYearAndMonth(
            @Param("userId") Integer userId,
            @Param("year") Integer year,
            @Param("month") Integer month);
}