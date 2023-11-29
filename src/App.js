import React from 'react';
import './App.css';

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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayArr: [],
      firstRow: 'This is the display.',
      secondRow: 'This is the result.'
    };
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
      //[+x/] after [+-x/], - => remove both, add new
      arr.splice(arr.length - 2, 2, button);
      return arr;
    }
    if (operators.includes(button) && button !== '-' && operators.includes(arr[arr.length - 1])) {
      //[+x/] after [+-x/] => remove, add new
      arr[arr.length - 1] = button;
      return arr;
    }
    if (button === 0 && operators.includes(arr[arr.length - 2]) && arr[arr.length - 1] === 0) {
      // 0 after [3-x/], 0 => do nothing
      return arr;
    }
    if (button === '.' && arr.findLast(element => typeof element === 'string') === '.') {
      //max one decimal point in a number
      return arr;
    }
    if (button === '.' && operators.includes(arr[arr.length - 1])) {
      arr.push(0, '.');
      return arr;
    }
    arr.push(button);
    return arr;
  }

  handleClick(button) {
    if (button === 'C') {
      this.setState({
        displayArr: [],
        firstRow: '',
        secondRow: 0
      });
      return;
    }
    const arr = this.handleArr(button, this.state.displayArr);
    this.setState({
      displayArr: arr,
      firstRow: arr.join('')
    });
  }

  render() {
    const buttons = buttonConfig.map(buttonInfo => this.createButton(buttonInfo));

    return (
      <div id="calculator">
        <div id="display">
          {this.state.firstRow}
          <br /> {this.state.secondRow}
        </div>
        <div id="key-wrapper">{buttons}</div>
      </div>
    );
  }
}

export default App;
