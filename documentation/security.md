# Security Guidelines
## Enterprise Uptime Status Platform Security Framework

### Overview

The Enterprise Uptime Status Platform implements a comprehensive security framework designed to protect sensitive data, ensure compliance with enterprise security standards, and maintain the integrity of the Microsoft 365 ecosystem. This document outlines security best practices, implementation guidelines, threat mitigation strategies, and compliance requirements for all aspects of the platform.

Security is implemented using a defense-in-depth strategy with multiple layers of protection including authentication, authorization, data encryption, secure communications, input validation, and comprehensive monitoring.

### Security Architecture

#### Multi-Layer Security Model

**Layer 1: Network Security**
- **HTTPS/TLS Encryption**: All communications encrypted in transit
- **CDN Security**: Secure content delivery with DDoS protection
- **Firewall Configuration**: Network-level access controls and filtering
- **VPN Integration**: Secure remote access for administrative functions

**Layer 2: Application Security**
- **Authentication**: Multi-factor authentication with Azure AD integration
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Input Validation**: Comprehensive input sanitization and validation
- **Output Encoding**: XSS prevention through proper output encoding

**Layer 3: Data Security**
- **Encryption at Rest**: Database encryption and secure storage
- **Data Classification**: Sensitive data identification and protection
- **Data Loss Prevention**: Monitoring and prevention of data exfiltration
- **Backup Security**: Encrypted backups with secure retention policies

**Layer 4: Infrastructure Security**
- **Container Security**: Secure containerization and orchestration
- **Secrets Management**: Azure Key Vault integration for sensitive configuration
- **Monitoring and Logging**: Comprehensive security event logging and analysis
- **Incident Response**: Automated threat detection and response procedures

### Authentication and Authorization

#### Azure Active Directory Integration

**SharePoint Framework Authentication**
```typescript
// Authentication configuration for SPFx context
export class AuthenticationService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  async getAccessToken(resource: string = 'https://graph.microsoft.com'): Promise<string> {
    try {
      const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
      const token = await tokenProvider.getToken(resource);
      
      if (!token || !token.accessToken) {
        throw new AuthenticationError('Failed to acquire access token');
      }

      return token.accessToken;
    } catch (error) {
      this.logSecurityEvent('token_acquisition_failed', { resource, error: error.message });
      throw new AuthenticationError('Authentication failed');
    }
  }

  getCurrentUser(): IUserInfo {
    const user = this.context.pageContext.user;
    
    return {
      displayName: user.displayName,
      email: user.email,
      loginName: user.loginName,
      roles: this.extractUserRoles(),
      permissions: this.calculateUserPermissions()
    };
  }

  private extractUserRoles(): string[] {
    // Extract roles from SharePoint groups and Azure AD
    const spRoles = this.context.pageContext.legacyPageContext.userPermissions;
    const aadRoles = this.context.pageContext.aadInfo?.roles || [];
    
    return [...spRoles, ...aadRoles];
  }
}
```

**NestJS API Authentication**
```typescript
// JWT authentication guard for NestJS API
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logSecurityEvent('missing_auth_token', { 
        ip: request.ip, 
        userAgent: request.get('User-Agent'),
        path: request.path 
      });
      throw new UnauthorizedException('Authentication token required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        audience: this.configService.get<string>('JWT_AUDIENCE')
      });

      // Validate token claims
      this.validateTokenClaims(payload);
      
      // Attach user information to request
      request.user = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        tenant: payload.tenant
      };

      this.logSecurityEvent('successful_authentication', { 
        userId: payload.sub,
        ip: request.ip 
      });

      return true;
    } catch (error) {
      this.logSecurityEvent('authentication_failed', { 
        token: token.substring(0, 20) + '...',
        error: error.message,
        ip: request.ip 
      });
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateTokenClaims(payload: any): void {
    const requiredClaims = ['sub', 'email', 'exp', 'iat'];
    
    for (const claim of requiredClaims) {
      if (!payload[claim]) {
        throw new Error(`Missing required claim: ${claim}`);
      }
    }

    // Validate token expiration
    if (payload.exp * 1000 < Date.now()) {
      throw new Error('Token has expired');
    }

    // Validate token issuer
    const validIssuers = this.configService.get<string[]>('VALID_TOKEN_ISSUERS');
    if (!validIssuers.includes(payload.iss)) {
      throw new Error('Invalid token issuer');
    }
  }
}
```

#### Role-Based Access Control (RBAC)

