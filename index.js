// Import Stripe
const stripe = require('stripe')('<your_secret_key_here>');
// Import express
let express = require('express')

// Import Body parser
let bodyParser = require('body-parser');

// Initialize the app
let app = express();
var cors = require('cors')
app.use(cors())

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Setup server port
var port = process.env.PORT || 8888;
// Send message for default URL

const YOUR_DOMAIN = 'https://clothingcrown.com/poc/stripe';

// Define the endpoint for creating a checkout session
app.post('/create-session', async (req, res) => {
  console.log(req.body);

  var iphoneType = req.body.iphone;
  var email = req.body.email;
  var productData = {name: '', images: []};
  var unit_amount = 0;

  // Determine the product details based on the type received in the request
  if(iphoneType === 'xyz') {
    productData.name = 'xyz';
    productData.images.push('https://i.ibb.co/z8YdmXC/iphone-12-mini.png');
    unit_amount = 69900;
  } else if(iphoneType === 'abc') {
    productData.name = 'abc';
    productData.images.push('https://i.ibb.co/Tcj0zy4/iphone-12-pro.png');
    unit_amount = 99900;
  }

  console.log(productData);

  // Create a Checkout session using the Stripe API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'MY', 'IN'],
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: unit_amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html?session_id={CHECKOUT_SESSION_ID}`,
  });

  // Send the session ID as a JSON response
  res.json({ id: session.id });
});

// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running NodeJS, Express, Stripe checkout application on port " + port);
});
