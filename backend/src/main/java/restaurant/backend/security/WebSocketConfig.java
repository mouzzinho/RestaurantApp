package restaurant.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TableWebSocketHandler tableWebSocketHandler;

    public WebSocketConfig(TableWebSocketHandler tableWebSocketHandler) {
        this.tableWebSocketHandler = tableWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(tableWebSocketHandler, "/wss/tables")
                .setAllowedOrigins("*");
    }
}