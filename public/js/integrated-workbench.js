/**
 * Integrated Workbench - SharePoint and Angular Integration
 * This handles the initialization of the integrated development environment.
 */

(function() {
  // Store state
  const state = {
    initialized: false,
    angularStatus: 'pending', // pending, loading, success, error
    apiStatus: 'checking',    // checking, connected, error
    config: window.WorkbenchConfig || {}
  };

  /**
   * Initialize the integrated workbench
   */
  function init() {
    if (state.initialized) return;
    console.log('🔧 Initializing integrated workbench...');
    
    // Set up global integration handler
    window.angularIntegration = {
      ready: handleAngularReady,
      error: handleAngularError
    };
    
    // Set up SPFx integration callback
    window.spfxReady = handleSPFxReady;
    
    // Update status indicators
    updateStatusIndicators();
    
    // Check API status
    checkApiStatus();
    
    state.initialized = true;
    console.log('✅ Integrated workbench initialized');
  }

  /**
   * Handle SPFx Web Part Ready event
   */
  function handleSPFxReady() {
    console.log('✅ SPFx Web Part is ready');
    document.getElementById('angular-status').textContent = 'SPFx Ready, waiting for Angular...';
    
    // Find the container where Angular should be injected
    const angularContainer = document.querySelector('.angular-container');
    if (angularContainer) {
      angularContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>Angular integration area is ready for content</p>
          <p style="font-size: 12px; color: #999;">Angular components will be moved here when ready</p>
        </div>
      `;
    }
  }

  /**
   * Handle Angular Ready event
   */
  function handleAngularReady() {
    console.log('✅ Angular application is ready');
    state.angularStatus = 'success';
    updateStatusIndicators();
    
    // Add special class to body to indicate both systems are ready
    document.body.classList.add('integration-ready');
  }

  /**
   * Handle Angular Error event
   */
  function handleAngularError(error) {
    console.error('❌ Angular application error:', error);
    state.angularStatus = 'error';
    updateStatusIndicators();
  }

  /**
   * Update status indicators in the UI
   */
  function updateStatusIndicators() {
    const angularStatusElement = document.getElementById('angular-status');
    if (angularStatusElement) {
      switch (state.angularStatus) {
        case 'pending':
          angularStatusElement.textContent = 'Waiting...';
          angularStatusElement.style.color = '#ff9800';
          break;
        case 'loading':
          angularStatusElement.textContent = 'Loading...';
          angularStatusElement.style.color = '#2196f3';
          break;
        case 'success':
          angularStatusElement.textContent = 'Connected ✓';
          angularStatusElement.style.color = '#4caf50';
          break;
        case 'error':
          angularStatusElement.textContent = 'Error ✗';
          angularStatusElement.style.color = '#f44336';
          break;
      }
    }
    
    const apiStatusElement = document.getElementById('api-status');
    if (apiStatusElement) {
      switch (state.apiStatus) {
        case 'checking':
          apiStatusElement.textContent = 'Checking...';
          apiStatusElement.style.color = '#ff9800';
          break;
        case 'connected':
          apiStatusElement.textContent = 'Connected ✓';
          apiStatusElement.style.color = '#4caf50';
          break;
        case 'error':
          apiStatusElement.textContent = 'Error ✗';
          apiStatusElement.style.color = '#f44336';
          break;
      }
    }
  }

  /**
   * Check API status
   */
  function checkApiStatus() {
    fetch('/api/uptime')
      .then(response => {
        if (response.ok) {
          state.apiStatus = 'connected';
        } else {
          state.apiStatus = 'error';
        }
      })
      .catch(() => {
        state.apiStatus = 'error';
      })
      .finally(() => {
        updateStatusIndicators();
      });
  }

  /**
   * Initialize Direct Angular Integration
   * This is called when Angular assets are loaded directly into the page
   */
  function initDirectAngularIntegration() {
    window.DirectAngularIntegration = {
      configure: function(options) {
        console.log('🔧 Configuring Direct Angular Integration with options:', options);
      },
      ready: function() {
        console.log('✅ Direct Angular Integration is ready');
        handleAngularReady();
      },
      error: function(error) {
        console.error('❌ Direct Angular Integration error:', error);
        handleAngularError(error);
      }
    };
    
    console.log('✅ Direct Angular Integration is set up and awaiting Angular initialization');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Set up Direct Angular Integration
  initDirectAngularIntegration();
  
})();
