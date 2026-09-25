// -------------------- MENU SUR TÉLÉPHONE --------------------

// On récupère le bouton du menu et la liste des liens.
const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.getElementById("menu-links");

menuToggle.addEventListener("click", function() {

    /*
        Ajoute la classe "header__links--open" si elle n'existe pas.
        Si elle existe déjà, toggle l'enlève.
        toggle renvoie true quand la classe vient d'être ajoutée.
    */
    const isOpen = menuLinks.classList.toggle("header__links--open");

    // aria-expanded prévient les lecteurs d'écran de l'état du menu.
    menuToggle.setAttribute("aria-expanded", isOpen);

});


// -------------------- COMPÉTENCES (PAGE PARCOURS) --------------------

// On récupère tous les boutons qui possèdent la classe "skill".
const skills = document.querySelectorAll(".skill");

/*
    On récupère la zone qui affichera
    l'explication de la compétence sélectionnée.
    Elle n'existe que sur la page Parcours.
*/
const skillDescription = document.getElementById("skill-description");

skills.forEach(function(skill) {

    // Pour chaque bouton, on écoute le clic.
    skill.addEventListener("click", function() {

        // Tous les boutons repassent à "non sélectionné".
        skills.forEach(function(otherSkill) {

            otherSkill.setAttribute("aria-pressed", "false");

        });

        // Seul le bouton cliqué est sélectionné.
        skill.setAttribute("aria-pressed", "true");

        /*
            Le texte de chaque compétence est écrit dans le HTML
            (attribut data-description) : le même script sert donc
            pour la version française et la version anglaise.
        */
        skillDescription.textContent = skill.dataset.description;

    });

});


// -------------------- CUBES 3D --------------------

// On récupère tous les cubes présents dans le HTML.
const cubeTriggers = document.querySelectorAll(".cube");


/*
    Tableau contenant le nom des six faces.
    JavaScript va créer automatiquement chaque face.
*/
const cubeFaceNames = [
    "front",
    "back",
    "right",
    "left",
    "top",
    "bottom"
];


/*
    Ce tableau contiendra les informations
    nécessaires pour animer chaque cube.
*/
const cubeStates = [];


/*
    Durée de l'effet après un clic (en secondes).
    Vitesse supplémentaire provoquée par le clic.
*/
const clickDuration = 4;
const clickExtraSpeed = 70;


/*
    Si le visiteur a demandé moins d'animations
    dans son système, les cubes restent immobiles.
*/
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


cubeTriggers.forEach(function(cubeTrigger, index) {

    // On crée l'objet 3D principal.
    const cubeObject = document.createElement("span");

    cubeObject.classList.add("cube__object");


    /*
        On crée les six faces du cube.
        Chaque face reçoit une classe différente.
    */
    cubeFaceNames.forEach(function(faceName) {

        const face = document.createElement("span");

        face.classList.add(
            "cube__face",
            "cube__face--" + faceName
        );

        cubeObject.appendChild(face);

    });


    // On ajoute le cube terminé dans son bouton.
    cubeTrigger.appendChild(cubeObject);


    /*
        data-speed définit la vitesse normale du cube.

        data-phase permet aux différents cubes
        de commencer dans des positions différentes.
    */
    const baseSpeed =
        Number(cubeTrigger.dataset.speed) || 16;

    const phase =
        Number(cubeTrigger.dataset.phase) || index * 30;


    /*
        Chaque cube possède son propre état :
        ses angles, sa vitesse normale
        et le temps restant après un clic.
    */
    const cubeState = {

        cubeObject: cubeObject,

        rotationX: -18 + phase * 0.05,
        rotationY: phase,
        rotationZ: phase * 0.12,

        baseSpeed: baseSpeed,

        clickTimeRemaining: 0

    };


    cubeStates.push(cubeState);


    // On applique tout de suite la position de départ.
    cubeObject.style.transform =
        "rotateX(" + cubeState.rotationX + "deg) "
        + "rotateY(" + cubeState.rotationY + "deg) "
        + "rotateZ(" + cubeState.rotationZ + "deg)";


    // -------------------- CLIC SUR LE CUBE --------------------

    cubeTrigger.addEventListener("click", function() {

        /*
            Au clic, on déclenche 4 secondes
            de rotation supplémentaire.

            Si on reclique pendant l'effet,
            les 4 secondes recommencent.
        */
        cubeState.clickTimeRemaining = clickDuration;

    });

});


