import { Component, OnInit, Input } from '@angular/core';
import { EBGSSystemChart } from '../../typings';
import { Options, IndividualSeriesOptions } from 'highcharts';

@Component({
    selector: 'app-system-chart',
    templateUrl: './system-chart.component.html'
})

export class SystemChartComponent implements OnInit {
    @Input() systemData: EBGSSystemChart;
    options: Options;
    constructor() { }

    ngOnInit(): void {
        const allTimeFactions: string[] = [];
        this.systemData.faction_history.forEach(record => {
            if (allTimeFactions.indexOf(record.faction) === -1) {
                allTimeFactions.push(record.faction);
            }
        });
        this.systemData.faction_history.sort((a, b) => {
            if (a.updated_at < b.updated_at) {
                return -1;
            } else if (a.updated_at > b.updated_at) {
                return 1;
            } else {
                return 0;
            }
        });
        const series: IndividualSeriesOptions[] = [];
        allTimeFactions.forEach(faction => {
            const data: [number, number][] = [];
            this.systemData.faction_history.forEach(record => {
                if (record.faction === faction) {
                    data.push([
                        Date.parse(record.updated_at),
                        Number.parseFloat((record.influence * 100).toFixed(2))
                    ]);
                } else {
                    const indexInSystem = this.systemData.history.findIndex(element => {
                        return element.updated_at === record.updated_at;
                    });
                    if (indexInSystem !== -1 && this.systemData.history[indexInSystem].factions.findIndex(element => {
                        return element.name_lower === faction;
                    }) === -1) {
                        data.push([Date.parse(record.updated_at), null]);
                    }
                }
            });
            series.push({
                name: faction,
                data: data
            });
        });
        this.options = {
            xAxis: { type: 'datetime' },
            title: { text: 'Influence trend' },
            series: series
        };
    }
}
