function roundingNumberFn (number) {
  let newNumber = null;
  const convertNumber =  number.toFixed(2);
  const numberArray = convertNumber.toString().split('');

  if(numberArray[numberArray.length - 1] === "0" && numberArray[numberArray.length - 2] === "0") {
    const newArray = numberArray.slice(0, numberArray.length - 3)
    newNumber = newArray.join('');
    return Number(newNumber);
    }


  if(numberArray[numberArray.length - 1] === "0") {
  const newArray = numberArray.slice(0, numberArray.length - 1)
  newNumber = newArray.join('');
  return Number(newNumber);
  }
  if(numberArray[numberArray.length - 1] !== "0") {
   return convertNumber;
  }

  }
  
  export default roundingNumberFn;