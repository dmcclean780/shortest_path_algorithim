let world;
let terrainCost
let end = {x:Math.floor(Math.random()*39), y:Math.floor(Math.random()*29)};
let start = {x:22, y:16};
let terrainCosts=[1,1,1,1,1,1,Infinity,Infinity,Infinity,Infinity,Infinity, Infinity, Infinity, Infinity ]


window.addEventListener('load',(event)=>{
    const canvas=document.getElementById("canvas")
    start=popWorld(start, end);
    //console.log(terrainCost);
    let path=AStar(world, start, end)
    plotTerrain(terrainCost)
    plotPath(path, "rgb(0,0,255")
})


function popWorld(start){
    world=new Array(40);
    terrainCost=new Array(40);
    for(var i=0; i<world.length; i++){
        world[i]=new Array(30);
        terrainCost[i]=new Array(30)
        for(var j=0; j<world[i].length; j++){
            world[i][j]={x:i, y:j, f:0, g:0, h:0, neighbours:null, parent:null};
            terrainCost[i][j]=terrainCosts[Math.floor(Math.random()*terrainCosts.length)];
            //console.log(Math.floor(Math.random()*terrainCosts.length))
        }
    }
    start=world[start.x][start.y]
    return start;
}

function getNeighbours(x,y){
    let neighbours=[]
    for(let i=-1; i<2; i++){
        if(i!=0 && x+i>-1 && x+i<40){
            neighbours.push({x:x+i, y:y})
        }
    }
    for(let i=-1; i<2; i++){
        if(i!=0 && y+i>-1 && y+i<30){
            neighbours.push({x:x, y:y+i})
        }
    }
    return neighbours;
}

function draw(x, y, colour) {
    const canvas=document.getElementById("canvas")
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = colour;
        ctx.fillRect(x,y,1,1);
    }
}

function plotTerrain(terrainCost){
    for(var i=0; i<terrainCost.length; i++){
        for(var j=0; j<terrainCost[i].length; j++){
            if(terrainCost[i][j]==Infinity){
                draw(i, j, "rgb(0, 0, 0)")
            }
            if(terrainCost[i][j]==10){
                draw(i, j, "rgb(255, 255, 0)")
            }
        }
    }
}

function plotPath(path, colour){
    for(var i=0; i<path.length; i++){
        point=path[i]
        draw(point.x, point.y, colour)
        draw(start.x, start.y, "rgb(0, 255, 0)");
        draw(end.x, end.y, "rgb(0, 255, 0)");
    }
}

function heuristic(curPos, end, D){
    let dx = Math.abs(curPos.x-end.x)
    let dy = Math.abs(curPos.y-end.y)
    return D*(dy+dx);
}

function AStar(world, start, end){
    
    let openSet=[];
    let closedSet=[];
    let path=[];

    openSet.push(start)

    while(openSet.length>0){
        let lowestCostIndex=0;
        for(let i=0; i<openSet.length; i++){
            if(openSet[i].f<openSet[lowestCostIndex].f){
                lowestCostIndex=i;
            }
        }
        
        
        let currentNode=openSet[lowestCostIndex];
        currentNode.neighbours=getNeighbours(currentNode.x,currentNode.y);

        if(currentNode.x==end.x && currentNode.y==end.y){
            let temp=currentNode;
            path.push(temp)
            while(temp.parent != null){
                path.push(temp.parent);
                temp = temp.parent;
            }

            //plotPath(openSet, "rgb(0,255,255")
            //plotPath(closedSet, "rgb(255, 0, 255")
            return path
        }

        openSet.splice(lowestCostIndex, 1);
        closedSet.push(currentNode);

        let neighbours=currentNode.neighbours;

        for(let i=0; i<neighbours.length; i++){
           
            let neighbour = world[neighbours[i].x][neighbours[i].y]
            
            
            let currentG = currentNode.g
            let nextG = currentG + 1
            neighbour.g=nextG
            neighbour.h=heuristic(neighbour, end, terrainCost[neighbour.y][neighbour.x])
            
            if(!(closedSet.includes(neighbour))){
                
                thisF=neighbour.g+neighbour.h;
                thisParent=currentNode;
                neighbour.f=thisF;
                neighbour.parent=thisParent;
                
                if(!(openSet.includes(neighbour))){
                    openSet.push(neighbour);
                }

            }
        }
    }
    return []
}

