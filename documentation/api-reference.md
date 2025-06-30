<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-API%20REFERENCE-blue?style=for-the-badge&labelColor=red&color=blue" alt="API REFERENCE" />
</div>

# 📡 <span style="color:#DC143C">API</span> <span style="color:#FFFFFF">Reference</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

This document details the **<span style="color:#FF6B35">RESTful API endpoints</span>**, <span style="color:#32CD32">**request/response formats**</span>, and <span style="color:#1E90FF">**authentication**</span> for the <span style="color:#FFD700">**Enterprise Uptime Status Platform**</span>.

## 🎨 <span style="color:#FF1493">Patriotic API Design</span>

- 🔐 <span style="color:#DC143C">**All endpoints secured with OAuth2 (Azure AD)**</span>
- 📝 <span style="color:#32CD32">**JSON responses, clear error codes**</span>
- 🎨 <span style="color:#0000FF">**Red, white, and blue status badges in UI**</span>

# API Reference Documentation

## Overview

This comprehensive API reference documents all endpoints, request/response formats, authentication methods, and integration patterns for the NestJS backend services that power the SharePoint Framework + Angular enterprise platform.

## Base Configuration

### API Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com` (configured per deployment)

### Content Types
- **Request**: `application/json`
- **Response**: `application/json`
- **Error Response**: `application/json`

### Authentication
The API leverages SharePoint Framework authentication context and supports:
- **SharePoint Context Authentication**: Automatic via SPFx web part
- **Azure AD Bearer Tokens**: For external integrations
- **API Key Authentication**: For service-to-service communication

## Core System APIs

### System Health & Monitoring

#### GET /api/health
Returns comprehensive system health status including all service dependencies.

**Request:**
```http
GET /api/health
Accept: application/json
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "uptime": 86400,
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 12,
      "lastCheck": "2024-01-15T14:29:50.000Z"
    },
    "sharepoint": {
      "status": "healthy",
      "responseTime": 45,
      "lastCheck": "2024-01-15T14:29:50.000Z"
    },
    "teams": {
      "status": "healthy", 
      "responseTime": 23,
      "lastCheck": "2024-01-15T14:29:50.000Z"
    }
  },
  "metrics": {
    "memoryUsage": {
      "used": 234567890,
      "free": 1024000000,
      "percentage": 23.4
    },
    "cpuUsage": 15.7,
    "activeConnections": 12
  }
}
```

**Status Codes:**
- `200 OK`: System is healthy
- `503 Service Unavailable`: One or more critical services are down

#### GET /api/uptime
Returns detailed server uptime information with historical data.

**Request:**
```http
GET /api/uptime
Accept: application/json
```

**Response:**
```json
{
  "uptime": "15 days, 8 hours, 42 minutes",
  "uptimeSeconds": 1337720,
  "startTime": "2024-01-01T00:00:00.000Z",
  "availability": 99.97,
  "lastRestart": "2024-01-01T00:00:00.000Z",
  "restartReason": "planned_maintenance",
  "statistics": {
    "totalUptime": 1337720,
    "totalDowntime": 401,
    "averageSessionLength": 334430,
    "longestUptime": 2592000,
    "restartCount": 4
  },
  "sla": {
    "target": 99.9,
    "current": 99.97,
    "monthToDate": 99.95,
    "yearToDate": 99.92
  }
}
```

#### GET /api/time
Returns current server time with timezone and formatting options.

**Request:**
```http
GET /api/time
Accept: application/json
```

**Query Parameters:**
- `timezone` (optional): Target timezone (default: UTC)
- `format` (optional): Date format (iso, epoch, custom)

**Response:**
```json
{
  "currentTime": "2024-01-15T14:30:00.000Z",
  "timezone": "UTC",
  "formatted": "1/15/2024, 2:30:00 PM",
  "epoch": 1705329000,
  "iso": "2024-01-15T14:30:00.000Z",
  "relative": "now",
  "timezones": {
    "utc": "2024-01-15T14:30:00.000Z",
    "local": "2024-01-15T09:30:00.000Z",
    "eastern": "2024-01-15T09:30:00.000Z",
    "pacific": "2024-01-15T06:30:00.000Z"
  }
}
```

### Performance Metrics

#### GET /api/metrics
Returns comprehensive system performance metrics.

