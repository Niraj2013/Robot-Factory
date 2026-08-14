let game = {
    money: 1000,
    factoryLevel: 1,
    electricity: 100,
    workers: 2,
    reputation: 0,
    currentProduction: "None",
    efficiency: 100,
    productionQueue: [],
    dailyProfit: 0,
    factoryValue: 1000,
    storage: 0,
    storageCapacity: 20,
    machineHealth: 100,
    researchLevel: 1,
    factoryRank: "Beginner Factory",
    machineLevel: 1,
    conveyorLevel: 1,
    solarLevel: 0,
    toolLevel: 1,
    workerSkill: 1,
    robotsBuilt: 0,
    totalMoneyEarned: 0,
    bestRobot: "None",
    startTime: Date.now(),
    robotCounts: {
        toy: 0,
        clean: 0,
        delivery: 0,
        security: 0,
        ai: 0
    }
};

let currentRobot = null;

let robotParts = {
    head: false,
    body: false,
    arms: false,
    legs: false,
    battery: false,
    cpu: false
};

let robotPainted = false;
let robotAI = false;
let robotTested = false;
let assemblyProgress = 0;

let orderTimer = null;
let activeOrder = null;

let gameTimer = null;
let autoSaveTimer = null;

const orderTypes = [
    {
        name: "Toy Robot",
        reward: 250,
        time: 30
    },
    {
        name: "Cleaning Robot",
        reward: 650,
        time: 45
    },
    {
        name: "Delivery Robot",
        reward: 1100,
        time: 60
    },
    {
        name: "Security Robot",
        reward: 1800,
        time: 90
    },
    {
        name: "AI Assistant",
        reward: 3500,
        time: 120
    }
];

const achievements = [
    {
        id: "firstRobot",
        name: "First Robot Built",
        unlocked: false,
        check: function(){
            return game.robotsBuilt >= 1;
        }
    },
    {
        id: "fiveThousand",
        name: "Earn ₹5000",
        unlocked: false,
        check: function(){
            return game.totalMoneyEarned >= 5000;
        }
    },
    {
        id: "factoryLevelFive",
        name: "Reach Factory Level 5",
        unlocked: false,
        check: function(){
            return game.factoryLevel >= 5;
        }
    },
    {
        id: "hundredRobots",
        name: "Build 100 Robots",
        unlocked: false,
        check: function(){
            return game.robotsBuilt >= 100;
        }
    },
    {
        id: "everyRobot",
        name: "Unlock Every Robot",
        unlocked: false,
        check: function(){
            return (
                game.robotCounts.toy > 0 &&
                game.robotCounts.clean > 0 &&
                game.robotCounts.delivery > 0 &&
                game.robotCounts.security > 0 &&
                game.robotCounts.ai > 0
            );
        }
    }
];

function openWorkshop(robotName, cost, sellPrice, buildTime){
    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    if(game.storage >= game.storageCapacity){
        alert("Storage is full!");
        return;
    }

    currentRobot = {
        name: robotName,
        cost: cost,
        sellPrice: sellPrice,
        buildTime: buildTime
    };

    robotParts = {
        head: false,
        body: false,
        arms: false,
        legs: false,
        battery: false,
        cpu: false
    };

    robotPainted = false;
    robotAI = false;
    robotTested = false;
    assemblyProgress = 0;

    document.getElementById("workshopTitle").textContent =
        robotName + " Assembly Workshop";

    document.getElementById("robotWorkshop").hidden = false;

    document.getElementById("assemblyProgress").value = 0;
    document.getElementById("robotStatus").textContent = "Waiting...";
    document.getElementById("paintStatus").textContent = "Not Painted";
    document.getElementById("aiStatus").textContent = "Not Installed";
    document.getElementById("qualityStatus").textContent = "Not Tested";
    document.getElementById("workspaceLog").innerHTML =
        "Workspace Ready...";

    updateRobotPreview();
}

function closeWorkshop(){
    document.getElementById("robotWorkshop").hidden = true;
    currentRobot = null;
}

