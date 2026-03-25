import Ajv from 'ajv';

export class LayoutJSONValidator {
    constructor(initialValue, errorContainerSelector, schema) {
        this.value = initialValue; // string containing JSON
        this.errorContainer = document.querySelector(errorContainerSelector);
        this.schema = schema;

        this.ajv = new Ajv();
        this.validateFunc = this.ajv.compile(schema);
    }

    validate(value = this.value) {
        try {
            const parsed = JSON.parse(value);
            const valid = this.validateFunc(parsed);

            if (!valid) {
                this.showError(this.validateFunc.errors);
            } else {
                this.clearError();
            }

            return valid;
        } catch (e) {
            this.showError(e.message);
            return false;
        }
    }

    showError(message) {
        if (!this.errorContainer) return;

        if (Array.isArray(message)) {
            message = message
                .map(err => `${err.instancePath || '/'} ${err.message}`)
                .join('<br>');
        }

        this.errorContainer.innerHTML = `<span style="color:red;">${message}</span>`;
    }

    clearError() {
        if (!this.errorContainer) return;
        this.errorContainer.innerHTML = '';
    }
}
