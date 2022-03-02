//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault());
let human = document.querySelector('.g-recaptcha');
let submit =  document.querySelector('#form-submit');
submit.disabled = true;
human.addEventListener('change' , (event)=>
{
    submit.removeAttribute('disabled');
} );