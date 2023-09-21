import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faIndustry} from '@fortawesome/free-solid-svg-icons';
import Echo from 'laravel-echo';
import { webSocket , WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketService } from 'src/app/servicios/web-socket.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";


  public usuario    : string  = '';
  public rol        : string  = '';
  public imgName    : string  = '';
  public idRol      : number  = 0;
  public token       : string ='';
  public parametros : any[]   = []; 
  public datos      : any;
  public contador   : any;
  public socket      : any;
  faIndustry                  = faIndustry;

  constructor(private classToggler: ClassToggleService, 
               private rest        : RestService ,
               private servicioUser:  UsersService,
               private servicioAler: AlertasService,
               private router      : Router,
               private webSocketService : WebSocketService 
              
              ) {
    super();
    this.token = this.servicioUser.getToken();

   
  }


  ngOnInit(): void {
  
  this.rest.get('getUsuario' , this.token, this.parametros).subscribe(respuesta  => {
     let usuariox = respuesta;    

     Object.values(respuesta).forEach(element=>{
        this.usuario  = element.name;
        this.rol      = element.rolDes;
        this.imgName  = element.imgName;

      });

      if(this.usuario == ''){
           this.router.navigate(['/login']);
           this.servicioAler.setAlert('','');
           this.servicioUser.eliminarToken();
        }

      if(this.imgName == null){
        this.imgName = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAICgAwAEAAAAAQAAAIAAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAIAAgAMBEQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/3QAEABD/2gAMAwEAAhEDEQA/AP7Ksjb05wOnb/PSvh5t7WPUhFJ3Q0g+mcCsnpqapJ3GEA88HHAHastGkVZXZEWAPpj8M1otPiJaVjF1LXdO0mzu76/u7eysrGB7q9u7mdbW1tIo1LSSyyMdqIqglnYgAA5xW1OUW+WK1/ryMpxb1ufgT+0z/wAHI37EHwM1/W/CPwo0nxz+1TrPh6V7TWde+FF3pGi/CqymRA5ji8VapcwWl/tyUdtLF0sbqyMQykV6lDCYmskowSTWjb/RXf6P7jBunSblUlqnqkv+GR/MB+3Z/wAHD3xE+O/xc07xr8GPgn4W+Hun+HtPgtrKw+KGqW/xNvEukZmaeWKzSKDYoO2JVum2lizKeFr3cty3EUHUrVJ2nNWai3aUVorpre3bS1utx4jOLwp4fDNxUOqtrfV6K/Xvrueb3n/ByX/wUXtPhbpvw/8AB938I/h5JZ2qwX3jzwr8OP7e8bakxlLmSEX93Jp1mNuFWOO0nxjljg55J8O4erU5pydlstFa3nZtk/2veTnNKTbd2769tNPvv9xzvwH/AODiT/gqB8K/Euq+Ih8fLP4z6YsLXupeBPjN4B0TWPCWphyrG7thpVvpd5aSp8ysY53VVk3eTJtwKlkOEjJOneN+zbV/NO9/KzXn0tjHMJNOM4p28rPTs1ovO6k9rW1v/Qx+yx/wdqfBLxTq2m+Fv2uvgD4j+DL38oii+IHwh1af4w+D41EJdp7zSHtrbWYhvSRcWcF8qhoyWO47eeeW4mmuailJdej/ABdv18i1Wo1Lu/L+N/w/NW8z+nr9nr9qz9nX9rTwR/wsX9nL4w+AfjD4Pjuv7PvdV8DeIINX/si58qOZrS/gU+dazqksbGG4RHAdcjmvOm3CXLNWl2ehpySjqtu57+jKVBAGO3tWTvcFt5kwKn8voagqxOMAY24z75zVJdAt3JF2jsP89/0pr4tALI+UZA/Ht/nrW0WyXrZH/9D+yoNmNTwcjj26V8PJtnqxsiMnnB47n0qH7zsXsRyMFHXp6Dpj19f0rJroyua2iZ8ofteftefBb9i34J+K/jt8cvE3/CP+D/DqJaWVhZQf2h4o8aapcZWw0TRLEHfdX13INkcS8KNzuyRo7jelRnXfsoK8iZTS1k7I/wA+D/gpp/wWy/aC/b4h1DwHcM37Pn7NtlqM91ZfCjwL4ju73xD8So3t5bZU8Z6ujxR6lDsklY6XHGNNWTDF74LHIv0uX5XChLmtefd7L0/z38jgxGKVvedo9urPwe1TxleakkNloGn29rYWaCG3aXdJLAoAVAWB2AYwoAPQAAV9DCgoK83ds8qdbm0eiW39f8A5DUY/EN2JI7kW12bfO9UiWSSAE9sfMCTj1zmtk1Be7cx9pRctb3KFuNTsIvOltHnsyP3iEEgpzu2jqCpyc84K84rKdSLbjez/AK/r+kbqKk+aKLFx5+g6rbXlvIWhuLV5I541MfmLIh3HHr8wPpkj1rOMrxfMWo3j5iavqtpqOk2ErqVv4EjtzkYWRMyFgMdlAQD6CtIJ3fQcVrY+mv2N/wBtn9pD9i/4s2PxZ/Z8+JOr+CvFiy28WtRJGmr6N42soJFf+zNa0+VhHfWzKjRhGZJ4lkf7PPbszMefGYChi6fLVW2z7enb8n1TN6deph5Nx1T3/r8j/T4/4JPf8FSvhz/wUn+Bsfim1Gl+FfjP4NS30v4v/DGK6L3GgXkkQaLUbEPh5tMvcSPbXGAQY5YZVjuIZoo/jcRRnhKvsam3R9/+D3+/Y9GLp1Ic9P7j9aEkBxz7ZrLzJJxKCB+XHNO+th+RMjE4yRk8ccYouFtSyHwuBxx61pCQvI//0f7I1bCDjkAfh9a+H0TTZ6mr1AnoM4xwQeax1bNFoY2rahb6faXN7d3MFpaWlvJeXdzdSCG3tIokaSWWVzwqIqs7MegU00rasNZbH+Zv/wAFpf8Agpo37dn7Qlz4g8Parf2v7OHwjF/4M+AnhyWYQL4m3TzQ6j43mjAP77WvJVbPJLQ6XFE2Yzd3MdfV5bg3Cko2996vy8vl189DhxFVJuV9Fsu/n8/y1P58vEWuT61qElxPDM8gO3yxLiGNAPkRUA+UAY75OMnk19DTiqcOWJ5us/3jlb9PxMQi8uCqwW5iIfASIttyehyT/n+VczS1BOmnq73Ons/DHiGfZJHCbQt8odHAVskDCqmT8x/gxhuwBrKpiYRX9f8AAHGlKTaSuj2TwX4T8V6TcrNNpeneJdOnAS6sLhzDOOeDh9rA8kZxkg4OeleXisVQnpdp9H/X9fr6OEwWIg+dRTj1R7b4k/Z8k1LwxYXekaZdhXt5Fsv9Fk3afFy3lE4G5Ruba2OigHGMV5VHOIQrOFSS89Ue9X4eqVMPGrRi7v12PlbxH8IPE+k7nNvJJbxEKD5DQZ/2iG4VQMZLEY6c17dDMcPU0PArZfisNFycb9zzz+yruC63xrIkVu4V5xG7AEdWwBkjOegz3xXo80WtGcEpe7yyR+xn/BMT9rrVP2Pv2q/gZ8aU8QappXgrS/E9tpfxWhs9TGnWWr+HbqZdO1aa+ABSa0tIbt9SeFh97SwVIZRjwsww31iLS3Wq9bf187HXhqnLFJfP7z/Vg8P61Ya3pWn6tpl5Bf6bqVlFf6ffWsomt7yGZFkiljcEhldGVgwOCGHrXzCm7f1odzjaTR0KOCF78ZHPFK7BpdCzG2cHk8Z/Gr5v6/r+vyJcbE5fCjj3OeAacXdbgz//0v7I1AKp9P6V8Qemuo8qcHHQ/gBilboW31P5wP8Ag5D/AG+rj9lP9kH/AIUN4G1Gay+LX7Wtlqng2K/sLh7XUfCngyzS3h8UalbzKuI7i7bUNP0e3YlWR9WkmAYW7iu/LsN9YxK5l7sdX69F+F/kY1Kvs6Tkviei9Ov+X9O3+bzq14+oCK4u/skGn2lsTb26BY4MM3CpEPux7YlCL2VcDAGK+yjFQvGK1PIfNUa7I419Re6D2mmWrwrNJmeYHE84PAUE/dH+7gnPoMVpdRXNNhGlzO3U+3/2Wf2KPGPxrv7G+ntbqLT5J1MaujbZBkfw+nTqa/PeKeO8LkidKGs/xP1DhHw8xOfJYnEJxp+h/Q58KP8Agkh4Rg0a0l1y2F9eS224F4g3lFh8wDkdPYDHtX4pjvEnPK9bmwtlH/I/bsB4a8N4alyV4tvufQHhL/glD8OLDUreW80ea+hgkDR297OLyzcA5/e7EBYDOcNke1cs+OuIMVFwbt5r/M7o8CcOYZqdON7dH/WvzPunQP2BfhdY+Hv7KsfC2nQRtGySCG2jVjnG4A4zjg8Hjocda8bEYrOsS/bOvJy9T1cJgslwsvYxoRt6aH50/tJ/8Er9C1ZtSvdD0u8hV9zQCBURFb6DA4wOep/WvSy7jzO8okqWJ96K7o8vNOAciziLq0laTX9en3H8+/7R/wCwv47+FMt/eRaXeWMETPMt4ke6GbZ0Jx688fWv2XhbxAwOayjRm/efR/ofiPFvhxi8qhKtRXuq7uj8/ofEF3omCyJFNpsjWt7BJH8okBO1kQ8bSWZiAQGGOBX6goxqfC99T8hvKlPzWh/Zf/wba/8ABWPxTH408N/8E+PjN4ifXPh54g0yeH9l/Xdbnkn17wDqdjBLfXPgVrhyTLpc9pDcXOlLLh7NrK6tVdoGs4YPmc2wfsr4qmv8X+f+ffTqz1sJWVaPs5brb07Xvr5H9wcUm5AwJIJyOOua8PmuzsUU7suRtjAI+Y88VpF3RlJNMtM4K5zg56nnNbQt1MZX2P/T/snQfKpGenXH+fWvi3ZJM9FLUZMxK7V5kb5FGe56D9am6vcbvsf5bX/Bwh+1ZP8AtL/8FIfjzLpurRX3gn4G6hD+zl4EjtZZWhRPDCyf27NGd2zfPrV/qscuwDd/ZdtuJMY2/VZLRUMOqkl70ve+T2/BficWNk3P2aei0/r5n4U3q3UqW8TmV7W2iRHxlUdyMmNT/sgY9gDXsLlV5aK5yRShotT9A/2I/wBk3Xvjz4oikm0m5t/DtlPG+q6zc25it7VNwIt7cEYaVx3x8o5Pbd+a8d8Y4fIMG+WV6jTSjf8AF+S/E/TvD7gyvxBjFUqRfsV8UmvwXm/wR/YD+zv+zl4Y+HGkaJp+mafBBDBDHAhSEROdoH+H+c1/KuNzTF5rinXxErtv+v6uf1hg8uw+BwqoYeKUUrI/VzwV4Z0/7EtsIIo9sa9EDHGOe9fUZbhaU48kkeJjq9WnLnj/AF/XyPQ7bwhYxtu/dgJwxK4Ld/pXv08uwyskeRPG19U0dFFpFvCdqcADcpVRlMZ5P51308NQWjOWdao3oef+N7exntzA1tG52FQwjBzxgjPT/wDVXzme08M4+6tbH0GUe2Xvc2nXyPzh/aH+BXhz4g6Bqmj3mmxSxXds6uDGsijcCAwbtg/yr4fDYurlePWIw7acWmfRY/CUswwToVYp3Vj+Jv8AbK/ZmuvgL8Wdc0idZp9Eu55bqK7EZ5R/mG0dPkGR34Br+v8Ag3iBZ3k9Os2vaJa/15n8Z8c8NvIM4qU4fwpaorfsX6zrngL9pT9njxf4Jvha+LvCXx68EahpLo2ydxP4o03T/LRwCG8+O8uLMkgYS+G5l5YfQ5h71CfMrpxf4K//AAT5TCx2t0a/P+kf6+emXBuLWOVk2b0EmzjKFlBK9exJFfCRlJpS6HstWkzZjGcE9ueBz/StadR9f6/Ahx6ssEfu84yQvQc12QfU55rXU//U/skjbKKcc4Hf/P8AkV8G5Je6z2FC2xkazPcxWN7NZqGu47OWSzVvuvKsbGLP/AttROo+R23s/wAi1FRlf+tz/IE/4KOfCvxl8F/2xv2h/hx8QLwan4qsfi7rviW71Ty0gTWovEeoT6/aXyxqx2+aupMSuchoyCB0r7jKKkamCp1I7cqX3Kz/ABR5WYR5K8rdW39/9fcfLngrQE17V9NsIYjeXs+oLHaW4XdHECdilvUuVU+y4xgkmrx+I9hQnNuySd/68gwWFeIxEacFdto/sN/ZL+Eej/Cj4c+D/D9lCn2gWMd3fSiMCS7uJFDyO5xyxPU+wA4r+MeLs0rZzmlWu3e7svJdkf23whk1HJsso4WK1STfm3u35n67/D/RJ7lNN+0A28eQyrKNhbuPzxXnZbk2LxUlOEHZdT1cyzfCYJONSaufa3gvQ4VWIrOoLRbtpbb37/56V93gMlxFNqTPksRnWHrR5UeqDSoUiURSK7Hlwjr6ZyM/j65/SvoaeCpKC1731PIqY2fPqu2tiKzsI/MImdookbJaVhyCccdu+cehp0sKlJ2f4hUxcnol0/Q47xppGjxW7mS5gRtpYb51V8bmByM+3f0rzM1yr2sP3a32/E9DLc5pUXepK3r8j418ZTaC9ylhFremSXlxN5Udq90gkbaTuXG7JPTj1/GvzrGZFjqMuf2b5X5aH2WFzrA4hckasb7WuvyP5mP+C0Xw6k0+x0Xx3a2RS2eJrC/uIoj5URZsRO2On3gCewzmv1rwizD2dapllR67pfmfjXjBljlgoZhFbaN+u1/8z8K/2ePF1r8P/i18O/iZcxBbXwD8R/C/xKvoZY3mt4rXw74i0zVtQ3RoQ7hBp7t5akFtoAxgEfu2P5nRlCPaS/B2+/Y/n7LUpV4xau5NLstXa932euvb7v8AYT8A6/Z+K/Cvh3xRpk8d3pfifQLPxHp11C++G4gvraO6jdT3BWQH3r4j2fIkmejJ2nJHfxL8o/yDWtKLsmTNssYwvcnp9K7aZxzd5H//1f7JNh2qRwMflx0r88nFrV9D3Y2sUrlDs5zz14/z/nNZrRWv/W5Vkz/LD/4OCfD2o+G/+Ctn7Vz6jHDDBrniDw54o0RY1YRGzk8J6PaQEgjIZptOutyj5ckNkl2C/Z8PVYTyxU4P4XJfje34nm5nCSxKnLrGPW/ddvw128z5Q/4J1fCQ/Fv48aPYzq76f4ds08S6gwG4bYJVjgJ643OHOOeEHpXy3iZnEsp4eqSg/fm+VfNXf3Kx9x4Z5NHNuI4Oa9ymuZ/faP3u/wBx/Un47uPiRpOmeHtC+DmiWOoeKdVlMT6rqriDSfCNnAB5t7ICp3S8BYo8dWJ5xiv504YoZZPESxecS/dx1t/M3svTq2f0pxBic0jTWEyiynLRy/lXf16JdzzuT4aftzeOtZd/BPxC1HQb+3kENvrFvruN21R5vlwOgwrckM4+YZAPev1LC8T8N0IRowo8y7JJL7z87xfCvEmJcqrqcq/mbvf5f8Mdl4d8Qf8ABQb4JaosWrfF671+C1lZ73Rb2KCKC/LOpKmRgzAgZACOFOAVdeVrLGcTcPz9xU/Zyfm3/X3eRpgeE+JKb5+ZVIrpZfd3+Z+s/wCzj+0F498YaBE3jnT4LHWY5TFKsaYE43ZEjBuSSCvI4JBNfF4vOIUsU5YWd4tddfv+Z93gcqqVaCWMg01ddV/Wh6j8T/ivrWi6Xdf2Pbxz6wbc3NqCCIJnU/KjDOeTn6Yrjln7T5ar0vq1/X6HVUyXlX+z9Vsfip48i/b8+MHinVE0X4vReGE1K9E1rpdkYZLS2RGJhjeV4HYIoO0ohAcli2Qa+0y3jDh2hCMJUpTkvL/g2/4H4fB5jwVxViearzQhDom1e34nM2f7Ev7ZkU73fij4j+CdSvGm3wTs2o2N2jpysu9WChgcAEbcFQRjpXs1uNchqx9lKhJR87NP+vmeVQ4K4hofvfaxb7pvT/P9Dn/21fAvj/xn+xV8drP42aM6+Nvhd4CufEY1KOdLq38VW1lC0i3cLKB85VJEfOPmUMQN2K+Wy2tgsLxjgsblDtTqVIxa25VJ289D6DN6WLx3COMwGbRvONOTT3vaN0/n2sfyRfCC4kn8T+HLKZ5WF7rUOilraAT3Mxv5ltoljDfKXdpgq7jgl+cV/SOMShTk4ro39yP5YwsuarHtdfif7Ev7Nvge7+G3wI+DfgG+nkur7wd8L9D8PX91MqrJcXFtptuk7FUAUfvN4woCjGAAK+GS920j2Kk3Ko5I97jbA4HIPeqgu2xLt1JiTt6Z9+mOa6YS6HLNJarY/9b+ypASqZHGO/X6V+fza7HuR1I5ox05wRjrgGpUFL3SnK2rP8+f/g7O/Zy1nwr+1H8Hv2lLPTwnhX4s/DVfAF7qUCFFfWPC8tzPHFMScGR7PUJ3RgAPLtJA7E+Up+m4dqRVOpQfe/37/l+PQ8zHxlKUZ/L+v67nwP8A8ESvBrah4n+Lni1omZLbTrDw2JOgQor3R257k3Xbsor8s8aMSlhsJhX3lL77R/8AbT9u8FsNevi8T192P3Xl/wC3WP6LptW/4QnwnrWqjR7rWJreJ7i20zTYDLf38gX5Il92IwNxwOpr+f6ddynGlF7u3l6s/oqlhoKo6tVba+fy/RH5mfGDxV/wU+8c/Dq88b/CCDx/8MtVXxULDQvhT8NLXQPt2p6LLYzBdRvNbvreVBcwXflB7QSRK0AZlkdyI0/ZuFMDwDRmoZrU9tLS8pOpCHnyKLW3Tmvd2urXPyPjLH+IuIh7TJqcaNO+kYqE6ltfjc/d10uo7dG9j0P4c+F/2r/DPwr8D+K/i7r3xW8SePvEnjS+0nx18H/iD/ZHibxF4Z0ZrlYLHV01eyht7aSZgr3Rt7YOBBKqOBKhZuri3AcE4+0MhUKVVXejqP0TvfV9dbJvsjPgrMOPcBWlU4i5qmGko6yjCLUvtWVO/up3tfdK75W7L9hP2bNAvNC1Kx0nXporqItH5E0fO1XOQpPsMHr3r8mq4WGDx9KNSd1J2Z+tfWZ5jgqlSlG0l+J9A/HjwzFLJJp+gtELuYqizv8AKIkI+Zt3UADJOK7MTgcNLMpUIT0S+887C43E4fBwxFeO7t6ep/OH+1O37djNpusfAKP4qLMPGOp+H9S+Hvw9g0bw/wCM7Kwtb+2XTtck1K9FxDPDf28V6UgtwssH2q2MqkrItfp/C2W8A0YwlnzjUqy3i3VSiuijyWUpbXu7a6ba/mfHmZeImJrSjwvzUsPC1pxjTlKo3F35vaP3Ypu0bK/u31UrH0f4Q8Pf8FC/Anw9+Dvi+z8Q/Fj4g6vq2iTX3xZ+F/xgfSXTwhIbqZrCCz1OK2he6vjavAl55W21E0TNblVJjPJxjg+BZPly2PsZ2vzQcnG/Re+7tW0b/Dc6eCMVx7TjOeeuFWm2tJKKqWa1+B8qS3Sd3q9XY+x/ipo3iT4tfsx/FjR/EGhXNhrviD4T6xpc2kXCj7SjTafOGg44J3ZXI6+lfm2T1atPNqPvXUZxafpJa+R9pn2HhPA1/ZrSUJfjHY/la/4JC/sVw/tJftl/sweEPE11e6Z4X8Q+KdB8bG6S382DUl8NQr4suLQ8MNsw0pbdycbVnY7gSlf1bnOc0cPVjg+b95UlKCVvKcn3t7sXvp03P5Ny7h/GYnAV82hTcqVGCnJ9I3lCCe/SU4/5WP8AVat0WOJUVdi7QqL1wo4A/AY/KvGcjzkrblxDg446jBpppDab6ErOdpxg8Z+tap2MJK+p/9f+yeNiUTGclQT+X+fzr89emqPcT7iT/wCrfvhTtPSqhLuEkfxQ/wDBaL4I+PP2t/2lPjJ8Ir931RfBfh+28Z+DZtQe4f8A4RlIIoFtrayRpGhSO5ImSQRRozGR2LlsGvyBccYzhzirFYzEOUqMa3snDmfLyezi21HbmTlzJ9dL3Wh/W+G8L8m4g8FMqxeFhCOKqqU+fljzOcakt52vayUHHpFu1nqfn5/wR48C3/gTw/8AGfQdd06XS9dsvHVrb6jZTptubeQaXZ5Dj0yrAdB8td3izjaOZxweLwk+alKm2mtn78v0tc+I8JMsxGVyx2CxkeWrGorrr8Ef1v8A0z+lr4cfDWz1i0tTdRQsJYw5DIGLbv4unXGa/JcswMsTUjG9j9hx2I9hByitj0bV/wBmHw7eKZludd0xGU7k03VJbdHOOSyKQP0r6t8NJr95KXyZ4kc8rJ8sWvuR51/woHwb4Tlnv2tJ9V1Rc+Xc6rcPdzLz/CzkkD2Ws5YanlseaF+Zd2zrhVrZjJRqS9172s9P67I0fA1tbW3iW0hEaRNFdB2YEBc7gMYH0UACvApyWJxsZ1X1ufRShHD4SVOj2/r+v6fsvxJsIY9bs5bkxyJcRK29GwBjjj1Uj+tenmMfq+OjUfVJni4e+IwTg1om1qebah+zx4A8USrr1nay2eoSKGklsbt7S6hJ5JjdCGHPYHmvcqUqWPw6nTbTtt/X+Z5dPEYjByeHlt0fc1dA+CcejTCQ3XiDUlQAq+ralNfRrg8EB2Pp3z9a8Oplc3UtFN+bbZ6axinBObXp/X9eQ/xh4e0+1sb6ExK0c0bWlx8udySgxP8ALx2c0sFSjhsZCT1s1+f9f8DryZgnVwkk+zPzF/4Iw/s8+FPDnxC+Cnibw89tcap8OPjd8Q9K1XyIsPY2g0/XtFsoGPYxRW1ohHqT3zX3uMzPF5n4jYDnbdOFptX6+xqXb9XNnytDB5dkfghndNxXtsRFRi3ulHE0bJf9uxv1v8z+v+POyMdyv5V+pL3pNn8vXsrMtID+HXFax8iX3JGBwfUc47/56VrF31XUiqloj//Q/sjQgInP8IPt7/5/yfgWlsz2k77kp5U5xjocHNQl08zRvRtH85f/AAVPjm+Hfxc+J3jnw9aSpr3j34S+EvDa3drEVlsYLa81xbu5VhyGdmtIyw6eWme1fz34i4GnS4pm7tRqxpSa6X99Sa85JRT8kj+2PAvGPOPD7D5VjJ3p4aviXFdfeVGUY+ifPJerPyx/Zi+HEfw2voZWvRdz+KfBtnfazeNcG4fUNSsry6iupi7ZZiRcxL8xyAAO1RicTPHZZOk/hpy0XRRa2X3HFXwlPLeIpVIRsqq182m3fXupfgfsf8LvG1vBFa27y7GiC5K45Gcf48V81luM9jWSW6Po8TgliKWnb9D6zk8c6WujGczL58cZ3hmHI5x/nFfo6zqg8IpX95I+HlkmIWKat7jZ8U+Pvizc634j07QdKljhTUNVGmPchwBb5RnOPXhDz6kV8Tj8fLHVpa2iux9zg8rp5fhbtXla+ppeHI9C8M+LFXVPEkLiRBuafMp8wfNgEdOe564/CscPTwMMTCXtrR63v9xrevVwsnGk+fpZpfmeo+OL7QdfGl/2R4iia68l93mP5CKMgjljjIz/AJ6V6GbwwuK9n9TrpySem34vQ48E6+FjUhi6No39fyuzzrRPipceEPFieE9duEuLSbH2PUUAVXQjJDEdeM4xXJgcxqYSSp137uz/AK6nRicnp42h7fDq07Xt39O3n/V/suy8Z+HX0nzow8s8sQCRsAoUBcAj9Pzr7eGYYD2XNG/M+h8S8rxzq2l8Ker+f9fcfL3xT8TWNnpt/fzyGO1jUy3GE3MFQ7m2jucDpXgUJUa+Oim9G0vxPQzCM6GAnO2qW3fTax4n/wAEd/hd448GeNPG9/4t0AeGYNb8X+JfHmkaO17Hd3drYapqF1d20twiZ8mSRtTVNjktmF+WHzV9Fw8/rvGlTH0Z3goS76JJRW/R3VvyPB8U6uFwXhrg8vhBqa9lCWyvU+KdrPWyjq/M/o6WQHBA5A7mv1yFS7P5VaLkbcDn6578V1waZnJPdEodcEnrj6ZrRJK5lJvr3P/R/saRxsT+IbAR0/lXwDleNpL+vvPZWmpMJQABnGPbg0X6FI/Mn/goN8FdQ8ct8PfHGmtaJ/ZMlz4a1hL2z+26Zfw3P76K1vo+8M22WPcfuvsI5xX5B4qZRVr+wzSitEnB/mr9lvr3sf0d4B8TYXARzHIcXvNRqws7SvHSTi/5lo7dY3PxX8QfB+2+EurXupaNavZWPiDUGvzpB1eTUtO0mdjGbsaesg3RQyeXE7R7tu9SwUFmz+aZNmVatRngK3RP1aXdre19OtvkfrHE8JYiVHNE23FpN272t8+5o6P48n0jU7aAuUDt5ZIfrjt6dcV5WIi6U20z1MuxEKlJc256H4w+NFxp3hiaSO7eN5Y9gJYh1yduPqSQO9a4fE16i9lT3en9anqVvq1Je2nayPNHPh7WvC/2W88S/ZdYuY/tL3dlcPFfW0pwQ8cqcoyk8Hr6+le9hcC4QUJR163/AOHPn8VnUHPmpv7vL+ux8m2nwI8Z6F4q17x/4c8RfEW71edS8+raj4h1bV7S/jRuPM02WU2pHVcpEhC4wwIzX1Lr01hYZd7GLh2UFp6yS5vxPLw7q1688w53GXdzdn2tG/KvOyX3nqtp+z54n+N9npPiLxjrXxBtZvD97HPpJ8PeJ9a8KWUE23BlaKCWOKbBPCz+YmRjFc1KLwcZ0aFFKL0u4qSt6yi1+TNp4ilWlDE1Jt26JuOq8lJP11at5H2fafDuDR/BdlBea9qeo+IdOi8yTU9buPM1OYjhHIwoA+VRhQBgepr5vHZd7Om773v5Hp0s7nXxcarjZWta1tP69b9TsfDHxGuItGjgvn2T2qmOTDBV3LwMfXqPrXixxdSjHkvsezVw9Go3Uj1OQ8X+MpfFulSaNZwyTm4uh5sKI7ySIJEEgXb8w43ZKjIGT2r1Msr1Ks5SjFuSTsld3dnY+ZzPDwnUo4epNQjKcVKTaSUbq929PLV7n7B/sb+BdP0rw3r3iqy02Szt9fvYYdOu5reWKTUoYU3yzKZPndTK+wSHh/J+X5QK/V+AcsqYfA1sXUv78kk2rNxSu991zO19nbsfhvjTnFHEZphspoVlN0lKU1GSkoyk7RjeL5U1BXt05tdbn24uB3PXkfeIr76F7tn4nJpRLiuBnrXXCb3MmrkvmZVucHHIHH+eK7ISUv6/r+uxjJJPU//S/sMSQbUzyNo9AelfnfN2PZRKJeB0z9c1Wi2LitTI17SNJ8S6PqOha3aR32mapbG3vIJCV3g8gqwwVZSAVZTlSAR7ebmeHoY7DSwuJV4y0f8AXTy8z0cqx2LyvHU8wwE+WrBpxf8AwHuujT0a0sfnb8eP2HfAWr/D7x5r+lXfizxD480Hwze6v4BXWtZDado1zBEZ2SO1gjiSZ5o4nh33IkIWU7cEkn4mnwTk+HwuKq0VKWJlCXI5P4XvokorW1rtN2utLs/UH4qcS47E4TB4p06eDVSLqRpw5efW15Sk5Ssr3UYuMb2bTsrfgjrP76xjvoGAeKZZ3H+qKKQGBP1B/OvxXH02pO3y/r+rH79gaslRUk/X9Sf4j6Rc698KptR0mZ5Lm3ura5YId0rIjqzY9eOee46VeUONLFx5trndmznVwDVN7/l/X9M+QfgN8dvil43+KWpfs++BLfw18JPFGg31sNT8TfFedF13Xre5E5jutOtWG2aFvKIUxOzEls7SpWv1X/V6p7CjmKn7SnVlyrk2g+03q763at211Pg8HxHlmCdXDYrDydWmua02o+084d10v30a6H6m/Dj9jv4+fEy2sNetv2svhhf3174UbX57fQ4n1SS1u/O2rZRtDf7Xixw1xs4YY8s5GPdo8J5pKnGcZxTe6cnf/C/PrzaLo09ztfjVkuW4itQjlcpxjUUE1yq8Laz1jLVP7O7/AJj1Xxn+x5+1J8PvDmk6tbftY/C63totFutZ1QeI5JdEsLOWGBJ4rW3ka52zZLEPIwRYwobawYLVPhfN1TTVSMv7qk/W12nd3utkvvMa3jPwtifa0Z5RKNpxjGV4+8m2nJrlXLZK/Ld32vpc/LvXv26fGnhX42WH7L3xZtdB8UfEHUdGg8S6H4v8AXaa/pptpoLS6l+2zQLtjiWO7RRJKEJbaBkkCvnsw4dxiyyebVLRjGyalZPW9ktlN6PRJNdTWPFnC+c4mngspp1KWKfM3DWUeWLS5r3fL03dnfS70Ps6OWf+x3ukZwt6n2jYybplBG4MAO2CPyr8jxtKPtnKOiZ+g4KvJYZQm9UfU37EfhL+2vjt4HldJ5E0mK+8W30qkvHGlvaPBErD+ENLcx8GvtfDvCOrxDSmtFDmm/8AwFxX/pR+U+LGOVHhWvTlvUcILTvLmf4RP31ikWNVijGFQBQF7Y4AH0r98lJRXJTWh/LN1vcspJ0wSx/ICpj3/ruN6FmN8ZwSM85PeumCj0Ib5dScuAjHrx9M+vNbwSUWkZSd1c//0/7AA3yoVzyoyd3GK/PEtpLpY9kc0gA4wcnv0pyjbT0GmRtITnnr19D/AJ/pXLWgnr/XkbQm1uVHKAOGUMDkOh5Egxgg+xGR+Nee1yy03R1c3un8s/7SXgmP4OfHn4kfDO5aOPTk1H+3fDolXYX0jVWe5091H91B51sW6brJxmvxTijKZYbGT5Fpe69Hdr7tV8j+muCuIIZjldL2j963LLX7UUk/v0l6s8q8I6nLE2p+EJtrxuhls97BhImeQM9fX8faviqkHTmpp/8ADn6DhavPTlRluvyPNP2jP2dfhJ+0J4Fs7fx14I0fxV/ZG+2lgvIBba3bRnMfm2d0uJopYwzhXiYMFdgDX3HCfFWNyjEc1Gq43a81/wBvLqn6M9LD5Dw9nMf7I4iwkK+GndrmTvFtWvCcWpU5W2lFprufG2gf8EqPhP4gi1KD4F+IrDwn4nvIfs1kbnxHfeF/GmnDAPlDULO5t5biFmRGMUkh3lF3NkAj9fwucZ7jaka+Hq8yX2U48rv/AHZJq/b9DzM98EeCcLhqn1CrLDRmknKrCdVxWlrV6co1WtFfmbbS1umeh+Hv+CP/AIGs9EC/Hzx7d+O73Q72OTSD468aap4sXQ7Y2kMdxZ2Ok3N7Pbq80kccvmr8wSJI+QjE9lbNM6UZT92klfdwi+j+zGLfe19Tx8t8EeEaUlLH4yWNjKOip0qji2rrm5685qCWq0j53eh9i/s3fsO/s9fs+eCtXt/hx4MstGvtekVZtcvIku/E2pwoxkU3NywMgyzPtiU7EU4CrkivyrjDPsTjqkadfEOpJdenyS0/rW561Hhnhvh2+WcOYaNOknedm5OUtd5ybckumyWyVkj27UbhYWg0SBvMkUbEeFwm3BHG7tkAcfWvzWtGpUnaJ3VK8KFNuZ+w37Anwou/D/hjVfijrEQS88Z2ken+HY2UB4tLgcv52f8Ap5lw46ZjhjP8VfuHh5kksHgpZjVWtRKz/urZ/N677WP5g8VeJI5nmUcpou8KLfN2c30/7dWnrc/Q9D82Tkc4/H0r9BjBN/cflPNpr/X9f1ctrIcDAPJ6DjP41cab6g5W3Jkk+bqSO2OB/n/Ct4RS16ETbtoXAw2N/u/eHH+f89K2WiZnq9z/1P6+N3HsVHANfn9luv6seumRsx6Akc9u36/5xTd2rvy/Ad7ldpDkcfxYHzc/5/xrmlFu6NItDNxYgY5965ZUlOokbKbjD+v6/A/n3/4LI+FZbb4l/DHxpo0ePED/AA4uLb92VSTU4LPU2LWrHIzxclkJ4Vsc8mvz7jF08HmeHVX+HODUvlLR/K5+weHVKeMybEulpVp1E4/OP62PyJ8IfEoXdzp+qw3LCaylWO6SfMcsJVirowOGB4IIbp3r4XM8qSvyap6rsz9Ny7OG2qj3Wkk73Xe6PsWbTJtasI9Y052NvqMfmPbRyFoCSB86svRgRnP0r4yUJ0n7j23P0jCVI1oKXzWp8f8AxLX41eGNUmvPB+h6f4osy+9llQwalantukjU5Xr8zLn1NfW5Fm8uT2VSpKDXbr957Kz7P8ppr6g41Idpt6ejsejfBX/hePjN4r7xj4e/4Re00/axivJ2uBOu7cPLBRcHGT0PUcVrm+az0p0q7lH+tzJcWZ5mFKVLEUo0k9Hyq9/+3t0vkfXf/CTTac0aGZZYooysRLbAigfeJx1P6187T9pXu23c+fxNRQdm99zxm08S3Xinxo+gaNMJZyn2rWLuHIWwtxkBM9pJT8ox0BY9q9KtQhgKEcRiFq3ou7/y7/d1PAdaWaYp4TDytZXk+y/zey+bP6ef2ZIvsn7P/wAIrb/nj4EsQT06ox/QED8K/obhZSlwxgZT1bpRb+aP5O40jCnxfmNOmrRVaaXyPct4BwDkDua9mMLOx85dFtCSB1+jduPStlCy12I5r3XUtxEc9xnPTpVctvQlu7LWQqHjjb34NXy6WIv7x//V/r1zhRxnC89u1fCKMbbHp3d2V3YYx/kUmi4vuVnfng5A4z1Pt/T8qxlHf+utiriq2CCcY7Y+8Mfj7040rtPrcHKx+J3/AAVtt45/FnwclZQB/wAIbq8O7OM41CzJHp0bvX5b4m07VsNU/uT/APSoH7j4Oy5sLjY/9PIfjGZ/N18UNJ8QeDdWvvEPhe2d1l/0nVLNXLLeBeGlTHG8Y5B4bA5FfH5JmNCrbBY1+79l9v8Agfkfo+d5bXjzY/AL3vtL+a3X1PS/gr+17pOmWgstVuJEEEix3tvty0bZAKvGTlSPYf0zvmXDFaVT2tBJqWvk/RmeTcU0Ka9lWk01o09GvVW/pH29pnxW+HOu2dvrumazp0E7BXS0af5Z5Dzkc5UDuGBHJPBrycPgq1FuM4NS/wAvl/w59z/a1KpSi1NOO33/ADN7xb+0L4S0/Qxbi9sYjIjRM8TRuzMi52cNljjABHPPIx16qOXPENOUL+Vvx/qyPJxuYOEXGlNrzX9f8E+J/HP7R994gkg8FfD60n1vxjqjn7VJF/x56PbsSBLdyDIQEbDsyT6A8ivWhl+Cy+Msfjmo0o7LrJ9kuv5I+ZxGPxuMnHL8GnOvLftGPeT6Ly3dj7G/Zz8CSeDvC/nahI97ruqTDUNZ1WZNkt7M20MQDnEaABETPyqOSSSa/NM6zipmmY+12gvhXRL+t3bVn32RZTDLcE6V71JaylbWUrfkui6I/pd/Zmu47j4CfC0lstD4TgtH57wvLCfz8uv6l4On7ThTASX/AD6gvu0P438QKTocbZlT/wCnsn/4FZ/qe6rycjpj73U/5/lX0C7Hye+poIBtB/P/AB/T9au/u7f0xW10JQQCeCBjj3qo6bkyuTFwEOfulc8fj7VT+FkdT//W/rzZgUXaeoHIIAbPH+Tmvh000enZ6leRl/Lp0xVOxMboqMwOeVxjA5wB79qm1tI7f1+ppq7XIHcjIyox15z9apWtYmWiuj8d/wDgqparet8Hb+3eJpobfXNMlhkGSy7tMnDYGfRh9Wr8u8T0vq+GrdE5x+9KX6H7b4KzvVx2HfanL8ZR/U/E3XNAtb8bJE2pLwWVw20Y6DuGB/AjORX4XCs4S0/r+v6Z/QcqUKkbXPkr4lfs9eHfEcjzJF9hvxmSO+09/sN7ETuGUdApx0+XJHsOlfTZZxHmGCs6Mrx6p6r7mz57M+HMtx+laNpdJLRr5o8Lt/2XPiZbzrJoHxF12azZj5MF7NFOsbdsts3AgDgnn1r6uHG9Bq2Kwseburq/6HzkeDsVRbWExs1HonZ2+drnvHg39kT4g6+9vb+I/HOptbucTx2MiWu/OM7puXGcdVIP868zFcbUop+woJPpe7/4B6+G4UxMlbFYmTi91Gy/Hf7mfoL8Lv2cPCvw3sIobK1jE2V+0zqFe5nkK4LvIxJYnHVjnivgc2zvF5jNyrSdtrPsfZ5ZlWDy+l7PDwS8+7/NvzZ9V6Rpq2th8hOwDCFHxgjkDvxnt9a+d5veWn9f15HtRtF839WPsT4KftsSfDTRNF8A+JfBsmqaRozS28WuaVqfkX6RySvKqG2kXy2Kl2Gd67hjoRz+48H+IVDL8ro5RjaDcad0pxd3Zu+sWlte109eyZ/PvH3hnXzXN62eZfXXNUs3CS2aSWkl3ts1p37fpt8I/jp8M/jNp+oXXgXxJbaheaHOlt4h0K4H2LxD4dllXfGl7Zsd8YkGSkgzG4U7WbBx+24TEU8ZhIY7D605bPz7Ps/U/n3H4OtgMVLBYlWqR3XX180e1K+5eGGMdeufwrq3ik2cS5k7kq8Y7n0LZqk0Q79hxbI2g87fTP5f4+1U2rWRNpJ36H//2Q=="
      }
    });


    this.rest.get('notificaciones' , this.token, this.parametros).subscribe((data:any)=>{      
      this.datos    = data.notificaciones;
      this.contador = data.contador;   
      
    });
  
   /* setInterval(()=>{
   
    this.rest.get('notificaciones' , this.token, this.parametros).subscribe((data : any)=>{             
      this.datos    = data.notificaciones;
      this.contador = data.contador;    
      if(data.pendiente >= 1){
        const audio = new Audio('assets/water-droplet-bubble-pop.mp3');
        audio.play();
      }        
    });
    },1 * 60 * 1000);*/
    console.log('inicializando');
    
    this.webSocketService.startListening();



  }


  websockets(){
   // window['Pusher'] = Pusher;
 
    /*const echo = new Echo ({
      broadcaster: 'pusher',
      cluster: 'mt1',
      key: 'ASD1323',
      wsHost: '127.0.0.1',
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws']

    });

    echo.connector.options.debug = true;  
    setInterval(()=>{

   /* echo.channel('channel-message').listen('1', (resp: any) => {
      const data = JSON.parse(resp.data);
      console.log('mensaje2');
  });
  echo.channel('channel-message').subscribed((resp : any)=> {
    console.log(resp);
    
  });
  

  },2000);

  

  

// Escuchar mensajes
const socket: WebSocketSubject<any> = webSocket('ws://127.0.0.1:6001/app/ASD1323?protocol=7&client=js&version=8.3.0&flash=false');
setInterval(()=>{


socket.subscribe(
  ()=>{
    console.log('mensaje');
    
  }

);},2000);
*/



  
  }



  salir(){
    this.router.navigate(['/login']);
    this.servicioAler.setAlert('','');
    this.servicioUser.eliminarToken();
  }

  lectura(datos: any){
    this.rest.post('lecturaNot' , this.token, datos).subscribe(data =>{
    });
}

verNotificaciones(){

  this.rest.post('lecturaNotAll' , this.token, this.datos).subscribe(data =>{
    console.log(data)
  });

  this.rest.get('notificaciones' , this.token, this.parametros).subscribe((data:any)=>{      
    this.datos    = data.notificaciones;
    this.contador = data.contador;       
  });

  this.router.navigate(['home/seguridad/notificaciones']);

}


}
