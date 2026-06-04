'use client';
import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNum = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldResetDisplay(true);
  };

  const calculate = () => {
    if (!equation) return;
    try {
      // Safe eval equivalent for basic math
      const result = new Function('return ' + equation + display)();
      setDisplay(String(Number(result.toFixed(8)))); // fix floating point errors
      setEquation('');
      setShouldResetDisplay(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const btnClass = "flex items-center justify-center text-xl sm:text-2xl font-normal active:opacity-70 transition-opacity";
  const numClass = `${btnClass} bg-[#333333] hover:bg-[#404040] text-white`;
  const opClass = `${btnClass} bg-[#ff9f0a] hover:bg-[#ffb03a] text-white`;
  const actionClass = `${btnClass} bg-[#a5a5a5] hover:bg-[#d4d4d4] text-black`;

  return (
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col font-sans select-none">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end p-4 sm:p-6 text-white text-5xl sm:text-6xl font-light truncate">
        {display}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-[1px] bg-black p-[1px] h-[75%]">
        <button onClick={clear} className={actionClass}>AC</button>
        <button onClick={() => setDisplay(String(Number(display) * -1))} className={actionClass}>+/-</button>
        <button onClick={() => setDisplay(String(Number(display) / 100))} className={actionClass}>%</button>
        <button onClick={() => handleOp('/')} className={opClass}>÷</button>

        <button onClick={() => handleNum('7')} className={numClass}>7</button>
        <button onClick={() => handleNum('8')} className={numClass}>8</button>
        <button onClick={() => handleNum('9')} className={numClass}>9</button>
        <button onClick={() => handleNum('*')} className={opClass}>×</button>

        <button onClick={() => handleNum('4')} className={numClass}>4</button>
        <button onClick={() => handleNum('5')} className={numClass}>5</button>
        <button onClick={() => handleNum('6')} className={numClass}>6</button>
        <button onClick={() => handleOp('-')} className={opClass}>−</button>

        <button onClick={() => handleNum('1')} className={numClass}>1</button>
        <button onClick={() => handleNum('2')} className={numClass}>2</button>
        <button onClick={() => handleNum('3')} className={numClass}>3</button>
        <button onClick={() => handleOp('+')} className={opClass}>+</button>

        <button onClick={() => handleNum('0')} className={`${numClass} col-span-2 text-left pl-8`}>0</button>
        <button onClick={() => { if (!display.includes('.')) handleNum('.'); }} className={numClass}>.</button>
        <button onClick={calculate} className={opClass}>=</button>
      </div>
    </div>
  );
}