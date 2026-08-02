/**
 * Health Check Endpoint
 * FAANG-Level: Used by all major companies for monitoring
 * 
 * Features:
 * - App status check
 * - Database connectivity
 * - External service status
 * - Response time tracking
 */

import { NextResponse } from 'next/server';

const backendBaseUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request) {
  const startTime = Date.now();
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    checks: {}
  };

  try {
    // Check 1: Backend and database connectivity
    try {
      const response = await fetch(`${backendBaseUrl}/health`, {
        method: 'GET',
        cache: 'no-store',
      });
      const payload = await response.json();
      
      health.checks.database = {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
        error: response.ok ? null : payload?.message || 'Backend health check failed'
      };
      
      if (!response.ok) health.status = 'degraded';
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message
      };
      health.status = 'unhealthy';
    }

    // Check 2: Memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      health.checks.memory = {
        status: 'healthy',
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(memory.rss / 1024 / 1024) + 'MB'
      };
    }

    // Check 3: Environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_API_BASE_URL'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
    
    health.checks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      missingVariables: missingEnvVars
    };
    
    if (missingEnvVars.length > 0) health.status = 'unhealthy';

    // Overall response time
    health.responseTime = Date.now() - startTime;

    // Return appropriate status code
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}

// OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
