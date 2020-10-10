import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core"; 
import { FormBuilder } from "@angular/forms";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { VoiceRecognitionService } from "../voice-recognition/service/voice-reconition.service";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit {
  typeNotif: String[] = ["Aggression", "Disaster", "Accident"];
  icons: String[][] = [
    ["fas fa-fist-raised", "fas fa-fire", "fas fa-car-crash"],
    []
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
  textAlert: String;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,
    public service : VoiceRecognitionService) {
      this.checkoutForm = this.formBuilder.group({
        text: '' 
      });
        
    this.service.init();
    this.textAlert=this.service.text
    }
    recoverVoice(){ 
      this.service.isStoppedSpeechRecog ? this.service.start() : this.service.stop();
    }
    startService(){
      this.service.start()
    }
  
    stopService(){
      this.service.stop()
    }
  
  onSubmit(notification) {
    // Open modal here 
    console.log('Type: ' + this.nameTypeOneSelected);
    console.log(this.nameTypeTwoSelected? ' - ' + this.nameTypeTwoSelected : ''); 
  }

  ngOnInit(): void {}

  onClickTypeNotif(event, index) {
    if (
      this.typeNotifSelected == undefined ||
      this.typeNotifSelected != index
    ) {
      this.typeNotifSelected = index; 
      this.nameTypeOneSelected = this.typeNotif[index];
      console.log("sel : "+ this.nameTypeOneSelected)
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
      console.log("sel : "+ this.nameTypeOneSelected)
      
    } else {
      this.typeNotifSelectedTwo = undefined;
      this.nameTypeTwoSelected = undefined;
    }
  }

  isTypeNotifSelected(i, board): boolean {
    if (board == 1) return i == this.typeNotifSelected;
    else {
      return i!=undefined &&  i == this.typeNotifSelectedTwo;
    }
  }

  getFaticon(i,j){
    return this.icons[i][j];
  }


  hasAtLeastOne(){
    return !this.service.text && !this.nameTypeOneSelected;
  }



  closeResult: string;
  open(content) {
    console.log(content)
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult)
    }, (reason) => {

      console.log(reason)

    });

  }
}
