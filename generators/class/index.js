'use strict';

// @ts-check

const Generator = require('../base');
const { createClass } = require('../../services/php/class');
const prettier = require('gulp-prettier');
const validator = require('validator');
const { normalizeClassName, classNameToPath } = require('../../services/php');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('className', {
            type: String,
            description: 'The name for your class',
            required: false
        });

        this.option('abstract', {
            type: Boolean,
            description: 'Whether or not this class is abstract',
            default: false
        });

        this.option('final', {
            type: Boolean,
            description: 'Whether or not this class is final',
            default: false
        });
    }

    async prompting() {
        this.answers = {
            document: await this._getDocument(),
            className: await this._getClassName(),
            ...await this._getAdvanced()
        }
    }

    async _getClassName() {
        const className = this.options.className;

        return className
            ? (() => {
                this.notify(`Using class name "${className}"`);

                return className;
            })()
            : (async () => {
                this.notify(`No class name provided`);

                const answers = await this.prompt([
                    {
                        type: 'input',
                        name: 'className',
                        message: 'What is the name for your class?',
                        validate: (input) => {
                            switch (true) {
                                case validator.isEmpty(input, { ignore_whitespace: true }):
                                    return 'Please provide a name for your class';
                            }
        
                            return true;
                        }
                    }
                ]);

                return answers.className;
            })();
    }

    async _getAdvanced() {
        return this.options.advanced 
            ? await this._promptAdvanced() 
            : {
                abstract: this.options.abstract,
                final: this.options.final
            }
    }

    async _promptAdvanced() {
        return await this.prompt([
            {
                type: 'input',
                name: 'classDescription',
                message: 'What is the description for your class?'
            },
            {
                type: 'confirm',
                name: 'abstract',
                message: 'Is your class abstract?',
                default: this.options.abstract
            },
            {
                type: 'confirm',
                name: 'final',
                message: 'Is your class final?',
                default: this.options.final,
                when: (answers) => !answers.abstract
            }
        ]);
    }

    async writing() {
        try {
            this.registerTransformStream(prettier({ tabWidth: 4 }));

            const phpClass = await createClass(this.answers);

            this.fs.write(
                this.destinationPath(`${classNameToPath(normalizeClassName(this.answers.className))}.php`),
                phpClass
            );
        } catch (e) {
            this.error('Something went wrong');
        }
    }
};
