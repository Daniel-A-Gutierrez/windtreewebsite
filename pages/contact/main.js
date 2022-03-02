//document.querySelector('form').addEventListener( 'submit', (event) => event.preventDefault());
let human = document.querySelector('.g-recaptcha');
let submit =  document.querySelector('#form-submit');
submit.disabled = true;
function enableSubmit(args)
{
    submit.removeAttribute('disabled');
}