import { UsuarioService } from './usuarios.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'libphonenumber-js';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RegisterService } from '../registro/register.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [UsuarioService, RegisterService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class UsuariosComponent implements OnInit {

  private _dataSource: MatTableDataSource<any>;
  private _nome_coluna: string[]= ['nome', 'telefone', 'email'];
  @ViewChild(MatPaginator) paginador: MatPaginator;

  private _count= 0  
  private _id_user= null;
  private _lista_perfis= null;
  private _decisao_modal= false
  private _id_modal= null;
  private _atualiza_tabela= true;

  private  expandedElement= null;

  private _modal_aprovar= 'modalAprovar'
  private _modal_bloquear= 'modalBloquear'
  private _modal_perfil= 'modalPerfil'

  private _form_perfil: FormGroup;
  private _form_busca_avancada: FormGroup;

  private _lista_delegacia_policia= []
  private _lista_perfil= []

  constructor(private usuariosService: UsuarioService, private fb: FormBuilder, private modalService: NgbModal, private toastr:ToastrManager, private registerService: RegisterService){
    this._form_perfil= this.fb.group({
      'perfil_usuario': new FormControl('', Validators.required)
    })

    this._form_busca_avancada= fb.group({
      "nome": new FormControl(""),
      "matricula": new FormControl("")
    })
  }

  filtrar(filterValue: string) {
    this._dataSource.filter= filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.listarUsuarios()
  }

  listarUsuarios(){
    this.usuariosService.listarUsuarios().subscribe(resposta =>{
      if(resposta[0].toString() == "200"){        
        this._dataSource= new MatTableDataSource(resposta[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;
        this.toastr.successToastr('Atualizado', 'AVISO')
      }else{
        this.toastr.errorToastr('Aconteceu algum erro ao carregar os dados!');
      }            
    })
  }

  buscaAvancada(modal){
    this._form_busca_avancada.reset()

    this.modalService.open(modal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  buscaAvancadaForm(){
    const nome_busca= this._form_busca_avancada.get('nome').value
    const matricula= this._form_busca_avancada.get('matricula').value

    this.usuariosService.buscaListarUsuarios(nome_busca, matricula).subscribe((resposta)=>{
      if(resposta[0].toString() == "200"){ 
        this._dataSource= new MatTableDataSource(resposta[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;

        this.toastr.successToastr('Atualizado', 'AVISO')

        this.modalService.dismissAll('closing')
      }
    })
  }

}
