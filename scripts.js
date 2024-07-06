document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-canvas').appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const ball = new THREE.Mesh(geometry, material);
    scene.add(ball);

    const planeGeometry = new THREE.PlaneGeometry(100, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -1;
    scene.add(plane);

    camera.position.z = 10;

    let ballPosition = 0;
    const animate = function () {
        requestAnimationFrame(animate);

        ballPosition += 0.05;
        ball.position.x = ballPosition;

        if (ball.position.x > 50) {
            ballPosition = -50;
        }

        renderer.render(scene, camera);
    };

    animate();
}
