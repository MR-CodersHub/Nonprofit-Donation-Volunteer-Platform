/**
 * Custom JavaScript Extensions for Home 2 & Blog Pages
 */
document.addEventListener('DOMContentLoaded', () => {

    // Helper: Show Toast Notification (reusing system toast if available, otherwise creating one)
    function triggerCustomToast(message, type = 'success') {
        const existingToast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = existingToast ? existingToast.querySelector('.toast-icon') : null;

        if (existingToast && toastMessage) {
            toastMessage.innerText = message;
            if (type === 'success') {
                existingToast.style.borderLeftColor = 'var(--clr-secondary)';
                if (toastIcon) {
                    toastIcon.className = 'fa-solid fa-circle-check toast-icon';
                    toastIcon.style.color = 'var(--clr-secondary)';
                }
            } else {
                existingToast.style.borderLeftColor = 'var(--clr-accent)';
                if (toastIcon) {
                    toastIcon.className = 'fa-solid fa-circle-xmark toast-icon';
                    toastIcon.style.color = 'var(--clr-accent)';
                }
            }
            existingToast.classList.remove('hidden');
            existingToast.classList.add('show');
            setTimeout(() => {
                existingToast.classList.remove('show');
                setTimeout(() => existingToast.classList.add('hidden'), 300);
            }, 5000);
        } else {
            alert(message);
        }
    }

    // ==========================================================================
    // 1. Reading Progress Bar (for Article Detail pages)
    // ==========================================================================
    const progressIndicator = document.getElementById('reading-progress');
    if (progressIndicator) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressIndicator.style.width = scrolled + '%';
        });
    }

    // ==========================================================================
    // 2. Infinite Partner Marquee Duplicator
    // ==========================================================================
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const marqueeItems = Array.from(marqueeTrack.children);
        // Clone and append to create the seamless loop
        marqueeItems.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    // ==========================================================================
    // 3. Circular Progress Ring Animator (IntersectionObserver)
    // ==========================================================================
    const progressCircle = document.querySelector('.circle-progress-bar');
    if (progressCircle) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Set stroke-dashoffset to represent 70% (207.3)
                    progressCircle.style.strokeDashoffset = '207';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(progressCircle);
    }

    // ==========================================================================
    // 4. Live Donation Simulation Feed
    // ==========================================================================
    const feedItemsContainer = document.querySelector('.feed-items');
    if (feedItemsContainer) {
        const names = ['Michael K.', 'Elena S.', 'Sarah & Dave', 'Liam P.', 'Robert M.', 'Jessica H.', 'Thomas D.', 'Chloe B.'];
        const campaigns = ['Clean Water Haiti', 'Rural Uganda School', 'Amazon Trees Fund', 'Disaster Relief'];
        const amounts = [15, 25, 50, 100, 150, 200, 500];

        setInterval(() => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
            const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
            const initials = randomName.split(' ').map(n => n[0]).join('');

            const itemHTML = `
                <div class="feed-item" style="animation: slideDown 0.5s forwards;">
                    <div class="feed-avatar">${initials}</div>
                    <div class="feed-details">
                        <h5>${randomName}</h5>
                        <p>to ${randomCampaign}</p>
                    </div>
                    <div class="feed-amount">+$${randomAmount}</div>
                </div>
            `;

            // Insert new item at the top
            feedItemsContainer.insertAdjacentHTML('afterbegin', itemHTML);
            
            // Remove last item if too many
            if (feedItemsContainer.children.length > 5) {
                feedItemsContainer.removeChild(feedItemsContainer.lastElementChild);
            }
        }, 8000);
    }

    // Add keyframe style dynamically for donor feed slide animation
    if (feedItemsContainer) {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-15px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================================
    // 5. Interactive Share Buttons
    // ==========================================================================
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUrl = window.location.href;
            
            if (btn.classList.contains('share-copy')) {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    triggerCustomToast('Article link copied to clipboard!', 'success');
                }).catch(() => {
                    triggerCustomToast('Unable to copy link.', 'error');
                });
            } else {
                let shareName = 'Social';
                if (btn.classList.contains('share-fb')) shareName = 'Facebook';
                if (btn.classList.contains('share-tw')) shareName = 'Twitter';
                if (btn.classList.contains('share-ln')) shareName = 'LinkedIn';
                
                triggerCustomToast(`Redirecting to share on ${shareName}...`, 'success');
                setTimeout(() => {
                    window.open(`https://example.com/share?url=${encodeURIComponent(currentUrl)}`, '_blank');
                }, 800);
            }
        });
    });

    // ==========================================================================
    // 6. Interactive Blog Comments Submission
    // ==========================================================================
    const commentForm = document.getElementById('commentForm');
    const commentList = document.querySelector('.comment-list');
    
    if (commentForm && commentList) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const message = document.getElementById('commentMessage').value;
            const name = document.getElementById('commentName').value;
            const email = document.getElementById('commentEmail').value;
            
            if (!message || !name || !email) {
                triggerCustomToast('Please fill out all comments fields.', 'error');
                return;
            }
            
            // Format today's date
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);
            const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

            // Create comment HTML element
            const commentHTML = `
                <div class="comment-item" style="animation: slideDown 0.5s forwards;">
                    <div class="comment-avatar" style="background-color: var(--clr-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700;">
                        ${initials}
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <div>
                                <h5>${name}</h5>
                                <span class="comment-date">${formattedDate}</span>
                            </div>
                            <a href="#" class="reply-btn"><i class="fa-solid fa-reply"></i> Reply</a>
                        </div>
                        <p class="comment-text">${message}</p>
                    </div>
                </div>
            `;
            
            commentList.insertAdjacentHTML('beforeend', commentHTML);
            triggerCustomToast('Your comment has been posted successfully!', 'success');
            commentForm.reset();
            
            // Update comment count header
            const commentsTitle = document.querySelector('.comments-title');
            if (commentsTitle) {
                const match = commentsTitle.innerText.match(/\d+/);
                if (match) {
                    const newCount = parseInt(match[0]) + 1;
                    commentsTitle.innerText = `Comments (${newCount})`;
                }
            }
        });
    }
});
