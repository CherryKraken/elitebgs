import { Component, HostBinding, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { EBGSDonor, EBGSPatron } from '../typings';

@Component({
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    donors: EBGSDonor[];
    patrons: EBGSPatron[];
    constructor(private serverService: ServerService) {
        this.donors = [];
        this.patrons = [];
    }

    ngOnInit(): void {
        this.serverService.getDonors().subscribe(donors => {
            this.donors = donors;
        });
        this.serverService.getPatrons().subscribe(patrons => {
            this.patrons = patrons;
        });
    }
}
