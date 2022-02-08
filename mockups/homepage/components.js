class Navbar extends HTMLElement
{
    constructor()
    {
        super();
        this.innerHTML = 
        `<style>
            #navbar
            {
                position:fixed;
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
                /*align-items: center; for some reason this breaks the icon*/
                z-index: 1;
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
            }
        </style>
        <nav id="navbar">
            <div class="navbar-icon"><image src='images/windtree-logo.png'></div>
            <ul class="navbar-link-list">
                <a class="navbar-link"href="../homepage/index.html">HOME</a>
                <a class="navbar-link"href="../about/index.html">ABOUT</a>
                <a class="navbar-link"href="">EDUCATORS</a>
                <a class="navbar-link dropdown"href="">PROGRAMS</a>
                <a class="navbar-link dropdown"href="">SCHOOLS</a>
                <a class="navbar-link"href="">COMPETITION</a>
                <a class="navbar-link"href="../careers/index.html">CAREERS</a>
                <a class="navbar-link"href="">SPONSORSHIP</a>
                <a class="navbar-link"href="../contact/index.html">CONTACT US</a>
            </ul>
        </nav>
        `;
    }
}

window.customElements.define("navbar",Navbar);