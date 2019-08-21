var budgetController = (function () {

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

    function ctrlAddItem() {
        // 1. Get the field input date
        var input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the Ui
    }

    var setupEventListeners = function () {
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