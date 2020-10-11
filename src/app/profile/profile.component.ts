import { Component, OnInit } from '@angular/core';
import { User, Alert, Assessment } from 'src/models/interfaces';
import { UserApiService } from 'src/service/userApi.service';
import { AlertApiService } from 'src/service/alertApi.service';
import { AssessmentApiService } from 'src/service/assessmentApi.service';
import { FormBuilder } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { VoiceRecognitionService } from "../voice-recognition/service/voice-reconition.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    typeNotif: String[] = ["Aggression", "Disaster", "Accident"];
    icons: String[][] = [
      ["fa fa-hand-rock-o", "fa fa-fire-extinguisher", "fa fa-car"],
      [],
    ];
  
    agressions: String[] = ["Robbery", "Sexual", "Fight"];
  
    catastrofs: String[] = ["Fire", "Earthquake", "Wind"];
  
    accidents: String[] = ["Voiture", "Bike"];
  
    typeNotifSelected: number;
    typeNotifSelectedTwo: number;
    nameTypeOneSelected: String;
    nameTypeTwoSelected: String;
    typeNotifSecond: String[];
    checkoutForm;

    isLocationActive: boolean = false;
    latitude: number;
    longitude: number;

    user: User;
    alerts: Alert[];
    selectedAlert: Alert;
    riabilityScore: number;

    constructor(private userService: UserApiService,
        private alertService: AlertApiService,
        private assessmentService: AssessmentApiService,
        private modalService: NgbModal,
        public service: VoiceRecognitionService,
        private formBuilder: FormBuilder) {
            this.checkoutForm = this.formBuilder.group({
              text: "",
            });
        
            this.service.init(); 
        }

    ngOnInit() {
        this.riabilityScore = 0;
        this.userService.getUser(localStorage.getItem("login")).subscribe((data: User) => {
            this.user = data;
            
            this.alertService.getAlertsFromSpecificUser(this.user._id).subscribe((list: Alert[]) => {
                this.alerts = list;
                list.forEach((value, key) => {
                    this.assessmentService.getAssessmentByAlertId(value._id).subscribe((assessments: Assessment[]) => {
                        assessments.forEach((a, key) => {
                            if(a.is_real==="true") {
                                this.riabilityScore++;
                            } else {
                                this.riabilityScore--;
                            }
                        })
                    })
                })
            })
        });
        if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.isLocationActive = true;
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.log(this.latitude);
            console.log(this.longitude);
        });
        }
    }

    recoverVoice() {
      this.service.isStoppedSpeechRecog
        ? this.service.start()
        : this.service.stop();
    }
    startService() {
      this.service.start();
    }
  
    stopService() {
      this.service.stop();
    }

    onClickTypeNotif(event, index) {
        if (
        this.typeNotifSelected == undefined ||
        this.typeNotifSelected != index
        ) {
        this.typeNotifSelected = index;
        this.nameTypeOneSelected = this.typeNotif[index];
        console.log("sel : " + this.nameTypeOneSelected);
        switch (this.typeNotifSelected) {
            case 0:
            this.typeNotifSecond = this.agressions;
            break;
            case 1:
            this.typeNotifSecond = this.catastrofs;
            break;
            case 2:
            this.typeNotifSecond = this.accidents;
            break;
        }
        } else {
        this.typeNotifSelected = undefined;
        this.typeNotifSecond = undefined;
        this.nameTypeOneSelected = undefined;
        }
        this.typeNotifSelectedTwo = undefined;
        this.nameTypeTwoSelected = undefined;
    }

    onClickTypeNotifTwo(event, index) {
        if (
        this.typeNotifSelectedTwo == undefined ||
        this.typeNotifSelectedTwo != index
        ) {
        this.typeNotifSelectedTwo = index;
        this.nameTypeTwoSelected = this.typeNotifSecond[index];
        console.log("sel : " + this.nameTypeOneSelected);
        } else {
        this.typeNotifSelectedTwo = undefined;
        this.nameTypeTwoSelected = undefined;
        }
    }

    isTypeNotifSelected(i, board): boolean {
        if (board == 1) return i == this.typeNotifSelected;
        else {
        return i != undefined && i == this.typeNotifSelectedTwo;
        }
    }

    getFaticon(i, j) {
        return this.icons[i][j];
    }

    hasAtLeastOne() {
        return (
        !this.isLocationActive ||
        (!this.service.text && !this.nameTypeOneSelected)
        );
    }

    open(content, alert) {
      this.clearData();
      this.selectedAlert = alert;
      if(alert.type !== null) {
        this.typeNotif.forEach((element, index) => {
            if(element === alert.type.split(" - ")[0]) {
                this.typeNotifSelected = index;
                this.nameTypeOneSelected = element;
                this.onClickTypeNotif(element, index);
                if(alert.type.split(" - ")[1] !== null) {
                    switch (index) {
                        case 0:
                            this.typeNotifSecond = this.agressions;
                            this.agressions.forEach((elem, index2) => {
                                if(alert.type.split(" - ")[1] == elem) {
                                    this.typeNotifSelectedTwo = index2;
                                    this.nameTypeTwoSelected = elem;
                                }
                            })
                            break;
                        case 1:
                            this.typeNotifSecond = this.catastrofs;
                            this.catastrofs.forEach((elem, index2) => {
                                if(alert.type.split(" - ")[1] == elem) {
                                    this.typeNotifSelectedTwo = index2;
                                    this.nameTypeTwoSelected = elem;
                                }
                            })
                            break;
                        case 2:
                            this.typeNotifSecond = this.accidents;
                            this.accidents.forEach((elem, index2) => {
                                if(alert.type.split(" - ")[1] == elem) {
                                    this.typeNotifSelectedTwo = index2;
                                    this.nameTypeTwoSelected = elem;
                                    this.onClickTypeNotifTwo(elem, index2)
                                }
                            })
                            break;
                    }
                }
            }
        });
      }
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => {},
          (reason) => {
            if (reason == "OK") {
              this.updateAlert();
            }
          }
        );
    }

    updateAlert() {
        let currentDate = new Date();
        if(this.nameTypeTwoSelected != undefined && this.nameTypeOneSelected == undefined) {
            this.nameTypeOneSelected = this.selectedAlert.type.split(" - ")[0];
        }
        let type = this.nameTypeTwoSelected ? this.nameTypeOneSelected + " - " + this.nameTypeTwoSelected : this.nameTypeOneSelected;
        this.alertService.updateAlert(this.selectedAlert._id, {_id: this.selectedAlert._id, 
            message: this.checkoutForm.controls.text.value,
            type: type,
            lat: this.latitude,
            lon: this.longitude,
            signaled_by: this.selectedAlert.signaled_by,
            start_date: this.selectedAlert.start_date,
            end_date: currentDate}).subscribe(alert => {
                this.alerts.forEach((element, index) => {
                    if(element._id == this.selectedAlert._id) {
                        this.alerts = this.alerts.filter(item => item !== element);
                        this.alerts.push(alert);
                    }
                });
            })
    }

    private clearData(){
      this.typeNotifSelected=undefined;
      this.typeNotifSelectedTwo=undefined;
      this.latitude=undefined;
      this.longitude=undefined;
      this.service.text=undefined;
      this.nameTypeOneSelected=undefined;
      this.nameTypeTwoSelected=undefined;
      this.typeNotifSecond=undefined;
      this.selectedAlert=undefined;
    }

}
