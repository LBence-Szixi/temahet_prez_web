import * as THREE from 'three'

function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}


function lerpNum (start, end, amt){
	return (1-amt)*start+amt*end
  }

var scrollPercentage = 0;

const scene = new THREE.Scene()

scene.background = new THREE.CubeTextureLoader()
.setPath( 'skybox/' )
.load( [
	'px.png',
	'nx.png',
	'py.png',
	'ny.png',
	'pz.png',
	'nz.png'
] );

const light = new THREE.PointLight(0xffffff)
light.position.set(2.5, 7.5, 15)
scene.add(light)

const ambLight = new THREE.AmbientLight(0X2d2d2d);

scene.add(ambLight);

const camera = new THREE.PerspectiveCamera(
	40,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.z = 3

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const earthAlbedo = new THREE.TextureLoader().load('Earth/albedo.jpg');
const earthNormal = new THREE.TextureLoader().load('Earth/normalmap.png');
const earthRough = new THREE.TextureLoader().load('Earth/roughness.png');


const earth = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: earthAlbedo, normalMap: earthNormal, roughnessMap: earthRough }));
scene.add(earth);
earth.position.z = -15;
earth.position.x = 5;
earth.position.y = -10;
earth.material.transparent = true;
earth.material.opacity = 0;

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	render()
}

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;

	//camera.position.z = t * -0.01;
	//camera.position.x = t * -0.0002;
	camera.rotation.x = t * 0.0004;
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
	
	requestAnimationFrame(animate)



	render();

}

function render() {
	scrollPercentage = getScrollPercent();

	if(scrollPercentage > 30 && scrollPercentage < 47)
	{
		earth.material.opacity = lerpNum(earth.material.opacity,1,0.1);
	}
	else
	{
		earth.material.opacity = lerpNum(earth.material.opacity,0,0.1);
	}

	earth.rotation.y -= 0.01;

	console.log(scrollPercentage);
	renderer.render(scene, camera);
}

animate()