<?php
session_start();

include "db.php"; // أو connection.php حسب مشروعك — تأكد من استخدام نفس ملف الإتصال في كل مكان

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if ($email === '' || $password === '') {
        die("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    }

    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // خزن id و username في الجلسة لاستخدامهما لاحقًا
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            header("Location: home.html");
            exit();
        } else {
            echo "كلمة المرور خاطئة";
        }
    } else {
        echo "المستخدم غير موجود";
    }

    $stmt->close();
    $conn->close();
} else {
    // طريقة الطلب غير صحيحة
    header("Location: login.html");
    exit();
}
?>