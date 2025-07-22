import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('performanceCanvas') performanceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenuCanvas') revenuCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.renderPerformanceChart();
    this.renderRevenueChart();
  }

  renderPerformanceChart(): void {
    const ctx = this.performanceCanvas?.nativeElement?.getContext('2d');
    if (!ctx) {
      console.error('Performance chart context not found!');
      return;
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenus (dt)',
          data: [5000, 8000, 7500, 9000, 10000, 12000],
          borderColor: 'rgba(59,130,246,1)',
          backgroundColor: 'rgba(59,130,246,0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  renderRevenueChart(): void {
    const ctx = this.revenuCanvas?.nativeElement?.getContext('2d');
    if (!ctx) {
      console.error('Revenue chart context not found!');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Hébergement', 'Restaurant', 'Autres'],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: [
            'rgba(16,185,129,0.7)',
            'rgba(139,92,246,0.7)',
            'rgba(234,179,8,0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}