**Request:**
```http
GET /api/metrics
Accept: application/json
```

**Query Parameters:**
- `timeframe` (optional): 1h, 24h, 7d, 30d (default: 1h)
- `granularity` (optional): minute, hour, day (default: minute)

**Response:**
```json
{
  "timeframe": "24h",
  "granularity": "hour",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "performance": {
    "cpu": {
      "current": 15.7,
      "average": 12.3,
      "peak": 45.2,
      "trend": "stable",
      "history": [
        {"timestamp": "2024-01-15T13:00:00.000Z", "value": 12.1},
        {"timestamp": "2024-01-15T14:00:00.000Z", "value": 15.7}
      ]
    },
    "memory": {
      "used": 4294967296,
      "available": 8589934592,
      "percentage": 50.0,
      "trend": "increasing",
      "history": [
        {"timestamp": "2024-01-15T13:00:00.000Z", "value": 48.2},
        {"timestamp": "2024-01-15T14:00:00.000Z", "value": 50.0}
      ]
    },
    "network": {
      "bytesIn": 1073741824,
      "bytesOut": 536870912,
      "packetsIn": 1000000,
      "packetsOut": 750000,
      "errors": 0,
      "bandwidth": {
        "inbound": 1048576,
        "outbound": 524288
      }
    },
    "storage": {
      "diskUsage": 73.5,
      "freeSpace": 21474836480,
      "totalSpace": 85899345920,
      "iops": {
        "read": 1500,
        "write": 800
      }
    }
  },
  "application": {
    "requests": {
      "total": 50000,
      "successful": 49750,
      "failed": 250,
      "averageResponseTime": 145,
      "p95ResponseTime": 450,
      "p99ResponseTime": 1200
    },
    "errors": {
      "total": 25,
      "rate": 0.05,
      "types": {
        "4xx": 20,
        "5xx": 5
      }
    }
  }
}
```

## SAFe Metrics APIs

### Epic Management

#### GET /api/safe/epics
Returns comprehensive epic tracking data with progress metrics.

**Request:**
```http
GET /api/safe/epics
Accept: application/json
```

**Query Parameters:**
- `status` (optional): planned, active, completed, cancelled
- `program` (optional): Filter by program increment
- `portfolio` (optional): Filter by portfolio theme

**Response:**
```json
{
  "epics": [
    {
      "id": "EPIC-001",
      "name": "Digital Transformation Initiative",
      "description": "Comprehensive digital transformation across enterprise systems",
      "status": "active",
      "completion": 78.5,
      "priority": "high",
      "owner": "john.doe@company.com",
      "program": "Q1-2024",
      "portfolio": "digital-transformation",
      "budget": {
        "allocated": 2000000,
        "spent": 1200000,
        "remaining": 800000,
        "burnRate": 150000
      },
      "timeline": {
        "startDate": "2024-01-01T00:00:00.000Z",
        "plannedEndDate": "2024-06-30T00:00:00.000Z",
        "estimatedEndDate": "2024-07-15T00:00:00.000Z",
        "actualEndDate": null
      },
      "features": {
        "total": 24,
        "completed": 18,
        "inProgress": 4,
        "planned": 2,
        "completion": 75.0
      },
      "dependencies": [
        {
          "id": "DEP-001",
          "type": "external",
          "description": "Third-party integration API",
          "status": "resolved",
          "risk": "low"
        }
      ],
      "risks": [
        {
          "id": "RISK-001",
          "severity": "medium",
          "description": "Resource availability constraints",
          "mitigation": "Cross-training team members",
          "status": "monitoring"
        }
      ],
      "metrics": {
        "velocity": 12.5,
        "quality": 94.2,
        "teamSatisfaction": 8.1,
        "customerSatisfaction": 8.7
      }
    }
  ],
  "summary": {
    "totalEpics": 8,
    "activeEpics": 5,
    "completedEpics": 2,
    "plannedEpics": 1,
    "averageCompletion": 62.3,
    "totalBudget": 10000000,
    "spentBudget": 6200000,
    "onTrackEpics": 6,
    "atRiskEpics": 2,
    "blockedEpics": 0
  },
  "trends": {
    "velocityTrend": "increasing",
    "budgetTrend": "on_track",
    "qualityTrend": "stable",
    "riskTrend": "decreasing"
  }
}
```

