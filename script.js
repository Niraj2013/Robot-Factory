let money = 1000;
let factoryLevel = 1;
let electricity = 100;
let workers = 2;
let reputation = 0;
let efficiency = 100;
let storage = 0;

let robotsBuilt = 0;
let totalMoneyEarned = 0;
let dailyProfit = 0;

let factoryValue = 1000;

let currectProduction = "None";
let productionQueue = [];

let machineHealth = 100;
let researchLevel = 1;
let factoryRank = "Beginner Factory";

let toyBuilt = 0;
let cleanBuit = 0;
let deliverybuilt = 0;
let securityBuilt = 0;
let aiBuilt = 0;

let selectedRobot = null;
let selectedCost = 0;
let selectedSellPrice = 0;
let selectedBuildTime = 0;

let partsInstalled = 0;
let robotPainted = false;
let aiInstalled = false;
let qualityPassed = false;

function updateDashboard(){
    document.getElementById("money").textContent = money;
    document.getElementById("factory-level").textContent = factoryLevel;
    document.getElementById("electrictiy").textContent = electricity;
    document.getElementById("workers").textContent = workers;
    document.getElementById("reputation").textContent = reputation;
    document.getElementById("effficiency").textContent = efficiency;
    document.getElementById("storage").textContent = storage;
    document.getElementById("robotsBuilt").textContent = robotsBuilt;
    document.getElementById("dailyProfit").textContent = dailyProfit;
    document.getElementById("factoryValue").textContent = factoryLevel;
    document.getElementById("machineHealth").textContent = machineHealth;
    document.getElementById("researchLevel").textContent = researchLevel;
    document.getElementById("factoryRank").textContent = factoryRank;
    document.getElementById("totalMoneyEarned").textContent = totalMoneyEarned;
    document.getElementById("current-production").textContent = currectProduction;

    if(productionQueue.length===0){
        document.getElementById("productionQueue").textContent="Empty";
    }

    else{
        document.getElementById("productionQueue").textContent=productionQueue
    }

}

function openWorkshop(name,cost,sellPrice,time){
    if(money<cost){
        alert("Not Enough Money");

        return;
    }

    selectedRobot=name;
    selectedCost=cost;
    selectedSellPrice=sellPrice;
    selectedBuildTime=time;
    currectProduction=name;
    productionQueue.push(name);
    document.getElementById("workshopTitle").textContent=name+" Workshop";
    document.getElementById("robotWorkshop").hidden=false;
    resetWorkshop();
    updateDashboard();
}

function closeWorkshop(){
    document.getElementById("robotWorkshop").hidden=true;
}

function resetWorkshop(){
    partsInstalled=0;
    robotPainted=false;
    aiInstalled=false;
    qualityPassed=false;

    document.getElementById("assemblyProgress").value=0;
    document.getElementById("robotStatus").textContent="Waiting...";
    document.getElementById("paintStatus").textContent="NotPainted";
    document.getElementById("aiStatus").textContent="Not Installed";
    document.getElementById("qualityStatus").textContent="Not Tested";
    document.getElementById("workspaceLog").innerHTML="Workspace Ready...";
}

function addLog(message){
    let log=document.getElementById("workspaceLog");
    log.innerHTML+="<br>"+message;
    log.scrollTop=log.scrollHeight;
}

updateDashboard();