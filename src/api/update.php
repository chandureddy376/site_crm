<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
// $subscr = mysqli_real_escape_string($connect, $data->customer_id);
// $t1=implode(',', $_POST['$data->customer_loan']);

$sql1 = "UPDATE enquiry SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
$qry = $connect->query($sql1);
if($data->customer_name){
}

$sql2 = "UPDATE active_leads SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
   $qry = $connect->query($sql2);
   if($data->customer_name){
   }

   $sql3 = "UPDATE follow_up SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
	 $qry = $connect->query($sql3);
     if($data->customer_name){
     }

     


     $sql4 = "UPDATE face_to_face SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
	 $qry = $connect->query($sql4);
     if($data->customer_name){
     }

	$sql5 = "UPDATE usv SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
	 $qry = $connect->query($sql5);
     if($data->customer_name){
     }

     $sql6 = "UPDATE rsv SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
customer_address ='$data->customer_address', customer_loan ='$data->customer_loan'
WHERE customer_IDPK = $data->customer_IDPK ";
	 $qry = $connect->query($sql6);
     if($data->customer_name){
     }

     $sql7 = "UPDATE permanent_followup SET customer_name ='$data->customer_name'
     WHERE customer_IDFK = $data->customer_IDPK ";
          $qry = $connect->query($sql7);
          if($data->customer_name){
          }

$connect->close();
?>