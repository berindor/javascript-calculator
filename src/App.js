import React from 'react';
import './App.css';

function makeInteger(arr) {
  let num = 0;
  for (let dec = 0; dec < arr.length; dec++) {
    num += arr[arr.length - 1 - dec] * Math.pow(10, dec);
  }
  return num;
}

function computeResult(arr) {
  if (arr.includes('+')) {
    const opIndex = arr.findLastIndex(element => element === '+');
    return computeResult(arr.slice(0, opIndex)) + computeResult(arr.slice(opIndex + 1));
  }
  if (arr.includes('-')) {
    const opIndex = arr.findLastIndex(element => element === '-');
    if (['-', 'x', '/'].includes(arr[opIndex - 1])) {
      const newArr = arr.slice(0, opIndex);
      newArr.push(-computeResult(arr.slice(opIndex + 1)));
      return computeResult(newArr);
    }
    return computeResult(arr.slice(0, opIndex)) - computeResult(arr.slice(opIndex + 1));
  }
  if (arr.includes('x')) {
    const opIndex = arr.findLastIndex(element => element === 'x');
    return computeResult(arr.slice(0, opIndex)) * computeResult(arr.slice(opIndex + 1));
  }
  if (arr.includes('/')) {
    const opIndex = arr.findLastIndex(element => element === '/');
    return computeResult(arr.slice(0, opIndex)) / computeResult(arr.slice(opIndex + 1));
  }
  if (arr.includes('.')) {
    const decimal = arr.findLastIndex(element => element === '.');
    const integerPart = arr.slice(0, decimal);
    const fractionalPart = arr.slice(decimal + 1);
    return makeInteger(integerPart) + makeInteger(fractionalPart) * Math.pow(10, 1 + decimal - arr.length);
  }
  return makeInteger(arr);
}

function separateLastNumber(arr) {
  if (typeof arr[arr.length - 1] === 'string' && arr[arr.length - 1] !== '.') {
    return arr[arr.length - 1];
  }
  const numStart = arr.findLastIndex(element => typeof element === 'string' && element !== '.');
  return arr.slice(numStart + 1).join('');
}

const buttonConfig = [
  { id: 'zero', symbol: 0, className: 'number' },
  { id: 'one', symbol: 1, className: 'number' },
  { id: 'two', symbol: 2, className: 'number' },
  { id: 'three', symbol: 3, className: 'number' },
  { id: 'four', symbol: 4, className: 'number' },
  { id: 'five', symbol: 5, className: 'number' },
  { id: 'six', symbol: 6, className: 'number' },
  { id: 'seven', symbol: 7, className: 'number' },
  { id: 'eight', symbol: 8, className: 'number' },
  { id: 'nine', symbol: 9, className: 'number' },
  { id: 'decimal', symbol: '.', className: 'decimal' },
  { id: 'add', symbol: '+', className: 'operator' },
  { id: 'subtract', symbol: '-', className: 'operator' },
  { id: 'multiply', symbol: 'x', className: 'operator' },
  { id: 'divide', symbol: '/', className: 'operator' },
  { id: 'equals', symbol: '=', className: 'equals' },
  { id: 'clear', symbol: 'C', className: 'clear' },
  { id: 'backspace', symbol: 'del', className: 'backspace' }
];

