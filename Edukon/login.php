<?php include 'headerT.php'; ?>

 <div class="login-box">
    <h2>Login</h2>
    <form action="conect" method="POST">
      <input type="text" name="username" placeholder="Enter Username" required>
      <input type="password" name="password" placeholder="Enter Password" required>
      <button type="submit">Login</button>
    </form>
    <?php if (isset($_GET['error'])): ?>
      <p class="error"><?php echo $_GET['error']; ?></p>
    <?php endif; ?>
  </div>

  <?php include 'footerT.php'; ?>