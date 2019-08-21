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
            } if (obj.type === 'exp') {
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
        inputBtn: '.add__btn'
    }

    return {
        getDomStrings: function() {
            return domString;
        },

        getInput: function() {
            var type = document.querySelector(domString.inputType).value; // inc(+) or exp(-)
            var description = document.querySelector(domString.inputDescription).value;
            var value = document.querySelector(domString.inputValue).value;
            return {
                type: type,
                description: description,
                value: value
            }
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    var domString = UICtrl.getDomStrings();

    function ctrlAddItem () {
        var input, newItem;
        // 1. Get the field input date
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input);

        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the Ui
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