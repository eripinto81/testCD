import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LivroOcorrenciaService } from './livro-ocorrencia.service';
import { formatDate } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-livro-ocorrencia',
  templateUrl: './livro-ocorrencia.component.html',
  styleUrls: ['./livro-ocorrencia.component.scss'],
  providers: [LivroOcorrenciaService]
})
export class LivroOcorrenciaComponent implements OnInit {

  private formOcorrencia: FormGroup;
  private formBuscaOcorrencia: FormGroup;

  private is_editar= false;
  private id_ocorrencia_editar= 0;

  @ViewChild(MatPaginator) paginador: MatPaginator;
  private dataSource: MatTableDataSource<any>;
  private nomecoluna: string[]= ['ocorrencia', 'data', 'acao'];

  constructor(private fb: FormBuilder, private livroService: LivroOcorrenciaService, private toastr: ToastrManager, private modalService: NgbModal) { 
    this.formOcorrencia= this.fb.group({
      "descricaoOcorrencia": new FormControl("", Validators.required),
      "data": new FormControl("")
    })   
    
    this.formBuscaOcorrencia= this.fb.group({
      "descricaoOcorrencia": new FormControl(""),
      "data": new FormControl("")
    })  
  }

  ngOnInit() {
    this.listaOcorrencia()
  }

  listaOcorrencia(){
    this.livroService.listaOcorrencia().subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.dataSource= new MatTableDataSource(resp[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this.dataSource.paginator= this.paginador;

        this.toastr.successToastr("Lista de registro atualizada!", "AVISO")
      }
    })
  }

  criarOcorrencia(){
    const descricao_ocorrencia= this.formOcorrencia.get('descricaoOcorrencia').value
    let data_atual= formatDate(new Date(), 'yyyy-MM-dd H:mm', 'pt-BR', '')

    this.livroService.adicionarOcorrencia(descricao_ocorrencia, data_atual).subscribe(resp=>{
      if(resp[0].toString() == "201"){
        this.listaOcorrencia()
        this.toastr.successToastr("Ocorrência inserida com sucesso", "AVISO")
      }
    })
  }

  editarOcorrencia(ocorrencia){
    this.is_editar= true;
    this.id_ocorrencia_editar= ocorrencia.id
    this.formOcorrencia.get('descricaoOcorrencia').setValue(ocorrencia.descricao_ocorrencia)
  }

  atualizarOcorrencia(){
    const descricao_ocorrencia= this.formOcorrencia.get('descricaoOcorrencia').value

    this.livroService.atualizarOcorrencia(descricao_ocorrencia, this.id_ocorrencia_editar).subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.listaOcorrencia()
        this.toastr.successToastr("Ocorrência atualizada com sucesso", "AVISO")
      }
    })
  }

  openModalBusca(modal){
    this.modalService.open(modal, {size: 'sm', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  buscarOcorrencia(){
    const descricao_ocorrencia= this.formBuscaOcorrencia.get('descricaoOcorrencia').value
    const data= this.formBuscaOcorrencia.get('data').value

    this.livroService.buscaOcorrencia(descricao_ocorrencia, data).subscribe(resp=>{
      if(resp[0].toString() == "200"){
        this.dataSource= new MatTableDataSource(resp[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this.dataSource.paginator= this.paginador;

        this.toastr.successToastr("Lista de registro atualizado!", "AVISO")
        this.modalService.dismissAll('closing')
      }
    })
  }

  limpar(){
    this.is_editar= false;
    this.formOcorrencia.reset()
  }

}
