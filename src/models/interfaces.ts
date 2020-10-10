import { InjectDecorator } from '@angular/core';

export interface User {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: number;
    login?: string;
    uuid?: string;
    password?: string;
}

export interface Alert {
    _id?: string;
    type?: string;
    lat?: number;
    lon?: number;
    signaled_by?: string;
    start_date?: Date;
    end_date?: Date;
    last_update?: Date;
}

export interface Assessment {
    _id?: string;
    user_uuid?: string;
    alert_id?: string;
    is_real?: string;
    last_update?: Date;
}