import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

//const SERVER_URL = 'http://vps-d4f37b99.vps.ovh.net:9000/subscription'
const SERVER_URL = 'http://resastyle:9000/subscription'

@Injectable()
export class PushNotificationService {
  constructor(private http: HttpClient) {}

  public sendSubscriptionToTheServer(subscription: PushSubscription) {
    return this.http.post(SERVER_URL, subscription)
  }
}