**Permission Matrix Definition**
```typescript
// Permission definitions and role mappings
export enum Permission {
  // System monitoring permissions
  VIEW_UPTIME_METRICS = 'view:uptime_metrics',
  MANAGE_SYSTEM_ALERTS = 'manage:system_alerts',
  
  // SAFe metrics permissions
  VIEW_SAFE_METRICS = 'view:safe_metrics',
  EDIT_SAFE_METRICS = 'edit:safe_metrics',
  MANAGE_SAFE_CONFIGURATION = 'manage:safe_configuration',
  
  // Teams integration permissions
  SEND_TEAMS_MESSAGES = 'teams:send_messages',
  MANAGE_TEAMS_CHANNELS = 'teams:manage_channels',
  
  // Administrative permissions
  MANAGE_USERS = 'admin:manage_users',
  VIEW_AUDIT_LOGS = 'admin:view_audit_logs',
  MANAGE_SYSTEM_CONFIG = 'admin:manage_system_config'
}

export enum Role {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SYSTEM_ADMIN = 'system_admin'
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.VIEWER]: [
    Permission.VIEW_UPTIME_METRICS,
    Permission.VIEW_SAFE_METRICS
  ],
  [Role.ANALYST]: [
    Permission.VIEW_UPTIME_METRICS,
    Permission.VIEW_SAFE_METRICS,
    Permission.EDIT_SAFE_METRICS,
    Permission.SEND_TEAMS_MESSAGES
  ],
  [Role.MANAGER]: [
    Permission.VIEW_UPTIME_METRICS,
    Permission.MANAGE_SYSTEM_ALERTS,
    Permission.VIEW_SAFE_METRICS,
    Permission.EDIT_SAFE_METRICS,
    Permission.MANAGE_SAFE_CONFIGURATION,
    Permission.SEND_TEAMS_MESSAGES,
    Permission.MANAGE_TEAMS_CHANNELS
  ],
  [Role.ADMIN]: [
    ...Object.values(Permission).filter(p => !p.startsWith('admin:')),
    Permission.MANAGE_USERS,
    Permission.VIEW_AUDIT_LOGS
  ],
  [Role.SYSTEM_ADMIN]: Object.values(Permission)
};
```

**Authorization Decorator Implementation**
```typescript
// Custom authorization decorator for NestJS
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: Permission[]) => {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(JwtAuthGuard, PermissionsGuard)
  );
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      this.logSecurityEvent('authorization_failed', { 
        reason: 'missing_user_permissions',
        requiredPermissions 
      });
      return false;
    }

    const hasPermission = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      this.logSecurityEvent('authorization_failed', { 
        userId: user.sub,
        requiredPermissions,
        userPermissions: user.permissions 
      });
    }

    return hasPermission;
  }
}

// Usage example in controller
@Controller('api/safe')
export class SafeController {
  @Get('epics')
  @RequirePermissions(Permission.VIEW_SAFE_METRICS)
  async getEpics(): Promise<EpicDto[]> {
    return this.safeService.getEpics();
  }

  @Post('epics')
  @RequirePermissions(Permission.EDIT_SAFE_METRICS)
  async createEpic(@Body() createEpicDto: CreateEpicDto): Promise<EpicDto> {
    return this.safeService.createEpic(createEpicDto);
  }
}
```

### Data Protection and Encryption

#### Encryption at Rest

**Database Encryption Configuration**
```sql
-- Azure SQL Database Transparent Data Encryption (TDE)
ALTER DATABASE [uptime-platform] SET ENCRYPTION ON;

-- Always Encrypted for sensitive columns
CREATE COLUMN MASTER KEY [CMK_UptimePlatform]
WITH (
    KEY_STORE_PROVIDER_NAME = 'AZURE_KEY_VAULT',
    KEY_PATH = 'https://uptime-platform-kv.vault.azure.net/keys/CMK_UptimePlatform/version'
);

CREATE COLUMN ENCRYPTION KEY [CEK_UptimePlatform]
WITH VALUES (
    COLUMN_MASTER_KEY = [CMK_UptimePlatform],
    ALGORITHM = 'RSA_OAEP'
);

-- Encrypt sensitive data columns
ALTER TABLE [dbo].[UserData] 
ALTER COLUMN [PersonalInfo] 
ADD ENCRYPTED WITH (
    COLUMN_ENCRYPTION_KEY = [CEK_UptimePlatform],
    ENCRYPTION_TYPE = Deterministic,
    ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
);
```

