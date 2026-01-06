<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";

$user_name = mysqli_real_escape_string($conn, $data->username);
$pass_word = mysqli_real_escape_string($conn, $data->password);

$sql = "SELECT * FROM 'login' WHERE username = '$user_name' AND password = '$pass_word'";
$result = $connect->query($sql);
if ($result->num_rows > 0) {
    // output data of each row
     $data = array() ;
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "0 results";
}
echo json_encode($data);
$connect->close();
?>
