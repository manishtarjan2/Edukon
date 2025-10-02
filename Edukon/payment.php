<?php
$id = $_GET['id']; // user ID from registration
?>
<?php include 'headerT.php'; ?>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h2 class="text-2xl font-bold mb-4">Complete Your Payment</h2>
  <button id="payBtn" class="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700">
    Pay ₹499
  </button>
</div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
document.getElementById("payBtn").onclick = function(e) {
  var options = {
      "key": "rzp_test_1234567890", // Replace with your Key ID
      "amount": 49900,
      "currency": "INR",
      "name": "Edukon Registration",
      "description": "Form Registration Payment",
      "handler": function (response){
          // Update backend with payment success
          fetch("update_payment.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: "id=<?= $id ?>&payment_id=" + response.razorpay_payment_id
          }).then(() => {
              alert("Payment successful! 🎉");
              window.location.href = "profile.php";
          });
      },
      "theme": { "color": "#2563eb" }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}
</script>

<?php include 'footerT.php'; ?>