function addPart(part){
    if(!currentRobot){
        alert("Open a robot workshop first!");
        return;
    }

    if(robotParts[part]){
        return;
    }

    robotParts[part] = true;
    assemblyProgress += 10;

    if(assemblyProgress > 60){
        assemblyProgress = 60;
    }

    document.getElementById("assemblyProgress").value =
        assemblyProgress;

    document.getElementById("robotStatus").textContent =
        "Adding " + part + "...";

    document.getElementById("workspaceLog").innerHTML +=
        "<br>✓ " + part.toUpperCase() + " added.";

    updateRobotPreview();

    if(Object.values(robotParts).every(Boolean)){
        document.getElementById("robotStatus").textContent =
            "All parts assembled!";
    }
}

function updateRobotPreview(){
    const preview =
        document.getElementById("robotPreview");

    let robot = "";

    if(robotParts.head){
        robot += "🧠";
    }

    if(robotParts.body){
        robot += "🤖";
    }

    if(robotParts.arms){
        robot += "💪";
    }

    if(robotParts.legs){
        robot += "🦿";
    }

    if(robotParts.battery){
        robot += "🔋";
    }

    if(robotParts.cpu){
        robot += "💻";
    }

    if(robot === ""){
        robot = "🤖";
    }

    preview.textContent = robot;
}

function paintRobot(){
    if(!currentRobot){
        alert("Open a robot workshop first!");
        return;
    }

    if(!Object.values(robotParts).every(Boolean)){
        alert("Add all robot parts first!");
        return;
    }

    if(robotPainted){
        return;
    }

    robotPainted = true;
    assemblyProgress += 10;

    document.getElementById("assemblyProgress").value =
        assemblyProgress;

    document.getElementById("paintStatus").textContent =
        "Painted";

    document.getElementById("workspaceLog").innerHTML +=
        "<br>✓ Robot painted successfully.";

    document.getElementById("robotStatus").textContent =
        "Robot painted and ready for AI installation.";
}

function installAI(){
    if(!currentRobot){
        alert("Open a robot workshop first!");
        return;
    }

    if(!Object.values(robotParts).every(Boolean)){
        alert("Add all robot parts first!");
        return;
    }

    if(!robotPainted){
        alert("Paint the robot first!");
        return;
    }

    if(robotAI){
        return;
    }

    robotAI = true;
    assemblyProgress += 10;

    document.getElementById("assemblyProgress").value =
        assemblyProgress;

    document.getElementById("aiStatus").textContent =
        "Installed";

    document.getElementById("workspaceLog").innerHTML +=
        "<br>✓ AI system installed.";

    document.getElementById("robotStatus").textContent =
        "AI installed. Robot is ready for testing.";
}

function qualityTest(){
    if(!currentRobot){
        alert("Open a robot workshop first!");
        return;
    }

    if(!Object.values(robotParts).every(Boolean)){
        alert("Add all robot parts first!");
        return;
    }

    if(!robotPainted){
        alert("Paint the robot first!");
        return;
    }

    if(!robotAI){
        alert("Install AI first!");
        return;
    }

    if(robotTested){
        return;
    }

    robotTested = true;
    assemblyProgress += 10;

    document.getElementById("assemblyProgress").value =
        assemblyProgress;

    document.getElementById("qualityStatus").textContent =
        "Passed";

    document.getElementById("workspaceLog").innerHTML +=
        "<br>✓ Quality test passed.";

    document.getElementById("robotStatus").textContent =
        "Quality test passed. Robot is ready to complete.";
}

