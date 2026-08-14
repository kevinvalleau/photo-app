class Payment < ApplicationRecord
  attr_accessor :email, :payment_method_id, :user_id
  belongs_to :user

  def self.month_options
    Date::MONTHNAMES.compact.each_with_index.map { |name, i| ["#{i+1} - #{name}", i+1]}
  end

  def self.year_options
    (Date.today.year..(Date.today.year+10)).to_a
  end

  def process_payment
    #customer = Stripe::Customer.create email: email, card: token
    #Stripe::Charge.create customer: customer.id,
    #amount: 1000,
    #description: 'Premium',
    #currency: 'usd'
    payment_intent = Stripe::PaymentIntent.create(
      amount: 1000,
      currency: "usd",
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    )
  end
end
