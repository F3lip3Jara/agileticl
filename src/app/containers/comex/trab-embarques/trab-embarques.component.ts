import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-trab-embarques',
  templateUrl: './trab-embarques.component.html',
  styleUrls: ['./trab-embarques.component.scss']
})
export class TrabEmbarquesComponent  implements OnInit, AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private shipMarkers: THREE.Sprite[] = [];
  private lineMeshes: THREE.Line[] = [];
  
  // Lista de barcos con latitud y longitud (ruta China - Chile)
  private ships = [
    {
      AIS: {
        MMSI: 123456789, // Identificador ficticio
        LATITUDE: 31.2304,  // Shanghái, China
        LONGITUDE: 121.4737,
        NAME: 'Cargo Ship A',
        DESTINATION: { LATITUDE: -33.0472, LONGITUDE: -71.6127 } // Valparaíso, Chile
      }
    }
    // Puedes agregar más barcos si lo necesitas...
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();  // Iniciar animación continua de la escena
  }

  initScene() {
    const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;

    // Crear la escena
    this.scene = new THREE.Scene();

    // Configurar la cámara
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 700;  // Aumentar el valor Z para alejar la cámara y ver más objetos

    // Configurar el render
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Cargar la textura de la tierra
    const loader = new THREE.TextureLoader();
    loader.load('assets/3.jpg', (texture) => {
      const geometry = new THREE.PlaneGeometry(1000, 500);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const earthMesh = new THREE.Mesh(geometry, material);
      this.scene.add(earthMesh);
    });

    // Añadir barcos y líneas de viaje
    this.ships.forEach(ship => {
      const { LATITUDE, LONGITUDE, NAME, DESTINATION } = ship.AIS;
      const shipMarker = this.createShipMarker(LONGITUDE, LATITUDE, NAME);
      this.scene.add(shipMarker);
      this.shipMarkers.push(shipMarker);

      const line = this.createLine(LONGITUDE, LATITUDE, DESTINATION.LONGITUDE, DESTINATION.LATITUDE);
      this.scene.add(line);
      this.lineMeshes.push(line);
    });
  }

  createShipMarker(lon: number, lat: number, name: string): THREE.Sprite {
    const spriteMaterial = new THREE.SpriteMaterial({ color: 0xff0000 });
    const sprite = new THREE.Sprite(spriteMaterial);
    const position = this.convertLatLongToPosition(lon, lat);
    sprite.position.set(position.x, position.y, 10); // Cambiar Z a 10 para asegurarse que esté frente al mapa
    sprite.scale.set(10, 10, 1); // Tamaño del marcador
    return sprite;
  }

  createLine(lon1: number, lat1: number, lon2: number, lat2: number): THREE.Line {
    const material = new THREE.LineBasicMaterial({ 
      color: 0xFFFFFF, // Blanco para las líneas
      linewidth: 2,
      opacity: 0.8,
      transparent: true,
    });

    const points = [];

    // Ajustar las coordenadas Z de las líneas para que estén visibles frente al plano
    points.push(new THREE.Vector3(...Object.values(this.convertLatLongToPosition(lon1, lat1)), 5)); 
    points.push(new THREE.Vector3(...Object.values(this.convertLatLongToPosition(lon2, lat2)), 5)); 

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    // Añadir animación a la línea
    this.animateLine(line, points);  // Llama a la animación

    return line;
  }

  convertLatLongToPosition(lon: number, lat: number): { x: number, y: number } {
    const x = (lon + 180) * (1000 / 360) - 500;
    const y = (lat + 90) * (500 / 180) - 250;
    return { x, y };
  }

  // Actualiza el tamaño del canvas si la ventana cambia de tamaño
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animación para renderizado continuo de la escena
  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);  // Renderizar la escena continuamente
  }

  // Animación para hacer crecer las líneas entre barcos y destinos
  animateLine(line: THREE.Line, points: THREE.Vector3[]): void {
    let segmentLength = 0;

    const animateSegment = () => {
      segmentLength += 0.01;  // Ajustar la velocidad del crecimiento

      // Crear una nueva geometría basada en el crecimiento
      const newPoints = points.slice(0, Math.ceil(segmentLength * points.length));
      line.geometry.setFromPoints(newPoints);

      if (segmentLength < 1) {
        requestAnimationFrame(animateSegment);  // Continuar la animación hasta completar la línea
      }
    };

    requestAnimationFrame(animateSegment);  // Iniciar la animación
  }
}