function completeRobot(){
    if(!currentRobot){
        alert("Open a robot workshop first!");
        return;
    }

    if(!Object.values(robotParts).every(Boolean)){
        alert("Add all robot parts first!");
        return;
    }

    if(!robotPainted){
        alert("Paint the robot first!");
        return;
    }

    if(!robotAI){
        alert("Install AI first!");
        return;
    }

    if(!robotTested){
        alert("Complete the quality test first!");
        return;
    }

    if(game.money < currentRobot.cost){
        alert("Not enough money!");
        return;
    }

    if(game.storage >= game.storageCapacity){
        alert("Storage is full!");
        return;
    }

    game.money -= currentRobot.cost;
    game.storage++;
    game.robotsBuilt++;

    game.currentProduction = currentRobot.name;

    updateRobotCount(currentRobot.name);

    if(activeOrder &&
       activeOrder.name === currentRobot.name){

        game.money += activeOrder.reward;
        game.totalMoneyEarned += activeOrder.reward;
        game.dailyProfit += activeOrder.reward;
        game.reputation += 5;

        clearInterval(orderTimer);

        document.getElementById("orderRobot").textContent =
            "Order Completed!";

        document.getElementById("orderReward").textContent =
            activeOrder.reward;

        document.getElementById("orderTime").textContent =
            "Completed";

        document.getElementById("orderProgress").value =
            100;

        activeOrder = null;

        setTimeout(function(){
            resetOrderDisplay();
        }, 2000);
    }

    updateFactoryLevel();
    updateFactoryRank();
    updateFactoryValue();
    updateDashboard();
    updateStatistics();
    checkAchievements();

    document.getElementById("workspaceLog").innerHTML +=
        "<br>✓ " + currentRobot.name +
        " completed successfully!";

    document.getElementById("robotStatus").textContent =
        "Robot completed!";

    assemblyProgress = 100;

    document.getElementById("assemblyProgress").value =
        100;

    setTimeout(function(){
        closeWorkshop();
    }, 1000);
}

function upgradeMachines(){
    const cost = 500 * game.machineLevel;

    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    game.money -= cost;
    game.machineLevel++;
    game.efficiency = Math.min(200, game.efficiency + 5);
    game.machineHealth =
        Math.min(100, game.machineHealth + 10);

    updateDashboard();
    updateUpgradeStatus();
    updateRobotProfits();
}

function upgradeConveyor(){
    const cost = 800 * game.conveyorLevel;

    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    game.money -= cost;
    game.conveyorLevel++;
    game.efficiency = Math.min(200, game.efficiency + 5);

    updateDashboard();
    updateUpgradeStatus();
}

function hireWorkers(){
    const cost = 1000 * game.workers;

    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    game.money -= cost;
    game.workers++;
    game.workerSkill++;

    updateDashboard();
    updateUpgradeStatus();
}

function buySolarPower(){
    const cost = 1500 * (game.solarLevel + 1);

    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    game.money -= cost;
    game.solarLevel++;
    game.electricity =
        Math.min(100, game.electricity + 20);

    game.efficiency =
        Math.min(200, game.efficiency + 3);

    updateDashboard();
    updateUpgradeStatus();
}

function buyBetterTools(){
    const cost = 1200 * game.toolLevel;

    if(game.money < cost){
        alert("Not enough money!");
        return;
    }

    game.money -= cost;
    game.toolLevel++;
    game.efficiency =
        Math.min(200, game.efficiency + 7);

    updateDashboard();
    updateUpgradeStatus();
}

function updateUpgradeStatus(){
    document.getElementById("machineLevel").textContent =
        game.machineLevel;

    document.getElementById("conveyorLevel").textContent =
        game.conveyorLevel;

    document.getElementById("solarLevel").textContent =
        game.solarLevel;

    document.getElementById("toolLevel").textContent =
        game.toolLevel;

    document.getElementById("workerSkill").textContent =
        game.workerSkill;
}

function updateFactoryLevel(){
    const newLevel =
        Math.floor(game.robotsBuilt / 10) + 1;

    if(newLevel > game.factoryLevel){
        game.factoryLevel = newLevel;
        game.reputation += 10;

        alert(
            "Factory Level Up!\nYou reached Level " +
            game.factoryLevel + "!"
        );
    }

    document.getElementById("factory-level").textContent =
        game.factoryLevel;
}

function updateFactoryRank(){
    if(game.factoryLevel >= 20){
        game.factoryRank = "Robot Empire";
    }else if(game.factoryLevel >= 15){
        game.factoryRank = "Industrial Giant";
    }else if(game.factoryLevel >= 10){
        game.factoryRank = "Advanced Factory";
    }else if(game.factoryLevel >= 5){
        game.factoryRank = "Professional Factory";
    }else if(game.factoryLevel >= 3){
        game.factoryRank = "Growing Factory";
    }else{
        game.factoryRank = "Beginner Factory";
    }

    document.getElementById("factoryRank").textContent =
        game.factoryRank;
}

