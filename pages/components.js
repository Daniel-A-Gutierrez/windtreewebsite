/**NOTE : ASSIGNING TO INNERHTML IS A SECURITY RISK. 
 * REPLACE THIS IMPLEMENTATION WITH A SHADOW DOM ONE.
 */
class Navbar extends HTMLElement
{
    constructor()
    {
        super();
        this.innerHTML = `<style>
            #navbar
            {
                /*position:fixed;*/
                top : 0; left:0;
                box-sizing: border-box;
                display:flex;
                width:100%;
                height:86px;
                padding: 20px 0px 20px 0px;
                background-color:white;
                flex-direction: row;
                justify-content:space-between;
                margin:0px;
                border-bottom: darkgrey solid 1px;
                z-index: 5;
            }

            .navbar-link-list
            {
                align-self:center;
            }

            .navbar-icon
            {
                max-width: 250px;
                max-height : 100%;

            }

            .navbar-icon > img
            {
                display:block;
                position:relative;
                max-height:100%;
                padding-left:16px;
            }


            .navbar-link:visited{color:black;}

            .navbar-link:hover{color:blue;}

            .navbar-link
            {
                text-decoration:none; 
                padding:0px 10px;
                font-weight:600;
                font-size : 15px;
                font-style:normal;
                color:black;
                font-family: "Poppins", sans-serif;
            }
        </style>
        <nav id="navbar">
            <div class="navbar-icon"><image src='images/windtree-logo.png'></div>
            <ul class="navbar-link-list">
                <a class="navbar-link"href="home">HOME</a>
                <a class="navbar-link"href="about">ABOUT</a>
                <!--<a class="navbar-link"href="">STANDARDS</a>-->
                <a class="navbar-link"href="programs">PROGRAMS</a>
                <a class="navbar-link"href="schools">SCHOOLS</a>
                <a class="navbar-link"href="careers">CAREERS</a>
                <a class="navbar-link"href="contact">CONTACT US</a>
            </ul>
        </nav>
        `;
    }
}

class Footer extends HTMLElement
{
    constructor()
    {
        super();
        this.innerHTML= `
        <style>
        footer
        {
            background-color:#22253a;
            border-top: rgba(255,255,255,.15) solid 1px;
            color:slategrey;
            text-align: center;
            text-justify: center;
            box-sizing: border-box;
            padding:40px;
        }
        footer-bar
        {
            position:absolute;
            width:100%;
            bottom:0;
        }
        </style>
        <footer>© WINDTREE EDUCATION (Los Angeles, California, USA) All Rights Reserved </footer>
        `
    }
}

window.customElements.define("nav-bar",Navbar);
window.customElements.define("footer-bar", Footer);