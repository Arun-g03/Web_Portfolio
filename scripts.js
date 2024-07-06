document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('crimson'); // Set background color to crimson red
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 500); // Pushed back camera position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x2f2f2f }); // Tarmac grey/black
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const baseColor = textureLoader.load('aventador-svj_Model/Body_Base_color.png');
    const metallic = textureLoader.load('aventador-svj_Model/Body_Metallic.png');
    const normalMap = textureLoader.load('aventador-svj_Model/Body_Normal_DirectX.png');
    const fabricInterior = textureLoader.load('aventador-svj_Model/Fabric004_4K_Colorcopie.jpeg');

    let carModel;

    // Load FBX model
    const loader = new THREE.FBXLoader();
    loader.load('aventador-svj_Model/aventador_Model.fbx', function(object) {
        object.position.set(0, 0, 0); // Set model position at (0, 0, 0)
        object.rotation.y = Math.PI; // Rotate model 180 degrees

        object.traverse(function(child) {
            if (child.isMesh) {
                // Apply textures
                child.material.map = baseColor;
                child.material.metalnessMap = metallic;
                child.material.normalMap = normalMap;

                // Apply fabric interior texture conditionally
                if (child.name.toLowerCase().includes('interior')) {
                    child.material.map = fabricInterior;
                }

                // Ensure the textures have correct settings
                child.material.map.encoding = THREE.sRGBEncoding;
                child.material.metalnessMap.encoding = THREE.LinearEncoding;
                child.material.normalMap.encoding = THREE.LinearEncoding;

                child.material.needsUpdate = true;

                // Enable shadows
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        carModel = object;
        scene.add(carModel);
    }, undefined, function(error) {
        console.error('An error happened', error);
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Handle mouse movement
    window.addEventListener('mousemove', function(event) {
        if (carModel) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const maxRotation = Math.PI / 2; // 90 degrees in radians
            carModel.rotation.y = Math.PI + mouseX * maxRotation; // Rotate based on mouse position with max limit
        }
    });

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}


function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = slides.length}
    if (n < 1) {slideIndex = 1}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}
