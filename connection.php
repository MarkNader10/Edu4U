<?php
$host = "localhost";     // السيرفر
$user = "root";          // اليوزر الافتراضي في XAMPP
$pass = "";              // الباسورد الافتراضي (فاضي)
$db   = "mywebsite";  // اسم قاعدة البيانات

$conn = mysqli_connect("localhost", "root","" , "mywebsite");

// تأكيد الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>