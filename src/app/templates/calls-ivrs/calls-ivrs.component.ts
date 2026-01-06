import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-calls-ivrs',
  templateUrl: './calls-ivrs.component.html',
  styleUrls: ['./calls-ivrs.component.css']
})
export class CallsIvrsComponent implements OnInit {

  constructor(
    private _sharedservice: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  listParam: any;
  isAddIvrs: boolean = false;
  selectedTeamName: any;
  nonWorkingDays: any;
  timeOutNum: any;
  selectedMessageType: any;
  selectedLandingNum: any;
  ivrsTitle: any;
  weekends: any[] = [];
  selectedWeekends:any;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  callerleads:any;

  ngOnInit() {
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.weekends = [
      { key: '1', value: 'Sunday' },
      { key: '2', value: 'Monday' },
      { key: '3', value: 'Tuesday' },
      { key: '4', value: 'Wednesday' },
      { key: '5', value: 'Thursday' },
      { key: '6', value: 'Friday' },
      { key: '7', value: 'Saturday' }
    ]

    this.getleadsdata();
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.listParam = param['list'];
      this.resetScroll();
    });
  }

  addIvrs() {
    this.isAddIvrs = true;
    $('input[id="hidecheckboxid"]').attr("disabled", false);
    $('.hidecheckbox').show();
    setTimeout(() => {
      $('#fromTime').prop('disabled', true);
      $('#toTime').prop('disabled', true);
    }, 0)
  }

  teamNameChange(event) {

  }

  messageTypechange(event) {

  }

  landingNumberchange(event) {

  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  getselectedweekends(){
    var checkid = $("input[name='programmingweekends']:checked").map(function () {
      return this.value;
    }).get().join(',');
    console.log(checkid);

    if(checkid != '' && checkid != undefined && checkid != null){
      $('#fromTime').prop('disabled', false);
      $('#toTime').prop('disabled', false);
    }
  }

  ngAfterViewInit(): void {
    // Initialize FROM time picker
    $('.calendartime').calendar({
      type: 'time',
      ampm: true,
      disableMinute: true,
      onChange: (fromTime: Date) => {
        const fromHour = fromTime.getHours();
        const fromMinute = fromTime.getMinutes();

        const toHour = Math.min(fromHour + 1, 23);
        const minTime = this.formatTime(toHour, fromMinute);

        $('#toTime').val('');
        $('.calendarTimeTo').calendar('destroy');
        var minDate = new Date();
        minDate.setHours(toHour)
        $('.calendarTimeTo').calendar({
          type: 'time',
          ampm: true,
          disableMinute: true,
          minDate: minDate
        });
      }
    });

    // Initialize TO time picker (default)
    $('.calendarTimeTo').calendar({
      type: 'time',
      ampm: true,
      disableMinute: true,
    });

    this.resetScroll();
  }

  loadMore(){}

  // Helper: Format time to "HH:mm" string for Semantic UI
  formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

}
