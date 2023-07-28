const meals=document.getElementById('meals');
const favouriteContainer=document.getElementById('fav-meals');
const mealPopup=document.getElementById('meal-popup'); 
const mealInfo=document.getElementById('meal-info');
const popupClosebtn=document.getElementById('close-popup');
RandomMeal();
fetchFavMeals();


const searchTerm=document.getElementById('search-term');
const searchBtn=document.getElementById('search');
async function RandomMeal(){
  const resp=await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData=await resp .json();
  const randomMeal=respData.meals[0];
  console.log(randomMeal);
  addMeal(randomMeal,true);

}
async function getMealById(id){
  const resp=await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

  const respData= await resp.json();
  const meal=respData.meals[0];
  return meal;

}
async function getMealBySearch(term){
  const resp=await fetch( "https://www.themealdb.com/api/json/v1/1/search.php?s="+term);

  const respData= await resp.json();
  const meals=respData.meals;
  return meals;
}

function addMeal(mealData,random=false){
  const meal=document.createElement('div');
  meal.classList.add('meal');
  meal.innerHTML=`
  <div class="meal-header">
    ${random ?`<span class="random">
    Random Receipe
  </span>`:''}
    <img src="${mealData.strMealThumb}"alt="${mealData.strMeal}">
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
      <i class="fas fa-heart"></i>
    </button>
  </div>
`;
const btn=meal.querySelector('.meal-body .fav-btn');

btn.addEventListener("click", () =>{
  if(btn.classList.contains('active')){
    removeMealFromLS(mealData.idMeal);
    btn.classList.remove('active');
  }else{
    addMealToLS(mealData.idMeal);
    btn.classList.add('active');
    window.location.reload();
  }

  
  fetchFavMeals();
});

meal.addEventListener("click",()=>{
  showMealInfo(mealData);
})

meals.appendChild(meal);
}


function addMealToLS(mealId){
  const mealIds=getMealFromLS();
  localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}

function removeMealFromLS(mealId){
  const mealIds=getMealFromLS();
  localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id=>id!==mealId)));
}
function getMealFromLS(){
  const mealIds=JSON.parse(localStorage.getItem('mealIds'));
  return mealIds==null ? []:mealIds;
}

async function fetchFavMeals(){
    //clean the container
    favouriteContainer.innerHTML='';
  const mealIds=getMealFromLS();
  const meals=[];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}


function addMealFav(mealData){


  
  const favMeal=document.createElement('li');
  favMeal.innerHTML=`
  <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">   
  <span>${mealData.strMeal}</span></li>
  <button class="clear">
  <i class="fas fa-window-close">
  </i>
  </button>
`;
const btn = favMeal.querySelector(".clear");

btn.addEventListener("click", () =>{
  removeMealFromLS(mealData.idMeal );
  fetchFavMeals();
});
favMeal.addEventListener("click",()=>{
  showMealInfo(mealData);
})
favouriteContainer.appendChild(favMeal );
}

function showMealInfo(mealData){
  mealInfo.innerHTML='';
  const meals=document.createElement('div');
  const ingredients=[]; 
  for(let i=1;i<=20;i++){
    if(mealData["strIngredient"+i]){
    ingredients.push(`${mealData["strIngredient"+i]}-${mealData["strMeasure"+i]}`)
    }
    else{
      break;
    }
    
  }
  meals.innerHTML=`
  <h1>${mealData.strMeal}</h1>
      <img src="${mealData.strMealThumb}"alt="${mealData.strMeal}">

      <p>${mealData.strInstructions}</p>
      <h3>Ingrediants:</h3>
      <ul>
      ${ingredients.map(ing=>`<li>${ing}</li>`).join('')}
        
      </ul>  
  `
  mealInfo.appendChild(meals);
  mealPopup.classList.remove('hidden'); 
}
const empty=document.getElementById('fav-meals');
searchBtn.addEventListener("click",async()=>{
  meals.innerHTML="";
  const search=searchTerm.value;
  const mealsData= await getMealBySearch(search);
  console.log(search);
  if(search==""){
    empty.innerHTML=`<p style="
      font-family:'poppins';
      color:red;
      font-weight:bold;
      font-size:20px;
      top:-20px;
    ">Please enter some data</p>`;
  }
  else if(mealsData){
    mealsData.forEach(meal=>{
      addMeal(meal);
      
    });
  }
});


popupClosebtn.addEventListener("click",()=>{
  mealPopup.classList.add('hidden');
});