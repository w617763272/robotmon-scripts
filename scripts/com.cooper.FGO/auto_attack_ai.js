var initServant = [];
var initUlt = [];
var ultList = [];
var cardList = [];
var cardStatus = []; // -1:null 0:disable 1:weak 2:resist
var servantInited;
var ultCheckX = [682,1146,1620];
var ultCheckY = 420;
var allServentDieFlag = false;

//autoAttack(3,0,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
function autoAttack(until,mainColor,sameColor,weak,die,p0ult,p0s0,p0t0,p0s1,p0t1,p0s2,p0t2,p1ult,p1s0,p1t0,p1s1,p1t1,p1s2,p1t2,p2ult,p2s0,p2t0,p2s1,p2t1,p2s2,p2t2){
    if(isDebug){
        until = 2;
        mainColor = 0;
        sameColor = 1;
        die = 0;
        p0ult = 0;
        p0s0 = -1;
        p0t0 = -1;
        p0s1 = -1;
        p0t1 = -1;
        p0s2 = -1;
        p0t2 = -1;
        p1ult = 0;
        p1s0 = -1;
        p1t0 = -1;
        p1s1 = -1;
        p1t1 = -1;
        p1s2 = -1;
        p1t2 = -1;
        p2ult = 0;
        p2s0 = -1;
        p2t0 = -1;
        p2s1 = -1;
        p2t1 = -1;
        p2s2 = -1;
        p2t2 = -1;
    }
    servantInited = false;
    var ult = [];
    ult[0] = p0ult;
    ult[1] = p1ult;
    ult[2] = p2ult;
    var ps0 = [];
    ps0[0] = p0s0;
    ps0[1] = p0s1;
    ps0[2] = p0s2;
    var ps1 = [];
    ps1[0] = p1s0;
    ps1[1] = p1s1;
    ps1[2] = p1s2;
    var ps2 = [];
    ps2[0] = p2s0;
    ps2[1] = p2s1;
    ps2[2] = p2s2;

    var pt0 = [];
    pt0[0] = p0t0;
    pt0[1] = p0t1;
    pt0[2] = p0t2;
    var pt1 = [];
    pt1[0] = p1t0;
    pt1[1] = p1t1;
    pt1[2] = p1t2;
    var pt2 = [];
    pt2[0] = p2t0;
    pt2[1] = p2t1;
    pt2[2] = p2t2;

    var p0 = [];
    p0[0] = ps0;
    p0[1] = pt0;
    var p1 = [];
    p1[0] = ps1;
    p1[1] = pt1;
    var p2 = [];
    p2[0] = ps2;
    p2[1] = pt2;

    var skill = [];
    skill[0] = p0;
    skill[1] = p1;
    skill[2] = p2;
    waitUntilPlayerCanMove();
    while(true){
        if(!isScriptRunning){
            break;
        }
        sleep(500);
        /*
        var screenShot = getScreenshot();
        if(checkImage(screenShot,selectBackImage,2300,1340,180,50)){
            tapScale(2390,1350,100);
        }
        releaseImage(screenShot);
        */
        var currentStage = getCurrentStage();
        if(until!=0 && until <= currentStage){
            break;
        }else if(isQuestFinish() >= 0){
            console.log("Quest Finish");
            break;
        }else{
            console.log("AutoAttack start new turn");
            attackAI(mainColor,sameColor,weak,die,ult,skill,currentStage);
        }
        if(until == 0){
            break;
        }
        sleep(5000);
        waitUntilPlayerCanMoveOrFinish();
    }
    for(var i=0;i<3;i++){
        releaseImage(initServant[i]);
    }
}

