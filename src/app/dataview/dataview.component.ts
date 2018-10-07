import { Component, OnInit } from '@angular/core';
import { DjangoFetchService } from '../django-fetch.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})

export class DataviewComponent implements OnInit {

  data: Object[];
  chart: Chart;
  categories: Object = {};
  categoriesKeys: string[] = [];

  constructor(private djangoService: DjangoFetchService) { }

  ngOnInit() {
  }

  getRandomColor(): string {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  clusterData(data: Object[], attribute: string): void {
    this.categories = {};
    data.forEach((d) => {
      const cat = d['fields'][attribute] || 'unknown';
      const amount = JSON.parse(d['fields']['amount']);
      if (!cat) { console.log(d) }
      if (!this.categories[cat]) {
        this.categories[cat] = 0;
      }
      this.categories[cat] += amount;
    })
  }
  generateChart(drilldownAttr?: string): void {
    // Dont generate a chart on top of an existing chart
    if (this.chart) {
      this.chart.destroy();
    }
    const values: number[] = [];
    const colors: string[] = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'teal', 'magenta', 'black', 'pink', 'gray'];
    let keyCount = 0;
    this.categoriesKeys = Object.keys(this.categories);
    this.categoriesKeys.forEach((k) => {
      keyCount++;
      if (keyCount > colors.length) {
        colors.push(this.getRandomColor())
      }
      values.push(this.categories[k]);
    })
    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ],
        labels: this.categoriesKeys,
      },
      options: {
        onClick: (e, f) => {
          if (drilldownAttr) {
            const index = f[0]._index;
            const chosenCat = this.categoriesKeys[index];
            console.log(`Clicked on ${chosenCat}`)
            this.clusterData(this.data, drilldownAttr);
            this.generateChart();
          }
        }
      }
    });

  }
  async fetchAllAccounts() {
    this.data = await this.djangoService.getData('accounts').toPromise();
  }
  async fetchAllTransactions() {
    this.data = await this.djangoService.getData('transactions').toPromise();
    this.clusterData(this.data, 'category');
    this.generateChart('subcategory');
  }
}
