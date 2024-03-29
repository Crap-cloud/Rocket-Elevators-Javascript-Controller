let floorRequestButtonID = 1;
let callButtonID = 1;

class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        this.ID = _id;
        this.status = 'online';
        this.elevatorList = [];
        this.callButtonList = [];
        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);
    };
    //Methods
    createCallButtons(_amountOfFloors){
        let buttonFloor = 1;
        for(let i=0;i<_amountOfFloors;i++){
            if(buttonFloor < _amountOfFloors){
                let callButton = new CallButton(callButtonID, 'OFF', buttonFloor, 'Up');
                this.callButtonList.push(callButton);
                callButtonID += 1;
            }
            if(buttonFloor > 1){
                let callButton = new CallButton(callButtonID, 'OFF', buttonFloor, 'Down');
                this.callButtonList.push(callButton);
                callButtonID += 1;
            }
            buttonFloor += 1;
        }
    }
    createElevators(_amountOfFloors, _amountOfElevators){
        let elevatorID = 1;
        for(let i=0;i<_amountOfElevators;i++){
            let elevator = new Elevator(elevatorID, 'idle', _amountOfFloors, 1);
            this.elevatorList.push(elevator);
            elevatorID += 1;
        }
    }
    requestElevator(floor, direction){
        let elevator = this.findElevator(floor, direction);
        elevator.floorRequestList.push(floor);
        elevator.move();
        elevator.operateDoors();
        return elevator;
    }
    findElevator(requestedFloor, requestedDirection){
        let bestElevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations;
        for(let i=0;i<this.elevatorList.length;i++){
            //The elevator is at my floor and going in the direction I want
            if(requestedFloor == this.elevatorList[i].currentFloor && this.elevatorList[i].status == 'stopped' && requestedDirection == this.elevatorList[i].direction){
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            //The elevator is lower than me, is coming up and I want to go up
            else if(requestedFloor > this.elevatorList[i].currentFloor && this.elevatorList[i].direction == "Up" && requestedDirection == this.elevatorList[i].direction){
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            //The elevator is higher than me, is coming down and I want to go down
            else if(requestedFloor < this.elevatorList[i].currentFloor && this.elevatorList[i].direction == 'Down' && requestedDirection == this.elevatorList[i].direction){
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            //The elevator is idle
            else if(this.elevatorList[i].status == 'idle'){
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            //The elevator is not available, but still could take the call if nothing better is found
            else{
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            bestElevator = bestElevatorInformations[0];
            bestScore = bestElevatorInformations[1];
            referenceGap = bestElevatorInformations[2];
        }
        return bestElevator;
    }
    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor){
        if(scoreToCheck < bestScore){
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - floor);
        }
        else if(bestScore == scoreToCheck){
            let gap = Math.abs(newElevator.currentFloor - floor);
            if(referenceGap > gap){
                bestElevator = newElevator;
                referenceGap = gap;
            }
        }
        let bestElevatorInformations = [bestElevator, bestScore, referenceGap];
        return bestElevatorInformations 
    }
}

class Elevator {
    constructor(_id, _amountOfFloors) {
        this.ID = _id;
        this.status = '';
        this.currentFloor = 1;
        this.direction = null;
        this.door = new Door(_id, 'closed');
        this.floorRequestButtonList = [];
        this.floorRequestList = [];
        this.createFloorRequestButtons(_amountOfFloors);
    }
    createFloorRequestButtons(_amountOfFloors){
        let buttonFloor = 1;
        for(let i=0;i<_amountOfFloors;i++){
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, 'OFF', buttonFloor)
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor += 1;
            floorRequestButtonID += 1;
        }
    }
    requestFloor(floor){
        this.floorRequestList.push(floor);
        this.move();
        this.operateDoors();
    }
    move(){
        while(this.floorRequestList.length != 0){
            let destination = this.floorRequestList[0];
            this.status = 'moving';
            if(this.currentFloor < destination){
                this.direction = 'Up';
                this.sortFloorList();
                while(this.currentFloor < destination){
                    this.currentFloor += 1;
                    this.screenDisplay = this.currentFloor;
                }
            }
            else if(this.currentFloor > destination){
                this.direction = 'Down';
                this.sortFloorList();
                while(this.currentFloor > destination){
                    this.currentFloor -= 1;
                    this.screenDisplay = this.currentFloor;
                }
            }
            this.status = 'stopped';
            this.floorRequestList.shift();
        }
        this.status = 'idle';
    }
    sortFloorList(){
        if(this.direction == 'Up'){
            this.floorRequestList.sort(function(a, b){return a-b})
        }
        else{
            this.floorRequestList.sort(function(a, b){return b-a})
        }
    }
    operateDoors(){
        let overweight = 350;
        let obstruction = false;
        this.door.status = 'opened';
        //setTimeout(function(){},5000); //wait 5sec for people
        if(overweight < 600 ){
            this.door.status = 'closing';
            if(obstruction == false){
                this.door.status = 'closed';
            }
            else{
                this.operateDoors();
            }
        }
        else {
            while(overweight >= 600){
                console.log('Overweight alarm activated !');
            }
            this.operateDoors();
        }
    }
}

class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = "OFF";
        this.floor = _floor;
        this.direction = _direction;
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = "OFF";
        this.floor = _floor;
    }
}

class Door {
    constructor(_id) {
        this.ID = _id;
        this.status = 'closed';
    }
}

module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }


/*Scenario 1
const column = new Column(1, 'online', 10, 2);
column.elevatorList[0]._currentFloor = 2;
column.elevatorList[1]._currentFloor = 6;
const elevator = column.requestElevator(3, 'Up');
elevator.requestFloor(7);
console.log(elevator);*/

/*Scenario 2
const column = new Column(1, 10, 2);
column.elevatorList[0].currentFloor = 10;
column.elevatorList[1].currentFloor = 3;*/
/*Part 1
const elevator = column.requestElevator(1, 'Up');
elevator.requestFloor(6);
console.log(column.elevatorList);*/
/*Part 2
const elevator = column.requestElevator(3, 'Up');
elevator.requestFloor(5);
console.log(elevator);*/

/*Part 3
const elevator = column.requestElevator(9, 'Down');
elevator.requestFloor(2);
console.log(elevator);*/

/*Scenario 3
const column = new Column(1, 'online', 10, 2);
column.elevatorList[0].currentFloor = 10;
column.elevatorList[1].currentFloor = 3;
column.elevatorList[1].status = 'moving';
column.elevatorList[1].floorRequestList.push(6);*/
/*Part 1
const elevator = column.requestElevator(3, 'Down');
elevator.requestFloor(2);
console.log(elevator);*/
/*Part 2
const elevator = column.requestElevator(10, 'Down');
elevator.requestFloor(3);
console.log(elevator);*/