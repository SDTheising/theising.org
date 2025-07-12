<?php
// templates/base.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($page_title ?? 'Samuel Theising') ?></title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header>
    <div class="top-bar">
      <div class="logo">
        <div style="display: inline-block;">
          <h1 class="brand">Samuel Theising</h1>
          <p>CS Graduate</p>
          <p>Aspiring Data Analyst</p>
        </div>
      </div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/projects/">Projects</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/contact/">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="content">
    <?= $page_content ?>
  </main>

  <footer>
    <div class="footer-content">
      <p>&copy; 2025 <span class="brand">Samuel Theising</span> - All Rights Reserved.</p>
    </div>
  </footer>
</body>
</html>
