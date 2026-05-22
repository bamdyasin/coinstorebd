// Blog Specific Scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog scripts loaded locally.');
    
    // Load Main Header & Footer Dynamically
    loadMainHeader();
    loadMainFooter();
    
    // Initialize Pagination if on index page
    initPagination();

    // Example: Dynamic copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

function initPagination() {
    const postsPerPage = 3;
    const posts = document.querySelectorAll('.blog-post-card');
    const paginationWrapper = document.getElementById('pagination-wrapper');
    
    if (posts.length <= postsPerPage || !paginationWrapper) return;

    const totalPages = Math.ceil(posts.length / postsPerPage);
    let currentPage = 1;

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        posts.forEach((post, index) => {
            if (index >= start && index < end) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        renderControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderControls() {
        let html = '';
        
        // Previous Button
        html += `<div class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="window.changePage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></div>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<div class="page-btn ${i === currentPage ? 'active' : ''}" onclick="window.changePage(${i})">${i}</div>`;
        }

        // Next Button
        html += `<div class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="window.changePage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></div>`;

        paginationWrapper.innerHTML = `<div class="pagination-container">${html}</div>`;
    }

    window.changePage = (page) => {
        if (page < 1 || page > totalPages) return;
        showPage(page);
    };

    // Initial show
    showPage(1);
}

async function loadMainHeader() {
    const headerPlaceholder = document.getElementById('main-header-placeholder');
    if (!headerPlaceholder) return;

    try {
        const response = await fetch('../includes/header.html');
        if (response.ok) {
            let html = await response.text();
            
            html = html.replaceAll('href="home.html', 'href="../home.html');
            html = html.replaceAll('href="index.html', 'href="../index.html');
            html = html.replaceAll('src="./assets/', 'src="../assets/');
            html = html.replaceAll('href="pages/', 'href="../pages/');
            
            headerPlaceholder.innerHTML = html;
            initBlogHeaderLogic();
        }
    } catch (error) {
        console.error('Error loading main header:', error);
    }
}

async function loadMainFooter() {
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (!footerPlaceholder) return;

    try {
        const response = await fetch('../includes/footer.html');
        if (response.ok) {
            let html = await response.text();
            
            // Adjust paths in footer
            html = html.replaceAll('href="index.html', 'href="../index.html');
            html = html.replaceAll('src="./assets/', 'src="../assets/');
            html = html.replaceAll('href="pages/', 'href="../pages/');
            
            footerPlaceholder.innerHTML = html;
            
            // Update WhatsApp and Social links if siteConfig is available
            if (typeof siteConfig !== 'undefined') {
                const waLinks = footerPlaceholder.querySelectorAll('a[href*="wa.me"]');
                waLinks.forEach(link => {
                    link.href = `https://wa.me/${siteConfig.whatsappNumber}`;
                });
            }
        }
    } catch (error) {
        console.error('Error loading main footer:', error);
    }
}

function initBlogHeaderLogic() {
    const menuTrigger = document.getElementById('mobile-menu-trigger');
    const navMenu = document.getElementById('nav-menu');
    const closeBtn = document.getElementById('nav-close-btn');

    if(menuTrigger && navMenu) {
        menuTrigger.addEventListener('click', () => navMenu.classList.add('active'));
    }
    if(closeBtn && navMenu) {
        closeBtn.addEventListener('click', () => navMenu.classList.remove('active'));
    }
}
