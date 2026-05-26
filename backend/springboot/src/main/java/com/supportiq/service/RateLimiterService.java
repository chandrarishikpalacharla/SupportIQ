package com.supportiq.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimiterService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_UPLOADS_PER_HOUR = 20;

    public boolean isAllowed(String tenantId, String action) {
        String key = "rate:" + action + ":" + tenantId;
        int limit = action.equals("chat") ? MAX_REQUESTS_PER_MINUTE : MAX_UPLOADS_PER_HOUR;
        Duration window = action.equals("chat") ? Duration.ofMinutes(1) : Duration.ofHours(1);

        Long count = redisTemplate.opsForValue().increment(key);

        if (count == 1) {
            // First request — set expiry
            redisTemplate.expire(key, window);
        }

        if (count > limit) {
            log.warn("Rate limit exceeded for tenant: {} action: {}", tenantId, action);
            return false;
        }

        return true;
    }

    public long getRemainingRequests(String tenantId, String action) {
        String key = "rate:" + action + ":" + tenantId;
        int limit = action.equals("chat") ? MAX_REQUESTS_PER_MINUTE : MAX_UPLOADS_PER_HOUR;
        String count = redisTemplate.opsForValue().get(key);
        if (count == null) return limit;
        return Math.max(0, limit - Long.parseLong(count));
    }
}
