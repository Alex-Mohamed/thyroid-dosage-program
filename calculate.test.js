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
            <form>
                <input type="radio" id="pounds" name="unit_choice" value=0 onchange="change_weight_label()">
                <label for="pounds">Pounds (lbs)</label><br/>
                <input type="radio" id="kilograms" name="unit_choice" value=1 onchange="change_weight_label()">
                <label for="kilograms">Kilograms (kg)</label><br/>
            </form>
            <input id="weight" value=0 />
            <form>
                <input type="radio" id="Male" name="gender" value=0 onchange="calculate_with_weight()">
                <label for="Male">Male</label><br/>
                <input type="radio" id="Female" name="gender" value=1 onchange="calculate_with_weight()">
                <label for="Female">Female</label><br/>
            </form>
            <form>
                <input type="radio" id="Yes" name="surgical" value=0 onchange="calculate_with_weight()">
                <label for="Yes">Surgical</label><br/>
                <input type="radio" id="No" name="surgical" value=1 onchange="calculate_with_weight()">
                <label for="No">Non-Surgical</label><br/>
            </form>
            <form>
                <input type="radio" id="height_choice" name="height_or_weight" value=0 onchange="calculate_with_weight()">
                <label for="height_choice">Ideal Body Weight</label><br/>
                <input type="radio" id="weight_choice" name="height_or_weight" value=1 onchange="calculate_with_weight()">
                <label for="weight_choice">Actual Body Weight</label><br/>
            </form>
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
        document.getElementById("kilograms").checked = true;
        document.getElementById("weight").value = 40;
        document.getElementById("Male").checked = true;
        document.getElementById("Yes").checked = true;
        document.getElementById("height_choice").checked = true;
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
        document.getElementById("kilograms").checked = true;
        document.getElementById("weight").value = 40;
        document.getElementById("Male").checked = true;
        document.getElementById("Yes").checked = true;
        document.getElementById("weight_choice").checked = true;
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
        document.getElementById("pounds").checked = true;
        document.getElementById("weight").value = 180;
        document.getElementById("Male").checked = true;
        document.getElementById("Yes").checked = true;
        document.getElementById("weight_choice").checked = true;
        calculate_with_weight();

        assert.equal(
            get_calc(), "Based on calculations, <b>163.1 mcg per day</b> is needed."
        )

        assert.equal(
            get_round_ans(), "Therefore, the dosage that should be provided is <b>175 mcg per day</b>."
        )
    })
})