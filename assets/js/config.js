// Configuration for COINSTORE.BD
// Apni ekhane khub sahaje data gulo change korte parben.

const siteConfig = {
    // Payment Numbers
    payments: {
        'bKash': { number: '01845464034', type: 'Personal' },
        'Nagad': { number: '01845464034', type: 'Personal' },
        'Rocket': { number: '01845464034', type: 'Personal' }
    },
    
    // Service Rates (Rate per unit of budget)
    // Budget * rate = results
    rates: {
        'Video Views': { view: 21, like: 10, comment: 0, follower: 0 },
        'Likes & Comments': { view: 20, like: 0, comment: 10, follower: 0 },
        'More Followers': { view: 17, like: 0, comment: 0, follower: 3.1 }
    },
    
    // Cost per coin (e.g., 2 taka per coin)
    coinRate: 2,

    // WhatsApp Support Number
    whatsappNumber: '8801845464021',

    // Social Media Links
    socialLinks: {
        facebook: 'https://facebook.com/coinstorebd',
        whatsapp: 'https://wa.me/8801845464021',
        youtube: 'https://youtube.com/@coinstorebd',
        telegram: 'https://t.me/coinstorebd',
        tiktok: 'https://tiktok.com/@coinstorebd',
        location: 'https://maps.google.com/?q=Your+Location'
    }
};
