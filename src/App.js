
import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayFirstRow: 'This is the display.'
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(button) {
    switch (button) {
      case "one":
      case "two":
      case "three":
        this.setState({displayFirstRow: button});
        break;
      default: 
      this.setState({displayFirstRow: 'Clicked something else'});
    }
  }

  componentDidMount() {
    document.addEventListener("click", (PointerEvent) => {
      this.handleClick(PointerEvent.target.id);
    });
  } 

  render() {
    return (
      <div id="calculator">
        <div id="display">{this.state.displayFirstRow}</div>
        <div id="key-wrapper">
          <button id="zero">0</button>
          <button id="one">1</button>
          <button id="two">2</button>
          <button id="three">3</button>
          <button id="four">4</button>
          <button id="five">5</button>
          <button id="six">6</button>
          <button id="seven">7</button>
          <button id="eight">8</button>
          <button id="nine">9</button>
          <button id="decimal">.</button>
          <button id="add">+</button>
          <button id="subtract">-</button>
          <button id="multiply">x</button>
          <button id="divide">/</button>
          <button id="clear">C</button>
          <button id="equals">=</button>
        </div>
      </div>
    )
  }
}

export default App;
