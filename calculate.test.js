import { calculate, calculate_with_weight, get_results, get_calc, get_round_ans } from './calculate.js'
import { assert } from 'chai'
import { JSDOM } from 'jsdom'

describe('tests', () => {
    beforeEach(() => {
        const dom = new JSDOM('<!doctype html><html><body></body></html>', {
            url: 'http://localhost'
        });
        global.window = dom.window;
        global.document = dom.window.document;

        document.body.innerHTML = `
            <input id="too_little_dropdown" value=0 />
            <input id="too_little_frequency" value=0 />
            <input id="too_much_dropdown" value=0 />
            <input id="too_much_frequency" value=0 />
            <p id="too_little_reference" innerHTML="Test" />
            <p id="results" innerHTML="Test" />
            <p id="too_much_reference" innerHTML="Test" />
            <input id="height" value=0 />
            <input id="unit_choice" value=0 />
            <input id="weight" value=0 />
            <input id="gender" value=0 />
            <input id="thyroid_surgery" value=0 />
            <input id="height_or_weight" value=0 />
            <p id="calculation" innerHTML="Test" />
            <p id="rounding" innerHTML="Test" />
        `;
    });

    it('basic usage for main program', () => {
        document.getElementById("too_little_dropdown").value = 125;
        document.getElementById("too_little_frequency").value = 6;
        document.getElementById("too_much_dropdown").value = 137;
        document.getElementById("too_much_frequency").value = 6;
        calculate();

        assert.equal(
            get_results(),
            "Take 137 mcg 5.5 doses per week → 107.6 mcg <br>" + 
            "Take 112 mcg 7 doses per week → 112 mcg <br>" + 
            "Take 100 mcg 8 doses per week → 114.3 mcg <br>" + 
            "Take 125 mcg 6.5 doses per week → 116.1 mcg <br>"
        )
    })

    it('no options available', () => {
        document.getElementById("too_little_dropdown").value = 50;
        document.getElementById("too_little_frequency").value = 7;
        document.getElementById("too_much_dropdown").value = 25;
        document.getElementById("too_much_frequency").value = 7;
        calculate();

        assert.equal(
            get_results(), "No options found! Please check input."
        )
    })

    it('basic usage, ideal body weight', () => {
        document.getElementById("height").value = 80;
        document.getElementById("unit_choice").value = 1;
        document.getElementById("weight").value = 40;
        document.getElementById("gender").value = 0;
        document.getElementById("thyroid_surgery").value = 0;
        document.getElementById("height_or_weight").value = 0;
        calculate_with_weight();

        assert.equal(
            get_calc(), "Based on calculations, <b>192 mcg per day</b> is needed."
        )

        assert.equal(
            get_round_ans(), "Therefore, the dosage that should be provided is <b>200 mcg per day</b>."
        )
    })

    it('basic usage, actual body weight', () => {
        document.getElementById("height").value = 80;
        document.getElementById("unit_choice").value = 1;
        document.getElementById("weight").value = 40;
        document.getElementById("gender").value = 0;
        document.getElementById("thyroid_surgery").value = 0;
        document.getElementById("height_or_weight").value = 1;
        calculate_with_weight();

        assert.equal(
            get_calc(), "Based on calculations, <b>80 mcg per day</b> is needed."
        )

        assert.equal(
            get_round_ans(), "Therefore, the dosage that should be provided is <b>75 mcg per day</b>."
        )
    })

    it('testing unit conversion, input provided in lbs', () => {
        document.getElementById("height").value = 80;
        document.getElementById("unit_choice").value = 0;
        document.getElementById("weight").value = 180;
        document.getElementById("gender").value = 0;
        document.getElementById("thyroid_surgery").value = 0;
        document.getElementById("height_or_weight").value = 1;
        calculate_with_weight();

        assert.equal(
            get_calc(), "Based on calculations, <b>163.1 mcg per day</b> is needed."
        )

        assert.equal(
            get_round_ans(), "Therefore, the dosage that should be provided is <b>175 mcg per day</b>."
        )
    })
})