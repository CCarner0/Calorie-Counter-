const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false;

//cleanInputString() cleans the user’s input 
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

//1: returns NodeList of the text inputs in the form; .length returns the numerical value of the NodeList
//2: allows users to add entries without losing previous inputs; first argument passed = string specifies position of inserted element, 
   //second argument = string containing the HTML to be inserted
function addEntry() {
const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
const entryNumber = targetInputContainer.querySelectorAll('input[type = "text"]').length;//1
const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString
); //2
} 

//6: this returns any numbers that are in the #breakfast element
//7: ternary operator for determining if user is in caloric surplus or deficit; if remaining calories less than 0 = caloric surplus, else = caloric deficit
//8: output has the “classList” property since it is an element; .remove() method is used here to remove the hide class

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

 const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]')//6
const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit"; //7

 output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${remainingCalories} Calorie ${surplusOrDeficit}</span>
  
<hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;
output.classList.remove('hide');//8

}

//3: calls cleanInputString function while passing item.value as its argument
//4: sets a constant variable called invalidInputMatch that calls a "isInvalidInput" function and passes currVal as its argument
function getCaloriesFromInputs(list) {
  let calories = 0;
for (const item of list) {
  const currVal = cleanInputString(item.value);//3
const invalidInputMatch = isInvalidInput(currVal);//4

//5: if the input is invalid, it sends an alert in the form of a pop up that tells users that this is the case; isError would then be true and a null value is returned (absent value)
if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
	calories += Number(currVal);
  }
	return calories;
}

//9: .from() method: accepts an array-like and returns an array; document.querySelectorAll(): returns a Nodelist (not an array, but an array-like)
//10: value property of budgetnumberinput variable will clear, becoming an empty string 
//11: restores the hide class back to the output element 
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'))//9;

for (const container of inputContainers) {
    container.innerHTML = '';
  }
budgetNumberInput.value = ''; //10 
output.innerText = '';
output.classList.add("hide");  //11

}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener ("click", clearForm); 

