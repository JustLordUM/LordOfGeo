let currentRegion = [];
let currentIndex = 0;
let skipped = [];
let completedCountries = [];
let currentRegionName = "";

let score = 0;
let wrong = 0;
let skippedCount = 0;

let seconds = 0;
let timer;

let stats = {
    correct:0,
    wrong:0,
    skipped:0
};

function showScreen(id){

    document
    .querySelectorAll(".screen")
    .forEach(screen=>{
        screen.classList.remove("active");
    });

    document
    .getElementById(id)
    .classList.add("active");
}

function startGame(region){

    currentRegion = [...regions[region]];

    currentRegionName = region;
completedCountries = [];

    shuffle(currentRegion);

    currentIndex = 0;
    skipped = [];

    score = 0;
    wrong = 0;
    skippedCount = 0;

    stats.correct = 0;
    stats.wrong = 0;
    stats.skipped = 0;

    seconds = 0;

    clearInterval(timer);

    timer = setInterval(()=>{

        seconds++;

        document.getElementById("timer")
        .innerText = `⏱ ${seconds}s`;

    },1000);

    document.getElementById("regionTitle")
    .innerText =
    region === "world"
    ? "🌍 World Challenge"
    : region.toUpperCase();

    updateScore();

    showScreen("gameScreen");

    loadCountry();
}

function loadCountry(){

    if(currentIndex >= currentRegion.length){

        if(skipped.length > 0){

            currentRegion = skipped;

            skipped = [];

            currentIndex = 0;

        }else{

            finishGame();
            return;
        }
    }

    const country =
    currentRegion[currentIndex];

    document.getElementById("flag").src =
    country.flag;

    document.getElementById("countryInput").value = "";
    document.getElementById("capitalInput").value = "";

    document.getElementById("message").innerText = "";

    document.getElementById("counter")
    .innerText =
    `${currentIndex + 1} / ${currentRegion.length}`;

    const progress =
    ((currentIndex) / currentRegion.length) * 100;

    document.getElementById("progressBar")
    .style.width = `${progress}%`;
}

function normalize(text){

    return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();
}

function isCorrectAnswer(userInput, correctData){

    // Si hay varias respuestas válidas
    if(Array.isArray(correctData)){

        return correctData.some(answer =>
            normalize(answer) === normalize(userInput)
        );
    }

    // Si solo hay una
    return normalize(userInput) === normalize(correctData);
}

function checkAnswer(){

    const country =
    currentRegion[currentIndex];

    const userCountry =
    document.getElementById("countryInput").value;

    const userCapital =
    document.getElementById("capitalInput").value;

    const countryCorrect =
    isCorrectAnswer(userCountry,country.name);

    const capitalCorrect =
    isCorrectAnswer(userCapital,country.capital);

    if(countryCorrect && capitalCorrect){

        document.getElementById("message")
        .style.color = "#4ade80";

        document.getElementById("message")
        .innerText = "✔ Correcto";

        score++;
        stats.correct++;

        completedCountries.push({
    name: country.name[0],
    capital: country.capital[0]
});

        updateScore();

        currentIndex++;

        setTimeout(loadCountry,450);

    }else{

        document.getElementById("message")
        .style.color = "#f87171";

        document.getElementById("message")
        .innerText =
        "❌ Nombre o capital incorrecto";

        stats.wrong++;
    }
}

function skipCountry(){

    skipped.push(currentRegion[currentIndex]);

    skippedCount++;
    stats.skipped++;

    currentIndex++;

    loadCountry();
}

function updateScore(){

    document.getElementById("score")
    .innerText =
    `⭐ ${score}`;
}

function finishGame(){

    clearInterval(timer);

    showScreen("finishScreen");

    const total =
    stats.correct + stats.wrong;

    const accuracy =
    total > 0
    ? Math.round((stats.correct / total) * 100)
    : 0;

    document.getElementById("finalScore")
    .innerHTML = `

        <div class="stats">

            <div class="stat">
                ✅ Correctos
                <span>${stats.correct}</span>
            </div>

            <div class="stat">
                ❌ Errores
                <span>${stats.wrong}</span>
            </div>

            <div class="stat">
                ⏭ Omitidos
                <span>${stats.skipped}</span>
            </div>

            <div class="stat">
                🎯 Precisión
                <span>${accuracy}%</span>
            </div>

            <div class="stat">
                ⏱ Tiempo
                <span>${seconds}s</span>
            </div>

        </div>
    `;
}

function backMenu(){

    showScreen("menuScreen");
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j =
        Math.floor(Math.random()*(i+1));

        [array[i],array[j]] =
        [array[j],array[i]];
    }
}

function toggleList(){

    const list =
    document.getElementById("countryList");

    if(list.classList.contains("hidden")){

        updateCountryList();

        list.classList.remove("hidden");

    }else{

        list.classList.add("hidden");
    }
}

function updateCountryList(){

    const list =
    document.getElementById("countryList");

    const allCountries =
    regions[currentRegionName];

    list.innerHTML = "";

    allCountries.forEach(country=>{

        const completed =
        completedCountries.some(c =>
            c.name === country.name[0]
        );

        const item =
        document.createElement("div");

        item.className =
        completed
        ? "flag-card completed"
        : "flag-card remaining";

        item.innerHTML = `

            <img
                src="${country.flag}"
                alt="${country.name[0]}"
            >

            <div class="flag-info">

                ${
                    completed
                    ? `
                        <strong>
                            ${country.name[0]}
                        </strong>

                        <small>
                            ${country.capital[0]}
                        </small>
                    `
                    : `
                        <small>
                            Restante
                        </small>
                    `
                }

            </div>
        `;

        list.appendChild(item);
    });
}