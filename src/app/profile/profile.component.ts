import { Component, OnInit } from '@angular/core';
import { User, Alert, Assessment } from 'src/models/interfaces';
import { UserApiService } from 'src/service/userApi.service';
import { AlertApiService } from 'src/service/alertApi.service';
import { AssessmentApiService } from 'src/service/assessmentApi.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    user: User;
    alerts: Alert[];
    riabilityScore: number;

    constructor(private userService: UserApiService,
        private alertService: AlertApiService,
        private assessmentService: AssessmentApiService) { }

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
    }

}
