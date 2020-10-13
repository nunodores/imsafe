import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'
import * as Mapboxgl from 'mapbox-gl'
import { Observable } from 'rxjs';
import { AlertApiService } from 'src/service/alertApi.service';
import { UserApiService } from 'src/service/userApi.service';
import { AssessmentApiService } from '../../service/assessmentApi.Service'
import { FooterComponent } from '../shared/footer/footer.component';
import { Alert, User, Assessment } from '../../models/interfaces';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})

export class AlertDetailsComponent implements OnInit {
  mapa: Mapboxgl.Map;
  markers :Map<string, Mapboxgl.Marker>=new Map();
  Alerts:any = [];
  
  user: User;
  alerts: Alert[];
  selectedAlert: Alert;
  buttonClicked: boolean;
  
  constructor(private apiService: AlertApiService,
    private assessmentService: AssessmentApiService,
    private userService: UserApiService) {
  }
  
  ngOnInit(): void {
    this.buttonClicked = false;
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

        this.userService.getUser(localStorage.getItem("login")).subscribe((data: User) => {
            this.user = data;
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

        notif.reliabilityScore = 0;
        this.apiService.getAlertsFromSpecificUser(notif.signaled_by).subscribe((list: Alert[]) => {
          this.alerts = list;
          list.forEach((value, key) => {
              this.assessmentService.getAssessmentByAlertId(value._id).subscribe((assessments: Assessment[]) => {
                  assessments.forEach((a, key) => {
                      if(a.is_real==="true") {
                        notif.reliabilityScore++;
                      } else {
                        notif.reliabilityScore--;
                      }
                  })
              })
          })
        })
      }
    })    
  }

  assessAlert(alert, is_real) {
    this.buttonClicked = true;
    console.log("is real:" + is_real);
    this.assessmentService.getAssessmentByAlertId(alert._id)
      .subscribe(assessments => {
        let assessment;
        assessments.forEach(a => {
          if(a.alert_id == alert._id) {
            assessment = a;
          }
        })
        console.log(assessment)

        if(assessment == null) {
          this.assessmentService.createAssessment({user_uuid: this.user.uuid, alert_id: alert._id, is_real: is_real})
          .subscribe(data => {
            console.log("new assessment");
            if(is_real == "true") {
              alert.reliabilityScore++;
            } else {
              alert.reliabilityScore--;
            }
            this.buttonClicked = false;
          });
        } else if(assessment.is_real != is_real){
          assessment.is_real = is_real;
          this.assessmentService.updateAssessment(assessment._id, assessment)
          .subscribe(data => {
            console.log("update assessment");
            if(is_real == "true") {
              alert.reliabilityScore=alert.reliabilityScore+2;
            } else {
              alert.reliabilityScore=alert.reliabilityScore-2;
            }
            this.buttonClicked = false;
          });
        } else {
          this.assessmentService.deleteAssessment(assessment._id)
          .subscribe(data => {
            console.log("delete assessment");
            if(is_real == "true") {
              alert.reliabilityScore--;
            } else {
              alert.reliabilityScore++;
            }
            this.buttonClicked = false;
          });
        }
      })
    
  }
 
  @Input() hover: Observable<string>
  clickOnCard(alert){
    window.scrollTo(0, 0)
    this.mapa.setCenter(this.markers.get(alert._id).getLngLat())
  }
}
