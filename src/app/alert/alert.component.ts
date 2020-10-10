import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { VoiceRecognitionService } from "../voice-recognition/service/voice-reconition.service";
import { HttpCallsBackendService } from "./http-calls-backend.service";
import { compilePipeFromMetadata } from "@angular/compiler";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit {
  typeNotif: String[] = ["Aggression", "Disaster", "Accident"];
  icons: String[][] = [
    ["fas fa-fist-raised", "fas fa-fire", "fas fa-car-crash"],
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

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public service: VoiceRecognitionService,
    private serviceBackend : HttpCallsBackendService
  ) {
    this.checkoutForm = this.formBuilder.group({
      text: "",
    });

    this.service.init();
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

  onSubmit(notification) {}

  ngOnInit(): void {
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

  open(content) {
    this.service.stop();
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {
          if (reason == "OK") {
            this.sentAlert();
          }
        }
      );
  }
 

  private sentAlert() {
    let type = this.nameTypeTwoSelected
      ? this.nameTypeOneSelected + "" + this.nameTypeTwoSelected
      : this.nameTypeOneSelected;
    let currentDate = new Date();
    let jsonBody = {
      type: type,
      message: this.service.text,
      lat: this.latitude,
      lon: this.longitude,
      signaled_by: "", //TODO
      start_date: currentDate,
      end_date: currentDate,
    };
    this.serviceBackend.postAlert(jsonBody);
    this.clearData();
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
  }
}