#### POST /api/safe/epics
Creates a new epic with specified parameters.

**Request:**
```http
POST /api/safe/epics
Content-Type: application/json

{
  "name": "Customer Experience Enhancement",
  "description": "Improve customer experience across all touchpoints",
  "priority": "high",
  "owner": "jane.smith@company.com",
  "program": "Q2-2024",
  "portfolio": "customer-experience",
  "budget": 1500000,
  "plannedStartDate": "2024-04-01T00:00:00.000Z",
  "plannedEndDate": "2024-09-30T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "EPIC-009",
  "status": "created",
  "message": "Epic created successfully",
  "epic": {
    "id": "EPIC-009",
    "name": "Customer Experience Enhancement",
    "status": "planned",
    "completion": 0,
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### Feature Velocity Tracking

#### GET /api/safe/features
Returns feature delivery metrics and velocity analysis.

**Request:**
```http
GET /api/safe/features
Accept: application/json
```

**Query Parameters:**
- `program` (optional): Filter by program increment
- `team` (optional): Filter by specific team
- `timeframe` (optional): last_pi, current_pi, next_pi, all

**Response:**
```json
{
  "features": [
    {
      "id": "FEAT-001",
      "name": "User Authentication Enhancement",
      "description": "Multi-factor authentication implementation",
      "epic": "EPIC-001",
      "status": "completed",
      "completion": 100,
      "team": "Platform Team",
      "program": "PI-2024-Q1",
      "storyPoints": 34,
      "businessValue": 8,
      "effort": 21,
      "timeline": {
        "plannedStart": "2024-01-15T00:00:00.000Z",
        "actualStart": "2024-01-16T00:00:00.000Z",
        "plannedEnd": "2024-02-15T00:00:00.000Z",
        "actualEnd": "2024-02-12T00:00:00.000Z"
      },
      "acceptance": {
        "criteriaTotal": 8,
        "criteriaMet": 8,
        "testsPassed": 45,
        "testsTotal": 45
      },
      "metrics": {
        "velocity": 2.3,
        "cycleTime": 18,
        "leadTime": 25,
        "defectRate": 0.02
      }
    }
  ],
  "velocity": {
    "currentPI": {
      "planned": 280,
      "delivered": 265,
      "variance": -15,
      "percentage": 94.6
    },
    "previousPI": {
      "planned": 260,
      "delivered": 245,
      "variance": -15,
      "percentage": 94.2
    },
    "trend": "stable",
    "predictability": 92.4,
    "historicalAverage": 251.3
  },
  "quality": {
    "defectDensity": 0.12,
    "testCoverage": 87.5,
    "codeQuality": 8.4,
    "customerSatisfaction": 8.9,
    "technicalDebt": "medium"
  },
  "teams": [
    {
      "name": "Platform Team",
      "velocity": 45,
      "capacity": 48,
      "utilization": 93.8,
      "satisfaction": 8.2
    }
  ]
}
```

### Dependency Management

#### GET /api/safe/dependencies
Returns comprehensive dependency tracking and management data.

**Request:**
```http
GET /api/safe/dependencies
Accept: application/json
```

**Query Parameters:**
- `status` (optional): pending, in_progress, resolved, blocked
- `type` (optional): internal, external, technical, compliance
- `critical` (optional): true, false

**Response:**
```json
{
  "dependencies": [
    {
      "id": "DEP-001",
      "title": "External API Integration",
      "description": "Integration with third-party payment processing API",
      "type": "external",
      "status": "in_progress",
      "critical": true,
      "priority": "high",
      "source": {
        "epic": "EPIC-001",
        "feature": "FEAT-003",
        "team": "Payment Team"
      },
      "target": {
        "provider": "External Vendor",
        "contact": "vendor@external.com",
        "system": "Payment Gateway API"
      },
      "timeline": {
        "identified": "2024-01-01T00:00:00.000Z",
        "targetResolution": "2024-02-15T00:00:00.000Z",
        "actualResolution": null,
        "daysOpen": 45
      },
      "impact": {
        "affectedFeatures": 3,
        "affectedTeams": 2,
        "riskLevel": "high",
        "businessImpact": "revenue_generation"
      },
      "resolution": {
        "plan": "Coordinate with vendor for API access",
        "owner": "john.doe@company.com",
        "progress": 60,
        "nextSteps": ["Complete API documentation review", "Schedule integration testing"],
        "blockers": []
      }
    }
  ],
  "summary": {
    "total": 45,
    "byStatus": {
      "pending": 12,
      "in_progress": 18,
      "resolved": 14,
      "blocked": 1
    },
    "byType": {
      "internal": 25,
      "external": 12,
      "technical": 6,
      "compliance": 2
    },
    "critical": 8,
    "overdue": 3,
    "resolutionRate": 85.7,
    "averageResolutionTime": 12.5
  },
  "metrics": {
    "dependencyVelocity": 3.2,
    "blockageRate": 2.2,
    "escalationRate": 8.9,
    "riskScore": 6.7
  }
}
```

### Release Train Health

#### GET /api/safe/trains
Returns Agile Release Train health metrics and performance indicators.

**Request:**
```http
GET /api/safe/trains
Accept: application/json
```

**Response:**
```json
{
  "trains": [
    {
      "id": "ART-001",
      "name": "Digital Platform ART",
      "status": "healthy",
      "healthScore": 87.5,
      "program": "PI-2024-Q1",
      "teams": 8,
      "members": 95,
      "metrics": {
        "teamAlignment": 92.3,
        "technicalHealth": 85.7,
        "businessValue": 89.2,
        "timeToMarket": 78.9,
        "quality": 91.4,
        "predictability": 88.6
      },
      "performance": {
        "velocity": {
          "current": 425,
          "planned": 450,
          "achievement": 94.4,
          "trend": "stable"
        },
        "quality": {
          "defectRate": 0.08,
          "testCoverage": 89.2,
          "codeQuality": 8.6,
          "customerSatisfaction": 8.9
        },
        "delivery": {
          "onTimeDelivery": 92.3,
          "scopeStability": 87.1,
          "commitmentReliability": 94.7
        }
      },
      "risks": [
        {
          "category": "capacity",
          "level": "medium",
          "description": "Team capacity constraints in sprint 3",
          "mitigation": "Cross-training and resource reallocation"
        }
      ],
      "innovations": [
        {
          "title": "Automated Testing Framework",
          "impact": "30% reduction in testing time",
          "status": "implemented"
        }
      ]
    }
  ],
  "portfolio": {
    "totalTrains": 3,
    "averageHealthScore": 84.2,
    "totalTeams": 22,
    "totalMembers": 267,
    "overallVelocity": 1250,
    "portfolioAlignment": 91.5
  }
}
```

## Microsoft Teams Integration APIs

### Teams Messaging

#### POST /api/teams/message
Sends a message to specified Microsoft Teams channel.

**Request:**
```http
POST /api/teams/message
Content-Type: application/json
Authorization: Bearer <token>

