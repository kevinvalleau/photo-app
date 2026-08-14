import $ from "jquery";

window.$ = $;
window.jQuery = $;

const form = $(".cc_form");

if (form.length > 0) {
  const stripe = Stripe(
    document.querySelector(
      'meta[name="stripe-publishable-key"]'
    ).content
  );

  const elements = stripe.elements();

  const card = elements.create("card");

  card.mount("#card-element");

  card.on("change", function (event) {
    $("#card-errors").text(
      event.error ? event.error.message : ""
    );
  });

  form.on("submit", async function (event) {
    event.preventDefault();

    const submitButton = form.find("input[type=submit]");
    submitButton.prop("disabled", true);

    const { paymentMethod, error } =
      await stripe.createPaymentMethod({
        type: "card",
        card: card
      });

    if (error) {
      $("#card-errors").text(error.message);
      submitButton.prop("disabled", false);
      return;
    }

    $("<input>")
      .attr({
        type: "hidden",
        name: "payment[payment_method_id]"
      })
      .val(paymentMethod.id)
      .appendTo(form);

    form.off("submit").submit();
  });
}
