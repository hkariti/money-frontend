import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Observable, of } from 'rxjs';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
})

export class TransactionViewComponent implements OnInit {
  chart: Chart;
  transactions: Observable<object[]> = this.transactionService.getAll();

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.fetchAllTransactions();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  clusterData(data: Object[], attribute: string): object {
    const categories = {};
    data.forEach((d) => {
      const cat = d[attribute] || 'unknown';
      const amount = d['billed_amount'];
      if (!categories[cat]) {
        categories[cat] = 0;
      }
      categories[cat] += amount;
    });

    return categories;
  }

  generateChart(buckets: object, drilldownAttr?: string, rawData?: object[]): void {
    // Dont generate a chart on top of an existing chart
    if (this.chart) {
      this.chart.destroy();
    }
    const values: number[] = [];
    const colors: string[] = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'teal', 'magenta', 'black', 'pink', 'gray'];
    let keyCount = 0;
    const categoriesKeys = Object.keys(buckets);

    categoriesKeys.forEach((k) => {
      keyCount++;
      if (keyCount > colors.length) {
        colors.push(this.getRandomColor());
      }
      values.push(buckets[k]);
    });
    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ],
        labels: categoriesKeys,
      },
      options: {
        onClick: (e, f) => {
          if (drilldownAttr) {
            const index = f[0]._index;
            const chosenCat = categoriesKeys[index];
            const newClusters = this.clusterData(rawData, drilldownAttr);
            this.generateChart(newClusters);
          }
        }
      }
    });
  }

  fetchAllTransactions() {
    return this.transactions.subscribe((data: object[]) => {
      const clusters = this.clusterData(data, 'category');
      this.generateChart(clusters, 'subcategory', data);
    });
  }
}
