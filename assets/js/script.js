// JavaScript code for COINSTORE.BD

const getPaymentData = () => siteConfig.payments;

// Utility for value animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function calculateEstimates() {
    const promoType = document.querySelector('select[name="promo_type"]')?.value;
    const budgetInput = document.getElementById('budget_val');
    if (!promoType || !budgetInput) return;

    const budget = parseInt(budgetInput.value) || 0;
    const estimateBox = document.getElementById('estimate_box');
    const resultsDiv = document.getElementById('estimate_results');
    
    if (budget < 200) {
        if (estimateBox) estimateBox.classList.add('d-none');
        return;
    }

    const rates = siteConfig.rates[promoType] || {};
    const fields = [
        { key: 'view', label: 'ভিউ', icon: 'bi-eye' },
        { key: 'like', label: 'লাইক', icon: 'bi-heart' },
        { key: 'comment', label: (promoType === 'Likes & Comments' ? 'লাইক, কমেন্ট' : 'কমেন্ট'), icon: (promoType === 'Likes & Comments' ? 'bi-chat-heart' : 'bi-chat-text') },
        { key: 'follower', label: 'ফলোয়ার', icon: 'bi-people' }
    ];

    let html = '<div class="estimate-badge"><span class="lowest-badge">সর্বনিম্ন <i class="bi bi-caret-right-fill ms-1" style="color: #24E8E3;"></i></span></div>';
    
    fields.forEach(f => {
        if (promoType === 'Likes & Comments' && f.key === 'like') return;
        const rate = parseFloat(rates[f.key]) || 0;
        if (rate > 0) {
            const total = Math.floor(budget * rate);
            html += `
                <div class="estimate-badge" style="margin-left: 10px;">
                    <i class="bi ${f.icon}"></i>
                    <label>${f.label}:</label>
                    <span class="count-target" data-final="${total}">0</span>
                </div>`;
        }
    });

    resultsDiv.innerHTML = html;
    if (estimateBox) estimateBox.classList.remove('d-none');

    resultsDiv.querySelectorAll('.count-target').forEach(el => {
        const endVal = parseInt(el.getAttribute('data-final'));
        animateValue(el, 0, endVal, 800);
    });
}

function updatePaymentInfo() {
    const paymentData = getPaymentData();
    const select = document.getElementById('payment_method');
    const infoBox = document.getElementById('payment_info_box');
    const methodDisplay = document.getElementById('method_display');
    const accountType = document.getElementById('account_type');
    const paymentNumber = document.getElementById('payment_number');

    if (!select || !infoBox) return;

    const selected = select.value;

    if (selected && paymentData[selected]) {
        methodDisplay.innerText = selected;
        accountType.innerText = paymentData[selected].type;
        paymentNumber.innerText = paymentData[selected].number;
        infoBox.classList.remove('d-none');
    } else {
        infoBox.classList.add('d-none');
    }
}

function copyNumber() {
    const numberEl = document.getElementById('payment_number');
    if (!numberEl) return;
    
    const number = numberEl.innerText;
    navigator.clipboard.writeText(number).then(() => {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2"></i> Copied';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 2000);
    });
}

function updateBudget(change) {
    const input = document.getElementById('budget_val');
    if (!input) return;
    
    let newVal = parseInt(input.value) + change;
    if (newVal < 200) newVal = 200;
    input.value = newVal;
    calculateEstimates();
}

function updateCoins(change) {
    const input = document.getElementById('coin_val');
    if (!input) return;
    
    let newVal = parseInt(input.value) + change;
    if (newVal < 50) newVal = 50;
    input.value = newVal;
    calculateCoinPrice();
}

