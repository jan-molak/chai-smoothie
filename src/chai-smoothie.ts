import { ElementFinder } from 'protractor';

type ChaiAssertion<T> = { _obj: T };
type ElementFinderAssertion = ChaiAssertion<ElementFinder>;

declare global {
    namespace Chai {                // tslint:disable-line:no-namespace
        interface Assertion {
            displayed: Assertion;
            present: Assertion;
            enabled: Assertion;
            selected: Assertion;
        }
    }
}

function protractorChai(chai: any, utils: any) {

    function ensureAssertingOn<T>(type: T, assertion: { _obj: any }): ChaiAssertion<T> {
        const is         = (expected: T, candidate: any) => candidate instanceof expected,
              typeOf     = (object: any)         => !! object && object.constructor && object.constructor.name,
              notEmpty   = (value: any)          => !! value ? value : '';

        if (! is(type, assertion._obj)) {
            let message = `${ notEmpty(typeOf(assertion._obj)) } ${ utils.inspect(assertion._obj) } is not of type ${ type.name }`;

            throw new TypeError(message.trim());
        }

        return assertion;
    }

    function addBooleanProperty(property: string) {

        let methodNameFrom = (propertyName: string) => `is${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`,
            method         = methodNameFrom(property);

        chai.Assertion.addProperty(property, function () {                  // tslint:disable-line:only-arrow-functions
            let assertion: ElementFinderAssertion = ensureAssertingOn(ElementFinder, this);

            return assertion._obj[ method ]().then((state: boolean) => this.assert(state,
                `Expected the element located ${ assertion._obj.locator() } to be ${ property }, but it's not.`,
                `Expected the element located ${ assertion._obj.locator() } not to be ${ property }, yet it is.`
            ));
        });
    }

    function supportChaiAsPromised() {
        function isOfInterest(obj: any): boolean {
            return !! obj && obj instanceof ElementFinder && ! obj.then;
        }

        chai.Assertion.overwriteProperty('eventually', (_super) => {
            return function () {                                            // tslint:disable-line:only-arrow-functions
                let subject = this._obj;

                if (isOfInterest(subject)) {
                    let protractorAssertion = new chai.Assertion(subject);  // tslint:disable-line
                    utils.transferFlags(this, protractorAssertion, false);  // false means don't transfer `object` flag
                } else {
                    _super.call(this);
                }
            };
        });
    }

    addBooleanProperty('displayed');
    addBooleanProperty('present');
    addBooleanProperty('enabled');
    addBooleanProperty('selected');

    supportChaiAsPromised();
}

export = protractorChai;
