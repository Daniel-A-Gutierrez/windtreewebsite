async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data) 
    });
    console.log(response);
    return response.json(); // parses JSON response into native JavaScript objects
  }

//reveal form only after school is selected.  this needs to be updated to call populate class list 
function revealHiddenForm(e)
{
    if(e.target.value !== "default")
    {
        document.getElementById('form-hidden-content').removeAttribute('hidden');
        generateClassList();
    }
    else 
    {
        document.getElementById('form-hidden-content').setAttribute('hidden', "");
    }
}

///.netlify/functions/getClasses should expect a school name, and respond as detailed.
async function fetchClassData()
{
    classData = await fetch( URL("/.netlify/functions/getClasses"), {className : schoolSelect.value});
    /*classData = JSON.stringify( 
        [{
            className : 'innovative engineering',
            grades : [0,1,2],
            availability : 22,
            price : 100
        }]
        );*/
    //keep an eye out for the status of the response code.
    console.log(classData);
    classData = JSON.parse(classData);
    console.log(classData);
    classTotal = 0;
}

//RECAPTCHA STUFF
//make form submittable only after approved recaptcha 

function enableSubmit(args)
{
    submit.removeAttribute('disabled');
}

function disableSubmit(args)
{
    submit.setAttribute("disabled","");
}

//should filter selectable classes by grade and availability
function generateClassList()
{
    //let classes =  fetch(./netlify/functions/classes)
    let classList = document.querySelector('.class-list');
    classList.innerHTML='';
    classTotal = 0;
    priceTracker.innerText = classTotal;
    let studentGrade = parseInt(document.getElementById('student-grade').value);
    let frag = new DocumentFragment();
    classData.forEach( Class =>
    {
        /*example class
        <div class="class-row">
            <input type="checkbox" class="checkbox-input" value="class1">
            <span><span>Class1  <small>$100 USD</small></span></span>
        </div> */
        if( (parseInt(Class.availability) > 0) && Class.grades.indexOf(studentGrade)!==-1)
        {
            let classrow = document.createElement('div');
            classrow.setAttribute('class','class-row');
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type','checkbox');
            checkbox.setAttribute('class', 'checkbox-input');
            checkbox.setAttribute('value', Class.className);
            checkbox.addEventListener('change', (event) => 
            {
                let change = (event.target.checked) ? 1 : -1 ; 
                change*= parseInt(Class.price);
                classTotal += change;
                priceTracker.innerText = classTotal;
            });
            let classTextWrapper = document.createElement('span');
            let classNameText = document.createElement('span');
            classNameText.innerText = Class.className;
            let classPriceText = document.createElement('small');
            classPriceText.innerText = '  $' + Class.price + ' USD';
            classrow.appendChild(checkbox);
            classTextWrapper.appendChild(classNameText);
            classTextWrapper.appendChild(classPriceText);
            classrow.appendChild(classTextWrapper);
            frag.appendChild(classrow);
        }
    });
    
    if(frag.children.length < 1)
    {
        let notice = document.createElement('div');
        notice.innerText = "No classes available.";
        frag.appendChild(notice);
    }
    classList.appendChild(frag);
}

let classData;
let classTotal = 0;
let priceTracker = document.getElementById('price-tracker');
const schoolSelect = document.getElementById('school-select');
schoolSelect.value='default';
schoolSelect.addEventListener('change',revealHiddenForm);
schoolSelect.addEventListener('change',fetchClassData);
let human = document.querySelector('.g-recaptcha');
let submit =  document.querySelector('#form-submit');
submit.disabled = true;
let gradeSelect = document.getElementById('student-grade');
gradeSelect.value='default';
gradeSelect.addEventListener('change', generateClassList);
//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault())