function calculateCoinPrice() {
    const input = document.getElementById('coin_val');
    const infoDiv = document.getElementById('coin_price_info');
    if (!input || !infoDiv) return;
    
    const coinAmount = parseInt(input.value) || 0;
    const coinRate = parseFloat(siteConfig.coinRate) || 2;
    const totalPrice = coinAmount * coinRate;
    
    if (coinAmount >= 50) {
        infoDiv.innerHTML = `<i class="bi bi-info-circle me-1"></i> মোট দাম: <span class="text-tiktok-sm fw-bold">${totalPrice.toLocaleString()} টাকা</span> (১টি = ${coinRate} টাকা)`;
    } else {
        infoDiv.innerHTML = `<i class="bi bi-info-circle me-1"></i> ১টি কয়েন = ${coinRate} টাকা (সর্বনিম্ন ৫০টি)`;
    }
}

function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const titleEl = document.getElementById('successTitle');
    const msgEl = document.getElementById('successMessage');
    
    if (modal && titleEl && msgEl) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        modal.style.display = 'flex';
    }
}

function validateTikTokForm() {
    const boostTab = document.getElementById('boost-tab');
    const isBoostActive = boostTab ? boostTab.classList.contains('active') : false;
    const serviceType = isBoostActive ? 'Boost' : 'Coin';
    
    const whatsapp = document.getElementsByName('whatsapp')[0].value;
    const trxid = document.getElementsByName('trxid')[0].value;
    const videoLink = document.getElementById('video_url_input')?.value;
    const paymentMethod = document.getElementById('payment_method')?.value;

    if (!/^\d{11}$/.test(whatsapp)) {
        alert("অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের হোয়াটসঅ্যাপ নম্বর দিন।");
        return false;
    }

    if (serviceType === 'Boost') {
        if (!videoLink || !videoLink.includes('tiktok.com')) {
            alert("অনুগ্রহ করে একটি সঠিক টিকটক ভিডিও লিংক দিন।");
            return false;
        }
    } else {
        const coinAmount = parseInt(document.getElementById('coin_val')?.value);
        if (coinAmount < 50) {
            alert("সর্বনিম্ন ৫০টি কয়েন অর্ডার করতে হবে।");
            return false;
        }
    }

    if (!paymentMethod) {
        alert("অনুগ্রহ করে পেমেন্ট মাধ্যম সিলেক্ট করুন।");
        return false;
    }

    if (trxid.length < 6 || !/^[a-zA-Z0-9]+$/.test(trxid)) {
        alert("অনুগ্রহ করে একটি সঠিক Transaction ID দিন।");
        return false;
    }

    // Duplicate TrxID check
    let orders = JSON.parse(localStorage.getItem('user_orders')) || [];
    if (orders.some(o => o.trxid.trim() === trxid.trim())) {
        showSuccessModal("অর্ডারটি ইতিমধ্যে করা হয়েছে!", "আপনি এই ট্রানজেকশন আইডি দিয়ে ইতিমধ্যে অর্ডার করেছেন। দ্রুত সার্ভিস পেতে কাস্টমার সার্ভিসে যোগাযোগ করুন।");
        return false;
    }

    try {
        const now = Date.now();
        const promoType = serviceType === 'Boost' ? document.querySelector('select[name="promo_type"]').value : 'N/A';
        const finalAmount = serviceType === 'Boost' ? document.getElementById('budget_val').value : document.getElementById('coin_val').value;
        
        const orderData = {
            serviceType: serviceType,
            promoType: promoType,
            whatsapp: whatsapp,
            trxid: trxid,
            paymentMethod: paymentMethod,
            timestamp: now,
            formattedTime: new Date().toLocaleString(),
            amount: finalAmount,
            videoLink: videoLink || 'N/A',
            status: 'Received'
        };

        orders.unshift(orderData);
        if (orders.length > 50) orders.pop();
        localStorage.setItem('user_orders', JSON.stringify(orders));
        
        showSuccessModal("অর্ডার সফল হয়েছে!", "আপনার অর্ডারটি আমাদের কাছে সফলভাবে পৌঁছেছে। আমরা শীঘ্রই এটি প্রসেস করবো। আপনার TrxID: " + trxid);
    } catch (e) {
        console.error("Save error:", e);
        showSuccessModal("ত্রুটি!", "অর্ডার সেভ করতে সমস্যা হয়েছে।");
    }

    return false; // Prevent default form submission since we are handling via JS
}

