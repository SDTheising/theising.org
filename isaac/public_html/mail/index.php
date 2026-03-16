<?php
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Mailer dependencies are missing. Install PHPMailer via Composer.'
    ]);
    exit;
}

require $autoloadPath;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed.'
    ]);
    exit;
}

function sanitize(string $value): string {
    return trim(strip_tags($value));
}

$name = sanitize($_POST['client_name'] ?? '');
$email = filter_var($_POST['client_email'] ?? '', FILTER_VALIDATE_EMAIL);
$bladeLength = sanitize($_POST['blade_length'] ?? '');
$notes = trim($_POST['project_notes'] ?? '');

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if (!$email) {
    $errors[] = 'A valid email is required.';
}
if ($bladeLength === '') {
    $errors[] = 'Select a blade length range.';
}
if (mb_strlen($notes) <= 50) {
    $errors[] = 'Project notes must be more than 50 characters.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->setFrom('no-reply@example.com', 'Blade Sharpening Intake');
    $mail->addAddress('sharpening@example.com', 'Edge Revival');
    $mail->addReplyTo($email, $name);

    $mail->Subject = 'New sharpening request';
    $mail->Body = sprintf(
        "Name: %s\nEmail: %s\nBlade length: %s\nNotes:\n%s",
        $name,
        $email,
        $bladeLength,
        $notes
    );

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Request sent. Look for a reply shortly.'
    ]);
} catch (Exception $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Mailer error: ' . $exception->getMessage()
    ]);
}
