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

    // Load FBX model
    const loader = new THREE.FBXLoader();
    loader.load('aventador-svj-katanatm-sdctm-x-blackdeath/source/svj_PACKED.fbx, function(object) {
        scene.add(object);

        // Hide loading screen and show content
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
    }, undefined, function(error) {
        console.error(error);
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