let countdownInterval;

function checkStatus() {
    const trxidInput = document.getElementById('header_trxid_search');
    if (!trxidInput) return;
    
    const trxid = trxidInput.value.trim();
    if (!trxid) {
        alert("দয়া করে ট্রানজেকশন আইডি দিন।");
        return;
    }
    
    const modal = document.getElementById('statusModal');
    const resultDiv = document.getElementById('statusResult');
    
    if (!modal || !resultDiv) return;
    
    if (typeof countdownInterval !== 'undefined') clearInterval(countdownInterval);

    let orders = JSON.parse(localStorage.getItem('user_orders')) || [];
    let foundOrder = orders.find(o => o.trxid.trim() === trxid);

    if (foundOrder) {
        modal.style.display = 'block';
        
        const updateUI = () => {
            const now = Date.now();
            const elapsed = now - foundOrder.timestamp;
            const oneMinute = 1 * 60 * 1000;
            const tenMinutes = 10 * 60 * 1000;

            if (elapsed < oneMinute) {
                const remaining = oneMinute - elapsed;
                const seconds = Math.floor(remaining / 1000);
                const timeStr = seconds.toString().padStart(2, '0');
                
                resultDiv.innerHTML = `
                <div class="text-center">
                    <div class="status-glow-card mb-4" style="background: rgba(255, 215, 0, 0.03); border: 1.5px solid rgba(255, 215, 0, 0.4); border-radius: 20px; padding: 15px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.15); position: relative; overflow: hidden;">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="countdown-box" style="background: rgba(0, 0, 0, 0.4); border: 1.5px solid rgba(255, 215, 0, 0.3); padding: 8px 20px; border-radius: 12px; box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.1), 0 0 15px rgba(255, 215, 0, 0.1); display: inline-flex; align-items: baseline; gap: 8px; min-width: 160px; justify-content: center;">
                                <div class="time-part">
                                    <span class="font-monospace fw-bold" style="color: #fff; font-size: 1.6rem; text-shadow: 0 0 8px rgba(255,215,0,0.6);">0</span>
                                    <span style="font-size: 0.7rem; color: #ffd700; font-weight: 700; margin-left: 2px;">min</span>
                                </div>
                                <span style="color: #ffd700; font-weight: bold; font-size: 1.4rem; opacity: 0.8;">:</span>
                                <div class="time-part">
                                    <span class="font-monospace fw-bold" style="color: #fff; font-size: 1.6rem; text-shadow: 0 0 8px rgba(255,215,0,0.6);">${timeStr}</span>
                                    <span style="font-size: 0.7rem; color: #ffd700; font-weight: 700; margin-left: 2px;">sec</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-compact mb-3" style="background: rgba(255,255,255,0.02); border-radius: 15px; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <div class="d-flex justify-content-between mb-1" style="font-size: 0.8rem;">
                            <span class="text-white-50">সার্ভিস:</span>
                            <span class="fw-600 text-white">${foundOrder.serviceType === 'Boost' ? foundOrder.promoType : foundOrder.serviceType}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1" style="font-size: 0.8rem;">
                            <span class="text-white-50">পরিমাণ:</span>
                            <span class="fw-600 text-warning">${foundOrder.amount} Taka</span>
                        </div>
                        <div class="d-flex justify-content-between" style="font-size: 0.8rem;">
                            <span class="text-white-50">TrxID:</span>
                            <span class="text-info font-monospace">${foundOrder.trxid}</span>
                        </div>
                    </div>

                    <a href="https://wa.me/${siteConfig.whatsappNumber}" target="_blank" class="btn btn-sm w-100 py-2 mb-2" style="background: linear-gradient(45deg, #25D366, #128C7E); color: white; border-radius: 50px; font-weight: 700; font-size: 0.9rem; border: none; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); letter-spacing: 1px;">
                        <i class="fab fa-whatsapp me-2"></i> Chat Now
                    </a>
                    <button onclick="closeStatusModal()" class="btn btn-link text-white-50 text-decoration-none w-100 p-0 small" style="font-size: 0.75rem;">বন্ধ করুন</button>
                </div>`;
            } else {
                // Completed/Pending state (Professional Layout)
                const statusText = (elapsed < tenMinutes) ? 'PENDING' : 'COMPLETED';
                const statusColor = (elapsed < tenMinutes) ? '#3b82f6' : '#2ecc71';
                const statusIcon = (elapsed < tenMinutes) ? 'bi-hourglass-split' : 'bi-check2-circle';
                
                resultDiv.innerHTML = `
                <div class="text-center">
                    <h5 class="mb-4" style="color: #ffd700; font-weight: 700;">অর্ডার স্ট্যাটাস</h5>
                    <div class="status-card mb-4">
                        <i class="bi ${statusIcon} fs-1 d-block mb-2" style="color: ${statusColor};"></i>
                        <span class="fw-bold fs-5" style="color: ${statusColor};">${statusText}</span>
                    </div>
                    <div class="mb-4">
                        <div class="info-item"><span class="info-label">সার্ভিস</span><span class="info-value">${foundOrder.serviceType === 'Boost' ? foundOrder.promoType : foundOrder.serviceType}</span></div>
                        <div class="info-item"><span class="info-label">পরিমাণ</span><span class="info-value">${foundOrder.amount} Taka</span></div>
                        <div class="info-item"><span class="info-label">TrxID</span><span class="info-value text-info">${foundOrder.trxid}</span></div>
                        <div class="info-item"><span class="info-label">সময়</span><span class="info-value">${foundOrder.formattedTime || 'N/A'}</span></div>
                    </div>
                    ${elapsed >= oneMinute ? `
                        <div class="mt-3">
                            <a href="https://wa.me/${siteConfig.whatsappNumber}" target="_blank" class="btn btn-sm w-100 py-2" style="background: linear-gradient(45deg, #25D366, #128C7E); color: white; border-radius: 50px; font-weight: 700; font-size: 0.9rem; border: none; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); text-transform: uppercase; letter-spacing: 1px;">
                                <i class="fab fa-whatsapp me-2"></i> CHAT NOW
                            </a>
                        </div>
                    ` : ''}
                    <button onclick="closeStatusModal()" class="btn btn-link text-white-50 text-decoration-none w-100 p-0 mt-3 small">বন্ধ করুন</button>
                </div>`;
                if (countdownInterval) clearInterval(countdownInterval);
            }
        };

        updateUI();
        const currentElapsed = Date.now() - foundOrder.timestamp;
        if (currentElapsed < 600000) { // 10 minutes
            countdownInterval = setInterval(updateUI, 1000);
        }
    } else {
        resultDiv.innerHTML = `
            <div class="text-center p-2">
                <i class="bi bi-exclamation-circle text-danger display-4 d-block mb-3"></i>
                <h5 class="text-white mb-2">অর্ডার পাওয়া যায়নি!</h5>
                <p class="text-white-50 small mb-4">TrxID-টি সঠিক কিনা চেক করুন।</p>
                <button class="btn btn-tiktok w-100 rounded-pill" onclick="closeStatusModal()">আবার চেষ্টা করুন</button>
            </div>`;
        modal.style.display = 'block';
    }
}

