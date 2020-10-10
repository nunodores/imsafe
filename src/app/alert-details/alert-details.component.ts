import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'
import * as Mapboxgl from 'mapbox-gl'
import { Observable } from 'rxjs';
import { AlertApiService } from 'src/service/alertApi.service';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})

export class AlertDetailsComponent implements OnInit {
  mapa: Mapboxgl.Map;
  Alerts:any = [];

  constructor(private apiService: AlertApiService) {
    this.readAlerts();
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
    this.apiService.getAlerts().subscribe((data) => {
      console.log(data);
     this.Alerts = data;
    })    
  }
 
  @Input() hover: Observable<string>

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
