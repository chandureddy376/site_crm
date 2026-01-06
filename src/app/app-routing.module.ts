import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './templates/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "adminlogin", component: LoginComponent },
  { path: 'addproperty', loadChildren: './templates/addproperties/addproperties.module#AddPropertiesModule' },
  { path: 'adminreports', loadChildren: './templates/admin-report/admin-report.module#AdminReportModule' },
  { path: 'source-dashboard', loadChildren: './templates/source-report/source-report.module#SourceReportModule' },
  { path: 'mandate-myoverdues', loadChildren: './templates/mandate/mandate-overdues/mandate-overdues.module#MandateOverduesModule' },
  { path: 'overdues-dashboard', loadChildren: './templates/overdues-dashboard/overdues-dashboard.module#OverduesDashboardModule' },
  { path: 'Enquiry', loadChildren: './templates/enquiry/enquiry.module#EnquiryModule' },
  { path: 'homes247-enquiry', loadChildren: './templates/client-enquiry/client-enquiry.module#ClientEnquiryModule' },
  { path: 'mandate-inactive-junk', loadChildren: './templates/mandate/mandate-inactive-junk/mandate-inactive-junk.module#MandateInactiveJunkModule' },
  { path: "leads", loadChildren: './templates/leads/leads.module#LeadsModule' },
  { path: "campaignLeads", loadChildren: './templates/campaign-leads/campaign-leads.module#CampaignLeadsModule' },
  { path: "buyleads", loadChildren: './templates/campaign-leads/campaign-leads.module#CampaignLeadsModule' },
  { path: "sellleads", loadChildren: './templates/campaign-leads/campaign-leads.module#CampaignLeadsModule' },
  { path: "rentleads", loadChildren: './templates/campaign-leads/campaign-leads.module#CampaignLeadsModule' },
  { path: "homes247-leads", loadChildren: './templates/client-leads/client-leads.module#ClientLeadsModule' },
  { path: "registrationlist", loadChildren: './templates/registrationdata/registrationdata.module#RegistrationdataModule' },
  { path: "Executives", loadChildren: './templates/executives/executives.module#ExecutivesModule' },
  { path: "rmleadassign", loadChildren: './templates/mandate/leadassign/leadassign.module#LeadassignModule' },
  { path: "myfollowups", loadChildren: './templates/mandate/leadassign/leadassign.module#LeadassignModule' },
  { path: "Customer-Details/:id", loadChildren: './templates/customers/customers.module#CustomersModule' },
  { path: "mandateleads", loadChildren: './templates/mandate/mandatelisting/mandatelisting.module#MandatelistingModule' },
  { path: "mandatereports", loadChildren: './templates/mandate/report-activity/report-activity.module#ReportActivityModule' },
  { path: "mandate-customers/:id/:execid/:feedback/:htype/:propid", loadChildren: './templates/mandate/mandate-customer-details/mandate-customer-details.module#MandateCustomerDetailsModule' },
  { path: "mandate-customers/:id/:execid/:feedback/:htype",loadChildren:'./templates/mandate/mandate-customer-details/mandate-customer-details.module#MandateCustomerDetailsModule'},
  { path: "visit-dashboard", loadChildren: './templates/executive-dashboard/executive-dashboard.module#ExecutiveDashboardModule' },
  { path: "mandate-dashboard", loadChildren: './templates/mandate/mandate-dashboard/mandate-dashboard.module#MandateDashboardModule' },
  { path: "mandate-assigned-leads", loadChildren: './templates/mandate/mandate-assigned-leads/mandate-assigned-leads.module#MandateAssignedLeadsModule' },
  { path: "mandate-plans", loadChildren: './templates/mandate/mandate-plans/mandate-plans.module#MandatePlansModule' },
  { path: "mymandatereports", loadChildren: './templates/mandate/mandate-exec-activities/mandate-exec-activities.module#MandateExecActivitiesModule' },
  { path: "mandate-lead-stages", loadChildren: './templates/mandate/mandate-lead-stages/mandate-lead-stages.module#MandateLeadStagesModule' },
  { path: "mandate-lead-stages", loadChildren: './templates/mandate/mandate-lead-stages/mandate-lead-stages.module#MandateLeadStagesModule' },
  { path: "mandate-lead-stages", loadChildren: './templates/mandate/mandate-lead-stages/mandate-lead-stages.module#MandateLeadStagesModule' },
  { path: "mandate-feedback", loadChildren: './templates/mandate/mandate-feedback/mandate-feedback.module#MandateFeedbackModule' },
  { path: "mandate-pricing-list", loadChildren: './templates/mandate/mandate-price-listing/mandate-price-listing.module#MandatePriceListingModule' },
  { path: "mandate-junk-dash", loadChildren: './templates/mandate/mandate-junk-dash/mandate-junk-dash.module#MandateJunkDashModule' },
  { path: 'dummy-dash', loadChildren: './templates/dummy-dash/dummy-dash.module#DummyDashModule' },
  { path: 'hourly-report', loadChildren: './templates/hourly-report/hourly-report.module#HourlyReportModule' },
  { path: 'hourly-report-listing', loadChildren: './templates/hourly-report-listing/hourly-report-listing.module#HourlyReportListingModule' },
  { path: 'client-list', loadChildren: './templates/cp-client-listing/cp-client-listing.module#CpClientListingModule' },
  { path: 'cp-dedicated-leads', loadChildren: './templates/cp-dedicated-leads/cp-dedicated-leads.module#CpDedicatedLeadsModule' },
  { path: 'client-dash', loadChildren: './templates/client-dashboard/client-dashboard.module#ClientDashboardModule' },
  { path: 'team-chat', loadChildren: './templates/team-chat/team-chat.module#TeamChatModule' },
  { path: 'client-chat', loadChildren: './templates/whatsup-client-chat/whatsup-client-chat.module#WhatsupClientChatModule' },
  { path: 'visit-update-sitara', loadChildren: './templates/visit-update/visit-update.module#VisitUpdateModule' },
  { path: 'visit-update-samskruthi', loadChildren: './templates/visit-update/visit-update.module#VisitUpdateModule' },
  { path: 'visit-update-swara', loadChildren: './templates/visit-update/visit-update.module#VisitUpdateModule' },
  { path: 'visit-update-reviva', loadChildren: './templates/visit-update/visit-update.module#VisitUpdateModule' },
  { path: 'visit-update-ranav', loadChildren: './templates/visit-update/visit-update.module#VisitUpdateModule' },
  { path: 'whatsapp-visit', loadChildren: './templates/whatsapp-visit/whatsapp-visit.module#WhatsappVisitModule' },
  { path: 'call-dashboard', loadChildren: './templates/call-insights/call-insights.module#CallInsightsModule' },
  { path: 'all-calls', loadChildren: './templates/all-calls/all-calls.module#AllCallsModule' },
  { path: 'all-calls-listing', loadChildren: './templates/all-calls-listing/all-calls-listing.module#AllCallsListingModule' },
  { path: 'live-calls', loadChildren: './templates/all-calls/all-calls.module#AllCallsModule' },
  // { path: 'calls-hourly-report', loadChildren: './templates/calls-hourly-report/calls-hourly-report.module#CallsHourlyReportModule' },
  // { path: 'executive-calls-report', loadChildren: './templates/calls-executives-report/calls-executives-report.module#CallsExecutivesReportModule' },
  // { path: 'ivrs-list', loadChildren : './templates/calls-ivrs/calls-ivrs.module#CallsIvrsModule'},
  // { path: 'add-ivrs', loadChildren : './templates/calls-ivrs/calls-ivrs.module#CallsIvrsModule'},
  // { path: 'calls-monthly-report', loadChildren : './templates/calls-monthly-report/calls-monthly-report.module#CallsMonthlyReportModule'},
  { path: 'attendance-list', loadChildren: './templates/attendance-list/attendance-list.module#AttendanceListModule' },
  { path: 'enquiry-vsnap', loadChildren: './templates/enq-camp-leads/enq-camp-leads.module#EnqCampLeadsModule' },
  { path: 'enquiry-sitecrm', loadChildren: './templates/enq-camp-leads/enq-camp-leads.module#EnqCampLeadsModule' },
  { path: 'inventory-dashboard', loadChildren: './templates/inventory-dashboard/inventory-dashboard.module#InventoryDashboardModule' },
  { path:'under-maintenance',loadChildren:'./templates/under-maintenance/under-maintenance.module#UnderMaintenanceModule'},
  { path: 'junk-dashboard', loadChildren: './templates/junk-dashboard/junk-dashboard.module#JunkDashboardModule' },
  { path: 'today-activity', loadChildren: './templates/today-dashboard/today-dashboard.module#TodayDashboardModule' },
  { path: 'stage-dashboard', loadChildren: './templates/stage-dashboard/stage-dashboard.module#StageDashboardModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    CommonModule

  ],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }

