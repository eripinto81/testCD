import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RegistroLocalizacaoService } from './registro-localizacao.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-registro-localizacao',
  templateUrl: './registro-localizacao.component.html',
  styleUrls: ['./registro-localizacao.component.scss'],
  providers: [RegistroLocalizacaoService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class RegistroLocalizacaoComponent implements OnInit {

  private formBusca: FormGroup;

  private _dataSource: MatTableDataSource<any>
  private _nome_coluna: string[]= ['nome', 'lat', 'lon', 'data', 'mapa']
  @ViewChild(MatPaginator) paginador: MatPaginator;

  constructor(private toastr: ToastrManager, private registroLocalizacaoService: RegistroLocalizacaoService, private socket: Socket, private router: Router, private fb: FormBuilder, private modalService: NgbModal) { 
    this.formBusca= this.fb.group({
      "nome": new FormControl(""),
      "data": new FormControl("")
    }) 
  }

  ngOnInit() {
    this.listarLocalizacao()

    this.socket.on("emitNovoRegistroLocalizacao", status=> {
      this.listarLocalizacao()
    })
  }

  listarLocalizacao(){
    this.registroLocalizacaoService.listarLocalizacao().subscribe(resp=>{
      if(resp[0].toString() == 200){
        this._dataSource= new MatTableDataSource(resp[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;
      }
    })
  }

  carregarMapa(usuario){
    const mapa_usuario= {nome: usuario.nome_usuario, lat: usuario.lat, lon: usuario.lon, data: formatDate(usuario.data, 'dd/MM/yyyy H:mm', 'pt-BR', '')}
    localStorage.setItem('mapa_usuario', JSON.stringify(mapa_usuario))
    this.router.navigate(['/dashboard'])
  }

  buscaAvancada(modal){
    this.modalService.open(modal, {size: 'sm', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
        
    },(reason)=>{
      this.modalService.dismissAll('closing')
    })
  }

  buscarRegistroLocalizacao(){
    const nome= this.formBusca.get('nome').value
    const data= this.formBusca.get('data').value

    this.registroLocalizacaoService.buscaLocalizacao(nome, data).subscribe(resp=>{
      if(resp[0].toString() == 200){
        this._dataSource= new MatTableDataSource(resp[1]);
        this.paginador._intl.itemsPerPageLabel= 'Itens por Página'
        this._dataSource.paginator= this.paginador;

        this.toastr.successToastr('Busca concluída com sucesso', 'AVISO')
        this.modalService.dismissAll('closing')
      }
    })
  }

}
