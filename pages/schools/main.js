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

document.getElementById('school-select').addEventListener('change',revealHiddenForm);