import { renderCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cartList = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutButton = document.querySelector(".btn-checkout");
  let total = 0;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view your cart.");
    window.location.href = "./login.html";
    return;
  }

  let cart;

  // Fetch user data first
  fetch("/api/auth/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 401) {
        window.location.href = "login.html";
        return null;
      }
      return res.json();
    })
    .then((userData) => {
      if (!userData) return;

      // Pre-fill shipping information if user has address data
      if (userData.address) {
        // Get all input fields within the shipping address card
        const shippingCard = document.querySelector(".card.p-4.shadow-sm.mt-4");
        const inputs = shippingCard.querySelectorAll("input");

        // Set values for each input
        inputs[0].value = userData.name || ""; // Full Name
        inputs[1].value = userData.address.street || ""; // Street Address
        inputs[2].value = userData.address.city || ""; // City
        inputs[3].value = userData.address.zip || ""; // Zip Code

        // Set country
        const countrySelect = document.getElementById("country");
        if (countrySelect) {
          countrySelect.value = userData.address.country || "";
        }

        // Pre-fill contact information
        const contactCard = document.querySelectorAll(
          ".card.p-4.shadow-sm.mt-4"
        )[1];
        const contactInputs = contactCard.querySelectorAll("input");
        contactInputs[0].value = userData.email || ""; // Email
        contactInputs[1].value = userData.phone || ""; // Phone
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
    });

  try {
    const res = await fetch("/api/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart items");
    }

    cart = await res.json();
    cartList.innerHTML = "";

    cart.items.forEach((item) => {
      const variant = item.productId.variants.find(
        (v) => v._id === item.variantId
      );
      if (!variant) {
        console.error("Variant not found for item:", item);
        return;
      }
      const originalPrice = item.productId.price;
      const discount = variant.discount || 0;
      const unitPrice = +(originalPrice * (1 - discount / 100)).toFixed(2);

      // Create list item for each cart item
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${item.productId.name} (Color: ${variant.color}, Size: ${variant.size}, Quantity: ${item.quantity})`;

      const span = document.createElement("span");
      span.textContent = `$${(unitPrice * item.quantity).toFixed(2)}`;
      li.appendChild(span);

      cartList.appendChild(li);
      total += unitPrice * item.quantity;
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
  } catch (err) {
    console.error("Error fetching cart items:", err);
    cartList.innerHTML =
      '<li class="list-group-item text-danger">Failed to load cart items. Please try again later.</li>';
    return;
  }

  // Handle checkout button click
  checkoutButton.addEventListener("click", async () => {
    const shippingCard = document.querySelector(".card.p-4.shadow-sm.mt-4");
    const inputs = shippingCard.querySelectorAll("input");

    const shippingInfo = {
      name: inputs[0].value,
      address: inputs[1].value,
      city: inputs[2].value,
      zip: inputs[3].value,
      country: document.getElementById("country").value,
    };

    if (
      !shippingInfo.name ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zip ||
      !shippingInfo.country
    ) {
      alert("Please fill in all shipping information.");
      return;
    }

    // Check if terms and conditions are accepted
    const termsCheckbox = document.getElementById("termsCheck");
    if (!termsCheckbox.checked) {
      alert("Please agree to the terms and conditions to proceed.");
      return;
    }

    try {
      const res = await fetch("/api/orders/myorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.items,
          shippingInfo,
          totalPrice: total,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      alert("Order placed successfully!");
      window.location.href = "./orders.html"; // Redirect to orders page
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  });
});

// Render the cart in the offcanvas
renderCart();