{
  "channelId": "19:abc123def456@thread.tacv2",
  "message": "System alert: High CPU usage detected on production servers",
  "messageType": "alert",
  "priority": "high",
  "mentions": [
    {
      "id": "user123",
      "displayName": "John Doe"
    }
  ],
  "attachments": [
    {
      "type": "adaptive_card",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.3",
        "body": [
          {
            "type": "TextBlock",
            "text": "System Performance Alert",
            "weight": "Bolder",
            "size": "Medium"
          }
        ]
      }
    }
  ]
}
```

**Response:**
```json
{
  "id": "msg_abc123",
  "status": "sent",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "channelId": "19:abc123def456@thread.tacv2",
  "messageId": "1705329000000",
  "deliveryStatus": "delivered",
  "readReceipts": {
    "total": 8,
    "read": 3,
    "unread": 5
  }
}
```

#### GET /api/teams/channels
Returns available Teams channels for messaging.

**Request:**
```http
GET /api/teams/channels
Accept: application/json
Authorization: Bearer <token>
```

**Response:**
```json
{
  "channels": [
    {
      "id": "19:abc123def456@thread.tacv2",
      "displayName": "Platform Alerts",
      "description": "Automated system alerts and notifications",
      "membershipType": "standard",
      "members": 25,
      "isActive": true,
      "permissions": {
        "canSendMessages": true,
        "canMentionUsers": true,
        "canUploadFiles": false
      }
    },
    {
      "id": "19:def456ghi789@thread.tacv2", 
      "displayName": "SAFe Metrics",
      "description": "Agile metrics and progress updates",
      "membershipType": "private",
      "members": 12,
      "isActive": true,
      "permissions": {
        "canSendMessages": true,
        "canMentionUsers": true,
        "canUploadFiles": true
      }
    }
  ],
  "total": 15,
  "accessible": 8,
  "permissions": {
    "canCreateChannels": false,
    "canManageChannels": false,
    "canDeleteMessages": false
  }
}
```

## Error Handling

### Error Response Format
All API endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested epic was not found",
    "details": "Epic with ID 'EPIC-999' does not exist in the system",
    "timestamp": "2024-01-15T14:30:00.000Z",
    "path": "/api/safe/epics/EPIC-999",
    "requestId": "req_abc123def456",
    "support": {
      "documentation": "https://docs.example.com/api/errors",
      "contact": "support@example.com"
    }
  }
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side errors |
| 503 | Service Unavailable | Temporary service issues |

### Common Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `INVALID_AUTHENTICATION` | Invalid or missing authentication token | Verify SharePoint context or provide valid bearer token |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions | Contact administrator for permission assignment |
| `RESOURCE_NOT_FOUND` | Requested resource does not exist | Verify resource ID and ensure it exists |
| `VALIDATION_ERROR` | Request data validation failed | Check request format and required fields |
| `RATE_LIMIT_EXCEEDED` | Too many requests in time window | Implement exponential backoff retry logic |
| `SERVICE_UNAVAILABLE` | External service temporarily unavailable | Retry request after specified time |
| `DEPENDENCY_FAILURE` | Required dependency service failed | Check service status and dependencies |

## Rate Limiting

### Rate Limit Headers
All responses include rate limiting information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705329060
X-RateLimit-Window: 3600
```