function attackAI(mainColor,sameColor,weak,die,ult,skill,currentStage){
    var screenShot = getScreenshot();
    var servantAlive = [true,true,true];
    if(!servantInited){
        console.log("Init servant image");
        servantInited = true;
        initServant = getCurrentServant(screenShot);
        for(var i=0;i<3;i++){
            servantAlive[i] = true;
        }
    }else{
        var currentServant = getCurrentServant(screenShot);
        for(var i=0;i<3;i++){
            if(getIdentityScore(initServant[i],currentServant[i])>0.85){
                servantAlive[i] = true;
            }else{
                console.log("servant "+i+" died");
                servantAlive[i] = false;
            }
        }
        if(!(servantAlive[0] || servantAlive[1] || servantAlive[2])){
            /*
            var path = getStoragePath();
            var currentdate = new Date();
            var time = currentdate.getTime();
            saveImage(screenShot,path+"/AllDieBug_"+time+".png");
            for(var j=0;j<3;j++){ 
                saveImage(currentServant[j],path+"/AllDieBug_current"+j+"_"+time+".png");                
                saveImage(initServant[j],path+"/AllDieBug_init"+j+"_"+time+".png");
            }*/
            console.log("All servant die bug?");
            if(!allServentDieFlag){
                allServentDieFlag = true;
                releaseImage(screenShot);
                return;
            }
        }
        for(var i = 0;i<3;i++){            
            releaseImage(currentServant[i]);
        }
    }
    allServentDieFlag = false;
    for(var i=0;i<3;i++){
        if(initUlt[i] != undefined){
            releaseImage(initUlt[i]);
        }
        initUlt[i] = cropImage(screenShot,ultCheckX[i]* screenScale[0] + screenOffset[0],ultCheckY* screenScale[1] + screenOffset[1],300 * screenScale[0],180* screenScale[1]);
    }
    var skillUsed = [];
    var m = 'skill_used:';
    for(var i=0;i<9;i++){
        skillUsed[i] = checkImage(screenShot,skillUsedImage,skillPositionX[i],skillPositionY,skillPositionW,skillPositionH);
        m+=skillUsed[i]+",";
    }
    releaseImage(screenShot);
    console.log(m);
    for(var i =0;i<3;i++){
        for(var j=2;j>=0;j--){
            if(!isScriptRunning){
                break;
            }
            if(!servantAlive[i]){
                switch(die){
                    case 0:
                        isScriptRunning = false;
                    return;
                    case 1:
                        if(!skillUsed[i*3+j]){
                            useSkill(i,j,skill[i][1][j],false); 
                        }
                    break;
                    case 2:
                    break;
                }
            }
            else if(skill[i][0][j] >= 0 && currentStage >= skill[i][0][j] && !skillUsed[i*3+j]){
                useSkill(i,j,skill[i][1][j],false);
            }
        }
    }
    console.log("skill use finish");
    startAttack();
    console.log("startAttack finish");
    updateCardList();
    console.log("updateCardList finish");
    updateUltList();
    console.log("updateUltList finish");

    var cardScore = [0,0,0,0,0];
    var sameColorCnt=[0,0,0];
    var sameColorScore = 1.5;
    var mainColorScore = 0.3;
    if(sameColor == 0){
        sameColorScore = 0;
    }else if(sameColor == 2){
        sameColorScore = 5.5;
    }
    var weakScore = 1;
    if(weak == 0){
        weakScore = 0;
    }else if(weak == 2){
        weakScore = 5;
    }
    var usedColor = [0,0,0];
    for(var i = 0;i<3;i++){
        if(ult[i] >= 0 && currentStage >= ult[i] && ultList[i] >= 0){
            usedColor[ultList[i]]++;
            sameColorCnt[ultList[i]]++;
        }
    }
    for(var i =0;i<5;i++){
        sameColorCnt[cardList[i]]++;
    }
    if((usedColor[0]>0 && usedColor[1] > 0)||(usedColor[0]>0 && usedColor[2] > 0)||(usedColor[1]>0 && usedColor[2] > 0)){
        sameColorCnt = [0,0,0];
    }else if(usedColor[0]>0){
        sameColorCnt[1] = 0;
        sameColorCnt[2] = 0;
    }else if(usedColor[1]>0){
        sameColorCnt[0] = 0;
        sameColorCnt[2] = 0;        
    }else if(usedColor[2]>0){
        sameColorCnt[0] = 0;
        sameColorCnt[1] = 0;        
    }
    for(var i=0;i<5;i++){
        if(sameColorCnt[cardList[i]] >= 3){
            cardScore[i] += sameColorScore;
        }
        switch(cardStatus[i]){
            case 0:
                cardScore[i] -= 100;
            break;
            case 1:
                cardScore[i] += weakScore;
            break;
            case 2:
                cardScore[i] -= weakScore;
            break;
        }
        if(cardList[i] == mainColor){
            cardScore[i] += mainColorScore;
        }
    }
    console.log("Ult:"+ultList);
    console.log("Card:"+cardList);
    console.log("Status:"+cardStatus);
    for(var i =0;i<3;i++){
        if(ult[i] >= 0 && currentStage >= ult[i] && ultList[i] >= 0){
            useUlt(i);
        }
    }
    while(true){
        if(!isScriptRunning){
            break;
        }
        var max = -10000;
        var id = -1;
        for(var i =0;i<5;i++){
            if(cardScore[i] > max){
                id = i;
                max = cardScore[i];
            }
        }
        if(id >= 0){
            selectCard(id);
            cardScore[id] = -15000;
        }else{
            return;
        }
    }
    sleep(5000);
}

