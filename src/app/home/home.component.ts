import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
    

export class HomeComponent implements OnInit {
    readonly VAPID_PUBLIC_KEY = "BFRO5QFdNEixylKfD3DI6js8rVf9W8VyOgkJ0sauH84xmNKSHQXT8_6G5tBK2ppf385VXNyhO6hG3Tzot-3akTE";

    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;
    constructor(private swPush: SwPush,
        ) { }

    ngOnInit() {}

    
}
