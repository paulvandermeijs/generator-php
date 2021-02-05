'use strict';

// @ts-check

const ejs = require('ejs');
const { normalizeClassName, extractClassName } = require('../php');

/**
 * @param {object} data
 */
const createClass = async (data) => {
    const { namespace, className } = extractClassName(normalizeClassName(data.className));

    const body = await ejs.renderFile(
        `${__dirname}/../../templates/php/class.ejs`,
        { 
            abstract: data.abstract,
            final: data.final,
            name: className,
            comment: data.classDescription ? {
                lines: [data.classDescription]
            } : null
        }
    );

    const docComment = [
        ...(data.document.description ? [data.document.description] : []),
        ...(data.document.version ? [`@version ${data.document.version}`] : []),
        ...(data.document.author ? [`@author ${data.document.author}`] : []),
        ...(data.document.license ? [`@license ${data.document.license}`] : []),
        ...(data.document.copyright ? [`@copyright ${data.document.copyright}`] : []),
    ];

    return await ejs.renderFile(
        `${__dirname}/../../templates/php.ejs`,
        {
            comment: docComment.length ? {
                lines: docComment
            } : null,
            declares: [
                {
                    key: 'strict_types',
                    value: '1'
                }
            ],
            namespace,
            body
        }
    );
};

module.exports = {
    createClass
}
