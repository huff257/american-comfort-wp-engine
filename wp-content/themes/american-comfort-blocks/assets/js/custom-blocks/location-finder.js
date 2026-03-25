document.addEventListener('DOMContentLoaded', () => {

    class LocationSearchPopup {

        constructor() {

            // ZIP codes you service
            this.serviceZips = [
            '30004',
            '30005',
            '30009',
            '30011',
            '30017',
            '30019',
            '30022',
            '30023',
            '30024',
            '30039',
            '30040',
            '30041',
            '30043',
            '30044',
            '30045',
            '30046',
            '30047',
            '30052',
            '30075',
            '30076',
            '30077',
            '30078',
            '30092',
            '30096',
            '30097',
            '30098',
            '30350',
            '30501',
            '30502',
            '30503',
            '30504',
            '30506',
            '30507',
            '30515',
            '30517',
            '30518',
            '30519',
            '30529',
            '30530',
            '30531',
            '30533',
            '30534',
            '30535',
            '30542',
            '30547',
            '30548',
            '30549',
            '30554',
            '30558',
            '30565',
            '30566',
            '30567',
            '30575',
            '30601',
            '30602',
            '30603',
            '30604',
            '30605',
            '30606',
            '30607',
            '30608',
            '30609',
            '30612',
            '30620',
            '30622',
            '30633',
            '30655',
            '30656',
            '30666',
            '30677',
            '30680',
            '30683'
            ];

            this.modal = null;

            // find the form
            this.form = document.querySelector('.location-search');

            if (!this.form) return;

            // button inside form
            this.button = this.form.querySelector('button');

            if (this.button) {
                this.button.addEventListener('click', (e) => this.handleSubmit(e));
            }
        }

        handleSubmit(event) {
            event.preventDefault();

            const input = this.form.querySelector('.wp-block-search__input');
            if (!input) return;

            const zip = input.value.trim();

            // DO NOTHING if empty
            if (!zip) return;

            const isServiced = this.serviceZips.includes(zip);

            const data = isServiced
                ? {
                    title: "Good News!",
                    content: `
                        <p>We service your area (${zip}).</p>
                        <p><strong>Click below to get scheduled now or give us a call.</strong></p>
                    `
                }
                : {
                    title: "Sorry!",
                    content: `<p>Unfortunately we do not service ZIP code ${zip} yet.</p>`
                };

            this.openModal(data, isServiced);
        }

        getModal() {

            if (!this.modal) {

                this.modal = document.createElement('div');
                this.modal.id = 'bb-location-modal';
                this.modal.style.display = 'none';

                this.modal.innerHTML = `
                    <div class="bb-location-finder-overlay"></div>
                    <div class="bb-location-content">
                        <button class="bb-location-close" aria-label="Close">&times;</button>
                        <div class="bb-location-inner"></div>
                    </div>
                `;

                document.body.appendChild(this.modal);

                this.modal.querySelector('.bb-location-finder-overlay')
                    .addEventListener('click', () => this.closeModal());

                this.modal.querySelector('.bb-location-close')
                    .addEventListener('click', () => this.closeModal());

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                });
            }

            return this.modal;
        }

        openModal(data, isServiced) {

            const modal = this.getModal();

            let buttons = '';

            if (isServiced) {
                buttons = `
                    <div class="wp-block-buttons modal-buttons-wrapper is-content-justification-center is-layout-flex">
                        <div class="wp-block-button ac-btn ac-red-btn se-booking-show">
                            <a class="wp-block-button__link has-custom-secondary-background-color has-background has-medium-font-size has-custom-font-size wp-element-button"
                               style="border-radius:2rem;font-style:normal;font-weight:800">
                               CLICK TO GET SCHEDULED NOW
                            </a>
                        </div>

                    </div>
                `;
            }

            modal.querySelector('.bb-location-inner').innerHTML = `
                <div class="ac-container">
                    <h2>${data.title}</h2>
                    ${data.content}
                    ${buttons}
                </div>
            `;

            modal.style.display = 'flex';
        }

        closeModal() {
            if (this.modal) this.modal.style.display = 'none';
        }

    }

    new LocationSearchPopup();

});