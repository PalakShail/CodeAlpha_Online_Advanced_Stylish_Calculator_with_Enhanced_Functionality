// Advanced Calculator JavaScript
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.themeToggle = document.getElementById('themeToggle');
        this.helpToggle = document.getElementById('helpToggle');
        this.keyboardHelp = document.getElementById('keyboardHelp');

        // Calculator state
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForNumber = false;
        this.memory = 0;
        this.calculationHistory = [];
        
        // Initialize theme
        this.initializeTheme();
        
        // Update display first
        this.updateDisplay();
        
        // Bind event listeners after DOM is ready
        setTimeout(() => {
            this.bindEvents();
        }, 100);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('calculator-theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    bindEvents() {
        // Button click events
        const buttons = document.querySelectorAll('.btn');
        console.log('Found buttons:', buttons.length);
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked:', button.textContent, button.dataset);
                this.handleButtonClick(button);
                this.animateButton(button);
            });
        });

        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
        }

        // Help toggle
        if (this.helpToggle) {
            this.helpToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleHelp();
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Click outside help to close
        document.addEventListener('click', (e) => {
            if (this.keyboardHelp && !this.keyboardHelp.contains(e.target) && 
                this.helpToggle && !this.helpToggle.contains(e.target)) {
                this.keyboardHelp.classList.remove('active');
            }
        });
    }

    handleButtonClick(button) {
        const action = button.dataset.action;
        const number = button.dataset.number;

        console.log('Handling button:', { action, number, text: button.textContent });

        if (number !== undefined) {
            this.inputNumber(number);
        } else if (action) {
            this.handleAction(action);
        }
    }

    handleAction(action) {
        console.log('Handling action:', action);
        
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'all-clear':
                this.allClear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'equals':
                this.calculate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.inputOperator(action);
                break;
            case 'percentage':
                this.percentage();
                break;
            case 'square-root':
                this.squareRoot();
                break;
            case 'square':
                this.square();
                break;
            case 'plus-minus':
                this.plusMinus();
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'm-plus':
                this.memoryAdd();
                break;
            case 'm-minus':
                this.memorySubtract();
                break;
            case 'ms':
                this.memoryStore();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    inputNumber(num) {
        console.log('Input number:', num);
        if (this.waitingForNumber || this.currentValue === '0') {
            this.currentValue = num;
            this.waitingForNumber = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForNumber) {
            this.currentValue = '0.';
            this.waitingForNumber = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation();
            
            if (result === null) return; // Error occurred
            
            this.currentValue = String(result);
            this.previousValue = result;
        }

        this.waitingForNumber = true;
        this.operator = nextOperator;
        this.updateHistory();
        this.updateDisplay();
    }

    performCalculation() {
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        
        if (isNaN(prev) || isNaN(current)) return null;

        let result;
        switch (this.operator) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return null;
                }
                result = prev / current;
                break;
            default:
                return null;
        }

        return this.formatResult(result);
    }

    calculate() {
        if (this.operator && this.previousValue !== null && !this.waitingForNumber) {
            const result = this.performCalculation();
            
            if (result !== null) {
                // Add to history
                const operation = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${this.currentValue} = ${result}`;
                this.calculationHistory.push(operation);
                
                this.currentValue = String(result);
                this.previousValue = null;
                this.operator = null;
                this.waitingForNumber = true;
                this.updateDisplay();
                this.history.textContent = operation;
            }
        }
    }

    getOperatorSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[op] || op;
    }

    clear() {
        console.log('Clearing display');
        this.currentValue = '0';
        this.updateDisplay();
    }

    allClear() {
        console.log('All clear');
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForNumber = false;
        this.history.textContent = '';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    percentage() {
        const value = parseFloat(this.currentValue);
        if (!isNaN(value)) {
            this.currentValue = String(value / 100);
            this.updateDisplay();
        }
    }

    squareRoot() {
        const value = parseFloat(this.currentValue);
        if (value < 0) {
            this.showError('Invalid input');
            return;
        }
        if (!isNaN(value)) {
            this.currentValue = String(this.formatResult(Math.sqrt(value)));
            this.updateDisplay();
        }
    }

    square() {
        const value = parseFloat(this.currentValue);
        if (!isNaN(value)) {
            this.currentValue = String(this.formatResult(value * value));
            this.updateDisplay();
        }
    }

    plusMinus() {
        if (this.currentValue !== '0') {
            if (this.currentValue.charAt(0) === '-') {
                this.currentValue = this.currentValue.slice(1);
            } else {
                this.currentValue = '-' + this.currentValue;
            }
            this.updateDisplay();
        }
    }

    memoryClear() {
        console.log('Memory clear');
        this.memory = 0;
        this.updateMemoryIndicator();
    }

    memoryRecall() {
        console.log('Memory recall:', this.memory);
        this.currentValue = String(this.memory);
        this.waitingForNumber = false;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentValue) || 0;
        this.updateMemoryIndicator();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentValue) || 0;
        this.updateMemoryIndicator();
    }

    memoryStore() {
        console.log('Memory store:', this.currentValue);
        this.memory = parseFloat(this.currentValue) || 0;
        this.updateMemoryIndicator();
    }

    updateMemoryIndicator() {
        if (this.memoryIndicator) {
            if (this.memory !== 0) {
                this.memoryIndicator.classList.add('active');
            } else {
                this.memoryIndicator.classList.remove('active');
            }
        }
    }

    formatResult(result) {
        // Handle very large or very small numbers
        if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
            return parseFloat(result.toExponential(10));
        }
        
        // Round to avoid floating point precision issues
        const rounded = Math.round(result * 1e10) / 1e10;
        return rounded;
    }

    updateDisplay() {
        if (!this.display) return;
        
        let displayValue = this.currentValue;
        
        // Format large numbers with commas
        if (!isNaN(displayValue) && Math.abs(parseFloat(displayValue)) >= 1000) {
            const num = parseFloat(displayValue);
            if (Number.isInteger(num)) {
                displayValue = num.toLocaleString();
            }
        }
        
        this.display.textContent = displayValue;
        this.display.classList.add('display-update');
        
        setTimeout(() => {
            this.display.classList.remove('display-update');
        }, 200);
    }

    updateHistory() {
        if (this.history && this.operator && this.previousValue !== null) {
            this.history.textContent = `${this.previousValue} ${this.getOperatorSymbol(this.operator)}`;
        }
    }

    showError(message) {
        if (this.display) {
            this.display.textContent = message;
            this.display.classList.add('error');
            
            setTimeout(() => {
                this.display.classList.remove('error');
                this.currentValue = '0';
                this.previousValue = null;
                this.operator = null;
                this.waitingForNumber = false;
                this.updateDisplay();
            }, 2000);
        }
    }

    animateButton(button) {
        if (button) {
            button.classList.add('btn-pressed');
            setTimeout(() => {
                button.classList.remove('btn-pressed');
            }, 100);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('calculator-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    toggleHelp() {
        if (this.keyboardHelp) {
            this.keyboardHelp.classList.toggle('active');
        }
    }

    handleKeyboard(e) {
        const key = e.key;
        
        // Numbers
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
            this.animateButtonByContent(key);
        }
        
        // Operations
        else if (key === '+') {
            this.inputOperator('add');
            this.animateButtonByAction('add');
        }
        else if (key === '-') {
            this.inputOperator('subtract');
            this.animateButtonByAction('subtract');
        }
        else if (key === '*') {
            this.inputOperator('multiply');
            this.animateButtonByAction('multiply');
        }
        else if (key === '/') {
            e.preventDefault();
            this.inputOperator('divide');
            this.animateButtonByAction('divide');
        }
        
        // Special keys
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
            this.animateButtonByAction('equals');
        }
        else if (key === 'Escape') {
            this.clear();
            this.animateButtonByAction('clear');
        }
        else if (key === 'Backspace') {
            this.backspace();
            this.animateButtonByAction('backspace');
        }
        else if (key === '.') {
            this.inputDecimal();
            this.animateButtonByAction('decimal');
        }
    }

    animateButtonByContent(content) {
        const button = document.querySelector(`[data-number="${content}"]`);
        if (button) this.animateButton(button);
    }

    animateButtonByAction(action) {
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) this.animateButton(button);
    }
}

// Global calculator instance
let calculator;

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    calculator = new Calculator();
    
    // Add ripple effect to buttons
    setTimeout(() => {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    }, 200);
});

// Add CSS for ripple effect
window.addEventListener('load', () => {
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        [data-color-scheme="dark"] .ripple {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Advanced Calculator Loaded');
    console.log('Keyboard Shortcuts:');
    console.log('Numbers: 0-9');
    console.log('Operations: + - * /');
    console.log('Equals: Enter or =');
    console.log('Clear: Escape');
    console.log('Backspace: Backspace');
    console.log('Decimal: .');
});