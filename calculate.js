export function calculate() {
    var dosages = [25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300];
    var too_little = parseInt(document.getElementById("too_little_dropdown").value, 10);
    var tl_freq = parseFloat(document.getElementById("too_little_frequency").value, 10);
    var too_much = parseInt(document.getElementById("too_much_dropdown").value, 10);
    var tm_freq = parseFloat(document.getElementById("too_much_frequency").value, 10);
    var arr = new Array(); // array in the form: [total_dosage_per_week, dosage, num_days_per_week]

    for (var i = 0; i < dosages.length; i++) {
        for (var j = 5; j <= 8; j += 0.5) {
            if (dosages[i] * j > too_little * tl_freq && dosages[i] * j < too_much * tm_freq) {
                arr.push([dosages[i] * j, dosages[i], j]);
            }
        }
    }

    document.getElementById("too_little_reference").innerHTML = "<i>Too Little Weekly Cumulative Dose: " + too_little * tl_freq + " mcg</i>";
    arr.sort((a,b) => a[0] - b[0]);
    var text = "";
    for (var i = 0; i < arr.length; i++) {
        text += "Take " + arr[i][1] + " mcg " + arr[i][2] + " doses per week → " + arr[i][0] + " mcg <br/>";;
    }
    if (text === "") {
        document.getElementById("results").innerHTML = "No options found! Please check input.";
    } else {
        document.getElementById("results").innerHTML = text;
    }
    document.getElementById("too_much_reference").innerHTML = "<i>Too Much Weekly Cumulative Dose: " + too_much * tm_freq + " mcg</i>";
}

export function calculate_with_weight() {
    var dosages = [25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300];
    var height = parseInt(document.getElementById("height").value, 10);
    var actual_weight = parseInt(document.getElementById("weight").value, 10);
    var hadThyroidSurgery = parseInt(document.getElementById("thyroid_surgery").value, 10);
    var calcChoice = parseInt(document.getElementById("height_or_weight").value, 10);
    var gender = parseInt(document.getElementById("gender").value, 10);
    var ideal_weight;
    var final_result;

    if (document.getElementById("unit_choice").value == 0) { // need to convert weight to kilograms
        actual_weight *= 0.453;
    }


    if (gender == 0) { // Male
        ideal_weight = 50;
    } else { // Female
        ideal_weight = 45.5;
    }
            
    if (height >= 60) { // height is 5-foot or above
        while (height > 60) {
            ideal_weight += 2.3;
            height--;
        }
    } else { // height is below 5-foot
        while (height < 60) {
            ideal_weight -= 2.3;
            height++;
        }
    }
            
    if (calcChoice == 0) { // Ideal Body Weight
        if (hadThyroidSurgery == 0) {
            final_result = 2 * ideal_weight // Yes
        } else {
            final_result = 1.6 * ideal_weight // No
        }
    } else { // Actual Body Weight
        if (hadThyroidSurgery == 0) {
            final_result = 2 * actual_weight // Yes
        } else {
            final_result = 1.6 * actual_weight // No
        }
    }

    document.getElementById("calculation").innerHTML = "Based on calculations, <b>" + Math.round(final_result * 10) / 10 + " mcg per day</b> is needed."

    var smallestDifference = [dosages[0], Math.abs(dosages[0] - final_result)] // (dosage, difference from result)
    for (var i = 1; i < dosages.length; i++) {
        if (Math.abs(dosages[i] - final_result) < smallestDifference[1]) {
            smallestDifference[0] = dosages[i];
            smallestDifference[1] = Math.abs(dosages[i] - final_result);
        }
    }

    document.getElementById("rounding").innerHTML = "Therefore, the dosage that should be provided is <b>" + smallestDifference[0] + " mcg per day</b>."
}

function change_weight_label() {
    if (document.getElementById('unit_choice').value == 0) { 
        document.getElementById('weight_label').innerHTML = 'pounds';
    } else { 
        document.getElementById('weight_label').innerHTML = 'kilograms';
    }
    calculate_with_weight(); // recalculating using current inputted number in new unit
}

export function get_results() {
    return document.getElementById("results").innerHTML;
}

export function get_calc() {
    return document.getElementById("calculation").innerHTML;
}

export function get_round_ans() {
    return document.getElementById("rounding").innerHTML;
}