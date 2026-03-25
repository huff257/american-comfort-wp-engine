(function () {
    const cache = {};

    function getModal() {
        let modal = document.getElementById('bb-coupon-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bb-coupon-modal';

            modal.innerHTML = `
                <div class="bb-coupon-overlay"></div>
                <div class="bb-coupon-content"></div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.bb-coupon-overlay')
                .addEventListener('click', closeModal);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        }

        return modal;
    }

    function openModal(html) {
        const modal = getModal();
        modal.querySelector('.bb-coupon-content').innerHTML = html;
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('bb-coupon-modal');
        if (modal) modal.style.display = 'none';
    }

    async function fetchCoupon(id) {
        if (cache[id]) return cache[id];

        const res = await fetch(`/wp-json/wp/v2/coupon/${id}`);
        const post = await res.json();

        const html = post?.content?.rendered || '';
        cache[id] = html;

        return html;
    }

    async function open(id) {
        const html = await fetchCoupon(id);
        openModal(html);
    }

    // expose globally for loader
    window.BBCouponPopup = {
        open
    };
})();