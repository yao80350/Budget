var budgetController = (function () {
    function Income (obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
    }

    function Expense (obj) {
        this.id = obj.id;
        this.description = obj.description;
        this.value = obj.value;
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
                newItem = new Expense(obj);
            }

            type.push(newItem);

            return newItem;
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
        expenseContainer: '.expenses__list'
    }

    return {
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
                value: parseFloat(value)
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
                html += '<div class="item__value">+ ' + obj.value + '</div>';

                element = domString.incomeContainer;
            } else if (type === 'exp') {
                html += '<div class="item__value">- ' + obj.value + '</div>';
                html += '<div class="item__percentage">21%</div>';

                element = domString.expenseContainer;
            }
            
            html += '<div class="item__delete">';
            html += '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        clearInput: function () {
            var fields = document.querySelectorAll(domString.inputDescription + ', ' + domString.inputValue);
            // Array.prototype.slice.call(fields);
            fields.forEach(function(item) {
                item.value = '';
            });
            fields[0].focus();
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    var domString = UICtrl.getDomStrings();

    function updateBudget() {
        // 1. Calculate the budget
        // 2. Return the budget
        // 3. Display the budget on the UI
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

    function setupEventListeners () {
        document.querySelector(domString.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function(event) {
            // event.which for old browber
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();