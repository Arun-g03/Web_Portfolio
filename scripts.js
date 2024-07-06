document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('crimson'); // Set background color to crimson red
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create and append the container for the canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'threejs-canvas-container';
    document.body.appendChild(canvasContainer);
    canvasContainer.appendChild(renderer.domElement);

    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    // Add spotlight
    const spotlight = new THREE.SpotLight(0xffd700, 2); // Adjust color and intensity here
    spotlight.position.set(0, 50, 50);  // Adjust the position as needed
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 200;

    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 10;
    spotlight.shadow.camera.far = 200;

    scene.add(spotlight);

    // Add spotlight helper (optional, for visualization)
    const spotLightHelper = new THREE.SpotLightHelper(spotlight);
    scene.add(spotLightHelper);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const baseColor = textureLoader.load('aventador-svj_Model/textures/Body_Base_color.png');
    const metallic = textureLoader.load('aventador-svj_Model/textures/Body_Metallic.png');
    const normalMap = textureLoader.load('aventador-svj_Model/textures/Body_Normal_DirectX.png');
    const fabricInterior = textureLoader.load('aventador-svj_Model/textures/Fabric004_4K_Colorcopie.jpeg');

    // Load FBX model
    const loader = new THREE.FBXLoader();
    loader.load('aventador-svj_Model/source/svj_PACKED.fbx', function(object) {
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

        scene.add(object);
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

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        updateCamera();
        renderer.render(scene, camera);
    }

    animate();

    // Scroll-based camera rotation
    function updateCamera() {
        const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const angle = scrollPercentage * 2 * Math.PI; // Full rotation over scroll
        const radius = 30; // Increased distance from the center

        camera.position.x = radius * Math.sin(angle);
        camera.position.z = radius * Math.cos(angle);
        camera.lookAt(scene.position);
    }

    // Initial camera position
    camera.position.set(30, 15, 0); // Set further distance
    updateCamera();
}
