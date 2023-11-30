import React from 'react';
import './App.css';

function makeNum(arr) {
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
    if (arr[opIndex - 1] === 'x' || arr[opIndex - 1] === '/') {
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
    return makeNum(integerPart) + makeNum(fractionalPart) * Math.pow(10, 1 + decimal - arr.length);
  }
  return makeNum(arr);
}

function separateLastNumber(arr) {
  if (typeof arr[arr.length - 1] === 'string' && arr[arr.length - 1] !== '.') {
    return arr[arr.length - 1];
  }
  const numStart = arr.findLastIndex(element => typeof element === 'string' && element !== '.');
  return arr.slice(numStart + 1).join('');
}

const buttonConfig = [
  { id: 'zero', html: 0 },
  { id: 'one', html: 1 },
  { id: 'two', html: 2 },
  { id: 'three', html: 3 },
  { id: 'four', html: 4 },
  { id: 'five', html: 5 },
  { id: 'six', html: 6 },
  { id: 'seven', html: 7 },
  { id: 'eight', html: 8 },
  { id: 'nine', html: 9 },
  { id: 'decimal', html: '.' },
  { id: 'add', html: '+' },
  { id: 'subtract', html: '-' },
  { id: 'multiply', html: 'x' },
  { id: 'divide', html: '/' },
  { id: 'clear', html: 'C' },
  { id: 'equals', html: '=' }
];

const defaultState = {
  displayArr: [],
  firstRow: '',
  secondRow: 0,
  isAns: false
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.createButton = this.createButton.bind(this);
    this.handleArr = this.handleArr.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  createButton({ id, html }) {
    return (
      <button id={id} key={id} onClick={() => this.handleClick(html)}>
        {html}
      </button>
    );
  }

  handleArr(button, arr) {
    const operators = ['+', '-', 'x', '/'];
    if (operators.includes(button) && button === arr[arr.length - 1]) {
      return arr;
    }
    if (operators.includes(button) && button !== '-' && operators.includes(arr[arr.length - 2]) && arr[arr.length - 1] === '-') {
      //[+-x/], '-', then [+x/] => remove both, add new
      arr.splice(arr.length - 2, 2, button);
      return arr;
    }
    if (operators.includes(button) && button !== '-' && operators.includes(arr[arr.length - 1])) {
      //[+-x/] then [+x/] => remove, add new
      arr[arr.length - 1] = button;
      return arr;
    }
    if (button === 0 && arr[arr.length - 1] === 0 && (operators.includes(arr[arr.length - 2]) || arr.length === 1)) {
      //[+-x/], 0 then 0 => do nothing
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
    if (button === '=' && operators.includes(arr[arr.length - 1])) {
      //[+-x/], '=' => remove [+-x/]
      arr.pop();
      arr.push('=');
      return arr;
    }
    arr.push(button);
    return arr;
  }

  handleClick(button) {
    if (button === 'C') {
      this.setState({
        // tried write defaultState here, but caused problem
        displayArr: [],
        firstRow: '',
        secondRow: 0,
        isAns: false
      });
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
    const arr = this.handleArr(button, this.state.displayArr);
    if (button === '=') {
      arr.pop();
      this.setState({
        displayArr: [computeResult(arr)],
        firstRow: arr.join('') + '=',
        secondRow: computeResult(arr),
        isAns: true
      });
      return;
    }
    this.setState({
      displayArr: arr,
      firstRow: arr.join(''),
      secondRow: separateLastNumber(arr),
      isAns: false
    });
  }

  render() {
    const buttons = buttonConfig.map(buttonInfo => this.createButton(buttonInfo));

    return (
      <div id="calculator">
        <div id="formula">{this.state.firstRow}</div>
        <div id="display">{this.state.secondRow}</div>
        <div id="key-wrapper">{buttons}</div>
      </div>
    );
  }
}

export default App;