**Application-Level Encryption**
```typescript
// Encryption service for sensitive data
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;
  
  constructor(private configService: ConfigService) {}

  encrypt(text: string, additionalData?: string): string {
    try {
      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key);
      
      if (additionalData) {
        cipher.setAAD(Buffer.from(additionalData, 'utf8'));
      }

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combine IV + encrypted data + auth tag
      return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');
    } catch (error) {
      this.logSecurityEvent('encryption_failed', { error: error.message });
      throw new Error('Encryption failed');
    }
  }

  decrypt(encryptedData: string, additionalData?: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const key = this.getEncryptionKey();
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const tag = Buffer.from(parts[2], 'hex');

      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAuthTag(tag);
      
      if (additionalData) {
        decipher.setAAD(Buffer.from(additionalData, 'utf8'));
      }

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logSecurityEvent('decryption_failed', { error: error.message });
      throw new Error('Decryption failed');
    }
  }

  private getEncryptionKey(): Buffer {
    const keyString = this.configService.get<string>('ENCRYPTION_KEY');
    if (!keyString) {
      throw new Error('Encryption key not configured');
    }
    
    return crypto.scryptSync(keyString, 'salt', this.keyLength);
  }
}
```

#### Secrets Management

**Azure Key Vault Integration**
```typescript
// Key Vault service for secrets management
import { Injectable } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class SecretsService {
  private secretClient: SecretClient;

  constructor() {
    const vaultUrl = process.env.AZURE_KEY_VAULT_URL;
    if (!vaultUrl) {
      throw new Error('Azure Key Vault URL not configured');
    }

    const credential = new DefaultAzureCredential();
    this.secretClient = new SecretClient(vaultUrl, credential);
  }

  async getSecret(secretName: string): Promise<string> {
    try {
      const secret = await this.secretClient.getSecret(secretName);
      
      this.logSecurityEvent('secret_accessed', { 
        secretName: this.hashSecretName(secretName),
        version: secret.properties.version 
      });

      return secret.value || '';
    } catch (error) {
      this.logSecurityEvent('secret_access_failed', { 
        secretName: this.hashSecretName(secretName),
        error: error.message 
      });
      throw new Error(`Failed to retrieve secret: ${secretName}`);
    }
  }

  async setSecret(secretName: string, secretValue: string): Promise<void> {
    try {
      await this.secretClient.setSecret(secretName, secretValue);
      
      this.logSecurityEvent('secret_updated', { 
        secretName: this.hashSecretName(secretName) 
      });
    } catch (error) {
      this.logSecurityEvent('secret_update_failed', { 
        secretName: this.hashSecretName(secretName),
        error: error.message 
      });
      throw new Error(`Failed to set secret: ${secretName}`);
    }
  }

  private hashSecretName(secretName: string): string {
    return crypto.createHash('sha256').update(secretName).digest('hex').substring(0, 8);
  }
}
```

### Input Validation and Output Encoding

#### Comprehensive Input Validation

**Angular Frontend Validation**
```typescript
// Input validation service for Angular components
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Custom validators for enterprise data
  static safeMetricValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Validate numeric range for metrics
      if (typeof value === 'number') {
        if (value < 0 || value > 100) {
          return { invalidRange: { value, min: 0, max: 100 } };
        }
      }

      // Validate string format for epic IDs
      if (typeof value === 'string') {
        const epicIdPattern = /^EPIC-\d{3,6}$/;
        if (!epicIdPattern.test(value)) {
          return { invalidFormat: { value, pattern: 'EPIC-###' } };
        }
      }

      return null;
    };
  }

  static secureTextValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value || typeof value !== 'string') {
        return null;
      }

      // Check for potential XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          return { potentialXSS: { value: value.substring(0, 50) + '...' } };
        }
      }

      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,
        /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/gi,
        /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return { potentialSQLInjection: { value: value.substring(0, 50) + '...' } };
        }
      }

      return null;
    };
  }

  sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href'],
      KEEP_CONTENT: true
    });
  }

  sanitizeFileName(fileName: string): string {
    // Remove dangerous characters from file names
    return fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
                  .replace(/^\.+/, '')
                  .substring(0, 255);
  }

  validateApiInput(input: any, schema: any): ValidationResult {
    const errors: string[] = [];

    try {
      // Validate against JSON schema
      const validator = new JSONSchema(schema);
      const result = validator.validate(input);

      if (!result.valid) {
        errors.push(...result.errors.map(e => e.message));
      }

      // Additional security validation
      if (typeof input === 'object') {
        this.validateObjectSecurity(input, errors);
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedInput: this.sanitizeObject(input)
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Validation error: ' + error.message],
        sanitizedInput: null
      };
    }
  }

  private validateObjectSecurity(obj: any, errors: string[]): void {
    const dangerousProperties = ['__proto__', 'constructor', 'prototype'];
    
    for (const prop of dangerousProperties) {
      if (obj.hasOwnProperty(prop)) {
        errors.push(`Dangerous property detected: ${prop}`);
      }
    }

    // Recursively validate nested objects
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.validateObjectSecurity(obj[key], errors);
      }
    }
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized: any = {};
    
    for (const key in obj) {
      if (key.startsWith('__') || key === 'constructor' || key === 'prototype') {
        continue; // Skip dangerous properties
      }

      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHtml(value);
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedInput: any;
}
```

