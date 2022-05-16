import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { StreamFaceService } from './../streaming-face/streaming-face.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { API_FACE } from '../../../CONFIG_API';

@Component({
  selector: 'app-stream-ocr',
  templateUrl: './stream-ocr.component.html',
  styleUrls: ['./stream-ocr.component.scss'],
  providers: [StreamFaceService]
})
export class StreamOcrComponent implements OnInit {

  private lista_camera= []
  private camera= [];
  
  private login= 'admin';
  private senha= 'admin';
  private host= '10.10.47.00';
  private porta= '554';

  constructor(private sanitizer: DomSanitizer, private faceService: StreamFaceService, private toastr:ToastrManager, private modalService: NgbModal) { }

  listarCamera(){
    this.camera= []
    this.faceService.listarCamera().subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.lista_camera= resp[1]
        resp[1].forEach(cam=>{
          let API_CAMERA= `${API_FACE}/ocr?user=`+cam.login+'&password='+cam.senha+'&host='+cam.host+'&port='+cam.porta    
          this.camera.push(this.getSafeUrl(API_CAMERA))
        })
      }
    })
  }

  ngOnInit() {
    this.reconectarCamera()
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  novaCamera(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
    
    },(reason)=> {
      this.modalService.dismissAll('closing')
    })
  }

  conectarCamera() {
    let flag_camera= false

    // VERIFICA SE CAMERA JA EXISTE
    this.lista_camera.forEach(cam=>{
      if(cam.login == this.login && cam.senha == this.senha && cam.host == this.host && cam.porta == this.porta){
        flag_camera= true
      }
    })

    if(flag_camera){
      this.toastr.warningToastr('Câmera já adicionada!', 'AVSO')
    }else{

      let option= confirm('Conectar câmera?')

      if (option) {

        this.faceService.adicionarCamera(this.login, this.senha, this.host, this.porta).subscribe(resp=>{
          if(resp[0].toString() == "200"){
            this.toastr.successToastr('Câmera adicionada com sucesso!', 'AVISO')
            this.listarCamera()

            this.modalService.dismissAll('closing')
          }
        })

      }
    }    
  }

  modalListaCamera(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
        
    },(reason)=>{

    })
  }

  deleteCamera(idCamera){
    this.faceService.deletarCamera(idCamera).subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.toastr.successToastr('Câmera deletada!', 'AVISO')
        this.listarCamera()
      }
    })
  }

  reconectarCamera(){
    this.faceService.realodThread().subscribe(resp=>{
      if(resp.toString() == "200"){
        this.listarCamera() 
      }
    })
  }

}
