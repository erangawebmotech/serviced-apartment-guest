const defaultNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;


export function sendWhatsappMessage(message: string, phoneNumber = defaultNumber) {
    if (!phoneNumber) {
        console.error('WhatsApp phone number is missing!')
        return
    }

    if (!message?.trim()) {
        console.error("Message is empty");
        return;
    }
    
    const encodedMsg = encodeURIComponent(message.trim())
    const url = `https://wa.me/${phoneNumber}?text=${encodedMsg}`

    if (typeof window !== 'undefined') {
        window.open(url, '_blank')
    } else {
        console.warn('Window object is not available')
    }
}


export const RequestWhatsappChat = {

    greeting: () => {
        const message = `Hello 👋`;
        sendWhatsappMessage(message);
    },

};