**NestJS Backend Validation**
```typescript
// DTO validation with security considerations
import { IsString, IsNumber, IsEmail, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSafeEpicDto {
  @ApiProperty({ description: 'Epic identifier', pattern: '^EPIC-\\d{3,6}$' })
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  @Matches(/^EPIC-\d{3,6}$/, { message: 'Epic ID must follow pattern EPIC-### format' })
  epicId: string;

  @ApiProperty({ description: 'Epic name', maxLength: 255 })
  @IsString()
  @Length(1, 255)
  @Transform(({ value }) => DOMPurify.sanitize(value?.toString().trim()))
  name: string;

  @ApiProperty({ description: 'Completion percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  completion: number;

  @ApiProperty({ description: 'Epic status', enum: ['planning', 'in-progress', 'completed'] })
  @IsString()
  @IsIn(['planning', 'in-progress', 'completed'])
  @Transform(({ value }) => value?.toString().toLowerCase().trim())
  status: string;

  @ApiProperty({ description: 'Owner email address', required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toString().toLowerCase().trim())
  ownerEmail?: string;
}

// Global validation pipe configuration
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true,           // Transform input to DTO instance
      transformOptions: {
        enableImplicitConversion: false
      },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map(error => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints
        }));
        
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
    });
  }
}
```

### Security Headers and CORS

#### Security Headers Configuration

**HTTP Security Headers**
```typescript
// Security headers middleware for NestJS
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://graph.microsoft.com https://login.microsoftonline.com",
      "frame-ancestors 'self' https://*.sharepoint.com",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '));

    // X-Frame-Options (fallback for older browsers)
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Strict Transport Security
    if (req.secure) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Permissions Policy (Feature Policy replacement)
    res.setHeader('Permissions-Policy', [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', '));

    // Remove server information
    res.removeHeader('X-Powered-By');

    next();
  }
}
```

**CORS Configuration**
```typescript
// CORS configuration for multiple environments
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsConfiguration = (): CorsOptions => {
  const environment = process.env.NODE_ENV || 'development';
  
  const corsConfig: CorsOptions = {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'Link'
    ]
  };

  switch (environment) {
    case 'development':
      corsConfig.origin = [
        'http://localhost:4200',
        'https://localhost:4200',
        'http://localhost:3000'
      ];
      break;

    case 'staging':
      corsConfig.origin = [
        'https://company-staging.sharepoint.com',
        'https://staging.company.com'
      ];
      break;

    case 'production':
      corsConfig.origin = [
        'https://company.sharepoint.com',
        'https://app.company.com'
      ];
      break;

    default:
      corsConfig.origin = false; // Disable CORS for unknown environments
  }

  // Dynamic origin validation function
  corsConfig.origin = (origin, callback) => {
    const allowedOrigins = corsConfig.origin as string[];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log unauthorized CORS attempt
      console.warn(`CORS blocked: Unauthorized origin ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  };

  return corsConfig;
};
```

### Rate Limiting and DDoS Protection

#### API Rate Limiting

**Rate Limiting Configuration**
```typescript
// Advanced rate limiting with different tiers
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use user ID for authenticated requests, IP for anonymous
    return req.user?.sub || req.ip;
  }

  protected async getHitValue(context: ExecutionContext): Promise<number> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Different rate limits based on user role
    if (user?.roles?.includes('admin')) {
      return 1; // Admins get higher limits
    } else if (user?.roles?.includes('manager')) {
      return 2; // Managers get moderate limits
    } else {
      return 5; // Regular users get standard limits
    }
  }

  protected async getLimitValue(context: ExecutionContext): Promise<number> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Endpoint-specific rate limits
    const endpoint = request.route?.path;
    
    if (endpoint?.includes('/teams/message')) {
      return user?.roles?.includes('admin') ? 100 : 20; // Stricter limits for messaging
    }
    
    if (endpoint?.includes('/export')) {
      return user?.roles?.includes('admin') ? 50 : 5; // Very strict limits for exports
    }

    // Default rate limits by user role
    if (user?.roles?.includes('admin')) {
      return 10000; // 10,000 requests per window
    } else if (user?.roles?.includes('manager')) {
      return 5000;  // 5,000 requests per window
    } else {
      return 1000;  // 1,000 requests per window
    }
  }

  protected async getWindowSize(context: ExecutionContext): Promise<number> {
    return 3600; // 1 hour window
  }
}

