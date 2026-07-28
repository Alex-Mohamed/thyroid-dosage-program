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
            <h1>Thyroid Hormone Dosing and Adjustment Calculator</h1>
            <h2>Adjustment</h2>
            <p>
                <u>Step 1a</u>: Use the top dropdown to select the dosage that is too little. <br/>
                <u>Step 1b</u>: Use the text box to its right to select how often per week the medication is taken. <br/>
                <u>Step 2a</u>: Use the bottom dropdown to select the dosage that is too much. <br/>
                <u>Step 2b</u>: Use the text box to its right to select how often per week the medication is taken.
            </p>
            <div class="inline-element">
                <form>
                    <p class="inline-element">Too Little → </p>
                    <select id="too_little_dropdown" onchange="calculate()">
                        <option id="opt1", value=25>25 mcg</option>
                        <option id="opt2", value=50>50 mcg</option>
                        <option id="opt3", value=75>75 mcg</option>
                        <option id="opt4", value=88>88 mcg</option>
                        <option id="opt5", value=100>100 mcg</option>
                        <option id="opt6", value=112>112 mcg</option>
                        <option id="opt7", value=125>125 mcg</option>
                        <option id="opt8", value=137>137 mcg</option>
                        <option id="opt9", value=150>150 mcg</option>
                        <option id="opt10", value=175>175 mcg</option>
                        <option id="opt11", value=200>200 mcg</option>
                        <option id="opt12", value=300>300 mcg</option>
                    </select>
                    <input id="too_little_frequency" type="number" step="0.1" min=1 value=7 onchange="calculate()">
                    <p class="inline-element"> doses per week</p>
                    <br/>

                    <p class="inline-element">Too Much →</p>
                    <select id="too_much_dropdown" onchange="calculate()">
                        <option id="opt13", value=25>25 mcg</option>
                        <option id="opt14", value=50>50 mcg</option>
                        <option id="opt15", value=75>75 mcg</option>
                        <option id="opt16", value=88>88 mcg</option>
                        <option id="opt17", value=100>100 mcg</option>
                        <option id="opt18", value=112>112 mcg</option>
                        <option id="opt19", value=125>125 mcg</option>
                        <option id="opt20", value=137>137 mcg</option>
                        <option id="opt21", value=150>150 mcg</option>
                        <option id="opt22", value=175>175 mcg</option>
                        <option id="opt23", value=200>200 mcg</option>
                        <option id="opt24", value=300>300 mcg</option>
                    </select>
                        <input id="too_much_frequency" type="number" step="0.1" min=1 value=7 onchange="calculate()">
                        <p class="inline-element"> doses per week</p>
                </form>

                <p id="result_message"><br/>These are the options available:</p>
                <p id="too_little_reference"></p>
                <p id="results"></p>
                <p id="too_much_reference"></p>
            </div>

            <div class="divider"></div> <!-- Adds a space between the results and graph -->

            <div class="inline-element">
                <canvas id="results_chart" width="800" height="400"></canvas>
            </div>

            <br/><hr>  <!-- Splits the two parts of the program -->

            <h2>Dosing</h2>
            <p>
                Welcome to the thyroid dosing calculator! <br/>
                <u>Step 1</u>: Input the height in inches. <br/>
                <u>Step 2</u>: Choose if you want to input the weight in lbs or kg. <br/>
                <u>Step 3</u>: Input the weight in the desired unit. <br/>
                <u>Step 4</u>: Select the gender. <br/>
                <u>Step 5</u>: Select if the hypothyroidism is surgical or non-surgical. <br/>
                <u>Step 6</u>: Choose if you want to use actual or ideal body weight for the calculation.
            </p>

            <div>
                <input id="height" class="inline-element" type="number" min=1 value=1 onchange="calculate_with_weight()"/>
                <p class="inline-element">inches</p>
            </div>
            <br/>

            <form>
                <input type="radio" id="pounds" name="unit_choice" value=0 onchange="change_weight_label()">
                <label for="pounds">Pounds (lbs)</label><br/>
                <input type="radio" id="kilograms" name="unit_choice" value=1 onchange="change_weight_label()">
                <label for="kilograms">Kilograms (kg)</label><br/>
            </form>

            <div>
                <input id="weight" class="inline-element" type="number" min=1 value=1 onchange="calculate_with_weight()"/>
                <p id="weight_label" class="inline-element">pounds</p>
            </div>
            <br/>

            <form>
                <input type="radio" id="Male" name="gender" value=0 onchange="calculate_with_weight()">
                <label for="Male">Male</label><br/>
                <input type="radio" id="Female" name="gender" value=1 onchange="calculate_with_weight()">
                <label for="Female">Female</label><br/>
            </form>
            <br/>

            <form>
                <input type="radio" id="Yes" name="surgical" value=0 onchange="calculate_with_weight()">
                <label for="Yes">Surgical</label><br/>
                <input type="radio" id="No" name="surgical" value=1 onchange="calculate_with_weight()">
                <label for="No">Non-Surgical</label><br/>
            </form>
            <br/>

            <form>
                <input type="radio" id="height_choice" name="height_or_weight" value=0 onchange="calculate_with_weight()">
                <label for="height_choice">Ideal Body Weight</label><br/>
                <input type="radio" id="weight_choice" name="height_or_weight" value=1 onchange="calculate_with_weight()">
                <label for="weight_choice">Actual Body Weight</label><br/>
            </form>
            <br/>

            <p id="calculation"></p>
            <p id="rounding"></p>
        `;
    });

    it('basic usage for adjustment program', () => {
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

    it('adjustment program, no options available', () => {
        document.getElementById("too_little_dropdown").value = 50;
        document.getElementById("too_little_frequency").value = 7;
        document.getElementById("too_much_dropdown").value = 25;
        document.getElementById("too_much_frequency").value = 7;
        calculate();

        assert.equal(
            get_results(), "No options found! Please check input."
        )
    })

    it('basic usage for dosing program, ideal body weight', () => {
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

    it('basic usage for dosing program, actual body weight', () => {
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

    it('dosing program, input provided in lbs', () => {
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