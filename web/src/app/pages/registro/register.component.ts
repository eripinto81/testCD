import { Md5 } from 'ts-md5/dist/md5';
import { RegisterService } from './register.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  
  private registerForm: FormGroup;

  private isCheckEmail: boolean= true;
  private isEmailExist: boolean= false;
  private validcpf: boolean= false;

  private listar_unidade= [];

  constructor(private registerService: RegisterService, private fb: FormBuilder, public toastr: ToastrManager, private router: Router) {
    
    this.registerForm= this.fb.group({
      "nome": new FormControl("", Validators.required),
      "cpf": new FormControl("", Validators.required),
      "contato": new FormControl("", Validators.required),
      "unidade": new FormControl("", Validators.required),
      "matricula": new FormControl("", Validators.required),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "senha": new FormControl("", [Validators.required, Validators.minLength(5)]),
      "isCheckT": new FormControl("", [Validators.requiredTrue])
    })
  
  }

  ngOnInit(){
    this.onChanges()
    this.isCheckT()
    this.listarUnidade()
  }

  listarUnidade(){
    this.registerService.listarUnidade().subscribe(resp=>{
      if(resp[0].toString() == "200"){        
        this.listar_unidade= resp[1]
      }
    })
  }

  validarCPF(strCPF) {
    var Soma;
    var Resto;
    Soma= 0;
    if (strCPF == "00000000000") return false;
    
    for (var i= 1; i <= 9; i++) Soma= Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto= (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11)) Resto= 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
  
    Soma= 0;
    for (var i= 1; i <= 10; i++) Soma= Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto= (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11)) Resto= 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
  }
  
  onChanges() {   
    this.registerForm.get('cpf').valueChanges.subscribe(cpf => {
      if(cpf.length == 11){
        this.validcpf= this.validarCPF(cpf)
      }
    })

    this.registerForm.get('email').valueChanges.subscribe(value=> {
      if(this.registerForm.get('email').value == 0){
        this.isCheckEmail= true
      }else{
        if(this.registerForm.get('email').status == "VALID"){
          this.registerService.consultarEmail(value.toString()).subscribe((resposta)=>{
            if(resposta.toString() == "200"){
              this.isCheckEmail= true
              this.isEmailExist= true
            }else{
              this.isCheckEmail= true
              this.isEmailExist= false    
            }
          })
        }else if(this.registerForm.get('email').status == 'INVALID'){
          this.isCheckEmail= false
          this.isEmailExist= false
        }
      }   
    })
  }

  isCheckT(){
    return this.registerForm.get('isCheckT')
  }

  onSubmit(){
    this.registerService.registrar(this.registerForm.value).subscribe((usuario) =>{
      if(usuario.toString() == "201"){
        this.toastr.successToastr('Registrado com sucesso!')
        this.router.navigate(['/usuario'])
      }else if(usuario.toString() == "500"){
        this.toastr.errorToastr('Não foi possível registrar!')
      }
    })  
  }

}