// Rate limiting decorator for specific endpoints
export const RateLimit = (limit: number, window: number = 3600) => {
  return applyDecorators(
    UseGuards(CustomThrottlerGuard),
    SetMetadata('throttler', { limit, window })
  );
};

// Usage in controllers
@Controller('api/teams')
export class TeamsController {
  
  @Post('message')
  @RateLimit(20, 3600) // 20 messages per hour
  @RequirePermissions(Permission.SEND_TEAMS_MESSAGES)
  async sendMessage(@Body() messageDto: SendMessageDto): Promise<MessageResponse> {
    return this.teamsService.sendMessage(messageDto);
  }

  @Get('channels')
  @RateLimit(100, 3600) // 100 requests per hour
  @RequirePermissions(Permission.VIEW_TEAMS_CHANNELS)
  async getChannels(): Promise<ChannelDto[]> {
    return this.teamsService.getChannels();
  }
}
```

### Security Monitoring and Logging

#### Comprehensive Security Logging

**Security Event Logging Service**
```typescript
// Security event logging and monitoring
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationInsights } from 'applicationinsights';

@Injectable()
export class SecurityLogger {
  private appInsights: TelemetryClient;

  constructor(private configService: ConfigService) {
    const instrumentationKey = this.configService.get<string>('APPINSIGHTS_INSTRUMENTATIONKEY');
    
    if (instrumentationKey) {
      ApplicationInsights.setup(instrumentationKey)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .start();
        
      this.appInsights = ApplicationInsights.defaultClient;
    }
  }

  logSecurityEvent(eventType: string, details: any, severity: SecuritySeverity = SecuritySeverity.Medium): void {
    const securityEvent = {
      eventType,
      severity,
      timestamp: new Date().toISOString(),
      details: this.sanitizeLogData(details),
      source: 'uptime-platform-api',
      version: process.env.npm_package_version || 'unknown'
    };

    // Log to console (structured logging)
    console.log(JSON.stringify(securityEvent));

    // Send to Application Insights
    if (this.appInsights) {
      this.appInsights.trackEvent({
        name: `Security.${eventType}`,
        properties: securityEvent,
        measurements: { severity: severity }
      });
    }

    // Send alerts for high-severity events
    if (severity >= SecuritySeverity.High) {
      this.sendSecurityAlert(securityEvent);
    }
  }

  logAuthenticationEvent(userId: string, eventType: string, success: boolean, details?: any): void {
    this.logSecurityEvent('authentication', {
      userId: this.hashPII(userId),
      eventType,
      success,
      ...details
    }, success ? SecuritySeverity.Low : SecuritySeverity.High);
  }

  logAuthorizationEvent(userId: string, resource: string, action: string, allowed: boolean, details?: any): void {
    this.logSecurityEvent('authorization', {
      userId: this.hashPII(userId),
      resource,
      action,
      allowed,
      ...details
    }, allowed ? SecuritySeverity.Low : SecuritySeverity.Medium);
  }

  logDataAccess(userId: string, resource: string, operation: string, details?: any): void {
    this.logSecurityEvent('data_access', {
      userId: this.hashPII(userId),
      resource,
      operation,
      ...details
    }, SecuritySeverity.Low);
  }

  logSecurityViolation(violation: string, details: any): void {
    this.logSecurityEvent('security_violation', {
      violation,
      ...details
    }, SecuritySeverity.Critical);
  }

