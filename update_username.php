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
    $new_username = trim($_POST['new_username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Basic validation
    if (empty($new_username) || empty($password)) {
        header("Location: profile.html?error=يجب ملء جميع الحقول");
        exit();
    }

    if (strlen($new_username) < 3) {
        header("Location: profile.html?error=يجب أن يكون اسم المستخدم 3 أحرف على الأقل");
        exit();
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ? AND id != ?");
    $stmt->bind_param("si", $new_username, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        header("Location: profile.html?error=اسم المستخدم هذا مستخدم بالفعل");
        exit();
    }

    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        header("Location: profile.html?error=كلمة المرور غير صحيحة");
        exit();
    }

    // Update only the username
    $update_stmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ?");
    $update_stmt->bind_param("si", $new_username, $user_id);

    if ($update_stmt->execute()) {
        // Update the username in session if needed
        $_SESSION['username'] = $new_username;
        header("Location: profile.html?success=تم تحديث اسم المستخدم بنجاح");
    } else {
        header("Location: profile.html?error=حدث خطأ أثناء تحديث اسم المستخدم");
    }

    $stmt->close();
    $update_stmt->close();
    $conn->close();
} else {
    header("Location: profile.html");
    exit();
}
?>