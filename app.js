var budgetController = (function () {

})();

var UIController = (function () {

})();

var controller = (function (budgetCtrl, UICtrl) {
    function ctrlAddItem() {
        // 1. Get the field input date
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the Ui
        console.log('add');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keydown', function(event) {
        // event.which for old browber
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);