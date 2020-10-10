import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'
import * as Mapboxgl from 'mapbox-gl'
import { Observable } from 'rxjs';
import { AlertApiService } from 'src/service/alertApi.service';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})

export class AlertDetailsComponent implements OnInit {
  mapa: Mapboxgl.Map;
  markers :Map<string, Mapboxgl.Marker>=new Map();
  Alerts:any = [];
  
  constructor(private apiService: AlertApiService) {
   }
  
  ngOnInit(): void {

    Mapboxgl.accessToken = environment.mapbox.accessToken;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapa = new Mapboxgl.Map({
          // container id specified in the HTML
          container: 'map',

          // style URL
          style: 'mapbox://styles/mapbox/streets-v11',

          // initial position in [lon, lat] format
          center: [position.coords.longitude, position.coords.latitude],

          // initial zoom

          zoom: 16
        });  
        this.readAlerts();
        var marker = new Mapboxgl.Marker()
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .addTo(this.mapa); 

          // Add geolocate control to the map.
        this.mapa.addControl(
          new Mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            showAccuracyCircle: true,
            trackUserLocation: true
          })
        );
      });

    }


  }

  readAlerts(){
    this.apiService.getAlerts().subscribe((data : Array<any>) => { 
      
     this.Alerts = data;
     for (let notif of this.Alerts) {
        let myLatlng = new Mapboxgl.LngLat(notif.lon, notif.lat );
        let marker = new Mapboxgl.Marker()
        .setLngLat(myLatlng)
        .setPopup(new Mapboxgl.Popup({ offset: 25 }))
        .addTo(this.mapa); 
        this.markers.set(notif._id, marker);
      }
    })    
  }
 
  @Input() hover: Observable<string>
  clickOnCard(alert){
    window.scrollTo(0, 0)
    this.mapa.setCenter(this.markers.get(alert._id).getLngLat())
  }
}

// just an interface for type safety.
interface Alert {
  
  _id:string;
  type:string;
  lat:number;
  lon:number;
  message:string;
  signaled_by: string;
  start_date:Date;
  end_date:Date;
  last_update:Date;

}
