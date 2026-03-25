document.addEventListener('DOMContentLoaded', () => {
    class BBCouponPopup {
        constructor() {
            this.cache = {};
            this.modal = null;

            // Find all coupon wrapper blocks
            this.blocks = Array.from(document.querySelectorAll('.bb-coupon-wrapper'));

            // Preload all coupon content immediately
            this.blocks.forEach(block => {
                const id = block.dataset.couponId;
                if (id) this.fetchCoupon(id);
            });

            // Bind click events
            this.blocks.forEach(block => {
                block.addEventListener('click', (e) => this.handleClick(e, block));
            });
        }

        async fetchCoupon(id) {
            if (this.cache[id]) return this.cache[id];

            try {
                const res = await fetch(`/wp-json/wp/v2/coupon/${id}`);
                if (!res.ok) throw new Error('Coupon fetch failed');
                const post = await res.json();
                // store as object with title and content
                this.cache[id] = {
                    title: post?.title?.rendered || '',
                    content: post?.content?.rendered || ''
                };
                return this.cache[id];
            } catch (err) {
                console.error('Failed to fetch coupon', id, err);
                return { title: '', content: '' };
            }
        }

        async handleClick(event, block) {
            event.preventDefault();
            const id = block.dataset.couponId;
            if (!id) return;

            let data = this.cache[id];
            if (!data) {
                data = await this.fetchCoupon(id);
            }

            this.openModal(data);
        }

        getModal() {
            if (!this.modal) {
                this.modal = document.createElement('div');
                this.modal.id = 'bb-coupon-modal';
                this.modal.style.display = 'none';
                this.modal.innerHTML = `
                    <div class="bb-coupon-overlay"></div>
                    <div class="bb-coupon-content">
                        <button class="bb-coupon-close" aria-label="Close">&times;</button>
                        <div class="bb-coupon-inner"></div>
                    </div>
                `;
                document.body.appendChild(this.modal);

                this.modal.querySelector('.bb-coupon-overlay')
                    .addEventListener('click', () => this.closeModal());

                this.modal.querySelector('.bb-coupon-close')
                    .addEventListener('click', () => this.closeModal());

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                });
            }

            return this.modal;
        }

        openModal(data) {
            const modal = this.getModal();
            // make sure we use the properties, not the object itself
            modal.querySelector('.bb-coupon-inner').innerHTML = `
                <div class="ac-container">
                    <h2>${data.title}</h2>
                    ${data.content}
                </div>
            `;
            modal.style.display = 'flex';
        }


        closeModal() {
            if (this.modal) this.modal.style.display = 'none';
        }
    }

    new BBCouponPopup();
});