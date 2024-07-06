document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-canvas').appendChild(renderer.domElement);

    // Add light to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

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
            }
        });

        scene.add(object);

        // Hide loading screen and show content
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
    }, undefined, function(error) {
        console.error('An error happened', error);
    });

    // OrbitControls for camera
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 2, 5);
    controls.update();

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
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
