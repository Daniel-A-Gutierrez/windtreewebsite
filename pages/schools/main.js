function revealHiddenForm(e)
{
    console.log(e);
    if(e.target.value !== "default")
    {
        document.getElementById('form-hidden-content').removeAttribute('hidden');
    }
    else 
    {
        document.getElementById('form-hidden-content').setAttribute('hidden', "");
    }
}
document.getElementById('school-select').value='default';
document.getElementById('school-select').addEventListener('change',revealHiddenForm);

//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault());
let human = document.querySelector('.g-recaptcha');
let submit =  document.querySelector('#form-submit');
submit.disabled = true;
human.addEventListener('change' , (event)=>
{
    submit.disabled=false;
} );