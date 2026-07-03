// ==========================================================
// منطق الآلة الحاسبة المحدث لملف calculator.js
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '0';
    let operator = null;
    let previousValue = 0;

    function updateDisplay() {
        // تقليل حجم الخط إذا كان الرقم طويلاً
        if (currentInput.length > 10) {
            display.style.fontSize = '1.8em';
        } else {
            display.style.fontSize = '2.5em';
        }
        display.value = currentInput;
    }

    updateDisplay();

    function calculateResult() {
        const currentValue = parseFloat(currentInput);
        if (operator === null || isNaN(previousValue) || isNaN(currentValue)) return;

        let result;
        switch (operator) {
            case '+':
                result = previousValue + currentValue;
                break;
            case '-':
                result = previousValue - currentValue;
                break;
            case '*':
                result = previousValue * currentValue;
                break;
            case '/':
                if (currentValue === 0) {
                    currentInput = 'Error';
                    previousValue = 0;
                    return;
                }
                result = previousValue / currentValue;
                break;
            case 'power': // منطق القوة (x^y)
                result = Math.pow(previousValue, currentValue);
                break;
            default:
                return;
        }

        // تقريب النتيجة لمنع مشاكل الأرقام العشرية الطويلة
        result = parseFloat(result.toFixed(8)); 

        currentInput = result.toString();
        previousValue = result; // لتتمكن من إجراء عمليات متتالية
    }

    function calculateUnaryFunction(func) {
        const currentValue = parseFloat(currentInput);
        if (isNaN(currentValue) || currentInput === 'Error') return;

        let result;
        switch (func) {
            case 'root': // منطق الجذر التربيعي (√)
                if (currentValue < 0) {
                    currentInput = 'Error';
                    return;
                }
                result = Math.sqrt(currentValue);
                break;
            default:
                return;
        }

        // تقريب النتيجة
        result = parseFloat(result.toFixed(8)); 
        currentInput = result.toString();
        previousValue = 0;
    }


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            const dataOp = button.getAttribute('data-op');

            if (button.classList.contains('clear')) {
                currentInput = '0';
                operator = null;
                previousValue = 0;
            } else if (!isNaN(parseFloat(buttonText)) || buttonText === '.') {
                
                // منع ظهور الصفر في البداية إلا لو كان إدخال النقطة
                if (currentInput === '0' && buttonText !== '.') {
                    currentInput = buttonText;
                } else {
                    // منع إدخال أكثر من نقطة عشرية واحدة
                    if (buttonText === '.' && currentInput.includes('.')) return;
                    currentInput += buttonText;
                }

            } else if (button.classList.contains('function')) {
                // تنفيذ وظائف الجذر التربيعي فوراً
                const func = button.getAttribute('data-op');
                calculateUnaryFunction(func);
                
            } else if (button.classList.contains('operator')) {
                // تنفيذ عملية سابقة إذا كانت موجودة
                if (operator !== null && currentInput !== '0') {
                    calculateResult();
                }
                previousValue = parseFloat(currentInput);
                // تعيين عامل التشغيل الجديد (سواء كان +, -, / أو power)
                operator = dataOp ? dataOp : buttonText; 
                currentInput = '0'; 

            } else if (button.classList.contains('equals')) {
                calculateResult();
                operator = null;
            }
            
            updateDisplay();
        });
    });
});