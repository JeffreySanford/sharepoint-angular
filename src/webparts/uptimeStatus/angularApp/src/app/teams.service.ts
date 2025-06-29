import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface TeamsMessage {
  id: string;
  createdDateTime: string;
  body: {
    content: string;
    contentType: string;
  };
  from: {
    user: {
      displayName: string;
      id: string;
    };
  };
  importance: string;
  messageType: string;
}

export interface Team {
  id: string;
  displayName: string;
  description: string;
}

export interface Channel {
  id: string;
  displayName: string;
  membershipType: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private accessToken$ = new BehaviorSubject<string | null>(null);
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  constructor(private http: HttpClient) {}

  setAccessToken(token: string) {
    this.accessToken$.next(token);
  }

  private getHeaders(): HttpHeaders {
    const token = this.accessToken$.value;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get user's teams
  getMyTeams(): Observable<Team[]> {
    return this.http.get<any>(`${this.baseUrl}/me/joinedTeams`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error fetching teams:', error);
        return [];
      })
    );
  }

  // Get channels for a team
  getTeamChannels(teamId: string): Observable<Channel[]> {
    return this.http.get<any>(`${this.baseUrl}/teams/${teamId}/channels`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error fetching channels:', error);
        return [];
      })
    );
  }

  // Get recent messages from a channel
  getChannelMessages(teamId: string, channelId: string, top: number = 10): Observable<TeamsMessage[]> {
    return this.http.get<any>(
      `${this.baseUrl}/teams/${teamId}/channels/${channelId}/messages?$top=${top}&$orderby=createdDateTime desc`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error fetching messages:', error);
        return [];
      })
    );
  }

  // Get messages from multiple channels (for dashboard)
  getRecentMessagesFromMultipleChannels(teamChannelPairs: {teamId: string, channelId: string}[]): Observable<TeamsMessage[]> {
    const messageRequests = teamChannelPairs.map(pair => 
      this.getChannelMessages(pair.teamId, pair.channelId, 5)
    );

    // Combine all messages and sort by date
    return this.http.get('').pipe(
      // Implementation would use forkJoin to combine multiple requests
      map(() => [] as TeamsMessage[]) // Placeholder
    );
  }
}
