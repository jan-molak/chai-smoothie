import { browser, by, element } from 'protractor/globals';

import chai = require('chai');

chai.use(require('chai-as-promised'));              // tslint:disable-line:no-var-requires
chai.use(require('../../src/chai-protractor'));     // tslint:disable-line:no-var-requires

const expect = chai.expect;

describe('Chai-Protractor', () => {

    beforeEach(() => browser.get('index.html'));

    describe('says that a web element', () => {

        describe('that is visible', () => {

            it('is displayed', () => expect(element(by.css('h1'))).to.be.eventually.displayed);

            it('is present',   () => expect(element(by.css('h1'))).to.be.eventually.present);
        });

        describe('that is invisible', () => {

            it('is not displayed',  () => expect(element(by.id('existing-but-hidden'))).to.eventually.not.be.displayed);

            it('is present',        () => expect(element(by.id('existing-but-hidden'))).to.eventually.be.present);
        });

        describe('that is disabled', () => {

            it('is displayed',      () => expect(element(by.id('disabled'))).to.eventually.be.displayed);

            it('is present',        () => expect(element(by.id('disabled'))).to.eventually.be.present);

            it('is not enabled',    () => expect(element(by.id('disabled'))).to.eventually.not.be.enabled);
        });

        describe('that is checked', () => {

            it('is checked',        () => expect(element(by.id('checked-checkbox'))).to.eventually.be.selected);

            it('is displayed',      () => expect(element(by.id('checked-checkbox'))).to.eventually.be.displayed);

            it('is present',        () => expect(element(by.id('checked-checkbox'))).to.eventually.be.present);
        });

        describe('that is unchecked', () => {

            it('is not checked',    () => expect(element(by.id('unchecked-checkbox'))).to.eventually.not.be.selected);

            it('is displayed',      () => expect(element(by.id('unchecked-checkbox'))).to.eventually.be.displayed);

            it('is present',        () => expect(element(by.id('unchecked-checkbox'))).to.eventually.be.present);

            it('is enabled',        () => expect(element(by.id('unchecked-checkbox'))).to.eventually.be.enabled);
        });

        describe('that is disabled', () => {

            it('is not enabled',    () => expect(element(by.id('disabled'))).to.eventually.not.be.enabled);

            it('is displayed',      () => expect(element(by.id('disabled'))).to.eventually.be.displayed);

            it('is present',        () => expect(element(by.id('disabled'))).to.eventually.be.present);
        });

        describe('that is off-screen', () => {

            it('is displayed',      () => expect(element(by.id('off-screen'))).to.eventually.be.displayed);
            it('is xxx',      () => expect(element(by.id('off-screen'))).not.to.be.present.eventually);

            it('is present',        () => expect(element(by.id('off-screen'))).to.eventually.be.present);

            it('is enabled',        () => expect(element(by.id('off-screen'))).to.eventually.be.enabled);

            it('is clickable',      () => element(by.id('off-screen')).click());
        });
    });

    describe('plays well with others:', () => {

        it('works with chai-as-promised', () => expect(browser.getTitle()).to.eventually.equal('A sample HTML page'));

        it('does not affect the protractor assertions', () => expect(element(by.css('h1')).getText()).to.eventually.equal('A demo page'));

        it('does not affect the transferable flags', () => expect(browser.getTitle()).to.eventually.not.equal('Amazon.com'));

        it('returns a promise', () => {

            let result = expect(element(by.css('h1')).getText()).to.eventually.equal('A demo page');

            return expect(result).to.have.property('then');
        });

        it('returns a promise when used without chai-as-promised', () => {

            let result = expect(element(by.css('h1'))).to.be.displayed;

            return expect(result).to.have.property('then');
        });

        it('returns a promise when used with chai-as-promised', () => {

            let result = expect(element(by.css('h1'))).to.eventually.be.displayed;

            return expect(result).to.have.property('then');
        });
    });

    describe('complains when it', () => {

        it('is given a string instead of an ElementFinder', () =>
            expect(() => {
                expect('beautiful weather').to.be.present;
            }).to.throw('String \'beautiful weather\' is not of type ElementFinder')
        );

        it('is given an object instead of an ElementFinder', () =>
            expect(() => {
                expect({ user: 'charlie' }).to.be.present;
            }).to.throw('Object { user: \'charlie\' } is not of type ElementFinder')
        );

        it('is given a null', () =>
            expect(() => {
                expect(null).to.be.present;
            }).to.throw('null is not of type ElementFinder')
        );
    });
});
