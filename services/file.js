'use strict';

// @ts-check

/**
 * @param {string} filename 
 */
const getExtension = (filename) => filename.split('.').pop().trim();

module.exports = {
    getExtension
};
