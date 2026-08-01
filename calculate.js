export function calculate() {
    var dosages = [25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300];
    var too_little = parseInt(document.getElementById("too_little_dropdown").value, 10);
    var tl_freq = parseFloat(document.getElementById("too_little_frequency").value, 10);
    var too_much = parseInt(document.getElementById("too_much_dropdown").value, 10);
    var tm_freq = parseFloat(document.getElementById("too_much_frequency").value, 10);
    var arr = new Array(); // array in the form: [avg_daily_dose, dosage, num_days_per_week]

    var daily_val;
    for (var i = 0; i < dosages.length; i++) {
        for (var j = 5; j <= 8; j += 0.5) {
            if (dosages[i] * j > too_little * tl_freq && dosages[i] * j < too_much * tm_freq) {
                daily_val = (dosages[i] * j) / 7;
                arr.push([Math.round(daily_val * 10) / 10, dosages[i], j]);
            }
        }
    }

    var tl_daily = (too_little * tl_freq) / 7;
    var tm_daily = (too_much * tm_freq) / 7;
    document.getElementById("too_little_reference").innerHTML = "<i>Too Little Average Daily Dose: " + Math.round(tl_daily * 10) / 10 + " mcg</i>";
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
    document.getElementById("too_much_reference").innerHTML = "<i>Too Much Average Daily Dose: " + Math.round(tm_daily * 10) / 10 + " mcg</i>";
}

export function calculate_with_weight() {
    var dosages = [25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300];
    var height = parseInt(document.getElementById("height").value, 10);
    var actual_weight = parseInt(document.getElementById("weight").value, 10);
    var unit_choice = 0;
    var gender = 0;
    var calcChoice = 0;
    var surgical = 0;
    var ideal_weight;
    var final_result;

    document.getElementsByName("unit_choice").forEach(button => {
        if (button.checked) {
            unit_choice = button.value;
        }
    });

    document.getElementsByName("gender").forEach(button => {
        if (button.checked) {
            gender = button.value;
        }
    });

    document.getElementsByName("height_or_weight").forEach(button => {
        if (button.checked) {
            calcChoice = button.value;
        }
    });

    document.getElementsByName("surgical").forEach(button => {
        if (button.checked) {
            surgical = button.value;
        }
    });

    if (unit_choice == 0) { // need to convert weight to kilograms
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
        if (surgical == 0) {
            final_result = 2 * ideal_weight // Yes
        } else {
            final_result = 1.6 * ideal_weight // No
        }
    } else { // Actual Body Weight
        if (surgical == 0) {
            final_result = 2 * actual_weight // Yes
        } else {
            final_result = 1.6 * actual_weight // No
        }
    }

    document.getElementById("results_label").innerHTML = "<u><b>Results</b></u>";
    document.getElementById("calculation").innerHTML = "Based on calculations, <b>" + Math.round(final_result * 10) / 10 + " mcg per day</b> is needed."
    var smallestDifference = [dosages[0], Math.abs(dosages[0] - final_result)] // (dosage, difference from result)
    for (var i = 1; i < dosages.length; i++) {
        if (Math.abs(dosages[i] - final_result) < smallestDifference[1]) {
            smallestDifference[0] = dosages[i];
            smallestDifference[1] = Math.abs(dosages[i] - final_result);
        }
    }
    document.getElementById("rounding").innerHTML = "Therefore, the dosage that should be provided is <b>" + smallestDifference[0] + " mcg per day</b>."
    document.getElementById("dosing-results").style.borderStyle = "dotted";
    document.getElementById("dosing-results").style.borderWidth = "medium";
}

function change_weight_label() {
    var unit_choice = -1;
    document.getElementsByName("unit_choice").forEach(button => {
        if (button.checked) {
            unit_choice = button.value;
        }
    });

    if (unit_choice == 0) { 
        document.getElementById("weight_label").innerHTML = "pounds";
    } else { 
        document.getElementById("weight_label").innerHTML = "kilograms";
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