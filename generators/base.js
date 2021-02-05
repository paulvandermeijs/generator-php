'use strict';

// @ts-check

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const os = require('os');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.config.defaults({
            promptValues: {
                author: os.userInfo().username,
                license: 'ISC',
                copyright: new Date().getFullYear().toString()
            }
        });

        this.option('advanced', {
            type: Boolean,
            description: 'Show advanced options',
            default: false
        });

        this.option('skip-document', {
            type: Boolean,
            description: 'Use document defaults',
            default: false
        });
    }

    async _getDocument() {
        return this.options.advanced && !this.options['skip-document']
            ? await this._promptDocument() 
            : {
                author: this.config.get('promptValues').author,
                license: this.config.get('promptValues').license,
                copyright: this.config.get('promptValues').copyright,
            }
    }

    async _promptDocument() {
        return await this.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'What is the description for your document?'
            },
            {
                type: 'input',
                name: 'version',
                message: 'What is the version of your document?',
                default: '1.0.0'
            },
            {
                type: 'input',
                name: 'author',
                message: 'Who is the author of your document?',
                store: true
            },
            {
                type: 'input',
                name: 'license',
                message: 'What is the license for your document?',
                store: true
            },
            {
                type: 'input',
                name: 'copyright',
                message: 'What is the copyright for your document?',
                store: true
            },
        ]);
    }

    /**
     * Write a notification to the output.
     * 
     * @param {string} message
     */
    notify(message) {
        this.log(`${chalk.yellow('!')} ${chalk.bold(message)}`);
    }

    /**
     * Write an error to the output.
     * 
     * @param {string} message
     */
    error(message) {
        this.log(`${chalk.red('!')} ${chalk.bold(message)}`);
    }
}
