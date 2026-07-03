<?php
// Start session and include database connection
session_start();
include 'db.php';

// Get current user data
$user_id = $_SESSION['user_id'] ?? 0;
$current_username = '';

if ($user_id) {
    $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        $current_username = htmlspecialchars($user['username']);
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حسابي | Edu4U</title>
    <link rel="stylesheet" href="home.css">
    <link rel="stylesheet" href="profile.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="navbar-logo">
            <span class="logo-text">Edu4U</span>
        </div>
        <ul class="nav-links">
            <li><a href="home.php">الرئيسية</a></li>
            <li><a href="my_courses.php">كورساتي</a></li>
            <li><a href="courses.php">جميع الكورسات</a></li> 
            <li><a href="calculator.php">الحاسبة</a></li>
        </ul>
        <div class="nav-icons-group">
            <div class="account-dropdown active-link">
                <button class="nav-icon-btn account-btn active-link" title="Account">
                    <i class="fas fa-user-circle"></i> 
                </button>
                <div class="dropdown-content show">
                    <a href="profile.php" class="active">حسابي</a>
                    <a href="login.php">تسجيل الخروج</a>
                </div>
            </div>
            <button id="lang-toggle" class="nav-icon-btn" title="Change Language">
                <i class="fas fa-globe"></i>
            </button>
            <button id="theme-toggle" class="nav-icon-btn" title="Toggle Light/Dark Mode">
                <img id="theme-img" src="moon.png" alt="theme">
            </button>
        </div>
    </nav>

    <main class="profile-content">
        <div class="profile-card">
            <h1>إعدادات الحساب</h1>
            
            <?php
            if (isset($_GET['error'])) {
                echo '<div class="message error">' . htmlspecialchars($_GET['error']) . '</div>';
            }
            if (isset($_GET['success'])) {
                echo '<div class="message success">' . htmlspecialchars($_GET['success']) . '</div>';
            }
            ?>

            <section class="section-container">
                <h2>تغيير اسم المستخدم</h2>
                <form action="update_username.php" method="POST">
                    <div class="input-group">
                        <label for="current_username">اسم المستخدم الحالي:</label>
                        <input type="text" id="current_username" value="<?php echo $current_username; ?>" disabled>
                    </div>
                    <div class="input-group">
                        <label for="new_username">اسم المستخدم الجديد:</label>
                        <input type="text" id="new_username" name="new_username" required>
                    </div>
                    <div class="input-group">
                        <label for="password">كلمة المرور الحالية:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="save-btn">تحديث اسم المستخدم</button>
                </form>
            </section>

            <hr>

            <section class="section-container">
                <h2>تغيير كلمة المرور</h2>
                <form action="update_password.php" method="POST" onsubmit="return validateForm()">
                    <div class="input-group">
                        <label for="current_password">كلمة المرور الحالية:</label>
                        <input type="password" id="current_password" name="current_password" required>
                    </div>
                    <div class="input-group">
                        <label for="new_password">كلمة المرور الجديدة:</label>
                        <input type="password" id="new_password" name="new_password" minlength="6" required>
                    </div>
                    <div class="input-group">
                        <label for="confirm_password">تأكيد كلمة المرور الجديدة:</label>
                        <input type="password" id="confirm_password" name="confirm_password" required>
                        <span id="passwordMatch" style="color: #c62828; display: none; font-size: 0.9em; margin-top: 5px;">
                            كلمات المرور غير متطابقة
                        </span>
                    </div>
                    <button type="submit" class="save-btn">تغيير كلمة المرور</button>
                </form>
            </section>
        </div>
    </main>

    <script>
        function validateForm() {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const passwordMatch = document.getElementById('passwordMatch');
            
            if (newPassword !== confirmPassword) {
                passwordMatch.style.display = 'block';
                return false;
            }
            return true;
        }

        // Validate password match while typing
        document.getElementById('confirm_password').addEventListener('input', function() {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = this.value;
            const passwordMatch = document.getElementById('passwordMatch');
            
            if (newPassword !== confirmPassword) {
                passwordMatch.style.display = 'block';
            } else {
                passwordMatch.style.display = 'none';
            }
        });
    </script>
</body>
</html>