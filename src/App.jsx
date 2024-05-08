import React, { useState, useEffect } from 'react';
import Values from 'values.js';
import './App.css';

function App() {
  const [color, setColor] = useState('#e4f500');
  const [textInputValue, setTextInputValue] = useState('#e4f500');
  const [cname, setCName] = useState('');
  const [list, setList] = useState({
    shades: [],
    tints: [],
  });

  const handleChangeText = (e) => {
    const inputValue = e.target.value;
    setTextInputValue(inputValue);
    if (isValidColor(inputValue)) {
      setColor(inputValue);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.startsWith('#') ? inputValue : `#${inputValue}`;
    setColor(formattedValue);
    setTextInputValue(formattedValue);
  };

  const isValidColor = (colorString) => {
    const s = new Option().style;
    s.color = colorString;
    return s.color !== '';
  };

  async function fetchColorName() {
    try {
      let apiUrl = `https://api.color.pizza/v1/?values=${color.substring(1)}`;
      let fetchedData = await fetch(apiUrl);
      let responsedata = await fetchedData.json();
      let colorName = await responsedata.colors[0].name;
      setCName(colorName);
    } catch (error) {
      console.error('Error fetching color name:', error);
    }
  }

  useEffect(() => {
    if (color.length >= 4) {
      fetchColorName();
    }
    let shades = new Values(color).shades(10);
    let tints = new Values(color).tints(10);
    setList({ shades, tints });
  }, [color]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`color Copied to clipboard = ${text}`)
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error);
      });
  };

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-center flex-col gap-2 my-2 mb-6">
          <h1 className='text-6xl text-center'>Shade Generator</h1>
          <h3 className='text-slate-500'>Generate shades and tints of any color instantly</h3>
        </div>
        <div className="colorPickers flex items-center justify-center flex-col gap-2">
          <label htmlFor="color" className='text-slate-300'>Select a Color</label>
          <div className="flex items-center justify-center gap-1">
            <input type="text" id='picker' value={textInputValue} onChange={handleChangeText} className='rounded-md outline-none border-none text-black py-1 px-2' />
            <input type="color" name="color" id="color" onChange={handleChange} value={color} />
          </div>
        </div>
        <div className={`flex flex-col items-center justify-evenly w-1/2 mx-auto my-4 h-32 rounded-md`} style={{ backgroundColor: color }}>
          <h1 className='text-gray-900 text-4xl font-bold'>{cname}</h1>
          <p className='text-black text-2xl'>{color}</p>
        </div>
        <div className="shades flex flex-col px-12 gap-2 mb-4">
          <div className="">
            <h1 className='text-3xl'>Shades</h1>
            <h3 className='text-lg text-slate-500'>Shades of the color as the color is mixed with black.</h3>
          </div>
          <div className="border border-zinc-500 w-full rounded-md overflow-hidden p-2 flex items-center justify-start">
            {list.shades.map((item, index) => {
              return (<div key={index} className='w-40 h-32 flex items-center justify-center rounded-sm cursor-pointer hover:border hover:border-slate-100'
                style={{ backgroundColor: `#${item.hex}` }}
                onClick={(e) => { e.stopPropagation(); copyToClipboard(`#${item.hex}`); }}>
                <p className={index < 4 ? 'text-black' : 'text-white'} >#{item.hex}</p>
              </div>)
            })}
          </div>
        </div>
        <div className="tints flex flex-col px-12 gap-2 mb-3">
          <div className="">
            <h1 className='text-3xl'>Tints</h1>
            <h3 className='text-lg text-slate-500'>Shades of the color as the color is mixed with black.</h3>
          </div>
          <div className="border border-zinc-500 w-full rounded-md overflow-hidden p-2 flex items-center justify-start">
            {list.tints.map((item, index) => {
              return (<div key={index} className='w-40 h-32 flex items-center justify-center rounded-sm cursor-pointer hover:border hover:border-slate-100'
                style={{ backgroundColor: `#${item.hex}` }}
                onClick={(e) => { e.stopPropagation(); copyToClipboard(`#${item.hex}`); }}>
                <p className={'text-black'} >#{item.hex}</p>
              </div>)
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
