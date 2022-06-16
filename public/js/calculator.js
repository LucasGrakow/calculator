var user = ""
let calculator_buttons = [
    {
        name : "power",
        symbol : "ON OFF",
        type : "power"
    },
    {
        name : "1",
        symbol : 1,
        type : "number"
    },
    {
        name : "2",
        symbol : 2,
        type : "number"
    },
    {
        name : "subtraction",
        symbol : "-",
        type : "operator"
    },
    {
        name : "3",
        symbol : 3,
        type : "number"
    },
    {
        name : "4",
        symbol : 4,
        type : "number"
    },    
    {
        name : "5",
        symbol : 5,
        type : "number"
    },
    {
        name : "addition",
        symbol : "+",
        type : "operator"
    },
    {
        name : "6",
        symbol : 6,
        type : "number"
    },
    {
        name : "7",
        symbol : 7,
        type : "number"
    },
    {
        name : "8",
        symbol : 8,
        type : "number"
    },
    {
        name : "multiplication",
        symbol : "*",
        type : "operator"
    },
    {
        name : "9",
        symbol : 9,
        type : "number"
    },
    {
        name : "0",
        symbol : 0,
        type : "number"
    },
    {
        name : "clear",
        symbol : "C",
        type : "key"
    },
    {
        name : "division",
        symbol : "/",
        type : "operator"
    },
    {
        name : "open-parenthesis",
        symbol : "(",
        type : "number"
    },
    {
        name : "close-parenthesis",
        symbol : ")",
        type : "number"
    },
    {
        name : "dot",
        symbol : ".",
        type : "number"
    },
    {
        name : "calculate",
        symbol : "=",
        type : "calculate"
    },
];

let data = {
    operation: []
}

var calculatorStatus = false
$(document).ready(function(){
	window.addEventListener("click",function(event){
        const target_btn = event.target.id;   
        calculator_buttons.forEach( button => {
            if(button.name == target_btn && button.type === "power") {
                powerCalculator()
                
            } else {
                if(button.name == target_btn && calculatorStatus === true) {
                    calculator(button);
                }  
            } 
        })
	});
});

function createCalculatorButtons() {
    $(".input").html(`
        ${calculator_buttons.map( button => `
            <div class="row">
                <button id="${button.name}">
                    ${button.symbol}
                </button>
            </div>
        `)
        .join("")}
    `);
}
createCalculatorButtons();

function drawHistoric() {
    $.post(`http://localhost:3000/historic`,{},
    function(response){
        $(".paperHistoric").html(`
            ${response.result.map( historic => `
                <h2> ${historic.operation} = ${historic.result} - ${historic.user_name} <br>${historic.created_at}</h2>
            `)
            .join("")}
        `);
    });
}
drawHistoric()

function powerCalculator() {
    if (calculatorStatus == false) {
        calculatorStatus = true
        $('.result .value').html(0)
        $('.result').css('background-color','rgb(85,88,77')
    } else {
        calculatorStatus = false
        data.operation = []
        $('.result .value').html("")
        $('.result').css('background-color','rgb(54,54,54')
    }
}

function calculator(button) {
    if(button.type == "number" || button.type == "operator") {
        data.operation.push(button.symbol);

    } else if(button.type == "key") {
        var newArr = data.operation.slice(0,-1); 
        data.operation = newArr

    } else if(button.type == "calculate") {
        $.post(`http://localhost:3000/calculate`,{
            user: user,
            operation: JSON.stringify(data.operation)

        },
        function(response){
            if (response.result !== "ERROR") {
                data.operation = [response.result]
                updateOutputOperation(response.result);
                drawHistoric()
            } else {

                calculatorStatus = false
                updateOutputOperation("ERROR");

                setTimeout(() => {
                    calculatorStatus = true
                    data.operation = []
                    updateOutputOperation(0);
                }, 1000)

            }
            return;
        });
    }
    updateOutputOperation(data.operation.join(''));
}

function updateOutputOperation(operation) {
    $('.result .value').html(operation)
    if(operation === "") {
        $('.result .value').html(0)
    }
}

function myFunction() {
    let person = prompt("Por favor coloque o seu nome:", "");
    if (person == null || person == "") {
      user = "Anonimo"
    } else {
        user = person
    }
}
myFunction()