function getDefaultState() {
  return {
    displayArr: [],
    firstRow: '',
    secondRow: 0,
    isAns: false
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getDefaultState();
    this.createButton = this.createButton.bind(this);
    this.handleArr = this.handleArr.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  createButton({ id, symbol, className }) {
    const html = symbol === 'del' ? <i class="material-icons">backspace</i> : symbol;
    return (
      <button id={id} key={id} className={className} onClick={() => this.handleClick(symbol)}>
        {html}
      </button>
    );
  }

  handleArr(button, arr) {
    const operators = ['+', '-', 'x', '/'];
    if (operators.includes(button) && button !== '-' && operators.includes(arr[arr.length - 2]) && arr[arr.length - 1] === '-') {
      //[+-x/], '-', then [+x/] => remove both, add new
      // this if(...) must be the first to evaluate!
      arr.splice(arr.length - 2, 2, button);
      return arr;
    }
    if (button === '-' && arr[arr.length - 1] === '-' && operators.includes(arr[arr.length - 2])) {
      //[+x/], '-' then - => do nothing
      return arr;
    }
    if (operators.includes(button) && button !== '-' && operators.includes(arr[arr.length - 1])) {
      //[+-x/] then [+x/] => remove, add new
      arr[arr.length - 1] = button;
      return arr;
    }
    if (operators.includes(button) && arr[arr.length - 1] === '.') {
      //'. then [+-x/] => remove '.', add [+-x/]
      arr[arr.length - 1] = button;
      return arr;
    }
    if (operators.includes(button) && arr.length === 0) {
      //[] then [+-x/] => insert 0, [+-*/]
      arr.push(0, button);
      return arr;
    }
    if (button === 0 && arr[arr.length - 1] === 0 && (operators.includes(arr[arr.length - 2]) || arr.length === 1)) {
      //[+-x/], 0 then 0 => do nothing
      //need to be before the following if
      return arr;
    }
    if (typeof button === 'number' && arr[arr.length - 1] === 0 && (operators.includes(arr[arr.length - 2]) || arr.length === 1)) {
      //[+-x/], 0 then number =/= 0 => remove 0
      arr.pop();
      arr.push(button);
      return arr;
    }
    if (button === '.' && arr.findLast(element => typeof element === 'string') === '.') {
      //max one decimal point in a number
      return arr;
    }
    if (button === '.' && (operators.includes(arr[arr.length - 1]) || arr.length === 0 || this.state.isAns)) {
      //([+-x/] or [] or Ans), '.' => insert 0,'.'
      arr.push(0, '.');
      return arr;
    }
    if (button === '=' && (operators.includes(arr[arr.length - 1]) || arr[arr.length - 1] === '.')) {
      //[+-x/] or '.', '=' => remove [+-x/'.']
      arr.pop();
      arr.push('=');
      return arr;
    }
    if (button === 'del' && arr.length > 0) {
      arr.pop();
      return arr;
    }
    arr.push(button);
    return arr;
  }

  handleClick(button) {
    if (button === 'C') {
      this.setState(getDefaultState());
      return;
    }
    if (this.state.isAns === true && (typeof button === 'number' || button === '.')) {
      this.setState({
        displayArr: this.handleArr(button, []),
        firstRow: this.handleArr(button, []).join(''),
        secondRow: button,
        isAns: false
      });
      return;
    }
    let arr = this.state.displayArr;
    if (button === 'del' && typeof arr[arr.length - 1] !== 'number' && arr[arr.length - 1] !== '.') {
      arr.pop();
      this.setState({
        displayArr: arr,
        firstRow: arr.join(''),
        secondRow: ''
      });
      return;
    }
    arr = this.handleArr(button, this.state.displayArr);
    if (button === '=') {
      arr.pop();
      this.setState({
        displayArr: [computeResult(arr)],
        firstRow: arr.join('') + '=',
        secondRow: computeResult(arr),
        isAns: true
      });
      if ([NaN, Infinity, -Infinity].includes(computeResult(arr))) {
        this.setState({
          displayArr: [],
          secondRow: 'Error'
        });
      }
      return;
    }
    this.setState({
      displayArr: arr,
      firstRow: arr.join(''),
      secondRow: separateLastNumber(arr),
      isAns: false
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const validEvents = buttonConfig.map(({ symbol }) => symbol);
    let button = event.key;
    if (event.key === 'Enter') {
      event.preventDefault();
      button = '=';
    }
    if (event.key === 'c') {
      button = 'C';
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      button = 'del';
    }
    if (event.key === '*') {
      button = 'x';
    }
    if (event.key === ':') {
      button = '/';
    }
    if (validEvents.includes(button)) {
      this.handleClick(button);
    } else if (validEvents.includes(Number(button))) {
      this.handleClick(Number(button));
    }
  }

  render() {
    const buttons = buttonConfig.map(buttonInfo => this.createButton(buttonInfo));

    return (
      <div id="calculator">
        <div id="display-wrapper">
          <div id="formula">{this.state.firstRow}</div>
          <div id="display">{this.state.secondRow}</div>
        </div>
        <div id="key-wrapper">{buttons}</div>
      </div>
    );
  }
}

export default App;
