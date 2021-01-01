const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
}
  
const getKeyType = key => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator'
    // For everything else, return the action
    return action
}
  
const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = state
  
    if (keyType === 'number') {
        return displayedNum === '0' ||
            previousKeyType === 'operator' ||
            previousKeyType === 'evaluate'
            ? keyContent
            : displayedNum + keyContent
    }

    if (keyType === 'sign') {
        if (displayedNum[0] === '-') return displayedNum.slice(1)
        return displayedNum === '0' ? displayedNum : '-' + displayedNum
    }

    if (keyType === 'percent') {
        return (parseFloat(displayedNum) * 0.01).toString()
    }

    if (keyType === 'decimal') {
        if (!displayedNum.includes('.')) return displayedNum + '.'
        if (previousKeyType === 'operator' || previousKeyType === 'evaluate') return '0.'
        return displayedNum
    }
  
    if (keyType === 'operator') {
        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'evaluate'
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
  
    if (keyType === 'clear') return 0
  
    if (keyType === 'evaluate') {
        return firstValue
            ? previousKeyType === 'evaluate'
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
}
  
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset
  
    calculator.dataset.previousKeyType = keyType
  
    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'evaluate'
            ? calculatedValue
            : displayedNum
    }
  
    if (keyType === 'evaluate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'evaluate'
            ? modValue
            : displayedNum
    }
  
    if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = ''
        calculator.dataset.modValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.previousKeyType = ''
    }
}
  
const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
    if (keyType === 'operator') key.classList.add('is-depressed')
    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
    }
}
  
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.value')

calculator.addEventListener('click', e => {
    if (!e.target.matches('span')) return
    const key = e.target
    const displayedNum = display.value
    const resultString = createResultString(key, displayedNum, calculator.dataset)

    display.value = resultString
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
})
  
  