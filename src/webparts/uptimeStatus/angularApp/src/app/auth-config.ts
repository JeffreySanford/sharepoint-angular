// Microsoft Graph configuration for Teams messages
export const msalConfig = {
  auth: {
    clientId: 'YOUR_AZURE_APP_CLIENT_ID', // From Azure App Registration
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphTeamsEndpoint: 'https://graph.microsoft.com/v1.0/me/joinedTeams',
  graphMessagesEndpoint: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages'
};

// Required permissions for Teams messages
export const loginRequest = {
  scopes: [
    'User.Read',
    'Team.ReadBasic.All',
    'Channel.ReadBasic.All', 
    'ChannelMessage.Read.All'
  ]
};
