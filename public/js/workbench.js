/**
 * SPFx Development Workbench JavaScript
 * Handles web part initialization and dashboard functionality
 */

class WorkbenchManager {
    constructor() {
        this.isInitialized = false;
        this.refreshInterval = null;
        this.errorRetryInterval = null;
        this.config = window.WorkbenchConfig || {};
        this.isLiveDataMode = false; // Track current data model state
    }

    /**
     * Initialize the development workbench
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('Development workbench loaded');
        // Skip bundle loading for now and go directly to web part initialization
        this.initializeWebPart();
        this.isInitialized = true;
    }

    /**
     * Load the webpack bundle for the web part
     */
    loadWebPartBundle() {
        const bundleScript = document.createElement('script');
        bundleScript.src = this.config.UI?.BUNDLE_PATH || '/bundle.js';
        
        bundleScript.onload = () => {
            console.log('Webpack bundle loaded successfully');
            this.initializeWebPart();
        };
        
        bundleScript.onerror = () => {
            console.error('Failed to load webpack bundle');
            this.showBundleError();
        };
        
        document.head.appendChild(bundleScript);
    }

    /**
     * Show bundle load error
     */
    showBundleError() {
        const container = document.getElementById('uptime-status-webpart');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <h3>❌ Bundle Load Error</h3>
                    <p>${this.config.UI?.ERROR_MESSAGES?.BUNDLE_LOAD || 'Could not load the webpack bundle.'}</p>
                </div>
            `;
        }
    }

    /**
     * Initialize the web part
     */
    initializeWebPart() {
        try {
            const container = document.getElementById('uptime-status-webpart');
            
            // Create a mock SPFx context for development
            const mockContext = {
                domElement: container,
                properties: { description: 'Development Mode' }
            };

            console.log('Attempting to initialize web part...');
            
            if (container) {
                this.renderWebPartContainer(container);
                this.loadDashboard();
            }
        } catch (error) {
            console.error('Error initializing web part:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Render the web part container
     */
    renderWebPartContainer(container) {
        container.innerHTML = `
            <div class="uptime-status-webpart">
                <div class="container">
                    <div id="angular-app-container">
                        <div id="angular-loading" class="loading-container">
                            <div class="loading-spinner"></div>
                            <p class="loading-text">${this.config.UI?.LOADING_TEXT || 'Loading...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const container = document.getElementById('uptime-status-webpart');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <h3>❌ Initialization Error</h3>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * Load the dashboard interface
     */
    async loadDashboard() {
        try {
            console.log('Loading dashboard interface...');
            const container = document.querySelector('#angular-app-container');
            console.log('Angular app container found:', container);
            
            if (container) {
                // Simulate loading delay
                setTimeout(() => {
                    console.log('Injecting dashboard HTML...');
                    container.innerHTML = this.getDashboardHTML();
                    this.loadData();
                    console.log('Dashboard loaded successfully, checking for toggle button...');
                    const toggleButton = document.querySelector('.teams-live-toggle');
                    console.log('Toggle button found:', toggleButton);
                }, this.config.LOADING_DELAY || 1000);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showDashboardError(error);
        }
    }

    /**
     * Get the dashboard HTML template
     */
    getDashboardHTML() {
        return `
            <div class="dashboard-content">
                <h2 class="dashboard-title">
                    <i class="material-icons-outlined">rocket_launch</i>
                    Uptime Dashboard
                </h2>
                <div class="dashboard-grid">
                    <div class="metric-card uptime">
                        <h3 class="metric-title uptime">
                            <i class="material-icons-outlined">schedule</i>
                            Server Uptime
                        </h3>
                        <p class="metric-value uptime" id="uptime-display">Loading...</p>
                        <p class="metric-label uptime">seconds online</p>
                    </div>
                    <div class="metric-card time">
                        <h3 class="metric-title time">
                            <i class="material-icons-outlined">access_time</i>
                            Current Time
                        </h3>
                        <p class="metric-value time" id="time-display">Loading...</p>
                        <p class="metric-label time">server time</p>
                    </div>
                </div>
                
                <!-- Teams Messages Section with Material Design 3 -->
                <div class="teams-messages-card">
                    <div class="teams-header">
                        <div class="teams-live-toggle mock" onclick="window.workbenchManager.toggleDataModel()">
                            <div class="toggle-indicator"></div>
                            <span class="toggle-text">Mock Data</span>
                        </div>
                        <h3 class="teams-title">
                            <span class="teams-icon">
                                <i class="material-icons-outlined">groups</i>
                            </span>
                            Teams Messages
                        </h3>
                        <p class="teams-subtitle">Recent activity from monitored channels</p>
                    </div>
                    
                    <div class="teams-content">
                        <div id="teams-loading" class="teams-loading">
                            <div class="teams-loading-spinner"></div>
                            <span>Loading Teams messages...</span>
                        </div>
                        
                        <div id="teams-messages-list" class="teams-messages-list" style="display: none;">
                            <!-- Messages will be populated here -->
                        </div>
                        
                        <div id="teams-no-messages" class="teams-no-messages" style="display: none;">
                            <div class="teams-no-messages-icon">
                                <i class="material-icons-outlined">forum</i>
                            </div>
                            <p>No messages found</p>
                            <p>Configure your Teams channels to start monitoring</p>
                        </div>
                    </div>
                    
                    <div class="teams-actions">
                        <button class="teams-btn" onclick="window.workbenchManager.refreshTeamsMessages()">
                            <i class="material-icons-outlined">refresh</i>
                            <span>Refresh Messages</span>
                        </button>
                        <button class="teams-btn secondary" onclick="window.workbenchManager.configureTeamsChannels()">
                            <i class="material-icons-outlined">settings</i>
                            <span>Configure Channels</span>
                        </button>
                    </div>
                </div>
                
                <div class="metric-card status">
                    <h3 class="metric-title status">
                        <i class="material-icons-outlined">analytics</i>
                        System Status
                    </h3>
                    <div class="status-indicator">
                        <div class="status-dot"></div>
                        <span class="status-text">All systems operational</span>
                    </div>
                    <div class="api-status">
                        API endpoints: <span id="api-status">Checking...</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show dashboard error
     */
    showDashboardError(error) {
        const container = document.querySelector('#angular-app-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <h3>❌ Error Loading Dashboard</h3>
                    <p>Please check the console for details.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * Load data from API endpoints
     */
    async loadData() {
        try {
            this.updateApiStatus('✅ Connected', '#4caf50');
            
            // Load data in parallel
            const [uptimeData, timeData] = await Promise.all([
                this.fetchUptime(),
                this.fetchTime()
            ]);
            
            this.updateUptimeDisplay(uptimeData.uptime);
            this.updateTimeDisplay(timeData.time);
            
            // Load Teams messages
            this.loadTeamsMessages();
            
            // Schedule next refresh
            this.scheduleRefresh();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.handleDataError();
        }
    }

    /**
     * Fetch uptime data
     */
    async fetchUptime() {
        const response = await fetch('/api/uptime');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    /**
     * Fetch time data
     */
    async fetchTime() {
        const response = await fetch('/api/time');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    /**
     * Update API status display
     */
    updateApiStatus(text, color) {
        const element = document.querySelector('#api-status');
        if (element) {
            element.textContent = text;
            element.style.color = color;
        }
    }

    /**
     * Update uptime display
     */
    updateUptimeDisplay(uptime) {
        const element = document.querySelector('#uptime-display');
        if (element) {
            element.textContent = uptime.toString();
        }
    }

    /**
     * Update time display
     */
    updateTimeDisplay(time) {
        const element = document.querySelector('#time-display');
        if (element) {
            const date = new Date(time);
            element.textContent = date.toLocaleString();
        }
    }

    /**
     * Handle data loading errors
     */
    handleDataError() {
        this.updateApiStatus('❌ Connection failed', '#f44336');
        
        const uptimeElement = document.querySelector('#uptime-display');
        const timeElement = document.querySelector('#time-display');
        
        if (uptimeElement) uptimeElement.textContent = 'Error';
        if (timeElement) timeElement.textContent = 'Error loading data';

        // Retry after 10 seconds on error
        this.scheduleErrorRetry();
    }

    /**
     * Schedule regular data refresh
     */
    scheduleRefresh() {
        // Clear any existing intervals
        this.clearIntervals();
        
        // Auto-refresh every 30 seconds
        this.refreshInterval = setTimeout(() => {
            this.loadData();
        }, 30000);
    }

    /**
     * Schedule error retry
     */
    scheduleErrorRetry() {
        // Clear any existing intervals
        this.clearIntervals();
        
        // Retry after 10 seconds on error
        this.errorRetryInterval = setTimeout(() => {
            this.loadData();
        }, 10000);
    }

    /**
     * Clear all intervals
     */
    clearIntervals() {
        if (this.refreshInterval) {
            clearTimeout(this.refreshInterval);
            this.refreshInterval = null;
        }
        if (this.errorRetryInterval) {
            clearTimeout(this.errorRetryInterval);
            this.errorRetryInterval = null;
        }
    }

    /**
     * Load Teams Messages (Mock Data)
     */
    loadTeamsMessages() {
        const loadingElement = document.querySelector('#teams-loading');
        const messagesContainer = document.querySelector('#teams-messages-list');
        const noMessagesElement = document.querySelector('#teams-no-messages');
        
        if (loadingElement) loadingElement.style.display = 'flex';
        if (messagesContainer) messagesContainer.style.display = 'none';
        if (noMessagesElement) noMessagesElement.style.display = 'none';
        
        // Simulate API delay (longer for live data to simulate real API calls)
        const delay = this.isLiveDataMode ? 2500 : 1500;
        
        setTimeout(() => {
            if (this.isLiveDataMode) {
                this.displayLiveTeamsMessages();
            } else {
                this.displayMockTeamsMessages();
            }
            if (loadingElement) loadingElement.style.display = 'none';
            if (messagesContainer) messagesContainer.style.display = 'flex';
        }, delay);
    }

    /**
     * Display Teams Messages with Mock Data
     */
    displayMockTeamsMessages() {
        const mockMessages = [
            {
                id: '1',
                author: 'John Smith',
                avatar: 'JS',
                time: '5 min ago',
                content: 'Server maintenance completed successfully. All systems are back online and performing optimally. 🚀',
                channel: 'IT Support',
                priority: 'high'
            },
            {
                id: '2', 
                author: 'Sarah Johnson',
                avatar: 'SJ',
                time: '15 min ago',
                content: 'Monitoring dashboard looks absolutely amazing! 👍 The uptime metrics and real-time data are incredibly helpful for our team.',
                channel: 'DevOps',
                priority: 'normal'
            },
            {
                id: '3',
                author: 'DevOps Bot',
                avatar: '🤖',
                time: '30 min ago', 
                content: '⚠️ ALERT: CPU usage spike detected on production server PRD-WEB-01. Auto-scaling triggered. Investigating root cause...',
                channel: 'Critical Alerts',
                priority: 'urgent'
            },
            {
                id: '4',
                author: 'Backup Service',
                avatar: '💾',
                time: '1 hour ago',
                content: '✅ Daily backup completed successfully. All data secured and verified. Next backup scheduled for 02:00 AM.',
                channel: 'System Notifications',
                priority: 'normal'
            },
            {
                id: '5',
                author: 'Security Scanner',
                avatar: '🔒',
                time: '2 hours ago',
                content: 'Weekly security scan completed. No vulnerabilities detected. All systems are secure and up to date.',
                channel: 'Security',
                priority: 'high'
            }
        ];

        const messagesContainer = document.querySelector('#teams-messages-list');
        if (messagesContainer) {
            messagesContainer.innerHTML = mockMessages.map(message => `
                <div class="teams-message priority-${message.priority}">
                    <div class="teams-message-header">
                        <div class="teams-message-author">
                            <div class="teams-author-avatar">${message.avatar}</div>
                            <div class="teams-author-name">${message.author}</div>
                        </div>
                        <div class="teams-message-time">
                            <i class="material-icons-outlined teams-time-icon">schedule</i>
                            <span>${message.time}</span>
                        </div>
                    </div>
                    <div class="teams-message-content">${message.content}</div>
                    <div class="teams-message-actions">
                        <button class="teams-action-btn" onclick="window.workbenchManager.openInTeams('${message.id}')">
                            <i class="material-icons-outlined">open_in_new</i>
                            <span>View in Teams</span>
                        </button>
                        <button class="teams-action-btn" onclick="window.workbenchManager.replyToMessage('${message.id}')">
                            <i class="material-icons-outlined">reply</i>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    /**
     * Display Teams Messages with Live Data (Simulated)
     */
    displayLiveTeamsMessages() {
        const liveMessages = [
            {
                id: 'live_1',
                author: 'Microsoft Graph API',
                avatar: '📊',
                time: 'Just now',
                content: '🔴 LIVE DATA: Real Teams messages would appear here. This demonstrates live Microsoft Graph API integration for actual Teams channels.',
                channel: 'Live Channel - IT Support',
                priority: 'high',
                isLive: true
            },
            {
                id: 'live_2',
                author: 'Sarah Williams (Live)',
                avatar: 'SW',
                time: '2 min ago',
                content: '✅ LIVE: Production deployment successful! All microservices are running smoothly. Real-time monitoring shows optimal performance.',
                channel: 'Live Channel - DevOps',
                priority: 'high',
                isLive: true
            },
            {
                id: 'live_3',
                author: 'Teams Integration Bot',
                avatar: '🤖',
                time: '5 min ago',
                content: '⚡ LIVE DATA: Connected to Microsoft Graph API. Monitoring 12 Teams channels across 3 organizations. Real-time updates enabled.',
                channel: 'Live Channel - System Status',
                priority: 'normal',
                isLive: true
            },
            {
                id: 'live_4',
                author: 'Alex Chen (Live)',
                avatar: 'AC',
                time: '8 min ago',
                content: '🔥 LIVE: Critical alert resolved! Database performance is back to normal. Thanks to the team for the quick response.',
                channel: 'Live Channel - Critical Alerts',
                priority: 'critical',
                isLive: true
            }
        ];

        const messagesContainer = document.querySelector('#teams-messages-list');
        if (messagesContainer) {
            messagesContainer.innerHTML = liveMessages.map(message => `
                <div class="teams-message priority-${message.priority} ${message.isLive ? 'live-message' : ''}">
                    <div class="teams-message-header">
                        <div class="teams-message-author">
                            <div class="teams-author-avatar ${message.isLive ? 'live-avatar' : ''}">${message.avatar}</div>
                            <div class="teams-author-name">
                                ${message.author}
                                ${message.isLive ? '<span class="live-badge"><i class="material-icons-outlined">radio_button_checked</i> LIVE</span>' : ''}
                            </div>
                        </div>
                        <div class="teams-message-time">
                            <i class="material-icons-outlined teams-time-icon">schedule</i>
                            <span>${message.time}</span>
                        </div>
                    </div>
                    <div class="teams-message-content">${message.content}</div>
                    <div class="teams-message-actions">
                        <button class="teams-action-btn" onclick="window.workbenchManager.openInTeams('${message.id}')">
                            <i class="material-icons-outlined">open_in_new</i>
                            <span>View in Teams</span>
                        </button>
                        <button class="teams-action-btn" onclick="window.workbenchManager.replyToMessage('${message.id}')">
                            <i class="material-icons-outlined">reply</i>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    /**
     * Refresh Teams Messages
     */
    refreshTeamsMessages() {
        console.log('Refreshing Teams messages...');
        this.loadTeamsMessages();
    }

    /**
     * Configure Teams Channels
     */
    configureTeamsChannels() {
        alert('🔧 Channel Configuration\n\nThis will open a dialog to configure which Teams channels to monitor:\n\n• IT Support - General\n• DevOps - Alerts\n• System - Notifications\n\nComing soon with Microsoft Graph integration!');
    }

    /**
     * Open message in Teams
     */
    openInTeams(messageId) {
        console.log('Opening message in Teams:', messageId);
        alert(`🔗 Opening message ${messageId} in Microsoft Teams\n\nThis would normally open the Teams client to the specific message thread.`);
    }

    /**
     * Reply to a Teams message
     */
    replyToMessage(messageId) {
        console.log('Replying to message:', messageId);
        const replyText = prompt('💬 Reply to this message:\n\nEnter your reply:');
        if (replyText && replyText.trim()) {
            alert(`✅ Reply sent!\n\n"${replyText}"\n\nIn a real implementation, this would post to the Teams channel via Microsoft Graph API.`);
        }
    }

    /**
     * Toggle between mock and live data models
     */
    toggleDataModel() {
        console.log('Toggle button clicked! Current state:', this.isLiveDataMode);
        this.isLiveDataMode = !this.isLiveDataMode;
        
        // Update the toggle button appearance
        const toggleButton = document.querySelector('.teams-live-toggle');
        console.log('Toggle button element found:', toggleButton);
        
        if (toggleButton) {
            if (this.isLiveDataMode) {
                toggleButton.className = 'teams-live-toggle live';
                toggleButton.innerHTML = `
                    <div class="toggle-indicator"></div>
                    <span class="toggle-text">Live Data</span>
                `;
            } else {
                toggleButton.className = 'teams-live-toggle mock';
                toggleButton.innerHTML = `
                    <div class="toggle-indicator"></div>
                    <span class="toggle-text">Mock Data</span>
                `;
            }
        }
        
        // Show notification about data model change
        const dataType = this.isLiveDataMode ? 'Live Microsoft Teams' : 'Mock/Demo';
        alert(`🔄 Data Model Changed!\n\nNow using: ${dataType} data\n\n${this.isLiveDataMode ? 
            '⚡ Live data would connect to Microsoft Graph API\n• Real Teams messages\n• Live channel activity\n• Actual user interactions' : 
            '🎭 Mock data provides:\n• Sample Teams messages\n• Demo channel activity\n• Simulated interactions'}`);
        
        // Refresh the Teams messages with the new data model
        this.refreshTeamsMessages();
        
        console.log(`Data model toggled to: ${this.isLiveDataMode ? 'Live' : 'Mock'}`);
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.clearIntervals();
        this.isInitialized = false;
    }
}

// Initialize the workbench when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const workbench = new WorkbenchManager();
    workbench.init();
    
    // Store reference for potential cleanup
    window.workbenchManager = workbench;
});
