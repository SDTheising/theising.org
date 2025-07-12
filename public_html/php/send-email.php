<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

$envPath = realpath(__DIR__ . '/../../'); // .env is two levels up
$dotenv = Dotenv\Dotenv::createImmutable($envPath);
$dotenv->load();

// Config constants
define('COUNT_FILE', __DIR__ . '/email_count.txt');
define('SEND_LIMIT', 100);
define('LOG_FILE', __DIR__ . '/ses_debug.log');
define('REDIRECT_SUCCESS', '../contact/index.html?status=success');
define('REDIRECT_ERROR', '../contact/index.html?status=error');
define('REDIRECT_INVALID', '../contact/index.html?status=invalid');
define('REDIRECT_LIMIT', '../contact/index.html?status=limit');

// POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Honeypot
if (!empty($_POST['website'])) {
    file_put_contents(LOG_FILE, "Honeypot triggered\n", FILE_APPEND);
    header("Location: " . REDIRECT_SUCCESS);
    exit;
}

// Limit check
if (!file_exists(COUNT_FILE)) file_put_contents(COUNT_FILE, '0', LOCK_EX);
$count = (int) file_get_contents(COUNT_FILE);
if ($count >= SEND_LIMIT) {
    header("Location: " . REDIRECT_LIMIT);
    exit;
}

// Sanitize input
$name    = htmlspecialchars(trim($_POST['name'] ?? ''));
$email   = htmlspecialchars(trim($_POST['email'] ?? ''));
$phone   = htmlspecialchars(trim($_POST['phone'] ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

// Validate required fields
if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: " . REDIRECT_INVALID);
    exit;
}

// Send the email
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $_ENV['SES_SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SES_SMTP_USERNAME'];
    $mail->Password   = $_ENV['SES_SMTP_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom($_ENV['SES_FROM_ADDRESS'], $_ENV['SES_FROM_NAME']);
    $mail->addAddress('theisingsamuel@gmail.com');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = "New contact form submission from $name";
    $mail->Body = <<<EOT
Name: $name
Email: $email
Phone: $phone

Message:
$message
EOT;

    $mail->send();
    file_put_contents(COUNT_FILE, $count + 1, LOCK_EX);
    header("Location: " . REDIRECT_SUCCESS);
    exit;

} catch (Exception $e) {
    file_put_contents(LOG_FILE, "Mailer Error: {$mail->ErrorInfo}\n", FILE_APPEND);
    header("Location: " . REDIRECT_ERROR);
    exit;
}