  private sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = this.maskSensitiveData(sanitized[field]);
      }
    }

    return sanitized;
  }

  private maskSensitiveData(value: string): string {
    if (!value || typeof value !== 'string') {
      return '[REDACTED]';
    }

    if (value.length <= 4) {
      return '[REDACTED]';
    }

    return value.substring(0, 4) + '*'.repeat(value.length - 4);
  }

  private hashPII(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  private async sendSecurityAlert(event: any): Promise<void> {
    // Implementation for sending security alerts
    // Could integrate with Teams, email, SMS, or security operations center
    
    const alertMessage = {
      title: `Security Alert: ${event.eventType}`,
      severity: event.severity,
      timestamp: event.timestamp,
      details: event.details,
      source: event.source
    };

    // Send to Teams channel
    try {
      await this.sendTeamsAlert(alertMessage);
    } catch (error) {
      console.error('Failed to send Teams security alert:', error);
    }

    // Send to security operations center
    try {
      await this.sendToSOC(alertMessage);
    } catch (error) {
      console.error('Failed to send SOC alert:', error);
    }
  }
}

enum SecuritySeverity {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}
```

### Compliance and Audit

#### Audit Trail Implementation

**Comprehensive Audit Logging**
```typescript
// Audit trail service for compliance tracking
@Injectable()
export class AuditService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly securityLogger: SecurityLogger
  ) {}

  async logUserAction(
    userId: string, 
    action: string, 
    resource: string, 
    oldValue?: any, 
    newValue?: any,
    metadata?: any
  ): Promise<void> {
    const auditEntry = {
      id: crypto.randomUUID(),
      userId: this.hashPII(userId),
      action,
      resource,
      oldValue: oldValue ? this.sanitizeAuditData(oldValue) : null,
      newValue: newValue ? this.sanitizeAuditData(newValue) : null,
      timestamp: new Date(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      sessionId: metadata?.sessionId,
      requestId: metadata?.requestId
    };

    // Store in audit database
    await this.databaseService.audit.create(auditEntry);

    // Log security event
    this.securityLogger.logSecurityEvent('audit_trail', {
      action,
      resource,
      hasChanges: !!(oldValue || newValue)
    });
  }

  async getAuditTrail(
    filters: AuditFilters,
    pagination: PaginationOptions
  ): Promise<AuditTrailResponse> {
    const where = this.buildAuditWhereClause(filters);
    
    const [entries, total] = await Promise.all([
      this.databaseService.audit.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: pagination.offset,
        take: pagination.limit
      }),
      this.databaseService.audit.count({ where })
    ]);

    return {
      entries: entries.map(entry => this.sanitizeAuditEntry(entry)),
      total,
      page: Math.floor(pagination.offset / pagination.limit) + 1,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  private sanitizeAuditData(data: any): any {
    // Remove sensitive information from audit logs
    const sensitiveFields = ['password', 'token', 'secret', 'privateKey'];
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }
}

// Audit decorator for automatic action logging
export const Auditable = (resource: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const request = args.find(arg => arg && arg.user);
      const userId = request?.user?.sub;
      
      let oldValue, newValue;
      
      try {
        // Execute the original method
        const result = await method.apply(this, args);
        newValue = result;
        
        // Log the audit trail
        if (userId) {
          await this.auditService.logUserAction(
            userId,
            propertyName,
            resource,
            oldValue,
            newValue,
            {
              ipAddress: request?.ip,
              userAgent: request?.get('User-Agent'),
              requestId: request?.id
            }
          );
        }
        
        return result;
      } catch (error) {
        // Log failed attempts
        if (userId) {
          await this.auditService.logUserAction(
            userId,
            `${propertyName}_failed`,
            resource,
            oldValue,
            { error: error.message },
            {
              ipAddress: request?.ip,
              userAgent: request?.get('User-Agent'),
              requestId: request?.id
            }
          );
        }
        
        throw error;
      }
    };
  };
};

// Usage in service methods
@Injectable()
export class SafeMetricsService {
  
  @Auditable('safe_epic')
  async updateEpic(epicId: string, updateData: UpdateEpicDto, user: User): Promise<Epic> {
    const existingEpic = await this.findEpic(epicId);
    const updatedEpic = await this.databaseService.epic.update({
      where: { id: epicId },
      data: updateData
    });
    
    return updatedEpic;
  }
}
```

This comprehensive security framework ensures the Enterprise Uptime Status Platform maintains the highest security standards while providing detailed audit trails and compliance capabilities for enterprise environments.
