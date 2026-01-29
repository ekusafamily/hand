
// Run this script to simulate a successful M-Pesa Callback to your local server
// 1. Make sure your local server is running (node server/index.js)
// 2. Make sure you have a PENDING order in Supabase with amount 5 (or whatever you set below) 
// 3. Run: node server/simulate_callback.js

// Native fetch is available in Node.js 18+

const PORT = 3000;
const URL = `http://localhost:${PORT}/api/callback`;

const simulateCallback = async () => {
    const payload = {
        "response": {
            "Amount": 5,
            "CheckoutRequestID": "ws_CO_Example123",
            "ExternalReference": "REPLACE_WITH_REAL_ORDER_ID_FROM_SUPABASE",
            "MerchantRequestID": "5efa-4ea3",
            "MpesaReceiptNumber": "UAS6M58SIM",
            "Phone": "254702322277",
            "ResultCode": 0,
            "ResultDesc": "The service request is processed successfully.",
            "Metadata": {
                "order_id": "REPLACE_WITH_REAL_ORDER_ID_FROM_SUPABASE",
                "customer_name": "Customer"
            },
            "Status": "Success"
        },
        "status": true
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('Callback sent. Status:', response.status);
    } catch (e) {
        console.error('Error sending callback:', e);
    }
};

simulateCallback();
