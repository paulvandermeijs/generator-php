'use strict';

// @ts-check

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var version = require('../../services/version');

module.exports = class extends Generator {
  async prompting() {
    this.log('');
    this.log(chalk.bold(chalk.magenta(this._title())));
    this.log('');
    this.log(chalk.bold(`PHP Generator version ${version()}, copyright (c) 2018 – ${new Date().getFullYear().toString()}, Paul van der Meijs`));
    this.log('');
  }

  /**
   * @return {string}
   */
  _title() {
    return this.fs.read(this.templatePath('title.txt'));
  }
};
