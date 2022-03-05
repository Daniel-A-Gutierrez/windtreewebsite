//reveal form only after school is selected.  this needs to be updated to call populate class list 
function revealHiddenForm(e)
{
    console.log(e);
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

let classData;
let classTotal = 0;
let priceTracker = document.getElementById('price-tracker');

//TODO - FETCH REAL CLASS DATA
function fetchClassData()
{
    classData = JSON.stringify( 
        [{
            className : 'innovative engineering',
            grades : [0,1,2],
            availability : 22,
            price : 100
        }]
        );
    classData = JSON.parse(classData);
    classTotal = 0;
}
const schoolSelect = document.getElementById('school-select');
schoolSelect.value='default';
schoolSelect.addEventListener('change',revealHiddenForm);
schoolSelect.addEventListener('change',fetchClassData);

//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault())

//RECAPTCHA STUFF
//make form submittable only after approved recaptcha 
let human = document.querySelector('.g-recaptcha');
let submit =  document.querySelector('#form-submit');
submit.disabled = true;
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

let gradeSelect = document.getElementById('student-grade');
gradeSelect.value='default';
gradeSelect.addEventListener('change', generateClassList);