function updateDashboard(){
    document.getElementById("money").textContent =
        Math.floor(game.money);

    document.getElementById("factory-level").textContent =
        game.factoryLevel;

    document.getElementById("electricity").textContent =
        Math.floor(game.electricity);

    document.getElementById("workers").textContent =
        game.workers;

    document.getElementById("reputation").textContent =
        game.reputation;

    document.getElementById("current-production").textContent =
        game.currentProduction;

    document.getElementById("efficiency").textContent =
        Math.floor(game.efficiency);

    document.getElementById("productionQueue").textContent =
        game.productionQueue.length > 0
            ? game.productionQueue.join(", ")
            : "Empty";

    document.getElementById("dailyProfit").textContent =
        Math.floor(game.dailyProfit);

    updateFactoryValue();

    document.getElementById("storage").textContent =
        game.storage;

    document.getElementById("machineHealth").textContent =
        Math.floor(game.machineHealth);

    document.getElementById("researchLevel").textContent =
        game.researchLevel;

    document.getElementById("factoryRank").textContent =
        game.factoryRank;
}

function updateFactoryValue(){
    game.factoryValue = Math.floor(
        game.money +
        game.robotsBuilt * 100 +
        game.factoryLevel * 500 +
        game.machineLevel * 250 +
        game.conveyorLevel * 300 +
        game.solarLevel * 400 +
        game.toolLevel * 350
    );

    document.getElementById("factoryValue").textContent =
        game.factoryValue;
}

function updateRobotCount(robotName){
    if(robotName === "Toy Robot"){
        game.robotCounts.toy++;
    }

    if(robotName === "Cleaning Robot"){
        game.robotCounts.clean++;
    }

    if(robotName === "Delivery Robot"){
        game.robotCounts.delivery++;
    }

    if(robotName === "Security Robot"){
        game.robotCounts.security++;
    }

    if(robotName === "AI Assistant"){
        game.robotCounts.ai++;
    }

    updateRobotCountsDisplay();
    updateBestRobot();
}

function updateRobotCountsDisplay(){
    document.getElementById("toyBuilt").textContent =
        game.robotCounts.toy;

    document.getElementById("cleanBuilt").textContent =
        game.robotCounts.clean;

    document.getElementById("deliveryBuilt").textContent =
        game.robotCounts.delivery;

    document.getElementById("securityBuilt").textContent =
        game.robotCounts.security;

    document.getElementById("aiBuilt").textContent =
        game.robotCounts.ai;
}

function updateRobotProfits(){
    document.getElementById("toyProfit").textContent =
        80 * game.machineLevel;

    document.getElementById("cleanProfit").textContent =
        200 * game.machineLevel;

    document.getElementById("deliveryProfit").textContent =
        300 * game.machineLevel;

    document.getElementById("securityProfit").textContent =
        500 * game.machineLevel;

    document.getElementById("aiProfit").textContent =
        1000 * game.machineLevel;
}

function updateBestRobot(){
    const counts = game.robotCounts;

    let bestRobot = "None";
    let highest = 0;

    if(counts.toy > highest){
        highest = counts.toy;
        bestRobot = "Toy Robot";
    }

    if(counts.clean > highest){
        highest = counts.clean;
        bestRobot = "Cleaning Robot";
    }

    if(counts.delivery > highest){
        highest = counts.delivery;
        bestRobot = "Delivery Robot";
    }

    if(counts.security > highest){
        highest = counts.security;
        bestRobot = "Security Robot";
    }

    if(counts.ai > highest){
        highest = counts.ai;
        bestRobot = "AI Assistant";
    }

    game.bestRobot = bestRobot;

    document.getElementById("bestRobot").textContent =
        bestRobot;
}

