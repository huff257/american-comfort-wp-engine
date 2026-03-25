import { LayoutJSONValidator } from './json-validator.js';

const sectionSchema = {
  type: 'object',
  properties: {
    className: { type: 'string', nullable: true },

    /* ---------------------------------------------
     * 1. STYLE VALUES (CSS VARIABLES SOURCE)
     * --------------------------------------------- */
    styles: {
      type: 'object',
      nullable: true,
      description: 'Dynamic CSS properties that will be converted to CSS variables',
      patternProperties: {
        ".*": { type: 'string', nullable: true }
      },
      additionalProperties: true
    },

    /* ---------------------------------------------
     * 2. RESPONSIVE OVERRIDES
     * --------------------------------------------- */
    breakpoints: {
      type: 'object',
      nullable: true,
      description: 'Breakpoint-based style overrides',
      patternProperties: {
        "^[0-9]+$": {
          type: 'object',
          properties: {
            styles: {
              type: 'object',
              nullable: true,
              patternProperties: {
                ".*": { type: 'string', nullable: true }
              },
              additionalProperties: true
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },

    /* ---------------------------------------------
     * 3. JS BEHAVIORS (WHAT HAPPENS)
     * --------------------------------------------- */
    behaviors: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', nullable: true },
          options: {
            type: 'object',
            nullable: true,
            additionalProperties: true
          },
          asset: { type: 'string', nullable: true }
        },
        additionalProperties: false
      }
    },
    assets: {
      type: 'object',
      nullable: true,
      description: 'Static CSS and JS files required by this package',
      properties: {
        css: {
          type: 'object',
          nullable: true,
          required: ['handle', 'file'],
          properties: {
            handle: { type: 'string' },
            file: { type: 'string' }
          },
          additionalProperties: false
        },
        js: {
          type: 'object',
          nullable: true,
          required: ['handle', 'file'],
          properties: {
            handle: { type: 'string' },
            file: { type: 'string' }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    pseudo: {
      type: 'array',
      nullable: true,
      description: 'Pseudo-elements applied to specific selectors',
      items: {
        type: 'object',
        required: ['element', 'file'],
        properties: {
          element: { type: 'string', description: 'Selector (class or ID) to attach pseudo-element to' },
          file: { type: 'string', description: 'SVG filename relative to theme assets folder' },
          before: { type: 'boolean', nullable: true, description: 'Apply as ::before' },
          after: { type: 'boolean', nullable: true, description: 'Apply as ::after' }
        },
        additionalProperties: true
      }
    },
  },
  additionalProperties: false
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#post');
    const errorContainer = document.querySelector('#layout_text_error');

    if (!form ) return;

    form.addEventListener('submit', (e) => {
        const textarea = document.querySelector('#layout_rich_text');

        const validator = new LayoutJSONValidator(
            textarea.value,
            '#layout_text_error',
            sectionSchema
        );

        const valid = validator.validate(textarea.value);

        if (!valid) {
            e.preventDefault();
            alert('Layout JSON is invalid');
            textarea.focus();
        }
    });
});