// -------------------- ANIMATION CONTINUE DES CUBES --------------------

let previousTime = performance.now();


function animateCubes(currentTime) {

    /*
        deltaTime représente le temps écoulé
        depuis l'image précédente.

        On limite sa valeur pour éviter un grand saut
        si l'onglet est laissé en arrière-plan.
    */
    const deltaTime = Math.min(
        (currentTime - previousTime) / 1000,
        0.05
    );

    previousTime = currentTime;


    cubeStates.forEach(function(cubeState) {

        let clickIntensity = 0;


        /*
            Si le cube vient d'être cliqué,
            l'intensité commence à 1 puis diminue
            progressivement jusqu'à 0.
        */
        if (cubeState.clickTimeRemaining > 0) {

            cubeState.clickTimeRemaining -= deltaTime;

            const remainingRatio =
                Math.max(
                    cubeState.clickTimeRemaining / clickDuration,
                    0
                );

            // Math.sin donne une diminution plus douce.
            clickIntensity =
                Math.sin(
                    remainingRatio * Math.PI / 2
                );

        }


        // Au repos extraSpeed vaut 0, après un clic il redescend doucement.
        const extraSpeed =
            clickExtraSpeed * clickIntensity;


        // Le clic accélère les trois axes.
        cubeState.rotationX +=
            (
                cubeState.baseSpeed * 0.28
                + extraSpeed * 1.85
            )
            * deltaTime;


        cubeState.rotationY +=
            (
                cubeState.baseSpeed
                + extraSpeed
            )
            * deltaTime;


        cubeState.rotationZ +=
            (
                cubeState.baseSpeed * 0.08
                + extraSpeed * 1.55
            )
            * deltaTime;


        // Une seule transformation est appliquée.
        cubeState.cubeObject.style.transform =
            "rotateX(" + cubeState.rotationX + "deg) "
            + "rotateY(" + cubeState.rotationY + "deg) "
            + "rotateZ(" + cubeState.rotationZ + "deg)";

    });


    // Le navigateur prépare l'image suivante.
    requestAnimationFrame(animateCubes);

}


// On lance l'animation une seule fois (sauf mouvement réduit).
if (!reduceMotion) {

    requestAnimationFrame(animateCubes);

}


// -------------------- FORMULAIRE DE CONTACT --------------------

// Le formulaire n'existe que sur la page Contact.
const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", function(event) {

        /*
            On empêche l'envoi classique pour rester sur la page
            et afficher un message. Sans JavaScript,
            le formulaire fonctionne quand même (envoi normal).
        */
        event.preventDefault();

        // Les messages sont écrits dans le HTML (data-success / data-error).
        formStatus.textContent = contactForm.dataset.sending;

        fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: { "Accept": "application/json" }
        })
            .then(function(response) {

                if (response.ok) {

                    formStatus.textContent = contactForm.dataset.success;
                    contactForm.reset();

                } else {

                    formStatus.textContent = contactForm.dataset.error;

                }

            })
            .catch(function() {

                // Erreur réseau : le visiteur est prévenu.
                formStatus.textContent = contactForm.dataset.error;

            });

    });

}


// -------------------- MENU : PAGE ET SECTION EN COURS --------------------

// Tous les liens du menu principal.
const navLinks = document.querySelectorAll(".header__link");

// Un clic sur un lien referme le menu du téléphone.
navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        menuLinks.classList.remove("header__links--open");
        menuToggle.setAttribute("aria-expanded", "false");

    });

});


/*
    IntersectionObserver prévient quand une section entre
    dans la zone centrale de l'écran. Le lien correspondant
    reçoit alors aria-current="page" : le visiteur sait
    toujours où il se trouve.
*/
const observedSections = document.querySelectorAll("#home, #projects, #journey, #contact");

const sectionObserver = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {

        if (entry.isIntersecting) {

            navLinks.forEach(function(link) {

                if (link.getAttribute("href") === "#" + entry.target.id) {

                    link.setAttribute("aria-current", "page");

                } else {

                    link.removeAttribute("aria-current");

                }

            });

        }

    });

}, { rootMargin: "-40% 0px -55% 0px" });

observedSections.forEach(function(section) {

    sectionObserver.observe(section);

});