function updateUltList(){
    var edgeX = [696,1159,1622];
    var edgeY = [270,570];
    var screenShot = getScreenshot();
    for(var i=0;i<3;i++){
        var card = cropImage(screenShot,ultCheckX[i]* screenScale[0] + screenOffset[0],ultCheckY* screenScale[1] + screenOffset[1],300 * screenScale[0],180* screenScale[1]);
        var score1 = getImageLightness(card,5);
        var score2 = getIdentityScore(card,initUlt[i]);
        if((score1 >= 120 && score2 < 0.6) ||(score1 >= 100 && score2 < 0.5) || (score1 >= 80 &&score2 < 0.3)){
            var r=0,g=0,b=0;
            for(var ey=edgeY[0];ey<edgeY[1];ey++){
                var color = getImageColor(screenShot,edgeX[i]* screenScale[0] + screenOffset[0],ey* screenScale[1] + screenOffset[1]);
                if(color.r > (color.g + color.b)){
                    r++;
                }
                if(color.g > (color.r + color.b)){
                    g++;
                }
                if(color.b > (color.r + color.g)){
                    b++;
                }
            }
            if(r >= g && r >= b){
                 ultList[i] = 0;
            }
            else if(b >= r && b >= g){
                ultList[i] = 1;
            }
            else if(g >= r && g >= b){
                ultList[i] = 2;
            }
        }else{
            ultList[i] = -1;
        }
        releaseImage(card);
    }
    releaseImage(screenShot);
}

function updateCardList(){
    var cardImageScore = [];
    var screenShot = getScreenshot();

    var offsetDisableX = [110,260];
    var offsetDisableY = -90;
    var disableW = [65,60];
    var disableH = 65;

    var weakW = 100;
    var weakH = 30;
    //get card color
    for(var i=0;i<5;i++){
        for(var j =0;j<2;j++){
            var card = cropImage(screenShot,updateCardListX[i]* screenScale[0] + screenOffset[0],updateCardListY[j]* screenScale[1] + screenOffset[1],300 * screenScale[0],100* screenScale[1]);
            for(var k=0;k<3;k++){
                var resizeCard = resizeImage(cardListImage[k],300 * screenScale[0],100* screenScale[1]);
                var score = getIdentityScore(card,resizeCard);
                if(cardImageScore[i] == undefined || score > cardImageScore[i]){
                    cardImageScore[i] = score;
                    cardList[i] = k;
                }
                releaseImage(resizeCard);
            }
            releaseImage(card);
        }
    }
    //get card status
    for(var i=0;i<5;i++){
        cardStatus[i] = -1;
        for(var checkY = updateCardListY[0];checkY < updateCardListY[1];checkY+=2){
            for(var ox = -2;ox<3;ox++){
                if(checkImage(screenShot,cardDisableImage[0],updateCardListX[i] + offsetDisableX[0]+ox,updateCardListY[j] + offsetDisableY,disableW[0], disableH) 
                    && checkImage(screenShot,cardDisableImage[1],updateCardListX[i] + offsetDisableX[1]+ox,checkY + offsetDisableY,disableW[1], disableH)){
                    cardStatus[i] = 0;
                    break;
                }else if(checkImage(screenShot,cardWeakImage[0],updateCardListX[i] + updateCardListOffsetWeakX+ox, checkY + updateCardListOffsetWeakY[0], weakW,weakH)){
                    cardStatus[i] = 1;
                    break;
                }else if(checkImage(screenShot,cardWeakImage[1],updateCardListX[i] + updateCardListOffsetWeakX+ox, checkY + updateCardListOffsetWeakY[1], weakW,weakH)){
                    cardStatus[i] = 2;
                    break;
                }
            }
        }
    }
    releaseImage(screenShot);
}

function getCurrentServant(screenShot){
    var x = [200,830,1470];
    var y = 800;
    var servant = [];
    for(var i=0;i<3;i++){
        servant[i] = cropImage(screenShot,x[i]* screenScale[0] + screenOffset[0],y* screenScale[1] + screenOffset[1],300* screenScale[0],200* screenScale[1]);
    }
    return servant;
}


console.log("Load auto attack api finish");