function updateStatistics(){
    document.getElementById("robotsBuilt").textContent =
        game.robotsBuilt;

    document.getElementById("totalMoneyEarned").textContent =
        Math.floor(game.totalMoneyEarned);

    document.getElementById("bestRobot").textContent =
        game.bestRobot;

    updatePlayTime();
    updateFactoryLevel();
    updateFactoryRank();
    updateFactoryValue();
}

function updatePlayTime(){
    const totalSeconds =
        Math.floor((Date.now() - game.startTime) / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    document.getElementById("playTime").textContent =
        minutes + " min " + seconds + " sec";
}

function generateOrder(){
    if(activeOrder){
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * orderTypes.length);

    const selected =
        orderTypes[randomIndex];

    activeOrder = {
        name: selected.name,
        reward: selected.reward,
        time: selected.time,
        remaining: selected.time
    };

    document.getElementById("orderRobot").textContent =
        activeOrder.name;

    document.getElementById("orderReward").textContent =
        activeOrder.reward;

    document.getElementById("orderTime").textContent =
        activeOrder.remaining + " sec";

    document.getElementById("orderProgress").value = 0;
}

function acceptOrder(){
    if(activeOrder){
        alert("You already have an active order!");
        return;
    }

    generateOrder();

    clearInterval(orderTimer);

    orderTimer = setInterval(function(){
        if(!activeOrder){
            clearInterval(orderTimer);
            return;
        }

        activeOrder.remaining--;

        const elapsed =
            activeOrder.time -
            activeOrder.remaining;

        const progress =
            (elapsed / activeOrder.time) * 100;

        document.getElementById("orderTime").textContent =
            activeOrder.remaining + " sec";

        document.getElementById("orderProgress").value =
            progress;

        if(activeOrder.remaining <= 0){
            failOrder();
        }
    }, 1000);
}

function completeOrder(robotName){
    if(!activeOrder){
        return false;
    }

    if(robotName !== activeOrder.name){
        return false;
    }

    game.money += activeOrder.reward;
    game.totalMoneyEarned += activeOrder.reward;
    game.dailyProfit += activeOrder.reward;
    game.reputation += 5;

    clearInterval(orderTimer);

    document.getElementById("orderRobot").textContent =
        "Order Completed!";

    document.getElementById("orderReward").textContent =
        activeOrder.reward;

    document.getElementById("orderTime").textContent =
        "Completed";

    document.getElementById("orderProgress").value =
        100;

    activeOrder = null;

    updateDashboard();
    updateStatistics();
    checkAchievements();

    setTimeout(function(){
        resetOrderDisplay();
    }, 2000);

    return true;
}

function failOrder(){
    clearInterval(orderTimer);

    game.reputation =
        Math.max(0, game.reputation - 3);

    document.getElementById("orderRobot").textContent =
        "Order Failed";

    document.getElementById("orderReward").textContent =
        "0";

    document.getElementById("orderTime").textContent =
        "Time's Up!";

    document.getElementById("orderProgress").value =
        100;

    activeOrder = null;

    updateDashboard();

    setTimeout(function(){
        resetOrderDisplay();
    }, 2000);
}

function resetOrderDisplay(){
    document.getElementById("orderRobot").textContent =
        "No Active Order";

    document.getElementById("orderReward").textContent =
        "0";

    document.getElementById("orderTime").textContent =
        "--";

    document.getElementById("orderProgress").value =
        0;
}

function checkAchievements(){
    const achievementItems =
        document.querySelectorAll("#achievements li");

    achievements.forEach(function(achievement, index){
        if(achievement.unlocked){
            return;
        }

        if(achievement.check()){
            achievement.unlocked = true;

            if(achievementItems[index]){
                achievementItems[index].textContent =
                    "✓ " + achievement.name;

                achievementItems[index].style.background =
                    "linear-gradient(135deg,#e8f5e9,#c8e6c9)";

                achievementItems[index].style.borderLeftColor =
                    "#43a047";
            }

            game.reputation += 10;

            alert(
                "Achievement Unlocked!\n\n" +
                achievement.name
            );
        }
    });
}

function updateAchievementsDisplay(){
    const achievementItems =
        document.querySelectorAll("#achievements li");

    achievements.forEach(function(achievement, index){
        if(!achievementItems[index]){
            return;
        }

        if(achievement.unlocked){
            achievementItems[index].textContent =
                "✓ " + achievement.name;

            achievementItems[index].style.background =
                "linear-gradient(135deg,#e8f5e9,#c8e6c9)";

            achievementItems[index].style.borderLeftColor =
                "#43a047";
        }else{
            achievementItems[index].textContent =
                "🔒 " + achievement.name;
        }
    });
}

function saveGame(showMessage = true){
    const saveData = {
        game: game,
        achievements: achievements.map(function(achievement){
            return {
                id: achievement.id,
                name: achievement.name,
                unlocked: achievement.unlocked
            };
        })
    };

    localStorage.setItem(
        "robotFactorySave",
        JSON.stringify(saveData)
    );

    if(showMessage){
        alert("Game saved successfully!");
    }
}

function loadGame(){
    const savedData =
        localStorage.getItem("robotFactorySave");

    if(!savedData){
        alert("No saved game found!");
        return;
    }

    try{
        const data = JSON.parse(savedData);

        if(!data.game){
            alert("Saved game data is invalid!");
            return;
        }

        game = data.game;

        if(!game.robotCounts){
            game.robotCounts = {
                toy: 0,
                clean: 0,
                delivery: 0,
                security: 0,
                ai: 0
            };
        }

        if(!game.productionQueue){
            game.productionQueue = [];
        }

        if(!game.startTime){
            game.startTime = Date.now();
        }

        if(data.achievements){
            data.achievements.forEach(function(savedAchievement){
                const achievement =
                    achievements.find(function(item){
                        return item.id === savedAchievement.id;
                    });

                if(achievement){
                    achievement.unlocked =
                        savedAchievement.unlocked;
                }
            });
        }

        updateGame();

        alert("Game loaded successfully!");
    }catch(error){
        alert("Could not load the saved game.");
    }
}

function resetGame(){
    const confirmation =
        confirm(
            "Are you sure you want to reset your entire factory?\n\n" +
            "All progress will be permanently deleted."
        );

    if(!confirmation){
        return;
    }

    localStorage.removeItem("robotFactorySave");

    location.reload();
}

function autoSave(){
    saveGame(false);
}

function automaticFactorySystems(){
    if(game.electricity > 0){
        game.electricity =
            Math.max(0, game.electricity - 0.1);
    }

    if(game.solarLevel > 0){
        game.electricity =
            Math.min(
                100,
                game.electricity +
                game.solarLevel * 0.2
            );
    }

    if(game.electricity <= 0){
        game.efficiency =
            Math.max(25, game.efficiency - 0.1);
    }

    if(game.machineHealth > 0){
        game.machineHealth =
            Math.max(0, game.machineHealth - 0.01);
    }

    if(game.machineHealth < 25){
        game.efficiency =
            Math.max(25, game.efficiency - 0.1);
    }

    game.dailyProfit +=
        game.workers *
        game.workerSkill *
        0.01;

    updateDashboard();
}

function startGameSystems(){
    clearInterval(gameTimer);
    clearInterval(autoSaveTimer);

    gameTimer = setInterval(function(){
        updatePlayTime();
        automaticFactorySystems();
        checkAchievements();
    }, 1000);

    autoSaveTimer = setInterval(function(){
        autoSave();
    }, 30000);
}

function updateGame(){
    updateDashboard();
    updateUpgradeStatus();
    updateRobotCountsDisplay();
    updateRobotProfits();
    updateStatistics();
    updateAchievementsDisplay();
}

window.addEventListener("beforeunload", function(){
    autoSave();
});

document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
        const workshop =
            document.getElementById("robotWorkshop");

        if(workshop && !workshop.hidden){
            closeWorkshop();
        }
    }
});

document.addEventListener("DOMContentLoaded", function(){
    updateGame();
    startGameSystems();

    const savedData =
        localStorage.getItem("robotFactorySave");

    if(savedData){
        const loadSavedGame =
            confirm(
                "A saved game was found. Would you like to load it?"
            );

        if(loadSavedGame){
            loadGame();
        }
    }
});