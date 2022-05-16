import { WebcamModule } from './../../webcam/webcam.module';
import { StreamOcrComponent } from './../../pages/stream-ocr/stream-ocr.component';
import { StreamingFaceComponent } from '../../pages/streaming-face/streaming-face.component';
import { RegisterComponent } from 'src/app/pages/registro/register.component';
import { GerenciarPessoaComponent } from './../../pages/gerenciar-pessoa/gerenciar-pessoa.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/minha-conta/user-profile.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LivroOcorrenciaComponent } from 'src/app/pages/livro-ocorrencia/livro-ocorrencia.component';
import { RegistroLocalizacaoComponent } from 'src/app/pages/registro-localizacao/registro-localizacao.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    NgxSummernoteModule.forRoot(),
    MatAutocompleteModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatSlideToggleModule,
    WebcamModule
  ],
  declarations: [
    RegisterComponent,
    DashboardComponent,
    UserProfileComponent,
    UsuariosComponent,
    GerenciarPessoaComponent,
    StreamingFaceComponent,
    StreamOcrComponent,
    LivroOcorrenciaComponent,
    RegistroLocalizacaoComponent
  ]
})

export class AdminLayoutModule {}
