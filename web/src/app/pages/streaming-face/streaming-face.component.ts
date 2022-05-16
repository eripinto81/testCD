import { GerenciarPessoaService } from './../gerenciar-pessoa/gerenciar-pessoa.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StreamFaceService } from './streaming-face.service';

import { Socket } from 'ngx-socket-io';

import { API_FACE } from '../../../CONFIG_API';

@Component({
  selector: 'app-streaming-face',
  templateUrl: './streaming-face.component.html',
  styleUrls: ['./streaming-face.component.scss'],
  providers: [StreamFaceService, GerenciarPessoaService]
})
export class StreamingFaceComponent implements OnInit {

  private URL= API_FACE;

  private ip_abrir_porta= new FormControl();
  private ip_camera_porta= new FormControl();

  private form_busca_avancada: FormGroup;

  private mostrar_alerta= false;
  private loading1= false;

  private listar_situacao= []
  private lista_camera= []
  private camera= [];
  
  private login= 'admin';
  private senha= 'admin';
  private host= '10.10.47.00';
  private porta= '554';

  private dataSource: MatTableDataSource<any>;
  private nome_coluna: string[]= ['foto', 'status', 'nome', 'rg', 'distancia', 'data_instante', 'camera'];
  @ViewChild(MatPaginator) paginador: MatPaginator;

  constructor(private socket: Socket, private fb: FormBuilder, private sanitizer: DomSanitizer, private gerenciarPessoaService: GerenciarPessoaService, private faceService: StreamFaceService, private toastr:ToastrManager, private modalService: NgbModal) { 
    this.form_busca_avancada= this.fb.group({
      "nome": new FormControl(""),
      "rg": new FormControl(""),
      "data_inicio": new FormControl(""),
      "data_fim": new FormControl(""),
      "situacao": new FormControl("")
    })
  }

  ngOnInit() {
    localStorage.setItem('ip_abrir_porta', '10.10.47.140')
    localStorage.setItem('ip_camera_porta', '10.10.47.42')

    this.ip_abrir_porta.setValue(localStorage.getItem('ip_abrir_porta'))
    this.ip_camera_porta.setValue(localStorage.getItem('ip_camera_porta'))

    this.reconectarCamera()
    this.logMonitoramento()

    this.socket.on("emitNovoRegistroLog", status=> {
      this.logMonitoramento()      
    })

    this.gerenciarPessoaService.listarSituacao().subscribe(resp=> {
      if(resp[0].toString() == "200"){
        this.listar_situacao= resp[1]
      }
    })

    // RELOAD RECONHECIMENTO FACIAL EM BACKGROUND
    //this.faceService.reloadThreadBackgound().subscribe()
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  format_distance(number){
    return (parseFloat(number)*100).toFixed(2)
  }

  listarCamera(){
    this.camera= []

    this.faceService.listarCamera().subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.lista_camera= resp[1]

        resp[1].forEach(cam=> {
          let API_CAMERA= `${API_FACE}/face?user=`+cam.login+'&password='+cam.senha+'&host='+cam.host+'&port='+cam.porta+'&ip_porta='+this.ip_abrir_porta.value+'&ip_camera='+this.ip_camera_porta.value   
          this.camera.push(this.getSafeUrl(API_CAMERA))
        })
      }
    })
  }

  conectarCamera() {
    let flag_camera= false;

    // VERIFICA SE CAMERA JA EXISTE
    this.lista_camera.forEach(cam=>{
      if(cam.login == this.login && cam.senha == this.senha && cam.host == this.host && cam.porta == this.porta){
        flag_camera= true
      }
    })

    if(flag_camera){
      this.toastr.warningToastr('Câmera já adicionada!', 'AVISO')
    }else{

      let option= confirm('Conectar câmera?')

      if (option) {

        this.faceService.adicionarCamera(this.login, this.senha, this.host, this.porta).subscribe(resp=>{
          if(resp[0].toString() == "200"){
            this.listarCamera()
            this.toastr.successToastr('Câmera adicionada com sucesso!', 'AVISO')
            this.modalService.dismissAll('closing')
          }
        })

      }
    }    
  }

  novaCamera(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
    
    },(reason)=> {
      this.modalService.dismissAll('closing')
    })
  }

  modalListaCamera(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{

    })
  }

  reconectarCamera(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }
    
    this.faceService.realodThread().subscribe(resp=>{
      if(resp.toString() == "200"){
        this.listarCamera() 
      }
    })
  }

  deleteCamera(idCamera){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }
    
    this.faceService.deletarCamera(idCamera).subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.listarCamera()
        this.toastr.successToastr('Câmera deletada com sucesso!', 'AVISO')
      }
    })
  }

  logMonitoramento(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }

    this.loading1= true;
      
    this.faceService.logMonitoramento().subscribe(resposta=>{
      let logs= null;
      logs= resposta;

      if(logs.length > 0){
        // PESSOA BLOQUEADA ENCONTRADA
        if(logs[0].id_status == 2){
          this.mostrar_alerta= true;
        }else{
          this.mostrar_alerta= false;
        }

        this.dataSource= new MatTableDataSource(logs);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this.dataSource.paginator= this.paginador;

        this.toastr.successToastr('Lista de registro atualizado!', 'AVISO')
        this.loading1= false;
      }else{
        this.loading1= false;
      }
    })
  }

  modalBuscaAvancada(modal){
    this.form_busca_avancada.reset()
    
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 

    },(reason)=> {
      this.modalService.dismissAll('closing')
    })
  }

  buscaAvancadaForm(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }

    this.loading1= true;
    
    const nome= this.form_busca_avancada.get('nome').value
    const rg= this.form_busca_avancada.get('rg').value
    const data_inicio= this.form_busca_avancada.get('data_inicio').value
    const data_fim= this.form_busca_avancada.get('data_fim').value
    const situacao= this.form_busca_avancada.get('situacao').value
    
    this.faceService.buscarAvancadaRegistro(nome, rg, data_inicio, data_fim, situacao).subscribe(resposta=> {
      if(resposta[0].toString() == "200"){
        let logs= null;
        logs= resposta[1]

        // PESSOA BLOQUEADA ENCONTRADA
        // if(logs[0].id_status == 2){
        //   this.mostrar_alerta= true;
        // }else{
        //   this.mostrar_alerta= false;
        // }

        this.dataSource= new MatTableDataSource(logs);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this.dataSource.paginator= this.paginador;
        this.loading1= false;

        if(logs.length == 0){
          this.toastr.warningToastr('Nada foi encontrado!', 'AVISO')
        }else{
          this.toastr.successToastr('Lista de registro atualizado!', 'AVISO')
        }
      }
    })
  }

  modalPorta(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 

    },(reason)=> {
      this.modalService.dismissAll('closing')
    })
  }

  abrirPorta(){
    this.gerenciarPessoaService.abrirPorta(localStorage.getItem('ip_abrir_porta').toString()).subscribe(resp=>{
      if(resp.toString() == 1){
        this.toastr.infoToastr('A porta foi aberta com sucesso!')
      }else{
        this.toastr.errorToastr('Erro ao tentar abrir porta!')
      }
    })
  }

  salvarConfigPorta(){
    localStorage.setItem('ip_abrir_porta', this.ip_abrir_porta.toString())
    localStorage.setItem('ip_camera_porta', this.ip_camera_porta.toString())
    this.toastr.successToastr('Porta configurada com sucesso!', 'AVISO')
    this.modalService.dismissAll('closing')
  }

}
