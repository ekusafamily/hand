export const initiateSTKPush = async (phone, amount, orderId) => {
    // Vite-specific env access
    const apiKey = import.meta.env.VITE_LIPIA_API_KEY;

    // Remove any non-digit characters (spaces, +, etc.)
    let rawPhone = phone.replace(/\D/g, '');
    let formattedPhone = rawPhone;

    // The API prefers local format (07... or 01...)
    // If it starts with 254, replace it with 0
    if (rawPhone.startsWith('254')) {
        formattedPhone = '0' + rawPhone.substring(3);
    }
    // If it's just 9 digits (e.g. 712...), add 0
    else if (rawPhone.length === 9) {
        formattedPhone = '0' + rawPhone;
    }
    // Otherwise leave it alone (it likely starts with 0)

    const paymentData = {
        phone_number: formattedPhone,
        amount: Math.ceil(amount), // Restore dynamic amount
        external_reference: orderId || `order_${Date.now()}`, // Use real Order ID
        callback_url: 'https://three-gyde.onrender.com/api/callback',
        metadata: {
            order_id: orderId || `ord_${Date.now()}`,
            customer_name: 'Customer'
        } // Optional
    };

    try {
        console.log('Sending Payment Request:', paymentData);

        const response = await fetch('https://lipia-api.kreativelabske.com/api/v2/payments/stk-push', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('Payment initiated:', result.data.TransactionReference);
            return {
                success: true,
                message: result.message,
                reference: result.data.TransactionReference
            };
        } else {
            console.error('Payment failed:', result.message);
            // Throwing error with customerMessage as per snippet
            throw new Error(result.customerMessage || result.message);
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        return {
            success: false,
            message: error.message || 'Failed to initiate payment.'
        };
    }
};
