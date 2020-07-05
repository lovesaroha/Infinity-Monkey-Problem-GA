"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const  colorsDark = ["#c13b59" , "#e15856" ,"#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Default values defined.
var maxPop = 100;
var targetPhrase = "";
var mutationRate = 0.01;
var found = false;
var newMaxPop = 100;
var newMutationRate = 0.01;

// Update dom data according to default values.
document.getElementById("maxpop_id").value = 100;
document.getElementById("mutation_rate_id").value = 0.01;

// Population object.
function Population() {
    this.generation = 0;
    this.totalFitness = 0;
    // Members
    this.members = [];
    for (let i = 0; i < maxPop; i++) {
        this.members[i] = new DNA();
    }
}

// Population calculate fitness.
Population.prototype.calcFitness = function() {
    this.totalFitness = 0;
    for (let i = 0; i < maxPop; i++) {
        this.totalFitness = this.totalFitness + this.members[i].calcFitness();
    }
}

//Generate new population.
Population.prototype.generate = function() {
    let newPopulation = [];
    for (let i = 0; i < maxPop; i++) {
        let partnerA = pickOne(this.members, this.totalFitness);
        let partnerB = pickOne(this.members, this.totalFitness);
        var child = partnerA.crossOver(partnerB);
        child.mutate();
        newPopulation[i] = child;
    }
    this.members = newPopulation.slice();
    this.generation++;
}

// Population evaluate.
Population.prototype.evaluate = function() {
    let maxFitness = 0;
    for (let i = 0; i < maxPop; i++) {
        if (this.members[i].genes.join("") == targetPhrase) {
            maxFitness = i;
            found = true;
        } else if (this.members[maxFitness].fitnessScore < this.members[i].fitnessScore) {
            maxFitness = i;
        }
    }
    document.getElementById("best_phrase_id").innerHTML = this.members[maxFitness].genes.join("");
}

// Pick one.
function pickOne(list, totalFitness) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
        if (list[index].pickChance == -1) {
            list[index].pickChance = list[index].fitnessScore / totalFitness;
        }
        r = r - list[index].pickChance;
        index++;
    }
    index--;
    return list[index];
}

// DNA object defined.
function DNA() {
    this.fitnessScore = 0;
    this.genes = [];
    this.pickChance = -1;
    for (let i = 0; i < targetPhrase.length; i++) {
        this.genes[i] = newChar();
    }
}

// Calculate dna fitness.
DNA.prototype.calcFitness = function() {
    let score = 0;
    for (let i = 0; i < this.genes.length; i++) {
        if (this.genes[i] == targetPhrase.charAt(i)) {
            score++;
        }
    }
    this.fitnessScore = (score + 0.1) / targetPhrase.length;
    this.fitnessScore = Math.pow(this.fitnessScore, 2);
    return this.fitnessScore;
}

// DNA crossover.
DNA.prototype.crossOver = function(partner) {
    let child = new DNA();
    let mid = Math.floor((Math.random() * child.genes.length) + 1);
    for (let i = 0; i < this.genes.length; i++) {
        if (i < mid) {
            child.genes[i] = this.genes[i];
        } else {
            child.genes[i] = partner.genes[i];
        }
    }
    return child;
}

// DNA mutation.
DNA.prototype.mutate = function() {
    for (let i = 0; i < this.genes.length; i++) {
        if (Math.random() < mutationRate) {
            this.genes[i] = newChar();
        }
    }
}

// Random character.
function newChar() {
    let r = Math.floor((Math.random() * 60) + 63);
    if (r == 63) { r = 32; }
    if (r == 64) { r = 46; }
    return String.fromCharCode(r);
}

var pop;

// Start function.
function start(e) {
    e.preventDefault();
    maxPop = newMaxPop;
    mutationRate = newMutationRate;
    targetPhrase = e.target.phrase.value;
    pop = new Population();
    found = false;
    let el = document.createElement("div");
    el.className = 'col-md-12 col-lg-12 text-center';
    let time = factorial(targetPhrase.length) / 60;
    document.getElementById("result_box_id").classList.remove("d-none");
    let show;
    if (time < 60) {
        show = `${time} sec`;
    } else if (time > 60 && time <= 3600) {
        show = `${time / 60} min`;
    } else if (time > 3600 && time <= 86400) {
        show = `${(time / 60) / 60} hr`;
    } else if (time > 86400 && time <= 2073600) {
        show = `${((time / 60) / 60) / 24} days`;
    } else if (time > 2073600 && time <= 62208000) {
        show = `${(((time / 60) / 60) / 24) / 30} months`;
    } else {
        show = `${((((time / 60) / 60) / 24) / 30) / 12} years`;
    }
    document.getElementById("est_time_id").innerHTML = `<h4>Estimated Time With Brute Force <br><font class="text-primary">${show}</font></h4>`;
    window.requestAnimationFrame(draw);
}

// Factorial function defined.
function factorial(x) {
    if (x == 1) {
        return 1;
    }
    return x * factorial(x - 1);
}

// Draw function.
function draw() {
    // Calculate population fitness.
    pop.calcFitness();
    // Generate new population.
    pop.generate();
    // Evaluate population.
    pop.evaluate();
    document.getElementById("generations_id").innerHTML = pop.generation;
    document.getElementById("avgfitness_id").innerHTML = ((pop.totalFitness / maxPop) * 100).toFixed(2);
    if (found == true) {
        document.getElementById("best_phrase_id").innerHTML = targetPhrase;
        return;
    }
    window.requestAnimationFrame(draw);
}