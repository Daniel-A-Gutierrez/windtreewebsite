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
        document.getElementById('flyer').setAttribute('href', `images/${schoolSelect.value}.pdf`)
        generateClassList();
    }
    else 
    {
        document.getElementById('form-hidden-content').setAttribute('hidden', "");
        document.getElementById('flyer').setAttribute('href', ``);
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
    discounts = [];
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

//note : classes with different costs must have unique names
function ClassesToCost(classes = [], selection= [])
{
    let monomorphized = [];
    classes.forEach( (C) => 
    {
        if (!monomorphized.includes( C.className))
        {
            monomorphized.push(  C.className );
        }
    });
    let cost = 0 ;
    monomorphized.forEach((m) => 
    {
        if(selection.includes(m))
        {
            let Class = classes.find( (c) => c.className = m);
            let price = 10000000000;
            if ( Class ){price = parseInt(Class.price);}

            cost += price;
        }
    })
    return cost;
}

//should filter selectable classes by grade and availability
function generateClassList()
{
    //let classes =  fetch(./netlify/functions/classes)
    let classList = document.querySelector('.class-list');
    classList.innerHTML='';
    classTotal = 0;
    discounts = [];
    priceTracker.innerText = classTotal;
    let studentGrade = parseInt(document.getElementById('student-grade').value);
    let frag = new DocumentFragment();

    let classArray = []; //checking and unchecking boxes manages array which sets classSelection.value
    let classSelection = document.createElement("input");
    classSelection.setAttribute('hidden', "");
    classSelection.setAttribute('name', 'class selection');
    classSelection.setAttribute('id', 'class-selection');
    classSelection.setAttribute('value',"");
    classData.forEach( Class =>
    {
        /*example class
        <div class="class-row">
            <input type="checkbox" class="checkbox-input" value="class1">
            <span><span>Class1  <small>$100 USD</small></span></span>
        </div> */
        if ( Class.className === 'discount') 
        {
            discounts = Class.price;
            discounts = discounts.split(',').map( (s) => parseInt(s) );
        }
        else if( (parseInt(Class.availability) > 0) && Class.grades.indexOf(studentGrade.toString())!==-1)
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
                
                //add it to class selection or remove it from class selection
                if(change < 0)
                    {classArray = classArray.filter( (elem) => elem!==Class.className );}
                else 
                    {classArray.push(Class.className);}
                classSelection.setAttribute('value',classArray.toString());

                //get subtotal
                let subtotal = ClassesToCost( classData, classArray );
                let discount = 0;
                if(discounts) 
                {
                    if(discounts.length > classArray.length-1)
                        {if(classArray.length > 0){discount = discounts[classArray.length-1];}}
                    else{ discount = discounts[discounts.length-1];} //cap discount
                }
                classTotal = subtotal - discount;
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

function generateSchoolList(arr)
{
    //<option value="School A">School 1</option>
    let frag = new DocumentFragment();
    arr.forEach(schoolName =>
        {
            let opt = document.createElement('option');
            opt.setAttribute("value" , schoolName);
            opt.innerText = schoolName;
            frag.appendChild(opt);
        })
    schoolSelect.appendChild(frag);
}

async function fetchAllClassData()
{
    allClassData =  postData( "./.netlify/functions/getClasses", {className : schoolSelect.value});
    schoolData =  postData( "./.netlify/functions/getSchools" , {});
    allClassData = await allClassData;
    schoolData = await schoolData;
    
    /* //see if this works, itd save time. 
    allClassData = await allClassData;
    schoolData = await schoolData; 
    */
    generateSchoolList(schoolData);
    schoolSelect.addEventListener('change', (event) => filterClassesBySchool(allClassData, event.target.value) );
    schoolSelect.addEventListener('change',revealHiddenForm);
    gradeSelect.addEventListener('change', generateClassList);
    schoolSelect.value = 'default';
    schoolSelect.disabled = false;
}

//setup paypal payments
paypal.Buttons({
    style:
    {
        layout: 'vertical',
        color: 'blue',
        label: 'paypal',
        tagline: false,
        height: 30
    },

    // Sets up the transaction when a payment button is clicked
    createOrder: (data, actions) => 
    {
      let itemName = 'registration of ' + document.querySelector("#student-first-name").value + " " + document.querySelector("#student-last-name").value;
      let itemDesc = document.querySelector("#class-selection").value + " " + document.querySelector(".school-select").value;
      return actions.order.create({
        purchase_units: 
        [{
            amount: 
            {
                value: classTotal.toString() // Can also reference a variable or function
            },
            description : itemName + ": " + itemDesc
        }]
      });
    },

    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
      return actions.order.capture().then(function(orderData) 
      {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        transactionId.value = transaction.id ;
        // Successful capture! For dev/demo purposes:
        //console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        alert(`Transaction ${transaction.status}: ${transaction.id}`);
        // When ready to go live, remove the alert and show a success message within this page. For example:
        const element = document.getElementById('paypal');
        element.innerHTML = '<h3>Thank you for your payment!</h3>';
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
    }
}).render('#paypal');

var allClassData=[];
var classData = [];
var classTotal = 0;
var discounts = []; //discounts[0] = discount for 2 classes, discounts[1] for 3 classes, etc.
var priceTracker = document.getElementById('price-tracker');
var human = document.querySelector('.g-recaptcha');
var submit =  document.querySelector('#form-submit');
var gradeSelect = document.getElementById('student-grade');
var schoolSelect = document.getElementById("school-select");
var transactionId = document.getElementById('transaction-id');
var form = document.getElementById('registration');
schoolSelect.value='default';
schoolSelect.disabled=true;
submit.disabled = true;
gradeSelect.value='default';
fetchAllClassData();

function submitForm(e)
{
    e.preventDefault();
    form.submit();

}

//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault()) 
