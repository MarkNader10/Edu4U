<?php
session_start();
include "db.php";

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = intval($_SESSION['user_id']);
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Basic validation
    if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
        header("Location: profile.html?error=يرجى ملء جميع الحقول");
        exit();
    }

    if ($new_password !== $confirm_password) {
        header("Location: profile.html?error=كلمة المرور الجديدة غير متطابقة مع التأكيد");
        exit();
    }

    if (strlen($new_password) < 6) {
        header("Location: profile.html?error=يجب أن تكون كلمة المرور 6 أحرف على الأقل");
        exit();
    }

    // Get current password hash
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        header("Location: profile.html?error=المستخدم غير موجود");
        exit();
    }

    $user = $result->fetch_assoc();

    // Verify current password
    if (!password_verify($current_password, $user['password'])) {
        header("Location: profile.html?error=كلمة المرور الحالية غير صحيحة");
        exit();
    }

    // Update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update_stmt->bind_param("si", $hashed_password, $user_id);

    if ($update_stmt->execute()) {
        header("Location: profile.html?success=تم تحديث كلمة المرور بنجاح");
    } else {
        header("Location: profile.html?error=حدث خطأ أثناء تحديث كلمة المرور");
    }

    $stmt->close();
    $update_stmt->close();
    $conn->close();
} else {
    header("Location: profile.html");
    exit();
}
?>