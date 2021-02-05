'use strict';

// @ts-check

const { pascalCase } = require('change-case');

/**
 * @param {string} name
 */
const normalizeClassName = (name) => name.split(/[^ a-zA-Z0-9_\x80-\xff]+/).map(pascalCase).join('\\').replace(/^\\+|\\+$/g, '');

/**
 * @param {string} name
 */
const extractClassName = (name) => {
    const lastIndex = name.lastIndexOf('\\');

    return !!~lastIndex 
        ? { namespace: name.substr(0, lastIndex), className: name.substr(lastIndex + 1)} 
        : { className: name };
};

/**
 * @param {string} name
 */
const classNameToPath = (name) => name.replace(/\\/g, '/');

module.exports = {
    normalizeClassName,
    extractClassName,
    classNameToPath
};
