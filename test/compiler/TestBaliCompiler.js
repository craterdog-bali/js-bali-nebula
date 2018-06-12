/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var language = require('bali-language/BaliLanguage');
var analyzer = require('../..//compiler/Analyzer');
var compiler = require('../..//compiler/Compiler');
var fs = require('fs');
var mocha = require('mocha');
var expect = require('chai').expect;


describe('Bali Virtual Machine™', function() {

    describe('Test the compiler.', function() {

        it('should compile source documents into assembly instructions.', function() {
            var testFolder = 'test/source/';
            var files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var basmFile = testFolder + prefix + '.basm';
                // strip off the POSIX newline terminator so that the round-trip comparison will work
                var source = fs.readFileSync(baliFile, 'utf8').slice(0, -1);
                expect(source).to.exist;  // jshint ignore:line
                var tree = language.parseProcedure(source);
                expect(tree).to.exist;  // jshint ignore:line
                var type = {};
                var instructions = compiler.compileProcedure(tree, type);
                expect(instructions).to.exist;  // jshint ignore:line
                //fs.writeFileSync(basmFile, instructions + '\n', 'utf8');  // add POSIX terminator
                // strip off the POSIX newline terminator so that the round-trip comparison will work
                var expected = fs.readFileSync(basmFile, 'utf8').slice(0, -1);
                expect(expected).to.exist;  // jshint ignore:line
                expect(instructions).to.equal(expected);
            }
        });

    });

});
