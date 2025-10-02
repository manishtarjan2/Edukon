<?php
// Razorpay API credentials (replace with yours)
$keyId = "rzp_test_1234567890";  
$keySecret = "your_secret_key";

// If verifying payment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $paymentId = $input['payment_id'] ?? null;

    if ($paymentId) {
        $ch = curl_init("https://api.razorpay.com/v1/payments/$paymentId");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, $keyId . ":" . $keySecret);
        $response = curl_exec($ch);
        curl_close($ch);

        $payment = json_decode($response, true);

        if (isset($payment['status']) && $payment['status'] === 'captured') {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Gateway</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f9;
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
    }
    .payment-box {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    button {
      padding: 12px 20px;
      background: #0d6efd;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #0b5ed7;
    }
  </style>
</head>
<body>
  <div class="payment-box">
    <h2>Buy Cricket Jersey</h2>
    <p>Price: ₹499</p>
    <button id="payBtn">Pay Now</button>
  </div>

  <!-- Razorpay JS -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    document.getElementById("payBtn").onclick = function(e) {
      var options = {
        "key": "<?php echo $keyId; ?>", 
        "amount": 49900, 
        "currency": "INR",
        "name": "Cricket Store",
        "description": "Jersey Purchase",
        "handler": function (response){
            fetch("", {   // same file handles verification
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payment_id: response.razorpay_payment_id })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    alert("✅ Payment Successful!");
                } else {
                    alert("❌ Payment Failed!");
                }
            });
        },
        "theme": { "color": "#0d6efd" }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();
    }
  </script>
</body>
</html>
