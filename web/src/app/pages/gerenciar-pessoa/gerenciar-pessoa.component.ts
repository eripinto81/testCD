import { StreamFaceService } from './../streaming-face/streaming-face.service';
import { Socket } from 'ngx-socket-io';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GerenciarPessoaService } from './gerenciar-pessoa.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { API_FACE } from '../../../CONFIG_API';

import {Observable, Subject} from 'rxjs';
import {WebcamImage} from '../../webcam/domain/webcam-image';
import {WebcamUtil} from '../../webcam/util/webcam.util';
import {WebcamInitError} from '../../webcam/domain/webcam-init-error';

import * as $ from 'jquery';

@Component({
  selector: 'app-gerenciar-pessoa',
  templateUrl: './gerenciar-pessoa.component.html',
  styleUrls: ['./gerenciar-pessoa.component.scss'],
  providers: [GerenciarPessoaService, StreamFaceService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class GerenciarPessoaComponent implements OnInit {

  private URL= API_FACE;
  private progresso= 0;

  private form_busca_avancada: FormGroup;
  private registerForm: FormGroup;
  private formAnexo: FormGroup;

  private listar_situacao= []
  private lista_registro= []
  private listar_anexo= []
  private listar_setor= []
  private lista_anexo= []

  private id_pessoa_editar= 0;
  private id_pessoa_saida= 0;
  private id_pessoa= 0;

  private nome_foto_capturada= null;
  private foto_capturada= null;
  
  private loading1= false;
  private editar= false;

  private ip_abrir_porta= new FormControl()

  private _dataSource: MatTableDataSource<any>
  private _nome_coluna: string[]= ['foto', 'nome', 'setor', 'entrada', 'saida', 'situacao', 'bloquear']
  @ViewChild(MatPaginator) paginador: MatPaginator
  
  /*
  webcam
  */
  public multipleWebcamsAvailable= false;
  public allowCameraSwitch= true;
  public showWebcam= true;

  public facingMode: string= 'environment';
  public deviceId: string= '';

  public errors: WebcamInitError[]= []

  public webcamImage: WebcamImage= null;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>()

  public triggerSnapshot(): void {
    this.trigger.next()
  }

  public toggleWebcam(): void {
    this.showWebcam= !this.showWebcam
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!")
    }
    this.errors.push(error)
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId)
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage= webcamImage
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId= deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable()
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable()
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints= {}
    if (this.facingMode && this.facingMode !== "") {
      result.facingMode= { ideal: this.facingMode }
    }
    return result
  }

  constructor(private socket: Socket, private faceService: StreamFaceService, private fb: FormBuilder, private gerenciarPessoaService: GerenciarPessoaService, private toastr: ToastrManager, private modalService: NgbModal) { 
    this.registerForm= this.fb.group({
      "nome": new FormControl("", Validators.required),
      "rg": new FormControl("", [Validators.required, Validators.minLength(8)]),
      "data_nascimento": new FormControl("", Validators.required),
      "setor": new FormControl("", Validators.required),
      "observacao": new FormControl("", Validators.required),
      "fk_id_situacao": new FormControl("", Validators.required),
      "data_entrada": new FormControl(""),
      "data_saida": new FormControl(""),
      "horario_entrada": new FormControl(""),
      "horario_saida": new FormControl("")
    })

    this.formAnexo= this.fb.group({
      "arquivo": new FormControl("", Validators.required)
    })

    this.form_busca_avancada= this.fb.group({
      "nome": new FormControl(""),
      "rg": new FormControl(""),
      "data_inicio": new FormControl(""),
      "data_fim": new FormControl("")
    })
  }

  ngOnInit() {
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }
      
    localStorage.setItem('ip_abrir_porta', '10.10.47.140')
    this.ip_abrir_porta.setValue(localStorage.getItem('ip_abrir_porta'))
    
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[])=> {
      this.multipleWebcamsAvailable= mediaDevices && mediaDevices.length > 1
    })

    this.gerenciarPessoaService.listarSituacao().subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.listar_situacao= resp[1]
      }
    })

    this.registerForm.get('data_entrada').setValue(new Date().toISOString().substring(0, 10)) 
    this.registerForm.get('data_saida').setValue(new Date().toISOString().substring(0, 10)) 

    this.listarSetor()
    this.listarRegistro()
    this.buscarCPF()
    this.listarAnexoTUDO()

    this.socket.on("emitRegistroPessoa", status=> {
      this.listarRegistro()
      this.listarAnexoTUDO()
    })

    this.registerForm.get('fk_id_situacao').setValue(1)
  }

  listarSetor(){
    this.gerenciarPessoaService.listarSetor().subscribe(resposta=>{
      if(resposta[0].toString() == "200"){
        this.listar_setor= resposta[1]
      }
    })
  }

  buscarCPF(){
    this.registerForm.get('rg').valueChanges.subscribe(rg=> {      
      if(rg.length == 8 && this.registerForm.get('rg').status == "VALID"){
        if(!navigator.onLine){
          this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
        }
        this.gerenciarPessoaService.buscarCPFAPI(rg).subscribe(resp=>{
          if(resp[0].toString() == "200" && resp[1].length > 0){
            let registro= resp[1][0] 

            this.registerForm.get('nome').setValue(registro.nome_pessoa)

            if(registro.data_nascimento != '0000-00-00'){
              this.registerForm.get('data_nascimento').setValue(new Date(registro.data_nascimento).toISOString().substring(0, 10)) 
            }

            this.registerForm.get('fk_id_situacao').setValue(registro.fk_id_situacao)
            
            this.nome_foto_capturada= registro.nome_arquivo
            this.foto_capturada= `${this.URL}/files/${this.nome_foto_capturada}`
            
            this.id_pessoa= registro.id_pessoa

            this.toggleWebcam()
          }else{
            this.registerForm.get('nome').setValue('')
            this.registerForm.get('data_nascimento').setValue('')
            this.registerForm.get('observacao').setValue('')

            this.id_pessoa= null
            this.foto_capturada= null
          }
        })
      }
    })
  }

  async listarRegistro(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }

    this.loading1= true;

    this.gerenciarPessoaService.listarRegistro().subscribe(resp=> {           
      if(resp[0].toString() == "200"){      
        this.lista_registro=  resp[1]

        this.gerenciarPessoaService.listarAnexoAPI().subscribe(resp=>{
          if(resp[0].toString() == 200){
            this.lista_anexo= resp[1]

            // TROCAR IMAGEM PARA MAIS RECENTE
            this.lista_registro.forEach(registro=>{
              this.lista_anexo.forEach(anexo=>{
                if(anexo.id_historico == registro.id_historico){
                  registro.nome_arquivo= anexo.nome_arquivo                  
                }
              })
            })
          }
        })

        this._dataSource= new MatTableDataSource(resp[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;

        this.loading1= false;
        //this.toastr.successToastr('Lista de registro atualizado', 'AVISO')

        // RELOAD RECONHECIMENTO FACIAL EM BACKGROUND
        //this.faceService.reloadThreadBackgound().subscribe()
      }
    })
  }

  async adicionarRegistro(){
    this.loading1= true;

    const nome= this.registerForm.get('nome').value
    const rg= this.registerForm.get('rg').value
    const data_nascimento= this.registerForm.get('data_nascimento').value
    const setor= this.registerForm.get('setor').value
    const observacao= this.registerForm.get('observacao').value
    const fk_id_situacao= this.registerForm.get('fk_id_situacao').value
    const data_entrada= this.registerForm.get('data_entrada').value
    const horario_entrada= this.registerForm.get('horario_entrada').value
    const data_saida= this.registerForm.get('data_saida').value
    const horario_saida= this.registerForm.get('horario_saida').value

    let data_atual= formatDate(new Date(), 'yyyy-MM-dd H:mm', 'pt-BR', '')

    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }else{
      // VERIFICAR SE PESSOA EXISTE
      let flag_existe_pessoa= false;
      let id_pessoa_existe= 0;

      this.lista_registro.forEach(reg=>{
        if(reg.cpf_pessoa == rg){
          flag_existe_pessoa= true;
          id_pessoa_existe= reg.id_pessoa;
        }
      })        

      // IMAGEM CAPTURADA EM BASE64
      if(this.webcamImage && flag_existe_pessoa){        
        // REGISTRAR HISTORICO
        this.gerenciarPessoaService.adicionarHistorico(id_pessoa_existe, setor, data_atual, data_atual, observacao).subscribe(historico=> {
          if(historico[0].toString() == "201"){
            let nome_arquivo= `${nome} - ${new Date()}`
            
            // REGISTRAR ANEXO
            this.gerenciarPessoaService.adicionarAnexo(`${nome_arquivo}.png`, id_pessoa_existe, historico[1].toString(), 'image/png', 0).subscribe(resp=> {
              if(resp.toString() == "201"){

                fetch(this.webcamImage.imageAsDataUrl).then(res=> res.blob()).then(blob=> {     

                  // ENVIAR ANEXO   
                  this.gerenciarPessoaService.pushFileToStorage(blob, `${nome_arquivo}.png`).subscribe(event=> {
                    let url= event['body']
                    this.progresso= Math.round(100 * event['loaded'] / event['total'])
                    if(typeof url != 'undefined'){
                      console.log('upload success')
                      this.listarRegistro()

                      this.modalService.dismissAll('closing')
                      this.toastr.successToastr('Registrado com sucesso!', 'AVISO')
                      this.limpar()
                    }
                  })

                })

                this.loading1= false;
              }
            })
          }
        })
      }else if(this.webcamImage){
        // REGISTRAR PESSOA
        this.gerenciarPessoaService.adicionarPessoa(rg, nome.toUpperCase(), data_nascimento, fk_id_situacao).subscribe(pessoa=> {
          if(pessoa[0].toString() == "201"){

            // REGISTRAR HISTORICO
            this.gerenciarPessoaService.adicionarHistorico(pessoa[1].toString(), setor, data_atual, data_atual, observacao).subscribe(historico=> {
              if(historico[0].toString() == "201"){
                let nome_arquivo= `${nome} - ${new Date()}`

                // REGISTRAR ANEXO
                this.gerenciarPessoaService.adicionarAnexo(`${nome_arquivo}.png`, pessoa[1].toString(), historico[1].toString(), 'image/png', 0).subscribe(resp=> {
                  if(resp.toString() == "201"){

                    fetch(this.webcamImage.imageAsDataUrl).then(res=> res.blob()).then(blob=> {  

                      // ENVIAR ANEXO    
                      this.gerenciarPessoaService.pushFileToStorage(blob, `${nome_arquivo}.png`).subscribe(event=> {
                        let url= event['body']
                        this.progresso= Math.round(100 * event['loaded'] / event['total'])
                        if(typeof url != 'undefined'){
                          console.log('upload success')
                          this.listarRegistro()

                          this.modalService.dismissAll('closing')
                          this.toastr.successToastr('Registrado com sucesso!', 'AVISO')
                          this.limpar()
                        }
                      })

                    })

                    this.loading1= false;
                  }
                })
              }
            })
          }
        })
      }else{
        if (this.id_pessoa == null){
          this.toastr.warningToastr('Foto não capturada!', 'AVISO')
          this.loading1= false;
        }else{
          // REGISTRAR HISTORICO
          this.gerenciarPessoaService.adicionarHistorico(this.id_pessoa, setor, data_atual, data_atual, observacao).subscribe(historico=> {
            if(historico[0].toString() == "201"){
              this.toastr.successToastr('Registrado com sucesso!', 'AVISO')
              this.limpar()
              this.listarRegistro()

              this.modalService.dismissAll('closing')
              this.loading1= false;
            }
          })
        }
      }
    }
  }

  bloquearPessoa(id_pessoa, situacao){
    this.loading1= true;
    let option= null;
    let status= 1;

    if(situacao == 'PERMITIDO'){
      status= 2
      option= confirm('Tem certeza que quer bloquear essa pessoa?')
    }else{
      option= confirm('Tem certeza que quer desbloquear essa pessoa?')
      status= 1
    }

    if (option) {
      this.gerenciarPessoaService.bloquear(id_pessoa, status).subscribe(resp=>{
        if(resp.toString() == "200"){
          this.listarRegistro()
  
          this.toastr.successToastr('Ação concluída', 'AVISO')
          this.loading1= false;
        }
      })
    } else {
      this.loading1= false;
    }
  }

  modalAnexo(modal, id){
    this.id_pessoa= id

    this.listarAnexo(id)

    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  marcarSaida(modal, id_pessoa){
    this.id_pessoa_saida= id_pessoa

    let hora= formatDate(new Date(), 'H', 'pt-BR', '')
    let minuto= formatDate(new Date(), 'mm', 'pt-BR', '')

    if(parseInt(hora) < 10){
      hora= '0'+hora
    }

    this.registerForm.get('horario_saida').setValue(hora+':'+minuto)    

    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  salvarSaida(){
    const data_saida= this.registerForm.get('data_saida').value
    const horario_saida= this.registerForm.get('horario_saida').value

    let saida= data_saida+' '+horario_saida

    this.gerenciarPessoaService.atualizarSaida(saida, this.id_pessoa_saida).subscribe(resp=> {
      if(resp.toString() == "200"){

        this.listarRegistro()
        this.toastr.successToastr('Registrado com sucesso!', 'AVISO')
        this.modalService.dismissAll('closing')
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
    
    this.gerenciarPessoaService.buscarAvancada(nome, rg, data_inicio, data_fim).subscribe(resp=> {
      if(resp[0].toString() == "200"){
        this.lista_registro=  resp[1]

        this.gerenciarPessoaService.listarAnexoAPI().subscribe(resp=>{
          if(resp[0].toString() == 200){
            this.lista_anexo= resp[1]

            // TROCAR IMAGEM PARA MAIS RECENTE
            this.lista_registro.forEach(registro=>{
              this.lista_anexo.forEach(anexo=>{
                if(anexo.id_historico == registro.id_historico){
                  registro.nome_arquivo= anexo.nome_arquivo                  
                }
              })
            })

          }
        })

        this._dataSource= new MatTableDataSource(this.lista_registro);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;

        this.loading1= false;
        this.toastr.successToastr('Lista de registro atualizado', 'AVISO')
      }
    })
  }

  listarAnexo(id_pessoa){
    this.gerenciarPessoaService.listarAnexoAPI().subscribe(resp=> {
      let lista_anexo= []
      resp[1].forEach(anexo => {
        if(anexo.id_pessoa == id_pessoa){
          lista_anexo.push(anexo)
        }
      })
      this.listar_anexo= lista_anexo
    })
  }

  listarAnexoTUDO(){
    this.gerenciarPessoaService.listarAnexoAPI().subscribe(resp=>{
      if(resp[0].toString() == 200){
        this.lista_anexo= resp[1]
      }
    })
  }

  deleteAnexo(id, file){
    this.gerenciarPessoaService.deletarAnexo(id, file).subscribe(resp=> {
      if(resp.toString() == "200"){
        this.toastr.infoToastr('Removido!')
        this.listarAnexo(this.id_pessoa)
      }
    })
  }

  limpar(){
    this.registerForm.reset()
    this.registerForm.get('data_entrada').setValue(new Date().toISOString().substring(0, 10)) 
    this.registerForm.get('data_saida').setValue(new Date().toISOString().substring(0, 10))
    this.registerForm.get('fk_id_situacao').setValue(1)
    this.foto_capturada= null;
    this.webcamImage= null;
    this.editar= false;
  }

  modalPorta(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=> {
      this.modalService.dismissAll('closing')
    })
  }

  abrirPorta(){    
    this.gerenciarPessoaService.abrirPorta(this.ip_abrir_porta.value.toString()).subscribe(resp=>{
      if(resp.toString() == 1){
        this.toastr.successToastr('A porta foi aberta com sucesso!', 'AVISO')
      }else{
        this.toastr.errorToastr('Erro ao tentar abrir porta!', 'AVISO')
      }
    })
  }

  salvarConfigPorta(){
    localStorage.setItem('ip_abrir_porta', this.ip_abrir_porta.value.toString())
    this.modalService.dismissAll('closing')
    this.toastr.successToastr('Porta configurada com sucesso!', 'AVISO')
  }

  novaEntrada(modal){
    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  date_format(data){    
    if(data == "0000-00-00" || data == "" || data == null){
      return ""
    }else{
      return formatDate(data, 'dd/MM/yyyy H:mm', 'pt-BR', '')
    }
  }

  loadIMG(nome_arquivo){
    return `${this.URL}/files/${nome_arquivo}`
  }

}
