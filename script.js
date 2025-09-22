document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');
    const themeToggler = document.querySelector('.theme-toggler');
    const body = document.body;

    let currentInput = '';
    let operator = '';
    let previousInput = '';
    let isError = false;
    let isResultShown = false;

    buttons.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            if (isError) {
                clear();
            }

            const value = e.target.dataset.value;

            if (value === 'C') {
                clear();
            } else if (value === '=') {
                calculate();
            } else if (value === '%') {
                handlePercentage();
            } else if (['+', '-', '*', '/'].includes(value)) {
                handleOperator(value);
            } else {
                handleNumber(value);
            }
        }
    });

    themeToggler.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    function handleNumber(value) {
        if (isResultShown) {
            currentInput = '';
            isResultShown = false;
        }
        if (currentInput.includes('.') && value === '.') return;
        currentInput += value;
        updateDisplay();
    }

    function handleOperator(value) {
        if (currentInput === '' && previousInput === '') return;

        if (currentInput !== '' && previousInput !== '') {
            calculate();
        }
        
        if (isError) return;

        if (currentInput !== '') {
            previousInput = currentInput;
        }

        operator = value;
        currentInput = '';
        isResultShown = false;
        updateDisplay();
    }

    function calculate() {
        if (previousInput === '' || currentInput === '') return;
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (operator === '/' && current === 0) {
            showError();
            return;
        }

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        operator = '';
        previousInput = '';
        isResultShown = true;
        updateDisplay();
    }

    function handlePercentage() {
        if (currentInput === '') return;
        const current = parseFloat(currentInput);

        if (previousInput !== '' && operator) {
            const prev = parseFloat(previousInput);
            let result;
            
            switch (operator) {
                case '+':
                    result = prev + (prev * current / 100);
                    break;
                case '-':
                    result = prev - (prev * current / 100);
                    break;
                case '*':
                    result = prev * (current / 100);
                    break;
                case '/':
                    if (current === 0) {
                        showError();
                        return;
                    }
                    result = prev / (current / 100);
                    break;
                default:
                    return;
            }
            currentInput = result.toString();
            operator = '';
            previousInput = '';
            isResultShown = true;
        } else {
            currentInput = (current / 100).toString();
        }
        updateDisplay();
    }

    function clear() {
        currentInput = '';
        operator = '';
        previousInput = '';
        isError = false;
        isResultShown = false;
        updateDisplay();
    }

    function showError() {
        isError = true;
        currentInput = '';
        previousInput = '';
        operator = '';
        updateDisplay();
    }

    function updateDisplay() {
        if (isError) {
            display.value = 'Error';
        } else {
            display.value = currentInput || previousInput || '0';
        }
    }

    updateDisplay(); // Initialize display
});
