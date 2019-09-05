var budgetController = (function () {
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    function Income (obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
    }

    function Expense (obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
        this.percentage = obj.percentage;

    }

    function calculateTotal (type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            console.log(cur);
            sum += cur.value;
        });

        data.totals[type] = sum;
    }

    return {
        addItem: function (obj) {
            var newItem, type;

            type = data.allItems[obj.type];

            if (type.length === 0) {
                obj.id = 1;
            } else {
                obj.id = type[type.length - 1].id + 1;
            }

            if (obj.type === 'inc') {
                newItem = new Income(obj);
            } else if (obj.type === 'exp') {
                if (data.totals.inc > 0) {
                    obj.percentage = Math.round(obj.value / data.totals.inc * 100) + "%";
                } else {
                    obj.percentage = "---";
                }
                newItem = new Expense(obj);
            }

            type.push(newItem);

            return newItem;
        },
        removeItem: function (type, ID) {
            var items = data.allItems[type];
            data.allItems[type] = items.filter(function(cur) {
                return cur.id != ID;
            });
        },
        calculateBudget: function() {
            // calculate income and expenses
            calculateTotal("inc");
            calculateTotal("exp");

            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate expenses percentage: expenses / income
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        }
    }
})();

var UIController = (function () {
    var domString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        bugetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        DateLabel: '.budget__title--month'
    }

    return {
        displayBudget: function(budget) {
            var bugetVal, totalInc, totalExp;
            bugetVal = this.formatNumber(budget.budget);;
            totalInc = this.formatNumber(budget.totalInc);
            totalExp = this.formatNumber(budget.totalExp);
            
            document.querySelector(domString.bugetLabel).textContent = budget.budget > 0 ? '+' + bugetVal : bugetVal;
            document.querySelector(domString.incomeLabel).textContent = budget.totalInc > 0 ? '+' + totalInc : totalInc;
            document.querySelector(domString.expensesLabel).textContent = budget.totalExp > 0 ? '-' + totalExp : totalExp;
            document.querySelector(domString.percentageLabel).textContent = budget.percentage > 0 ? budget.percentage + "%" : '---';
            
        },

        displayDate: function() {
            var now, months, month, year;
            now = new Date();
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(domString.DateLabel).textContent = months[month] + " " + year;
        },

        getDomStrings: function () {
            return domString;
        },

        getInput: function() {
            var type = document.querySelector(domString.inputType).value; // inc(+) or exp(-)
            var description = document.querySelector(domString.inputDescription).value;
            var value = parseFloat(document.querySelector(domString.inputValue).value);
            
            return {
                type: type,
                description: description.trim(),
                value: value
            }
        },

        addListItem: function (obj, type) {
            var html, idName, element;
            html = '';
            idName = type === 'inc' ? 'income' : 'expense';

            html += '<div class="item clearfix" id="' + idName + '-' + obj.id + '">';
            html += '<div class="item__description">' + obj.description + '</div>';
            html += '<div class="right clearfix">';

            if (type === 'inc') {
                html += '<div class="item__value">+ ' + this.formatNumber(obj.value) + '</div>';

                element = domString.incomeContainer;
            } else if (type === 'exp') {
                html += '<div class="item__value">- ' + this.formatNumber(obj.value) + '</div>';
                html += '<div class="item__percentage">' + obj.percentage + '</div>';

                element = domString.expenseContainer;
            }
            
            html += '<div class="item__delete">';
            html += '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function(item) {
            item.parentNode.removeChild(item);
        },

        clearInput: function () {
            var fields = document.querySelectorAll(domString.inputDescription + ', ' + domString.inputValue);
            // Array.prototype.slice.call(fields);
            fields.forEach(function(item) {
                item.value = '';
            });
            fields[0].focus();
        },
        formatNumber: function(num) {
            // 2000350.1 => 2,000,350.10
            var numSplit, intPart, intArr, intLen;
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split(".");
            intPart = numSplit[0];
            intArr = Array.prototype.slice.call(intPart); //make string to array
            intLen = intArr.length;
            for (var i = intLen - 3; i > 0; i -= 3) {
                intArr.splice(i, 0, ',');
            }
            return intArr.join("") + "." + numSplit[1];
        },
        changedType: function() {
            var elems = document.querySelectorAll(
                domString.inputType + ',' +
                domString.inputDescription  + ',' +
                domString.inputValue
            );
            elems.forEach(function(elem) {
                elem.classList.toggle('red-focus');
            });
            document.querySelector(domString.inputBtn).classList.toggle('red');
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    var domString = UICtrl.getDomStrings();

    function updateBudget() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    function ctrlAddItem () {
        var input, newItem;
        // 1. Get the field input date
        input = UICtrl.getInput();

        if (input.description === '' || isNaN(input.value) || input.value <= 0) {
            return;
        }

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Clear the fields
        UICtrl.clearInput();

        // 5. Calculate and the budget
        updateBudget();

    }

    function ctrldeleteItem (event) {
        var item = event.target.parentNode.parentNode.parentNode.parentNode;
        var splitID = item.id.split('-');
        var type = splitID[0].slice(0, 3);
        var id = splitID[1];
        
        UICtrl.deleteListItem(item);
        
        budgetCtrl.removeItem(type, id);
        updateBudget();
        

    }

    function setupEventListeners () {
        document.querySelector(domString.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function(event) {
            // event.which for old browber
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(domString.container).addEventListener('click', ctrldeleteItem);

        document.querySelector(domString.inputType).addEventListener('change', UICtrl.changedType);
    };

    return {
        init: function () {
            var budget = {
                totalExp: 0,
                totalInc: 0,
                budget: 0,
                percentage: '-1'
            }
            UICtrl.displayDate();
            UICtrl.displayBudget(budget);
            setupEventListeners(budget);
        }
    }
})(budgetController, UIController);

controller.init();