function closeStatusModal() {
    if (countdownInterval) clearInterval(countdownInterval);
    const modal = document.getElementById('statusModal');
    if (modal) modal.style.display = 'none';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const menuTrigger = document.getElementById('mobile-menu-trigger');
    const navMenu = document.getElementById('nav-menu');
    const closeBtn = document.getElementById('nav-close-btn');

    if(menuTrigger && navMenu) {
        menuTrigger.addEventListener('click', () => navMenu.classList.add('active'));
    }
    if(closeBtn && navMenu) {
        closeBtn.addEventListener('click', () => navMenu.classList.remove('active'));
    }

    const boostTabBtn = document.getElementById('boost-tab');
    const coinTabBtn = document.getElementById('coin-tab');

    if(boostTabBtn && coinTabBtn) {
        boostTabBtn.addEventListener('shown.bs.tab', function () {
            document.getElementById('service_type_input').value = 'Boost';
            document.getElementById('video_link_section').style.display = 'block';
            document.getElementById('video_url_input').setAttribute('required', 'required');
            document.getElementById('rule_public').innerText = 'ভিডিও অবশ্যই পাবলিক হতে হবে (Private ভিডিওতে কাজ হবে না)।';
            
            // Reset and Update Button
            document.getElementById('payment_method').value = '';
            document.getElementById('payment_info_box').classList.add('d-none');
            document.getElementById('submit_order_btn').innerHTML = 'বুস্ট অর্ডার করুন <i class="bi bi-arrow-right-circle ms-2"></i>';
            
            calculateEstimates();
        });

        coinTabBtn.addEventListener('shown.bs.tab', function () {
            document.getElementById('service_type_input').value = 'Coin';
            document.getElementById('video_link_section').style.display = 'none';
            document.getElementById('video_url_input').removeAttribute('required');
            document.getElementById('rule_public').innerText = 'দ্রুত সার্ভিস পেতে সাপোর্ট এ যোগাযোগ করুন।';
            
            // Reset and Update Button
            document.getElementById('payment_method').value = '';
            document.getElementById('payment_info_box').classList.add('d-none');
            document.getElementById('submit_order_btn').innerHTML = 'কয়েন অর্ডার করুন <i class="bi bi-arrow-right-circle ms-2"></i>';
            
            calculateCoinPrice();
        });
    }

    calculateEstimates();
    calculateCoinPrice();
    
    const checkBtn = document.querySelector('header .btn-danger');
    if(checkBtn) checkBtn.addEventListener('click', checkStatus);

    // Payment Options Loading
    const paymentSelect = document.getElementById('payment_method');
    
    function populatePaymentMethods() {
        if (!paymentSelect) return;
        
        // Ensure options are cleared
        paymentSelect.innerHTML = '<option value="" selected="" disabled="">পছন্দ করুন</option>';
        
        if (typeof siteConfig !== 'undefined' && siteConfig.payments) {
            Object.keys(siteConfig.payments).forEach(method => {
                const option = document.createElement('option');
                option.value = method;
                option.text = method;
                paymentSelect.appendChild(option);
            });
            console.log("Payment methods populated successfully.");
        } else {
            console.error("siteConfig.payments is not accessible yet.");
        }
    }

    // Call it when DOM is ready
    populatePaymentMethods();
    
    // Also re-call on tab switch just in case
    if(boostTabBtn && coinTabBtn) {
        [boostTabBtn, coinTabBtn].forEach(btn => {
            btn.addEventListener('shown.bs.tab', populatePaymentMethods);
        });
    }

    // Set WhatsApp Numbers
    if (typeof siteConfig !== 'undefined') {
        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        waLinks.forEach(link => {
            link.href = `https://wa.me/${siteConfig.whatsappNumber}`;
        });
        window.supportWhatsApp = siteConfig.whatsappNumber;

        // Update Footer Social Links
        const socialLinks = siteConfig.socialLinks;
        if (socialLinks) {
            const fbLink = document.querySelector('a[title="Facebook"]');
            const waLink = document.querySelector('a[title="WhatsApp"]');
            const ytLink = document.querySelector('a[title="YouTube"]');
            const tgLink = document.querySelector('a[title="Telegram"]');
            const ttLink = document.querySelector('a[title="TikTok"]');
            const locLink = document.querySelector('a[title="Our Location"]');

            if (fbLink) fbLink.href = socialLinks.facebook;
            if (waLink) waLink.href = socialLinks.whatsapp;
            if (ytLink) ytLink.href = socialLinks.youtube;
            if (tgLink) tgLink.href = socialLinks.telegram;
            if (ttLink) ttLink.href = socialLinks.tiktok;
            if (locLink) locLink.href = socialLinks.location;
        }
    }

    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => {
            if (event.target === m) m.style.display = 'none';
        });
    };
});
