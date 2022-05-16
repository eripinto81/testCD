import { ToastrManager } from 'ng6-toastr-notifications';
import { RegisterService } from '../registro/register.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  providers: [UserProfileService, RegisterService]
})

export class UserProfileComponent implements OnInit {
  
  private user_profile_form: FormGroup
  private user_password_form: FormGroup
  private id_user= null;
  private senha_comparacao= null;
  private is_senha_validacao= null;
  private isDisabled= true;

  constructor(private userProfileService:UserProfileService, private fb: FormBuilder, private registerService:RegisterService, private toastr:ToastrManager, private modalService: NgbModal) {
    const currentUser= JSON.parse(localStorage.getItem('currentUser'));
    this.id_user= currentUser.id

    this.user_profile_form = this.fb.group({
      "nome": new FormControl({value: '', disabled: true}, Validators.required),
      "cpf": new FormControl({value: '', disabled: true}, Validators.required),
      "telefone": new FormControl({value: '', disabled: false}, Validators.required),
      "email": new FormControl({value: '', disabled: true}, Validators.required)
    })

    this.user_password_form = this.fb.group({
      "senha_atual": new FormControl('', Validators.required),   
      "senha_nova": new FormControl('', [Validators.required, Validators.minLength(5)]),
      "senha_confirmacao": new FormControl('', Validators.required)
    })

    this.userProfileService.obterUsuario(this.id_user).subscribe((usuario)=>{
      if(usuario[0].toString() == "200"){                
        this.user_profile_form.get('nome').setValue(usuario[1][0]['nome_usuario'])
        this.user_profile_form.get('cpf').setValue(usuario[1][0]['cpf_usuario'])
        this.user_profile_form.get('telefone').setValue(usuario[1][0]['contato'])
        this.user_profile_form.get('email').setValue(usuario[1][0]['email'])
      }else{
        this.toastr.errorToastr('Não foi possível trazer seus dados!')
      }
    })
  }
  
  ngOnInit() {
    this.onChanges()
  }

  onChanges(){
    this.user_password_form.get('senha_confirmacao').valueChanges.subscribe(value=> {
      if(this.user_password_form.get('senha_confirmacao').value == this.user_password_form.get('senha_nova').value){
        this.is_senha_validacao= true;
      }else if(!this.user_password_form.get('senha_confirmacao').value == !this.user_password_form.get('senha_nova').value){
        this.is_senha_validacao= false;
      }
    })
  }

  openDialog(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      

    },(reason)=>{

    })
  }

  mudarSenha(){
    const md5= new Md5();
    let senha_atual= md5.appendStr(this.user_password_form.get('senha_atual').value).end()
    let senha_nova= this.user_password_form.get('senha_nova').value
    let senha_confirmar= this.user_password_form.get('senha_confirmacao').value

    this.userProfileService.obterUsuario(this.id_user).subscribe((usuario) =>{      
      if(usuario[0].toString() == "200"){
        this.senha_comparacao= usuario[1][0]['senha'].toString()        
        
        if(this.senha_comparacao === senha_atual){
          if(senha_nova === senha_confirmar){
            this.onAlterarSenha(this.id_user, senha_nova)
          }
        }else{
          this.toastr.errorToastr('Senha atual inválida! A senha não foi modificada.')
        }
      }else{
        this.toastr.errorToastr('Houve algum erro em alterar a senha!')
      }
    })
  }

  onAlterarSenha(id, senha_usuario){
    const md5= new Md5();
    this.userProfileService.alterarSenhaUsuario(id, md5.appendStr(senha_usuario).end()).subscribe((resposta)=>{      
      if(resposta.toString() == "200"){
        this.toastr.successToastr('Senha alterada com sucesso!')
        this.modalService.dismissAll()
      }
    })
  }

  onSubmit(){
    this.userProfileService.alterarDadosUsuario(this.id_user, this.user_profile_form.value).subscribe((usuario) =>{
      if(usuario.toString() == "500"){
        this.toastr.errorToastr('Erro ao atualizar seus dados! Informe ao administrador');
      }else if(usuario.toString() == "200"){
        this.toastr.successToastr('Seus dados foram atualizados com sucesso!');
      }
    })
  }
  
}