### Rate Limits by Endpoint Category

| Category | Requests per Hour | Burst Limit |
|----------|-------------------|-------------|
| System Health | 3600 | 60 |
| SAFe Metrics | 1000 | 30 |
| Teams Integration | 500 | 10 |
| Administrative | 100 | 5 |

## SDK and Client Libraries

### JavaScript/TypeScript Client
```typescript
import { SafeApiClient } from '@company/safe-api-client';

const client = new SafeApiClient({
  baseUrl: 'http://localhost:3000',
  authentication: {
    type: 'sharepoint',
    context: this.context
  }
});

// Get epic data
const epics = await client.safe.getEpics({
  status: 'active',
  program: 'Q1-2024'
});

// Send Teams message
await client.teams.sendMessage({
  channelId: 'channel-id',
  message: 'Deployment completed successfully',
  priority: 'normal'
});
```

### PowerShell Module
```powershell
Install-Module SafeApiPowerShell

# Connect to API
Connect-SafeApi -BaseUrl "http://localhost:3000" -AuthType SharePoint

# Get system health
$health = Get-SafeSystemHealth

# Get epic progress
$epics = Get-SafeEpics -Status Active -Program "Q1-2024"
```

## 🚀 <span style="color:#9932CC">API Endpoints Arsenal</span>

| <span style="color:#DC143C">**Endpoint**</span> | <span style="color:#0000FF">**Method**</span> | <span style="color:#32CD32">**Description**</span> |
|------------------|--------|-------------|
| 📊 `/api/uptime` | <span style="color:#FF4500">GET</span> | Get server uptime status |
| ⏰ `/api/time` | <span style="color:#FF4500">GET</span> | Get current server time |
| 📈 `/api/metrics` | <span style="color:#FF4500">GET</span> | Get SAFe metrics dashboard data |
| 👥 `/api/teams` | <span style="color:#FF4500">GET</span> | List Teams channels |

## 🌟 <span style="color:#FF6B35">Example Request - Battle Ready!</span>

```http
GET /api/uptime HTTP/1.1
Authorization: Bearer <token>
Host: your-patriotic-api.com
```

**🎯 <span style="color:#1E90FF">Response (JSON Victory!):</span>**
```json
{
  "uptime": 999999,
  "status": "🇺🇸 FREEDOM OPERATIONAL 🇺🇸",
  "message": "All systems GO ARMY!"
}
```

This API reference provides comprehensive documentation for integrating with the platform's backend services, enabling developers to build custom applications and integrations that leverage the full capabilities of the enterprise SAFe metrics and monitoring platform.
