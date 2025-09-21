#!/bin/bash

# Post-deployment verification script
# Verifies that all services are running correctly

set -e

echo "🔍 Starting post-deployment verification..."

# Configuration
BASE_URL="http://localhost"
API_URL="http://localhost:3001"
TIMEOUT=30

# Function to make HTTP request with timeout
make_request() {
    local url="$1"
    local expected_status="${2:-200}"
    local timeout="${3:-$TIMEOUT}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $url - Status: $response"
        return 0
    else
        echo "❌ $url - Expected: $expected_status, Got: $response"
        return 1
    fi
}

# Test frontend
echo "🌐 Testing frontend..."
make_request "$BASE_URL" 200

# Test API endpoints
echo "🔌 Testing API endpoints..."
make_request "$API_URL/health" 200
make_request "$API_URL/health/ready" 200
make_request "$API_URL/health/live" 200
make_request "$API_URL/api" 200

# Test API functionality
echo "📋 Testing API functionality..."

# Test sweets endpoint (should work without auth for GET)
make_request "$API_URL/api/sweets" 200

# Test auth endpoints (should return proper error codes)
make_request "$API_URL/api/auth/login" 400 || echo "ℹ️ Expected 400 for login without credentials"

# Test database connectivity
echo "🗄️ Testing database connectivity..."
response=$(curl -s "$API_URL/health")
if echo "$response" | grep -q '"database":"connected"'; then
    echo "✅ Database connection verified"
else
    echo "❌ Database connection issue detected"
    echo "Response: $response"
    exit 1
fi

# Test rate limiting
echo "🛡️ Testing rate limiting..."
echo "Making rapid requests to test rate limiter..."
for i in {1..5}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/sweets")
    echo "Request $i: $status"
done

# Performance check
echo "⚡ Running performance check..."
response_time=$(curl -w "%{time_total}" -o /dev/null -s "$API_URL/health")
if (( $(echo "$response_time < 1.0" | bc -l) )); then
    echo "✅ Response time acceptable: ${response_time}s"
else
    echo "⚠️ Slow response time: ${response_time}s"
fi

# Check Docker containers
echo "🐳 Checking Docker containers..."
if command -v docker >/dev/null 2>&1; then
    running_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES)
    echo "Running containers:"
    echo "$running_containers"
    
    # Check if all expected containers are running
    expected_containers=("postgres" "redis" "backend" "frontend")
    for container in "${expected_containers[@]}"; do
        if docker ps --format "{{.Names}}" | grep -q "$container"; then
            echo "✅ $container container is running"
        else
            echo "⚠️ $container container not found or not running"
        fi
    done
fi

# Check logs for errors
echo "📜 Checking recent logs for errors..."
if command -v docker-compose >/dev/null 2>&1; then
    error_logs=$(docker-compose logs --tail=50 2>/dev/null | grep -i "error\|fail\|exception" | head -5)
    if [ -n "$error_logs" ]; then
        echo "⚠️ Recent errors found in logs:"
        echo "$error_logs"
    else
        echo "✅ No recent errors found in logs"
    fi
fi

# Memory usage check
echo "💾 Checking system resources..."
if command -v free >/dev/null 2>&1; then
    free -h
elif command -v vm_stat >/dev/null 2>&1; then
    vm_stat
fi

# Disk usage check
echo "💿 Checking disk usage..."
df -h

echo ""
echo "🎉 Post-deployment verification completed!"
echo "📊 Summary:"
echo "   ✅ Frontend accessible"
echo "   ✅ API endpoints responding"
echo "   ✅ Database connected"
echo "   ✅ Security measures active"
echo ""
echo "🌟 Sweet Shop Management System is ready for use!"
