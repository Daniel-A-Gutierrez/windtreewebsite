async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data) 
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

//reveal form only after school is selected.  
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
/*classData = JSON.stringify( 
        [{
            schoolName : 'School A'
            className : 'innovative engineering',
            grades : [0,1,2],
            availability : 22,
            price : 100
        }]
        );*/
async function filterClassesBySchool(allClassData, schoolName)
{
    classData = allClassData.filter((Class) => Class.schoolName === schoolName);//schoolSelect.value);
    console.log(allClassData);
    //keep an eye out for the status of the response code.
    console.log(classData);
    classTotal = 0;
    return classData;
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

//
function generateSchoolList(schools)
{
    let frag = new DocumentFragment();
    //unused
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

    let classArray = []; //checking and unchecking boxes manages array which sets classSelection.value
    let classSelection = document.createElement("input");
    classSelection.setAttribute('hidden', "");
    classSelection.setAttribute('name', 'class selection');
    classSelection.setAttribute('value',"");
    classData.forEach( Class =>
    {
        /*example class
        <div class="class-row">
            <input type="checkbox" class="checkbox-input" value="class1">
            <span><span>Class1  <small>$100 USD</small></span></span>
        </div> */
        if( (parseInt(Class.availability) > 0) && Class.grades.indexOf(studentGrade.toString())!==-1)
        {
            let classrow = document.createElement('div');
            classrow.setAttribute('class','class-row');
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('class','checkbox-input');
            checkbox.setAttribute('value', Class.className);
            checkbox.addEventListener('change', (event) => 
            {
                let change = (event.target.checked) ? 1 : -1 ; 
                change*= parseInt(Class.price);
                classTotal += change;
                priceTracker.innerText = classTotal;

                //add it to class selection or remove it from class selection
                if(change < 0)
                {
                    classArray = classArray.filter( (elem) => elem!==Class.className );
                }
                else 
                {
                    classArray.push(Class.className);
                }
                classSelection.setAttribute('value',classArray.toString());
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
            frag.appendChild(classSelection);
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

async function fetchAllClassData()
{
    allClassData = await postData( "./.netlify/functions/getClasses", {className : schoolSelect.value});
    schoolData = await(postData( "./.netlify/functions/getSchools") , {});
    
    /* //see if this works, itd save time. 
    allClassData = await allClassData;
    schoolData = await schoolData; 
    */
    
    console.log(schoolData);
    schoolSelect.addEventListener('change', (event) => filterClassesBySchool(allClassData, event.target.value) );
    schoolSelect.addEventListener('change',revealHiddenForm);
    gradeSelect.addEventListener('change', generateClassList);
    schoolSelect.value = 'default';
    schoolSelect.disabled = false;
}


paypal.Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: classTotal.toString() // Can also reference a variable or function
          }
        }]
      });
    },

    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
      return actions.order.capture().then(function(orderData) 
      {
        // Successful capture! For dev/demo purposes:
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        const transaction = orderData.purchase_units[0].payments.captures[0];
        alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
        // When ready to go live, remove the alert and show a success message within this page. For example:
        // const element = document.getElementById('paypal-button-container');
        // element.innerHTML = '<h3>Thank you for your payment!</h3>';
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
    }
}).render('#paypal');

var allClassData=[];
var classData = [];
var classTotal = 0;
var priceTracker = document.getElementById('price-tracker');
var human = document.querySelector('.g-recaptcha');
var submit =  document.querySelector('#form-submit');
var gradeSelect = document.getElementById('student-grade');
var schoolSelect = document.getElementById("school-select");
schoolSelect.value='default';
schoolSelect.disabled=true;
submit.disabled = true;
gradeSelect.value='default';
fetchAllClassData();

//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault()) 
