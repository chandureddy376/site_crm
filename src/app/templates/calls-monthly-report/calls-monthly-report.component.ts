import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RenderDayCellEventArgs } from '@syncfusion/ej2-angular-calendars';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';

@Component({
  selector: 'app-calls-monthly-report',
  templateUrl: './calls-monthly-report.component.html',
  styleUrls: ['./calls-monthly-report.component.css']
})
export class CallsMonthlyReportComponent implements OnInit {

  constructor(
    private _sharedservice: sharedservice,
  ) { }

  public dateValue: Date = new Date();
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  @ViewChild('calendarRef') calendarElement: ElementRef;
  fullWeekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  date: Date = new Date();
  
  ngOnInit() {
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
  }

  ngAfterViewInit(): void {
   this.updateWeekHeaders();
  }

  public onRenderDayCell(args: RenderDayCellEventArgs): void {
    const currentMonth = this.date.getMonth();
    const cellMonth = args.date.getMonth();
    const date = args.date;
    const day = date.getDate();
    const letter = this.alphabet[(day - 1) % this.alphabet.length];
    args.element.style.backgroundColor = (day % 2 === 0) ? '#D9D9D9' : '#ffffff';
  
    args.element.innerHTML = '';
  
    // Add letter to cell (this replaces the date visually)
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('custom-letter');
    letterDiv.innerText = letter;
  
    // Style the letter (centered)
    letterDiv.style.position = 'absolute';
    letterDiv.style.top = '50%';
    letterDiv.style.left = '50%';
      letterDiv.style.transform = 'translate(-50%, -50%)';
      letterDiv.style.fontSize = '16px';
      letterDiv.style.fontWeight = 'bold';
      letterDiv.style.color = '#333';
      letterDiv.style.padding = '1rem'
    
    args.element.style.position = 'relative';
    args.element.appendChild(letterDiv);
  
    // Add date badge in top-right corner
    const badge = document.createElement('span');
    badge.classList.add('event-badge');
    badge.innerText = day.toString(); // Show date here
  
    badge.style.position = 'absolute';
    badge.style.top = '0px';
    badge.style.right = '0px';
    badge.style.background = '#0582C1';
    badge.style.color = '#fff';
    badge.style.padding = '2px 6px';
    badge.style.fontSize = '12px';
    badge.style.borderLeft = '1px solid #0582C1';
    badge.style.borderBottom = '1px solid #0582C1';
    badge.style.borderBottomLeftRadius = '2px';
  
    args.element.appendChild(badge);
  }

  onMonthChange(event: any): void {
    this.applyCustomCellRendering();
  }

  private applyCustomCellRendering() {
    // week headers are updation
    this.updateWeekHeaders();
  
    // Re-render the day cells
    const cells = document.querySelectorAll('.e-calendar .e-day');
  
    Array.from(cells).forEach((cell: HTMLElement) => {
      const dateAttr = cell.getAttribute('data-value');
      console.log(dateAttr,cell.getAttribute('data-value'))
      if (!dateAttr) return;  // Skip if no data-value attribute exists
  
      const date = new Date(dateAttr);
  
      const day = date.getDate();
      const letter = this.alphabet[(day - 1) % this.alphabet.length];
  
      // alternate date background color
      cell.style.backgroundColor = (day % 2 === 0) ? '#D9D9D9' : '#ffffff';
  
      cell.innerHTML = '';
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('custom-letter');
      letterDiv.innerText = letter;
      letterDiv.style.position = 'absolute';
      letterDiv.style.top = '50%';
      letterDiv.style.left = '50%';
      letterDiv.style.transform = 'translate(-50%, -50%)';
      letterDiv.style.fontSize = '16px';
      letterDiv.style.fontWeight = 'bold';
      letterDiv.style.color = '#333';
      letterDiv.style.padding = '1rem';
      cell.style.position = 'relative';
      cell.appendChild(letterDiv);
  
      // Add a date badge in the top-right corner
      const badge = document.createElement('span');
      badge.classList.add('event-badge');
      badge.innerText = day.toString();
      badge.style.position = 'absolute';
      badge.style.top = '0px';
      badge.style.right = '0px';
      badge.style.background = '#0582C1';
      badge.style.color = '#fff';
      badge.style.padding = '2px 6px';
      badge.style.fontSize = '12px';
      badge.style.borderLeft = '1px solid #0582C1';
      badge.style.borderBottom = '1px solid #0582C1';
      badge.style.borderBottomLeftRadius = '2px';
      cell.appendChild(badge);
    });
  }
  

  private updateWeekHeaders() {
    const headers = document.querySelectorAll('.e-calendar .e-week-header th');
    Array.from(headers).forEach((th, index) => {
      if (this.fullWeekDays[index]) {
        th.textContent = this.fullWeekDays[index];
      }
    });
  }

//   lastSelectedMonth: number = new Date().getMonth();

// onDateChange(event: any): void {
//   const selectedDate = new Date(event.target.value);
//   const selectedMonth = selectedDate.getMonth();

//   if (selectedMonth !== this.lastSelectedMonth) {
//     console.log('Month changed to:', selectedMonth + 1);
//     this.lastSelectedMonth = selectedMonth;

//     // Trigger custom cell updates or other logic
//     this.updateCalendarForNewMonth(selectedDate);
//   }
// }


}
