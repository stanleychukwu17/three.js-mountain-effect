import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * In this project, we will:
 * Create a scene, camera and renderer
 * Create a plane
 * Modify the objects in our scene using dat.gui
 * Add Orbit controls
 * Add hover effect to the scene
 * -- Add mousemove eventlistener
 * -- Normalize mouse coordinates
 * -- import raycaster
 * -- Test for intersects
 * -- Based of the intersected face, we change the surrounding vertices color
 * Add HTML and integrate with JS
*/

// resizes the scene to fit the current window size
function reportWindowSize() {
    renderer.setSize(innerWidth, innerHeight)
}
window.onresize = reportWindowSize;


//--START-- setup
// create the 3.js scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

// adds the orbit control to the scene
const controls = new OrbitControls(camera, renderer.domElement)

camera.position.z = 5 // moves the camera towards the viewer

// we instantiate the dat.gui and adds it to our project
const gui = new dat.GUI()
const world = {
    plane: {width:5, height:5, widthSegments:10, heightSegments:10},
}
//--END--



// lets create a box geometery
// const box = new THREE.BoxGeometry(1,1,1) // creates the vertices, let's just say it creates the wireframe
// const material = new THREE.MeshBasicMaterial({color: 0xE03270}) // creates the material that will be placed upon the wireframe(i.e the geometry)
// const boxMesh = new THREE.Mesh(box, material) // places the material on the wireframe, And we call it the mesh!
// scene.add(boxMesh) // the mesh is what we add to our scene


//--START-- lets create a plane geometry
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10) // width, height, widthSegments, heightSegments
// const planeMaterial = new THREE.MeshBasicMaterial({color:'#df0e3a', side:THREE.DoubleSide}) // the side:THREE.DoubleSide allows us to see both side of the plane, by default 3.js does not allow u to see the back of a plane
const planeMaterial = new THREE.MeshPhongMaterial({color:'#df0e3a', side:THREE.DoubleSide, flatShading:true}) // the MeshPongMaterial allows the object surface to react with light hitting the surface, so you see some kind of reflection. But there must be light in your scene for this to work(we also have different types of mesh material, you can check this out in the 3.js docs).. {we can also do -> {flatShading: THREE.FlatShading}}
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

// we want the plane properties to be editable using the dat.gui
// first argument is an object of properties that you want to be able to edit, 2. the name of property that will appear in the dat.gui panel, the name can be anything 3. the minimum value, 4. the maximum value
const minPlaneValue = 1
const maxPlaneValue = 20
gui.add(world.plane, 'width', minPlaneValue, maxPlaneValue).onChange(generatePlane)
gui.add(world.plane, 'height', minPlaneValue, maxPlaneValue).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', minPlaneValue, 50).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', minPlaneValue, 50).onChange(generatePlane)

// the function below disposes the old plane geometry and creates a new one
function generatePlane () {
    planeMesh.geometry.dispose() // this will delete/remove the planeMesh from our scene
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments) // we create a new geometry for our plane using the values received from the dat.gui
    creatMountainEffect()
}
//--END--


/**
 * we want to create a mountain like effect on our plane, and for us to archieve this, we have to manipulate the geometry of the plane
 * Each 3 values in the geometry array represents the x,y,z cordinates of one vertex of the plane geometry
*/
const creatMountainEffect = () => {
    const {array: planeVertexArray} = planeMesh.geometry.attributes.position // grabs the array containing the vertices of the plane
    for (let i = 0; i < planeVertexArray.length; i++) {
        const x = planeVertexArray[i]
        const y = planeVertexArray[i + 1]
        const z = planeVertexArray[i + 2]
    
        // we only want to edit the Z-axis because we are trying to make our plane look like a rough mountain
        planeVertexArray[i + 2] = z + Math.random()
    }
}
creatMountainEffect() // calls the function immediately to create the effect



// adds light to our scene, without this light nothing will show in our scene because of the type of material we're using on our planeGeometry
const light = new THREE.DirectionalLight('#fff', 1) // the color of the light, and the intensity of the light
light.position.set(0,0,1) // the x, y, z position of the light
scene.add(light)


// calls the renderer function in a loop to render all we've added to the scene and update the scene with any future changes
function animate () {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()