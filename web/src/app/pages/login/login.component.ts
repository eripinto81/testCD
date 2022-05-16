import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [LoginService]
})

export class LoginComponent implements OnInit {

  private email= new FormControl('', Validators.email)
  private senha= new FormControl('', Validators.required)
  private controleLogin: boolean= false
  private loginInvalided: boolean= false
  private loginNovo: boolean= false
  private loading= false

  private email_recuperar_senha= new FormControl('', Validators.email)

  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router, public toastr: ToastrManager, private modalService: NgbModal) {
    const currentUser= JSON.parse(localStorage.getItem('currentUser'));    
    if(currentUser == null){
      this.controleLogin= false
      this.router.navigate(['/login'])
    }
    if(this.controleLogin){
      this.router.navigate(['/dashboard'])
    }
  }

  logar(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com a internet!")
    }
    else{
      this.loginService.login(this.email.value, this.senha.value).subscribe((usuario)=> {          
        if(usuario[0].toString() == "404"){
          this.loginInvalided= true
        }else{        
          this.controleLogin= true
          this.loading= true        
          const user= { id: usuario[1][0]['id_usuario'], nome: usuario[1][0]['nome_usuario'], email: usuario[1][0]['email'] }
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/gerenciar'])
        }
      })
    }
  }

  ngOnInit() {
    this.onChanges()
  }

  onChanges() {
    this.email.valueChanges.subscribe(email=> {
      this.loginInvalided= false
    })
    this.senha.valueChanges.subscribe(senha=> {
      this.loginInvalided= false
    })
  }

  modalRecuperarSenha(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> {

    }, (reason) => {
      
    })
  }

  recuperarSenha(){
    this.loginService.recuperarSenha(this.email_recuperar_senha.value).subscribe((user)=> {
      if(user.toString() == "200"){
        this.toastr.successToastr("Uma senha temporária foi enviada para seu email.")
        this.modalService.dismissAll()
      }else if(user.toString() == "404"){
        this.toastr.infoToastr("E-mail informado não foi encontrado!")
      }else{
        this.toastr.errorToastr("Erro na solicitação!")
      }
    })
  }

}
