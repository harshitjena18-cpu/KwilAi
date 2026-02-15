/**
 * Logging System
 * Structured logging for requests, errors, and system events
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Format log entry
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level}]`,
    entry.context ? `[${entry.context}]` : '',
    entry.requestId ? `[Request: ${entry.requestId}]` : '',
    entry.userId ? `[User: ${entry.userId}]` : '',
    entry.message,
  ];

  let output = parts.filter(Boolean).join(' ');

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    output += ` | ${JSON.stringify(entry.metadata)}`;
  }

  if (entry.error) {
    output += `\nError: ${entry.error.name}: ${entry.error.message}`;
    if (entry.error.stack) {
      output += `\nStack: ${entry.error.stack}`;
    }
  }

  return output;
}

/**
 * Base log function
 */
function log(
  level: LogLevel,
  message: string,
  context?: string,
  metadata?: Record<string, any>,
  error?: Error,
  userId?: string,
  requestId?: string
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    userId,
    requestId,
    metadata,
  };

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  const formatted = formatLogEntry(entry);

  // Log to appropriate stream based on level
  if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
    console.error(formatted);
  } else if (level === LogLevel.WARN) {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }
}

/**
 * Logger class
 */
export class Logger {
  private context: string;
  private userId?: string;
  private requestId?: string;

  constructor(context: string, userId?: string, requestId?: string) {
    this.context = context;
    this.userId = userId;
    this.requestId = requestId;
  }

  debug(message: string, metadata?: Record<string, any>): void {
    log(LogLevel.DEBUG, message, this.context, metadata, undefined, this.userId, this.requestId);
  }

  info(message: string, metadata?: Record<string, any>): void {
    log(LogLevel.INFO, message, this.context, metadata, undefined, this.userId, this.requestId);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    log(LogLevel.WARN, message, this.context, metadata, undefined, this.userId, this.requestId);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    log(LogLevel.ERROR, message, this.context, metadata, error, this.userId, this.requestId);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, any>): void {
    log(LogLevel.FATAL, message, this.context, metadata, error, this.userId, this.requestId);
  }

  /**
   * Log request
   */
  logRequest(method: string, path: string, statusCode?: number, duration?: number): void {
    const metadata: Record<string, any> = { method, path };
    if (statusCode !== undefined) metadata.statusCode = statusCode;
    if (duration !== undefined) metadata.durationMs = duration;

    const message = `${method} ${path}${statusCode ? ` - ${statusCode}` : ''}${duration ? ` (${duration}ms)` : ''}`;
    
    if (statusCode && statusCode >= 400) {
      this.warn(message, metadata);
    } else {
      this.info(message, metadata);
    }
  }

  /**
   * Log API call
   */
  logApiCall(service: string, endpoint: string, success: boolean, duration?: number): void {
    const metadata = {
      service,
      endpoint,
      success,
      durationMs: duration,
    };

    const message = `API call to ${service} ${endpoint} - ${success ? 'Success' : 'Failed'}${duration ? ` (${duration}ms)` : ''}`;
    
    if (success) {
      this.info(message, metadata);
    } else {
      this.warn(message, metadata);
    }
  }

  /**
   * Log database operation
   */
  logDbOperation(operation: string, collection: string, success: boolean, duration?: number): void {
    const metadata = {
      operation,
      collection,
      success,
      durationMs: duration,
    };

    const message = `DB ${operation} on ${collection} - ${success ? 'Success' : 'Failed'}${duration ? ` (${duration}ms)` : ''}`;
    
    this.debug(message, metadata);
  }

  /**
   * Log security event
   */
  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>): void {
    const metadata = {
      event,
      severity,
      ...details,
    };

    const message = `Security Event: ${event} (${severity})`;
    
    if (severity === 'critical' || severity === 'high') {
      this.error(message, undefined, metadata);
    } else {
      this.warn(message, metadata);
    }
  }
}

/**
 * Create logger instance
 */
export function createLogger(context: string, userId?: string, requestId?: string): Logger {
  return new Logger(context, userId, requestId);
}

/**
 * Request logging middleware for Hono
 */
export function requestLoggingMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    const requestId = crypto.randomUUID();
    const userId = c.req.header('X-User-Id');
    const method = c.req.method;
    const path = c.req.path;
    const startTime = Date.now();

    // Attach logger to context
    c.set('logger', createLogger('Request', userId, requestId));
    c.set('requestId', requestId);

    // Add request ID to response header
    c.header('X-Request-ID', requestId);

    const logger = c.get('logger') as Logger;
    logger.info(`Incoming request: ${method} ${path}`);

    try {
      await next();

      const duration = Date.now() - startTime;
      const statusCode = c.res.status;

      logger.logRequest(method, path, statusCode, duration);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error(`Request failed: ${method} ${path}`, error, {
        durationMs: duration,
      });
      throw error;
    }
  };
}

/**
 * Error logging middleware for Hono
 */
export function errorLoggingMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error: any) {
      const logger = c.get('logger') as Logger || createLogger('Error');
      
      logger.error('Unhandled error in request', error, {
        method: c.req.method,
        path: c.req.path,
        headers: Object.fromEntries(c.req.headers),
      });

      // Return error response
      return c.json({
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
        requestId: c.get('requestId'),
      }, 500);
    }
  };
}

export default {
  createLogger,
  Logger,
  LogLevel,
  requestLoggingMiddleware,
  errorLoggingMiddleware,
};
