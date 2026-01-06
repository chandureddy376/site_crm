export class customers 
{   
    Builder_Id: string;
    property_info_name: string;
    property_type_list: string;
    final_location: string;
    final_date: Date;
    password: string;
    performer:string;
    birthday:string;
    customer_IDPK:any;
}

export class Enquiry 
{
    executives_name:any;
    customer_IDPK:any;
    customer_name: any;
    customer_number: any;
    customer_mail: any;
    customer_location: any;
    customer_timeline: any;
    customer_purpose: any;
    customer_source: any;
    customer_proptype: any;
    customer_size: any;
    customer_assign: any;
    customer_status: any;
    customer_address: any;
    customer_phase: any;
    customer_time:any;
    customer_budget:any;
    customer_date:any;
    customer_source_name:any;
    customer_assign_name:any;
    customer_source_IDPK: any;
    exec_IDFK:any;
    source_IDFK:any;
    customer_properties:any;
    localityid:any;
    timelineid:any;
    purposeid:any;
    proptypeid:any;
    propertysizeid:any;
    customer_assign_IDPK:any;
    customer_phaseid:any;
    enquiry_proptype:any;
    statusid:any;
    lead_priority:any;
    enquiry_name:any;
    enquiry_altname:any;
    enquiry_number:any;
    enquiry_altnumber:any;
    enquiry_mail:any;
    enquiry_altmail:any;
    enquiry_possession:any;
    enquiry_bhksize:any;
    enquiry_budget:any;
    address:any;
    mergedleads:any;
    enquiry_location:any;
}

export class Follow 
{
    customer_IDPK:any;
    phase_customer:any;
    comments_customer:any;
    next_date_customer:any;
    next_time_customer:any;
}

export class Face 
{   
    customer_IDPK:any;
    customer_facetoface_location:any;
    customer_facetoface_date:any;
    customer_facetoface_time:any;
    customer_suggest_properties:any;
    customer_phase:any;
    customer_comments:any;
    customer_next_date:any;
    customer_next_time:any;
}

export class Usv 
{   
    customer_IDPK:any;
    customer_name:any;
    customer_visited_property:any;
    visited_date:any;
    visited_time:any;
    customer_comments:any;
    customer_phase:any;
    customer_next_date:any;
    customer_next_time:any;
}

export class Finalnego
{
    customer_IDPK:any;
    final_builder:any;
    final_project_name:any;
    final_property_type:any;
    final_location:any;
    customer_phase:any;
    customer_next_date:any;
    customer_next_time:any;
    final_comments:any;
    final_builder_info:any;
}

export class closure
{
    customer_IDPK:any;
    customer_id:any;
    customer_name:any;
    developer_name:any;
    project_name:any;
    property_type:any;
    size:any;
    SQFT:any;
    dimensions:any;
    basic_SQFT:any;
    floor_rise:any;
    PLC:any;
    cumm_SQFT:any;
    car_parking:any;
    any_other:any;
    sales_value:any;
    professional_fee:any;
    gross_revenue:any;
    discount:any;
    gross:any;
    booking_amount:any;
    agreement_value:any;
    tenative:any;
    balance_agreement:any;

    first_applicant:any;
    second_applicant:any;
    first_contact:any;
    second_contact:any;
    first_mail:any;
    second_mail:any;
    first_pan:any;
    second_pan:any;

    transaction_id:any;
    amount_words:any;
    amount_rs:any;
    payment_date:any;
}

export class leadforward {
    customersupport: string;
    telecallername: string;
    assignedleads: string;

}
